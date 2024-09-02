import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';
import { Themes } from '@/types';
import styles from '@/styles/Showdown.module.sass';

export default function ArmsTomorrow() {
  const serverTime = useRecoilValue(serverTimeState);
  const [themes, setThemes] = useState<Themes[]>([]);
  const [title, setTitle] = useState<string>('');
  const [matching, setMatching] = useState<number[]>([]);

  useEffect(() => {
    if (!serverTime) return;

    const adjustedServerTime = new Date(serverTime);
    if (adjustedServerTime.getUTCHours() < 2) {
      adjustedServerTime.setUTCDate(adjustedServerTime.getUTCDate() - 1);
    }

    const tomorrow = new Date(adjustedServerTime);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const dayOfWeek = (tomorrow.getUTCDay() + 1) % 7;
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
    const currentUTCDate = new Date(adjustedServerTime);
    currentUTCDate.setUTCHours(startHour, 0, 0, 0);

    const timeDifference = adjustedServerTime.getTime() - currentUTCDate.getTime();
    const elapsedHours = Math.floor(timeDifference / (1000 * 60 * 60));
    const themeIndex = Math.floor(elapsedHours / 4) % themes.length;

    const nextThemeTime = new Date(currentUTCDate);
    nextThemeTime.setUTCHours(startHour + (themeIndex + 1) * 4, 0, 0, 0);
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

  return (
    <div className={styles.arms}>
      <h3>군비 경쟁 - {title} [내일]</h3>
      {Object.keys(themes).length === 0 ? (
        <p>데이터를 불러오는 중입니다 :)</p>
      ) : (
        <>
          {themes.map((theme, index) => {
            const isActive = matching.includes(index);
            return (
              <div key={index} className={isActive ? styles.active : undefined}>
                <h4>
                  <strong>{theme.name}</strong>
                  <span>{formatToLocalTime(theme.time)}</span>
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
