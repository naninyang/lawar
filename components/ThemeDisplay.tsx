import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { nowTimeState } from '@/atoms/timeState';
import { getCurrentThemeAndTime, getWeekStartTime, THEME_INTERVAL } from '@/utils/time';
import RewardList from './RewardList';
import styles from '@/styles/Arms.module.sass';

export default function ThemeDisplay() {
  const nowTime = useRecoilValue(nowTimeState);

  const [themeInfo, setThemeInfo] = useState(() => (nowTime ? getCurrentThemeAndTime(nowTime) : null));
  const [remainingTime, setRemainingTime] = useState(() =>
    nowTime ? calculateRemainingTime(nowTime) : { hours: 0, minutes: 0, seconds: 0 },
  );

  useEffect(() => {
    if (nowTime) {
      const interval = setInterval(() => {
        setThemeInfo(getCurrentThemeAndTime(nowTime));
        setRemainingTime(calculateRemainingTime(nowTime));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nowTime]);

  return (
    <div className={styles['current-container']}>
      {!nowTime || !themeInfo ? (
        <p>데이터를 불러오는 중입니다 :)</p>
      ) : (
        <>
          <div className={styles['current-theme']}>
            <div className={styles.headline}>
              <h3>
                현재 테마 <strong>{themeInfo.currentTheme}</strong>
              </h3>
              <p>
                남은 시간{' '}
                <strong>
                  {remainingTime.hours}시간 {remainingTime.minutes}분 {remainingTime.seconds}초
                </strong>
              </p>
            </div>
            <RewardList theme={themeInfo.currentTheme} />
          </div>
          <div className={styles['next-theme']}>
            <h3>
              다음 테마 <strong>{themeInfo.nextTheme}</strong>
            </h3>
            <RewardList theme={themeInfo.nextTheme} />
          </div>
        </>
      )}
    </div>
  );
}

function calculateRemainingTime(nowTime: Date) {
  const nextThemeTime =
    getWeekStartTime(nowTime).getTime() +
    (Math.floor((nowTime.getTime() - getWeekStartTime(nowTime).getTime()) / THEME_INTERVAL) + 1) * THEME_INTERVAL;
  const remainingTimeMs = Math.max(0, nextThemeTime - nowTime.getTime());

  const remainingHours = Math.floor(remainingTimeMs / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
  const remainingSeconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

  return {
    hours: remainingHours,
    minutes: remainingMinutes,
    seconds: remainingSeconds,
  };
}
