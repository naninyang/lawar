import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';
import { Themes } from '@/types';
import styles from '@/styles/Home.module.sass';

export default function CurrentShowdown() {
  const serverTime = useRecoilValue(serverTimeState);
  const [themes, setThemes] = useState<Themes[]>([]);
  const [day, setDay] = useState<string>('');
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
        setDay(data.day);
        setTitle(data.title);
        setMatching(data.matching || []);
      });
  }, [serverTime]);

  const formatToLocalTime = (utcTime: string, dueTime?: boolean) => {
    const [hours, minutes, seconds] = utcTime.slice(1, 9).split(':').map(Number);

    const localDate = new Date();
    localDate.setUTCHours(hours, minutes, seconds);

    if (dueTime) {
      localDate.setHours(localDate.getHours() + 4);
    }

    const localHours = localDate.getHours().toString().padStart(2, '0');
    let nextDayText = localHours >= '03' && localHours <= '07' ? '다음 날' : '';

    if (dueTime) {
      nextDayText = localHours >= '03' && localHours <= '11' ? '다음 날' : '';
    }

    return `${nextDayText} ${localHours}시`;
  };

  return (
    <div className={styles.currentShowdown}>
      {themes.length === 0 ? (
        <p>데이터를 불러오는 중입니다 :)</p>
      ) : (
        <dl>
          <dt>
            {day} - {title}
          </dt>
          <dd>
            {themes.filter((_, index) => matching.includes(index)).length === 0
              ? '오늘은 연맹 대전이 없는 날입니다'
              : themes
                  .filter((_, index) => matching.includes(index))
                  .map((theme, index) => (
                    <dl className={styles.items} key={index}>
                      <dt>
                        <strong>{theme.name}</strong>
                        <span>
                          {formatToLocalTime(theme.time)} ~ {formatToLocalTime(theme.time, true)}
                        </span>
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
