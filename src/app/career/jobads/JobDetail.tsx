import styles from './JobDetail.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import type { ExpandedJobAd } from '@/services/career/jobAds/types'

export default function JobDetail({ jobAd }: { jobAd: ExpandedJobAd }) {
    return (
        <article className={styles.wrapper}>
            <Link href="/career/jobads">Tilbake til jobbannonser</Link>
            <h1>{jobAd.title}</h1>
            <div className={styles.columns}>
                <div className={styles.body} dangerouslySetInnerHTML={{ __html: jobAd.body_html || '' }} />
                <aside className={styles.sidebar}>
                    {jobAd.logo_url && <Image src={jobAd.logo_url} alt={jobAd.company_name}
                        width={240} height={120} unoptimized className={styles.logo} />}
                    <h2>{jobAd.company_name}</h2>
                    <dl>
                        {jobAd.employment_label && <><dt>Stillingstype</dt><dd>{jobAd.employment_label}</dd></>}
                        {jobAd.location && <><dt>Sted</dt><dd>{jobAd.location}</dd></>}
                        <dt>Søknadsfrist</dt><dd>{jobAd.deadline.split('-').reverse().join('.')}</dd>
                    </dl>
                    <a className={styles.apply} href={jobAd.apply_url} target="_blank" rel="noopener noreferrer">
                        Søk på stillingen
                    </a>
                </aside>
            </div>
        </article>
    )
}
