import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';
import { Alliance } from '@/types';
import styles from '@/styles/Home.module.sass';

export default function CurrentTheme() {
  const serverTime = useRecoilValue(serverTimeState);
  const [currentTheme, setCurrentTheme] = useState<Alliance | null>(null);

  useEffect(() => {
    async function fetchCurrentTheme() {
      try {
        if (!serverTime) return;

        const currentDate = new Date(serverTime);

        if (currentDate.getUTCHours() < 2) {
          currentDate.setUTCDate(currentDate.getUTCDate() - 1);
        }
        currentDate.setUTCHours(2, 0, 0, 0);

        let dayOfWeek = currentDate.getUTCDay();

        if (dayOfWeek === 0) {
          dayOfWeek = 7;
        }

        const dayMap: { [key: number]: string } = {
          1: 'monday',
          2: 'tuesday',
          3: 'wednesday',
          4: 'thursday',
          5: 'friday',
          6: 'saturday',
          7: 'sunday',
        };

        const dayName = dayMap[dayOfWeek];

        const response = await fetch(`/api/alliance/${dayName}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${dayName}`);
        }

        const data: Alliance = await response.json();
        setCurrentTheme(data);
      } catch (error) {
        console.error('Error fetching current theme:', error);
      }
    }

    fetchCurrentTheme();
  }, [serverTime]);

  return (
    <div className={styles.currentTheme}>
      {!currentTheme ? (
        <p>데이터를 불러오는 중입니다 :)</p>
      ) : (
        <dl>
          <dt>
            {currentTheme.day} - {currentTheme.title}
          </dt>
          <dd>
            {currentTheme.items
              ? currentTheme.items.map((item: string, index: number) => <strong key={index}>{item}</strong>)
              : '오늘은 연맹 대전이 없는 날입니다'}
          </dd>
        </dl>
      )}
    </div>
  );
}
