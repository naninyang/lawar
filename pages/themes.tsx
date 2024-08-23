import { useEffect, useState } from 'react';
import Seo, { originTitle } from '@/components/Seo';
import styles from '@/styles/Themes.module.sass';

type Reward = {
  item: string;
  reward: number;
};

type Theme = {
  title: string;
  rewards: Reward[];
};

export default function Themes() {
  const [themes, setThemes] = useState<{ [key: number]: Theme }>({});
  const [displayDay, setDisplayDay] = useState<number | null>(null);
  const timestamp = Date.now();

  useEffect(() => {
    async function fetchAllData() {
      try {
        const kstOffset = 9 * 60;
        const now = new Date();
        const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
        const kstDate = new Date(utcTime + kstOffset * 60000);

        let dayOfWeek = kstDate.getDay();
        const hours = kstDate.getHours();

        if (dayOfWeek === 0) {
          dayOfWeek = 7;
        }

        let calculatedDisplayDay: number;
        if (hours < 11) {
          calculatedDisplayDay = dayOfWeek === 1 ? 7 : dayOfWeek - 1;
        } else {
          calculatedDisplayDay = dayOfWeek;
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

        const themeData: { [key: number]: Theme } = {};

        for (let i = 1; i <= 7; i++) {
          const dayName = dayMap[i];
          const response = await fetch(`/api/${dayName}`);
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

    const handleFocus = () => {
      fetchAllData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

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
            return (
              <div key={key} data-day={key} aria-current={displayDay === parseInt(key) ? 'true' : undefined}>
                <h3>{theme.title}</h3>
                <dl>
                  {theme.rewards.map((reward, index) => (
                    <div key={index}>
                      <dt>{reward.item}</dt>
                      <dd>{reward.reward.toLocaleString()}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
