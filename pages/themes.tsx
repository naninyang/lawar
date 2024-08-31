import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';
import Seo, { originTitle } from '@/components/Seo';
import styles from '@/styles/Themes.module.sass';
import { Theme } from '@/types';

export default function Themes() {
  const timestamp = Date.now();
  const serverTime = useRecoilValue(serverTimeState);
  const [themes, setThemes] = useState<{ [key: number]: Theme }>({});
  const [displayDay, setDisplayDay] = useState<number | null>(null);

  useEffect(() => {
    if (!serverTime) return;

    async function fetchAllData() {
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

        const calculatedDisplayDay = dayOfWeek;

        const dayMap: { [key: number]: string } = {
          1: 'monday',
          2: 'tuesday',
          3: 'wednesday',
          4: 'thursday',
          5: 'friday',
          6: 'saturday',
          7: 'sunday',
        };

        const themeData: { [key: number]: Theme } = {};

        for (let i = 1; i <= 7; i++) {
          const dayName = dayMap[i];
          const response = await fetch(`/api/alliance/${dayName}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch data for ${dayName}`);
          }
          const data: Theme = await response.json();
          themeData[i] = data;
        }

        setThemes(themeData);
        setDisplayDay(calculatedDisplayDay);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchAllData();
  }, [serverTime]);

  return (
    <main className={styles.themes}>
      <Seo
        pageTitles={`오늘의 테마 (연맹 대결) - ${originTitle}`}
        pageTitle="오늘의 테마 (연맹 대결)"
        pageDescription="오늘의 테마를 확인하세요"
        pageImg={`https://lawar.dev1stud.io/og-themes.webp?ts=${timestamp}`}
      />
      <h2>연맹 대결 - 오늘의 테마</h2>
      {Object.keys(themes).length === 0 ? (
        <p>데이터를 불러오는 중입니다 :)</p>
      ) : (
        <div id="theme-list">
          {Object.keys(themes).map((key) => {
            const theme = themes[parseInt(key)];
            if (!theme) return null;
            const isCurrentDay = displayDay === parseInt(key);
            const isLastDay = displayDay === 7;
            return (
              <div key={key} data-day={key} aria-current={isCurrentDay ? 'true' : undefined}>
                <h3>
                  {theme.title} {isCurrentDay && '[오늘]'}
                </h3>
                <dl>
                  {theme.rewards.map((reward, index) => (
                    <div key={index}>
                      <dt>{reward.item}</dt>
                      <dd>{reward.reward.toLocaleString()}</dd>
                    </div>
                  ))}
                </dl>
                {isLastDay && key === '7' && (
                  <p className={styles.rest}>
                    <span>오늘은 연맹 대결이 없어요 :)</span>
                    <span>일주일간 수고 많았어요!</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
