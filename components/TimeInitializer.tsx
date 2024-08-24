import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { nowTimeState, serverTimeState, serverTimezoneState } from '@/atoms/timeState';

function TimeInitializer() {
  const setServerTime = useSetRecoilState(serverTimeState);
  const setServerTimezone = useSetRecoilState(serverTimezoneState);
  const setNowTime = useSetRecoilState(nowTimeState);

  useEffect(() => {
    const storedTime = localStorage.getItem('serverTime');
    const storedTimezone = localStorage.getItem('serverTimezone');
    const storedNowTime = localStorage.getItem('nowTime');

    if (storedTime) {
      setServerTime(new Date(storedTime));
    }

    if (storedTimezone) {
      setServerTimezone(storedTimezone);
    }

    if (storedNowTime) {
      setNowTime(new Date(storedNowTime));
    }
  }, [setServerTime, setServerTimezone, setNowTime]);

  return null;
}

export default TimeInitializer;
