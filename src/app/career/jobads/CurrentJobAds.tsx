import JobAd from './JobAd'
import { readActiveJobAdsAction } from '@/services/career/jobAds/actions'

export default async function CurrentJobAds({ not }: { not?: string }) {
    const response = await readActiveJobAdsAction()
    if (!response.success) return <p>Kunne ikke hente jobbannonsene. Prøv igjen senere.</p>
    const jobAds = response.data.filter(jobAd => jobAd.slug !== not)
    return jobAds.length ? jobAds.map(jobAd => <JobAd jobAd={jobAd} key={jobAd.id} />)
        : <p>Det er for tiden ingen jobbannonser.</p>
}
