import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';
import styles from '@/styles/Showdown.module.sass';

interface Theme {
  name: string;
  time: string;
  rewards: { item: string; reward: number }[];
}

export default function ArmsTomorrow() {
  const serverTime = useRecoilValue(serverTimeState);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [title, setTitle] = useState<string>('');
  const [matching, setMatching] = useState<number[]>([]);

  useEffect(() => {
    if (!serverTime) return;

    const tomorrow = new Date(serverTime);
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
    const currentUTCDate = new Date(serverTime);
    currentUTCDate.setUTCHours(startHour, 0, 0, 0);

    const timeDifference = serverTime.getTime() - currentUTCDate.getTime();
    const elapsedHours = Math.floor(timeDifference / (1000 * 60 * 60));
    const themeIndex = Math.floor(elapsedHours / 4) % themes.length;

    const nextThemeTime = new Date(currentUTCDate);
    nextThemeTime.setUTCHours(startHour + (themeIndex + 1) * 4, 0, 0, 0);
  }, [serverTime]);

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
                  <span>{theme.time}</span>
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
