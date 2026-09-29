import PageWrapper from '@/components/PageWrapper/PageWrapper'
import JobDetail from '@/app/career/jobads/JobDetail'
import { readJobAdAction } from '@/services/career/jobAds/actions'
import { notFound } from 'next/navigation'

export default async function JobAdPage({ params }: { params: Promise<{ nameAndId: string }> }) {
    const slug = (await params).nameAndId
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) notFound()
    const response = await readJobAdAction({ params: { slug } })
    if (!response.success) {
        return (
            <PageWrapper title="Jobbannonse"><p>Kunne ikke hente jobbannonsen. Prøv igjen senere.</p></PageWrapper>
        )
    }
    if (!response.data) notFound()
    return <PageWrapper title={response.data.title}><JobDetail jobAd={response.data} /></PageWrapper>
}
