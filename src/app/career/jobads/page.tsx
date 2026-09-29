import styles from './page.module.scss'
import CurrentJobAds from './CurrentJobAds'
import PageWrapper from '@/components/PageWrapper/PageWrapper'

export default function JobAds() {
    return (
        <PageWrapper title="Jobbannonser">
            <div className={styles.wrapper}>
                <CurrentJobAds />
            </div>
        </PageWrapper>
    )
}
