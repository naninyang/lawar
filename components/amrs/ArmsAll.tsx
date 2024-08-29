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

export default function ArmsAll() {
  const serverTime = useRecoilValue(serverTimeState);
  const [weeklyThemes, setWeeklyThemes] = useState<DailyThemes[]>([]);
  const [currentThemeIndex, setCurrentThemeIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00');
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  const [toggleStates, setToggleStates] = useState<{ [key: number]: boolean }>({});

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

      setCurrentThemeIndex(themeIndex);

      const nextThemeTime = new Date(currentUTCDate);
      nextThemeTime.setUTCHours(startHour + ((themeIndex % 6) + 1) * 4, 0, 0, 0);
      const timeDiff = nextThemeTime.getTime() - serverTime.getTime();

      const hoursLeft = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
      const minutesLeft = Math.floor((timeDiff / (1000 * 60)) % 60);
      const secondsLeft = Math.floor((timeDiff / 1000) % 60);
      setTimeLeft(
        `${hoursLeft.toString()}시간 ${minutesLeft.toString().padStart(2, '0')}분 ${secondsLeft.toString().padStart(2, '0')}초`,
      );
    });
  }, [serverTime]);

  const formatToLocalTime = (utcTime: string) => {
    const [hours, minutes, seconds] = utcTime.slice(1, 9).split(':').map(Number);

    const localDate = new Date();
    localDate.setUTCHours(hours, minutes, seconds);

    const localHours = localDate.getHours().toString().padStart(2, '0');
    const localMinutes = localDate.getMinutes().toString().padStart(2, '0');
    const localSeconds = localDate.getSeconds().toString().padStart(2, '0');

    return `${localHours}:${localMinutes}:${localSeconds}`;
  };

  const handleToggle = (index: number) => {
    setToggleStates((prevStates) => {
      const newStates = Object.keys(prevStates).reduce(
        (acc, key) => ({
          ...acc,
          [key]: false,
        }),
        {},
      );
      return {
        ...newStates,
        [index]: !prevStates[index],
      };
    });
  };

  return (
    <div className={styles['all-container']}>
      {weeklyThemes.length === 0 ? (
        <p>데이터를 불러오는 중입니다 :)</p>
      ) : (
        <>
          {weeklyThemes.map(({ themes, title, matching }, dayIndex) => (
            <div
              key={dayIndex}
              className={`${dayIndex === currentDayIndex ? styles.today : ''} ${styles['theme-item']}`}
            >
              <h3>
                <span>{title}</span>
              </h3>
              <div className={styles.themes}>
                {themes.map((theme, index) => {
                  const isActive = matching.includes(index);
                  const globalThemeIndex = dayIndex * 6 + index;
                  const isToggled = toggleStates[globalThemeIndex] || false;
                  const isCurrentTheme = globalThemeIndex === currentThemeIndex;

                  return (
                    <div
                      key={index}
                      className={`${isActive ? styles.active : ''} ${isCurrentTheme ? styles.current : ''} ${styles.item}`}
                      aria-current={isCurrentTheme ? 'true' : undefined}
                    >
                      {isCurrentTheme ? (
                        <>
                          <h4>
                            <span>{formatToLocalTime(theme.time)}</span> <span>{theme.name}</span>
                          </h4>
                          <div className={styles.detail}>
                            <div className={styles['detail-content']}>
                              <p>
                                남은 시간{' '}
                                <strong>
                                  <strong>{timeLeft}</strong>
                                </strong>
                              </p>
                              <dl>
                                {theme.rewards.map((reward: any, idx: number) => (
                                  <div key={idx}>
                                    <dt>{reward.item}</dt>
                                    <dd>{reward.reward}</dd>
                                  </div>
                                ))}
                              </dl>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className={`${styles.controller} ${isToggled ? styles.active : ''}`}>
                          <button type="button" onClick={() => handleToggle(globalThemeIndex)}>
                            <span>{formatToLocalTime(theme.time)}</span> <span>{theme.name}</span>
                          </button>
                        </div>
                      )}
                      {isToggled && (
                        <div className={styles.detail}>
                          <div className={styles['detail-content']}>
                            <dl>
                              {theme.rewards.map((reward: any, idx: number) => (
                                <div key={idx}>
                                  <dt>{reward.item}</dt>
                                  <dd>{reward.reward}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
