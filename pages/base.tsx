import Seo, { originTitle } from '@/components/Seo';
import styles from '@/styles/Base.module.sass';

export default function Base() {
  const timestamp = Date.now();
  return (
    <main className={styles.base}>
      <Seo
        pageTitles={`기지 업 기본 정보 - ${originTitle}`}
        pageTitle="기지 업 기본 정보"
        pageDescription="기지 업에 필요한 기본 정보를 확인하세요"
        pageImg={`https://lawar.dev1stud.io/og-base.webp?ts=${timestamp}`}
      />
      <h2>기지 업 기본 정보</h2>
    </main>
  );
}
