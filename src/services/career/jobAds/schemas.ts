import { z } from 'zod'

const httpsUrl = z.string().url().refine(value => new URL(value).protocol === 'https:')
const nullableText = z.string().nullable().optional()

export const contactorJobSchema = z.object({
    id: z.string(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string(),
    company_id: z.string(),
    company_name: z.string(),
    // The logo is decoration; an unusable one drops the logo, not the ad.
    logo_url: httpsUrl.nullable().optional().catch(null),
    location: nullableText,
    employment_type: nullableText,
    employment_label: nullableText,
    deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    published_at: nullableText,
    apply_url: httpsUrl,
})

export const contactorJobDetailSchema = contactorJobSchema.extend({
    body_html: z.string().nullable(),
})

export const jobAdSchemas = {
    read: z.object({ slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) }),
} as const
