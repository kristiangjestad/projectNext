import { fetchActiveJobAds, fetchJobAd, sanitizeJobHtml } from '@/services/career/jobAds/client'
import { beforeEach, expect, jest, test } from '@jest/globals'

const job = {
    id: '6a2df42e59216c469eb1f74f', slug: 'graduate-2027', title: 'Graduate 2027',
    company_id: '6a1448547632448bf5fb11eb', company_name: 'Acme AS', logo_url: null,
    location: 'Trondheim', employment_type: 'fulltime', employment_label: 'Fulltid',
    deadline: '2027-11-25', published_at: '2026-09-28T12:00:00Z',
    apply_url: 'https://api.contactor.no/public/jobs/6a2df42e59216c469eb1f74f/apply?source=vev',
}
const fetchMock = jest.fn<typeof fetch>()

beforeEach(() => {
    global.fetch = fetchMock
    fetchMock.mockReset()
    Reflect.deleteProperty(process.env, 'CONTACTOR_API_URL')
})

function respond(body: unknown, status = 200) {
    fetchMock.mockResolvedValue(new Response(JSON.stringify(body), { status }))
}

test('list requests use source=vev with a short cache and no local active filtering', async () => {
    respond([job])
    expect(await fetchActiveJobAds()).toEqual([job])
    const [url, options] = fetchMock.mock.calls[0]
    expect(url.toString()).toBe('https://api.contactor.no/public/jobs?source=vev')
    expect(options?.next).toEqual({ revalidate: 60 })
    expect(options?.signal).toBeInstanceOf(AbortSignal)
})

test('empty list stays empty', async () => {
    respond([])
    expect(await fetchActiveJobAds()).toEqual([])
})

test('API failure is distinct from an empty list', async () => {
    respond({}, 503)
    await expect(fetchActiveJobAds()).rejects.toThrow()
})

test('invalid ads are skipped without hiding valid ones', async () => {
    const invalid = { ...job, id: 'bad', slug: 'bad-ad', apply_url: ['java', 'script:alert(1)'].join('') }
    respond([invalid, job, 'not an ad'])
    expect(await fetchActiveJobAds()).toEqual([job])
})

test('an unusable logo is dropped but the ad is kept', async () => {
    respond([{ ...job, logo_url: 'http://example.com/logo.png' }])
    expect(await fetchActiveJobAds()).toEqual([{ ...job, logo_url: null }])
})

test('a response that is not a list fails', async () => {
    respond({ jobs: [job] })
    await expect(fetchActiveJobAds()).rejects.toThrow()
})

test('detail uses the slug and keeps the returned apply link', async () => {
    respond({ ...job, body_html: '<h1>Om jobben</h1><p onclick="alert(1)">Tekst</p><script>alert(1)</script>' })
    const detail = await fetchJobAd(job.slug)
    expect(fetchMock.mock.calls[0][0].toString()).toBe('https://api.contactor.no/public/jobs/graduate-2027?source=vev')
    expect(detail?.apply_url).toBe(job.apply_url)
    expect(detail?.body_html).toBe('<h2>Om jobben</h2><p>Tekst</p>')
})

test('expired or unpublished detail maps API 404 to null', async () => {
    respond({}, 404)
    expect(await fetchJobAd(job.slug)).toBeNull()
})

test('sanitization strips inline styles, embedded content and unsafe links', () => {
    const unsafe = '<p style="color:red">Hei</p><iframe src="https://evil.test"></iframe>'
        + '<a href="javascript:alert(1)">Lenke</a>'
    const clean = sanitizeJobHtml(unsafe)
    expect(clean).not.toContain('style=')
    expect(clean).not.toContain('iframe')
    expect(clean).not.toContain(['java', 'script:'].join(''))
    expect(clean).toContain('rel="noopener noreferrer"')
})

test('the API owns active status even if the returned deadline is in the past', async () => {
    respond([{ ...job, deadline: '2020-01-01' }])
    expect(await fetchActiveJobAds()).toHaveLength(1)
})
