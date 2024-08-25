import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { nowTimeState, serverTimeState } from '@/atoms/timeState';

function TimeInitializer({ initialServerTime }: { initialServerTime: string }) {
  const setServerTime = useSetRecoilState(serverTimeState);
  const setNowTime = useSetRecoilState(nowTimeState);

  useEffect(() => {
    const serverTime = new Date(initialServerTime);
    localStorage.setItem('serverTime', serverTime.toISOString());
    setServerTime(serverTime);

    const utcMinus2Offset = -2 * 60 * 60 * 1000;
    const utcMinus2Time = new Date(serverTime.getTime() + utcMinus2Offset);

    setNowTime(utcMinus2Time);
    localStorage.setItem('nowTime', utcMinus2Time.toISOString());

    const interval = setInterval(() => {
      setNowTime((prevTime) => {
        const newTime = prevTime ? new Date(prevTime.getTime() + 1000) : new Date();
        localStorage.setItem('nowTime', newTime.toISOString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialServerTime, setServerTime, setNowTime]);

  return null;
}

export default TimeInitializer;
