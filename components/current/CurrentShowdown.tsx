import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';
import { Themes } from '@/types';
import styles from '@/styles/Home.module.sass';

export default function CurrentShowdown() {
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
    <div className={styles.currentShowdown}>
      {themes.length === 0 ? (
        <p>데이터를 불러오는 중입니다 :)</p>
      ) : (
        <dl>
          <dt>{title}</dt>
          <dd>
            {themes
              .filter((_, index) => matching.includes(index))
              .map((theme, index) => (
                <dl className={styles.items} key={index}>
                  <dt>
                    <strong>{theme.name}</strong>
                    <span>{formatToLocalTime(theme.time)}</span>
                  </dt>
                  <dd>
                    {theme.rewards.map((reward: any, idx: number) => (
                      <strong key={idx}>{reward.item}</strong>
                    ))}
                  </dd>
                </dl>
              ))}
          </dd>
        </dl>
      )}
    </div>
  );
}
