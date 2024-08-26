import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { serverTimeState, koreanTimeState } from '@/atoms/timeState';

export default function TimeInitializer({ initialServerTime }: { initialServerTime: string }) {
  const setServerTime = useSetRecoilState(serverTimeState);
  const setKoreanTime = useSetRecoilState(koreanTimeState);

  useEffect(() => {
    let serverTime = new Date(initialServerTime);
    console.log('변환 전 서버 시간 (UTC-2 기준):', serverTime.toISOString());
    console.log('변환 전 서버 시간 (로컬 시간 기준):', serverTime.toString());
    localStorage.setItem('serverTime', serverTime.toISOString());
    setServerTime(serverTime);

    const koreanOffset = 9 * 60 * 60 * 1000;
    let koreanTime = new Date(serverTime.getTime() + koreanOffset);
    console.log('변환된 한국 시간 (UTC+9):', koreanTime.toISOString());
    console.log('변환된 한국 시간 (로컬 시간 기준):', koreanTime.toString());

    setKoreanTime(koreanTime);
    localStorage.setItem('koreanTime', koreanTime.toISOString());

    const interval = setInterval(() => {
      serverTime = new Date(serverTime.getTime() + 1000);
      koreanTime = new Date(koreanTime.getTime() + 1000);

      setServerTime(serverTime);
      localStorage.setItem('serverTime', serverTime.toISOString());

      setKoreanTime(koreanTime);
      localStorage.setItem('koreanTime', koreanTime.toISOString());
    }, 1000);

    return () => clearInterval(interval);
  }, [initialServerTime, setServerTime, setKoreanTime]);

  return null;
}
