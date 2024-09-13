import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';
import { Themes } from '@/types';
import styles from '@/styles/Showdown.module.sass';

export default function ArmsToday() {
  const serverTime = useRecoilValue(serverTimeState);
  const [themes, setThemes] = useState<Themes[]>([]);
  const [title, setTitle] = useState<string>('');
  const [matching, setMatching] = useState<number[]>([]);
  const [currentThemeIndex, setCurrentThemeIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>('T00:00:00.000Z');

  useEffect(() => {
    if (!serverTime) return;

    const adjustedServerTime = new Date(serverTime);
    if (adjustedServerTime.getUTCHours() < 2) {
      adjustedServerTime.setUTCDate(adjustedServerTime.getUTCDate() - 1);
    }

    const dayOfWeek = (adjustedServerTime.getUTCDay() + 1) % 7;
    const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const currentDay = days[dayOfWeek];

    fetch(`/api/arms/${currentDay}`)
      .then((response) => response.json())
      .then((data) => {
        setThemes(data.themes);
        setTitle(data.title);
        setMatching(data.matching || []);
      });

    const startHour = 2;
    const currentDate = new Date(adjustedServerTime);
    currentDate.setUTCHours(startHour, 0, 0, 0);

    let timeDifference;
    let elapsedHours;
    let themeIndex;

    if (adjustedServerTime.getUTCHours() < 2) {
      const previousDayUTCDate = new Date(currentDate);
      previousDayUTCDate.setUTCDate(previousDayUTCDate.getUTCDate() - 1);
      timeDifference = adjustedServerTime.getTime() - previousDayUTCDate.getTime();
      elapsedHours = Math.floor(timeDifference / (1000 * 60 * 60));
      themeIndex = Math.floor(elapsedHours / 4) % themes.length;
    } else {
      timeDifference = adjustedServerTime.getTime() - currentDate.getTime();
      elapsedHours = Math.floor(timeDifference / (1000 * 60 * 60));
      themeIndex = Math.floor(elapsedHours / 4) % themes.length;
    }

    setCurrentThemeIndex(themeIndex);

    const nextThemeTime = new Date(currentDate);
    nextThemeTime.setUTCHours(startHour + (themeIndex + 1) * 4, 0, 0, 0);
    const timeDiff = nextThemeTime.getTime() - adjustedServerTime.getTime();

    const hoursLeft = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutesLeft = Math.floor((timeDiff / (1000 * 60)) % 60);
    const secondsLeft = Math.floor((timeDiff / 1000) % 60);
    setTimeLeft(
      `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`,
    );
  }, [serverTime, themes.length]);

  const localTime = (utcTime: string) => {
    const [hours, minutes, seconds] = utcTime.slice(1, 9).split(':').map(Number);

    const localDate = new Date();
    localDate.setUTCHours(hours, minutes, seconds);

    const localHours = localDate.getHours().toString().padStart(2, '0');
    const localMinutes = localDate.getMinutes().toString().padStart(2, '0');
    const localSeconds = localDate.getSeconds().toString().padStart(2, '0');

    return `${localHours}:${localMinutes}:${localSeconds}`;
  };

  return (
    <div className={styles.arms}>
      <h3>군비 경쟁 - {title} [오늘]</h3>
      {Object.keys(themes).length === 0 ? (
        <p>데이터를 불러오는 중입니다 :)</p>
      ) : (
        <>
          {themes.map((theme, index) => {
            const isActive = matching.includes(index);
            return (
              <div key={index} className={isActive ? styles.active : undefined}>
                {index === currentThemeIndex && (
                  <p>
                    현재 테마 남은 시간 <strong>{timeLeft}</strong>
                  </p>
                )}
                <h4>
                  <strong>
                    {theme.name} {index === currentThemeIndex && '[현재 테마]'}
                  </strong>
                  <span>{localTime(theme.time)}</span>
                </h4>
                <dl>
                  {theme.rewards.map((reward: any, idx: number) => (
                    <div key={idx}>
                      <dt>{reward.item}</dt>
                      <dd>{reward.reward}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
