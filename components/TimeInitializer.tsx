import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';

export default function TimeInitializer({ initialServerTime }: { initialServerTime: string }) {
  const setServerTime = useSetRecoilState(serverTimeState);

  useEffect(() => {
    let serverTime = new Date(initialServerTime);
    // console.log('UTC 시간 기준 현재 시간:', serverTime.toISOString());
    // console.log('로컬 시간 기준 현재 시간:', serverTime.toString());
    localStorage.setItem('serverTime', serverTime.toISOString());
    setServerTime(serverTime);

    const interval = setInterval(() => {
      serverTime = new Date(serverTime.getTime() + 1000);

      setServerTime(serverTime);
      localStorage.setItem('serverTime', serverTime.toISOString());
    }, 1000);

    return () => clearInterval(interval);
  }, [initialServerTime, setServerTime]);

  return null;
}
