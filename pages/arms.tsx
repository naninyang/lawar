import { useState } from 'react';
import Seo, { originTitle } from '@/components/Seo';
import ThemeDisplay from '@/components/ThemeDisplay';
import FullThemeList from '@/components/FullThemeList';
import styles from '@/styles/Arms.module.sass';

export default function Arms() {
  const timestamp = Date.now();
  const [viewMode, setViewMode] = useState<'current' | 'all'>('current');

  const handleCurrentClick = () => {
    setViewMode('current');
  };

  const handleAllClick = () => {
    setViewMode('all');
  };

  return (
    <main className={styles.arms}>
      <Seo
        pageTitles={`군비 경쟁 (특별 이벤트) - ${originTitle}`}
        pageTitle="군비 경쟁 (특별 이벤트)"
        pageDescription="오늘의 군비를 확인하세요"
        pageImg={`https://lawar.dev1stud.io/og-arms.webp?ts=${timestamp}`}
      />
      <h2>특별 이벤트 - 군비 경쟁</h2>
      <ul className={styles.notice}>
        {viewMode === 'current' ? (
          <li>현재 테마와 다음 테마를 보실 수 있습니다.</li>
        ) : (
          <li>타임테이블(시간) 또는 테마를 누르시면 보상 목록을 보실 수 있습니다.</li>
        )}
      </ul>
      <ul className={styles.tabs}>
        <li className={viewMode === 'current' ? styles.current : undefined}>
          <button type="button" onClick={handleCurrentClick}>
            현재 기준
          </button>
        </li>
        <li className={viewMode !== 'current' ? styles.current : undefined}>
          <button type="button" onClick={handleAllClick}>
            전체 보기
          </button>
        </li>
      </ul>
      <div className={styles.contents}>{viewMode === 'current' ? <ThemeDisplay /> : <FullThemeList />}</div>
    </main>
  );
}
