import '@pn-server-only'
import { contactorJobSchema, contactorJobDetailSchema } from './schemas'
import logger from '@/lib/logger'
import sanitizeHtml from 'sanitize-html'
import { z } from 'zod'

function apiUrl(path: string) {
    const base = process.env.CONTACTOR_API_URL || 'https://api.contactor.no'
    const url = new URL(`${base.replace(/\/$/, '')}/public/jobs${path}`)
    url.searchParams.set('source', 'vev')
    return url
}

// A short cache keeps Veven's single server IP within Contactor's rate limit.
// Contactor still decides expiry; an ad can linger for at most a minute.
async function fetchJobs(path: string) {
    return fetch(apiUrl(path), {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(8000),
        headers: { Accept: 'application/json' },
    })
}

// One invalid ad is skipped and logged, so it cannot hide the rest of the list.
export async function fetchActiveJobAds() {
    const response = await fetchJobs('')
    if (!response.ok) throw new Error('Kunne ikke hente jobbannonsene fra Contactor.')
    const items = z.array(z.unknown()).parse(await response.json())
    return items.flatMap(item => {
        const result = contactorJobSchema.safeParse(item)
        if (result.success) return [result.data]
        const ref = z.object({ id: z.unknown(), slug: z.unknown() }).partial().safeParse(item)
        const { id, slug } = ref.success ? ref.data : {}
        logger.warn('Skipping invalid Contactor job ad', {
            id, slug, fields: result.error.issues.map(issue => issue.path.join('.')),
        })
        return []
    })
}

export async function fetchJobAd(slug: string) {
    const response = await fetchJobs(`/${encodeURIComponent(slug)}`)
    if (response.status === 404) return null
    if (!response.ok) throw new Error('Kunne ikke hente jobbannonsen fra Contactor.')
    const job = contactorJobDetailSchema.parse(await response.json())
    return { ...job, body_html: sanitizeJobHtml(job.body_html || '') }
}

export function sanitizeJobHtml(html: string) {
    return sanitizeHtml(html, {
        allowedTags: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'a', 'blockquote', 'pre', 'code'],
        allowedAttributes: { a: ['href', 'target', 'rel'] },
        allowedSchemes: ['https', 'http', 'mailto'],
        allowProtocolRelative: false,
        transformTags: {
            h1: 'h2',
            a: (tagName, attributes) => ({ tagName, attribs: {
                ...attributes, target: '_blank', rel: 'noopener noreferrer',
            } }),
        },
    })
}
