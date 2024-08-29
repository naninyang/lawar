import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';
import styles from '@/styles/Arms.module.sass';

interface Theme {
  name: string;
  time: string;
  rewards: { item: string; reward: number }[];
}

interface DailyThemes {
  day: string;
  themes: Theme[];
  title: string;
  matching: number[];
}

export default function ArmsCurrent() {
  const serverTime = useRecoilValue(serverTimeState);
  const [weeklyThemes, setWeeklyThemes] = useState<DailyThemes[]>([]);
  const [currentThemeIndex, setCurrentThemeIndex] = useState<number>(0);
  const [nextThemeIndex, setNextThemeIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00');
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);

  useEffect(() => {
    if (!serverTime) return;

    const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const currentDayIndex = (serverTime.getUTCDay() + 1) % 7;
    setCurrentDayIndex(currentDayIndex);

    const fetchThemesForDay = async (day: string) => {
      const response = await fetch(`/api/arms/${day}`);
      const data = await response.json();
      return {
        day,
        themes: data.themes,
        title: data.title,
        matching: data.matching || [],
      };
    };

    Promise.all(days.map((day) => fetchThemesForDay(day))).then((results) => {
      setWeeklyThemes(results);

      const startHour = 2;
      const currentUTCDate = new Date(serverTime);
      currentUTCDate.setUTCHours(startHour, 0, 0, 0);

      const totalElapsedTime = currentDayIndex * 24 + serverTime.getUTCHours() - startHour;
      const themeIndex = Math.floor(totalElapsedTime / 4);
      const nextIndex = (themeIndex + 1) % (7 * 6);

      setCurrentThemeIndex(themeIndex);
      setNextThemeIndex(nextIndex);

      const nextThemeTime = new Date(currentUTCDate);
      nextThemeTime.setUTCHours(startHour + ((themeIndex % 6) + 1) * 4, 0, 0, 0);
      const timeDiff = nextThemeTime.getTime() - serverTime.getTime();

      const hoursLeft = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
      const minutesLeft = Math.floor((timeDiff / (1000 * 60)) % 60);
      const secondsLeft = Math.floor((timeDiff / 1000) % 60);
      setTimeLeft(
        `${hoursLeft.toString()}시간 ${minutesLeft.toString().padStart(2, '0')}분 ${secondsLeft.toString().padStart(2, '0')}초`,
      );
      setWeeklyThemes(results);
    });
  }, [serverTime]);

  if (weeklyThemes.length === 0) return;
  const currentThemeDayIndex = Math.floor(currentThemeIndex / 6);
  const currentTheme = weeklyThemes[currentThemeDayIndex].themes[currentThemeIndex % 6];

  const nextThemeDayIndex = Math.floor(nextThemeIndex / 6);
  const nextTheme = weeklyThemes[nextThemeDayIndex].themes[nextThemeIndex % 6];

  return (
    <div className={styles['current-container']}>
      {!currentTheme || !nextTheme ? (
        <p>데이터를 불러오는 중입니다 :)</p>
      ) : (
        <>
          <div className={styles['current-theme']}>
            <div className={styles.headline}>
              <h3>
                현재 테마 <strong>{currentTheme.name}</strong>
              </h3>
              <p>
                남은 시간 <strong>{timeLeft}</strong>
              </p>
            </div>
            <dl>
              {currentTheme.rewards.map((reward: any, idx: number) => (
                <div key={idx}>
                  <dt>{reward.item}</dt>
                  <dd>{reward.reward}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className={styles['next-theme']}>
            <h3>
              다음 테마 <strong>{nextTheme.name}</strong>
            </h3>
            <dl>
              {nextTheme.rewards.map((reward: any, idx: number) => (
                <div key={idx}>
                  <dt>{reward.item}</dt>
                  <dd>{reward.reward}</dd>
                </div>
              ))}
            </dl>
          </div>
        </>
      )}
    </div>
  );
}
