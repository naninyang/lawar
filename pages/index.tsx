import { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.sass';

type Reward = {
  item: string;
  reward: number;
};

type Theme = {
  title: string;
  rewards: Reward[];
};

export default function Home() {
  const [themes, setThemes] = useState<{ [key: number]: Theme }>({});
  const [displayDay, setDisplayDay] = useState<number | null>(null);

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
  }, []);

  return (
    <main className={styles.home}>
      <h1>
        오늘의 테마 <span>(라스트워 연맹대결)</span>
      </h1>
      <div id="theme-list">
        {Object.keys(themes).map((key) => {
          const theme = themes[parseInt(key)];
          return (
            <>
              {theme ? (
                <div key={key} data-day={key} aria-current={displayDay === parseInt(key) ? 'true' : undefined}>
                  <h2>{theme.title}</h2>
                  <dl>
                    {theme.rewards.map((reward, index) => (
                      <div key={index}>
                        <dt>{reward.item}</dt>
                        <dd>{reward.reward.toLocaleString()}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : (
                <p>데이터를 불러오는 중입니다 :)</p>
              )}
            </>
          );
        })}
      </div>
    </main>
  );
}
