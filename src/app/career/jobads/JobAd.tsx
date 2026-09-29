import styles from './JobAd.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import type { SimpleJobAd } from '@/services/career/jobAds/types'

const months = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des']

export default function JobAd({ jobAd }: { jobAd: SimpleJobAd }) {
    const deadline = jobAd.deadline.split('-')
    return (
        <Link href={`/career/jobads/${jobAd.slug}`} className={styles.JobAd}>
            <div className={styles.thumb}>
                {jobAd.logo_url && <Image src={jobAd.logo_url} alt={jobAd.company_name}
                    width={200} height={120} unoptimized className={styles.logo} />}
            </div>
            <div className={styles.lead}>
                <b>{Number(deadline[2])}</b>
                <span>{months[Number(deadline[1]) - 1]}</span>
            </div>
            <div className={styles.main}>
                <h2>{jobAd.title}</h2>
                <p>{jobAd.company_name}{jobAd.employment_label && `, ${jobAd.employment_label}`}</p>
            </div>
            <div className={styles.meta}>
                {jobAd.location && <span>{jobAd.location}</span>}
            </div>
        </Link>
    )
}
