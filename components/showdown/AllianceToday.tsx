import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';
import { Alliance } from '@/types';
import styles from '@/styles/Showdown.module.sass';

export default function AllianceToday() {
  const serverTime = useRecoilValue(serverTimeState);
  const [currentTheme, setCurrentTheme] = useState<Alliance | null>(null);
  const [timeRemainingAlliance, setTimeRemainingAlliance] = useState('');

  useEffect(() => {
    const calculateTheme = async () => {
      if (!serverTime) return;

      const adjustedServerTime = new Date(serverTime);
      if (adjustedServerTime.getUTCHours() < 2) {
        adjustedServerTime.setUTCDate(adjustedServerTime.getUTCDate() - 1);
      }

      const startOfToday = new Date(adjustedServerTime);
      startOfToday.setUTCHours(2, 0, 0, 0);

      const startOfTomorrow = new Date(startOfToday);
      startOfTomorrow.setUTCDate(startOfToday.getUTCDate() + 1);

      const remainingTimeToday = startOfTomorrow.getTime() - adjustedServerTime.getTime();

      const hoursLeft = Math.floor(remainingTimeToday / (1000 * 60 * 60));
      const minutesLeft = Math.floor((remainingTimeToday % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((remainingTimeToday % (1000 * 60)) / 1000);

      setTimeRemainingAlliance(
        `${hoursLeft.toString().padStart(2, '0')}시간 ${minutesLeft.toString().padStart(2, '0')}분 ${secondsLeft.toString().padStart(2, '0')}초`,
      );

      const dayMap = {
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday',
        7: 'sunday',
      };

      try {
        const todayDayIndex = startOfToday.getUTCDay() === 0 ? 7 : startOfToday.getUTCDay();

        const todayThemeApi = `/api/alliance/${dayMap[todayDayIndex as keyof typeof dayMap]}`;
        const response = await fetch(todayThemeApi);
        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${todayThemeApi}`);
        }
        const data = await response.json();
        setCurrentTheme(data);
      } catch (error) {
        console.error('Error fetching theme data:', error);
      }
    };

    calculateTheme();
  }, [serverTime]);

  return (
    <div className={styles.themes}>
      <h3>연맹 대전 - {currentTheme?.title} [오늘]</h3>
      <p>
        남은 시간 <strong>{timeRemainingAlliance}</strong>
      </p>
      <dl>
        {currentTheme?.rewards.map((reward, index) => (
          <div key={index}>
            <dt>{reward.item}</dt>
            <dd>{reward.reward}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
