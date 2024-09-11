import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';
import styles from '@/styles/Home.module.sass';

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

export default function CurrentArms() {
  const serverTime = useRecoilValue(serverTimeState);
  const [weeklyThemes, setWeeklyThemes] = useState<DailyThemes[]>([]);
  const [currentThemeIndex, setCurrentThemeIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>('T00:00:00.000Z');

  useEffect(() => {
    if (!serverTime) return;

    const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    const adjustedServerTime = new Date(serverTime);
    if (adjustedServerTime.getUTCHours() < 2) {
      adjustedServerTime.setUTCDate(adjustedServerTime.getUTCDate() - 1);
    }

    const currentDayIndex = (adjustedServerTime.getUTCDay() + 1) % 7;

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
      const currentUTCDate = new Date(adjustedServerTime);
      currentUTCDate.setUTCHours(startHour, 0, 0, 0);

      let totalElapsedTime;

      if (adjustedServerTime.getUTCHours() < 2) {
        const previousDayUTCDate = new Date(adjustedServerTime);
        previousDayUTCDate.setUTCDate(previousDayUTCDate.getUTCDate() - 1);
        previousDayUTCDate.setUTCHours(startHour, 0, 0, 0);
        const timeDifference = adjustedServerTime.getTime() - previousDayUTCDate.getTime();
        totalElapsedTime = currentDayIndex * 24 + timeDifference / (1000 * 60 * 60);
      } else {
        totalElapsedTime = currentDayIndex * 24 + adjustedServerTime.getUTCHours() - startHour;
      }

      const themeIndex = Math.floor(totalElapsedTime / 4);

      setCurrentThemeIndex(themeIndex);

      const nextThemeTime = new Date(currentUTCDate);
      nextThemeTime.setUTCHours(startHour + ((themeIndex % 6) + 1) * 4, 0, 0, 0);
      const timeDiff = nextThemeTime.getTime() - adjustedServerTime.getTime();

      const hoursLeft = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
      const minutesLeft = Math.floor((timeDiff / (1000 * 60)) % 60);
      const secondsLeft = Math.floor((timeDiff / 1000) % 60);

      setTimeLeft(
        `${hoursLeft.toString()}시간 ${minutesLeft.toString().padStart(2, '0')}분 ${secondsLeft.toString().padStart(2, '0')}초`,
      );
    });
  }, [serverTime]);

  if (weeklyThemes.length === 0) return;
  const currentThemeDayIndex = Math.floor(currentThemeIndex / 6);
  const currentTheme = weeklyThemes[currentThemeDayIndex].themes[currentThemeIndex % 6];

  return (
    <div className={styles.currentArms}>
      {!currentTheme ? (
        <p>데이터를 불러오는 중입니다 :)</p>
      ) : (
        <dl>
          <dt>현재 군비경쟁 테마 - {currentTheme.name}</dt>
          <dd>
            {currentTheme.rewards.map((reward: any, idx: number) => (
              <strong key={idx}>{reward.item}</strong>
            ))}
          </dd>
        </dl>
      )}
    </div>
  );
}
