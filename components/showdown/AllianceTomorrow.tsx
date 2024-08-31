import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';
import { Alliance } from '@/types';
import styles from '@/styles/Showdown.module.sass';

export default function AllianceTomorrow() {
  const serverTime = useRecoilValue(serverTimeState);
  const [nextTheme, setNextTheme] = useState<Alliance | null>(null);

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
        const tomorrowDayIndex = startOfTomorrow.getUTCDay() === 0 ? 7 : startOfTomorrow.getUTCDay();

        const nextThemeApi = `/api/alliance/${dayMap[tomorrowDayIndex as keyof typeof dayMap]}`;
        const nextResponse = await fetch(nextThemeApi);
        if (!nextResponse.ok) {
          throw new Error(`Failed to fetch data from ${nextThemeApi}`);
        }
        const nextData = await nextResponse.json();
        setNextTheme(nextData);
      } catch (error) {
        console.error('Error fetching theme data:', error);
      }
    };

    calculateTheme();
  }, [serverTime]);

  return (
    <div className={styles.themes}>
      <h3>연맹대전 - {nextTheme?.title} [내일]</h3>
      <p>내일 연맹 대전</p>
      <dl>
        {nextTheme?.rewards.map((reward, index) => (
          <div key={index}>
            <dt>{reward.item}</dt>
            <dd>{reward.reward.toLocaleString()}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
