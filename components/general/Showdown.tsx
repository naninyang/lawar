import { useRecoilValue } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';
import Seo from '@/components/Seo';
import ShowdownToday from '@/components/showdown/Today';
import styles from '@/styles/Showdown.module.sass';

export default function Showdown() {
  const timestamp = Date.now();
  const serverTime = useRecoilValue(serverTimeState);

  return (
    <main className={styles.showdown}>
      <h2>오늘의 테마 및 군비 경쟁</h2>
      {serverTime ? <ShowdownToday /> : <p>데이터를 불러오는 중입니다 :)</p>}
    </main>
  );
}
