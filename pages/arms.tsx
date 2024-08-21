import Seo, { originTitle } from '@/components/Seo';
import styles from '@/styles/Arms.module.sass';

export default function Arms() {
  const timestamp = Date.now();
  return (
    <main className={styles.arms}>
      <Seo
        pageTitles={`군비 경쟁 (특별 이벤트) - ${originTitle}`}
        pageTitle="군비 경쟁 (특별 이벤트)"
        pageDescription="오늘의 군비를 확인하세요"
        pageImg={`https://lawar.dev1stud.io/og-arms.webp?ts=${timestamp}`}
      />
      <h2>특별 이벤트 - 군비 경쟁</h2>
    </main>
  );
}
