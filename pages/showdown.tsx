import { useRecoilValue } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';
import Seo from '@/components/Seo';
import ShowdownToday from '@/components/showdown/Today';
import styles from '@/styles/Showdown.module.sass';

export type Reward = {
  item: string;
  reward: number;
};

export type Theme = {
  name: string;
  rewards: Reward[];
};

export type Alliance = {
  title: string;
  rewards: Reward[];
};

export default function Showdown() {
  const timestamp = Date.now();
  const serverTime = useRecoilValue(serverTimeState);

  return (
    <main className={styles.showdown}>
      <Seo
        pageTitle="오늘의 테마 및 군비 경쟁"
        pageDescription="오늘의 테마에 맞는 군비 시간을 확인하세요"
        pageImg={`https://lawar.dev1stud.io/og-base.webp?ts=${timestamp}`}
      />
      <h2>오늘의 테마 및 군비 경쟁</h2>
      {serverTime ? <ShowdownToday /> : <p>데이터를 불러오는 중입니다 :)</p>}
    </main>
  );
}
