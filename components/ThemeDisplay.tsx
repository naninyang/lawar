import React, { useState, useEffect } from 'react';
import { getCurrentThemeAndTime, getWeekStartTime, THEME_INTERVAL } from '@/utils/time';
import RewardList from './RewardList';
import styles from '@/styles/Arms.module.sass';

export default function ThemeDisplay() {
  const [themeInfo, setThemeInfo] = useState(getCurrentThemeAndTime());
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setThemeInfo(getCurrentThemeAndTime());
      setRemainingTime(calculateRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles['current-container']}>
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
    </div>
  );
}

function calculateRemainingTime() {
  const now = new Date();
  const nextThemeTime =
    getWeekStartTime().getTime() +
    (Math.floor((now.getTime() - getWeekStartTime().getTime()) / THEME_INTERVAL) + 1) * THEME_INTERVAL;
  const remainingTimeMs = Math.max(0, nextThemeTime - now.getTime());

  const remainingHours = Math.floor(remainingTimeMs / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
  const remainingSeconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

  return {
    hours: remainingHours,
    minutes: remainingMinutes,
    seconds: remainingSeconds,
  };
}
