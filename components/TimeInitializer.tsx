import { useEffect } from 'react';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { serverTimeState, serverTimezoneState } from '@/atoms/timeState';

function TimeInitializer() {
  const setServerTime = useSetRecoilState(serverTimeState);
  const setServerTimezone = useSetRecoilState(serverTimezoneState);

  useEffect(() => {
    const storedTime = localStorage.getItem('serverTime');
    const storedTimezone = localStorage.getItem('serverTimezone');

    if (storedTime) {
      setServerTime(new Date(storedTime));
    }

    if (storedTimezone) {
      setServerTimezone(storedTimezone);
    }
  }, [setServerTime, setServerTimezone]);

  return null;
}

export default TimeInitializer;
