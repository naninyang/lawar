import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';
import { getWeekStartTime, THEME_INTERVAL, themes } from '@/utils/time';
import RewardList from './RewardList';
import styles from '@/styles/Arms.module.sass';

export default function FullThemeList() {
  const serverTime = useRecoilValue(serverTimeState);
  const [currentTime, setCurrentTime] = useState<Date | null>(serverTime);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (currentTime) {
      const interval = setInterval(() => {
        setCurrentTime(new Date(currentTime.getTime() + 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentTime]);

  if (!serverTime || !currentTime) {
    return null;
  }

  const startOfWeek = getWeekStartTime(serverTime);
  const themeElements = [];
  let currentDay = 0;

  for (let i = 0; i < 7 * 6; i++) {
    const themeTime = new Date(startOfWeek.getTime() + i * THEME_INTERVAL);
    const themeIndex = i % themes.length;
    const currentTheme = themes[themeIndex];
    const isCurrent = isCurrentTheme(themeTime, currentTime);
    const dayNumber = Math.floor(i / 6) + 1;
    const remainingTime = isCurrent ? getRemainingTime(themeTime, currentTime) : null;

    let displayDayInfo = '';
    if (i % 6 === 0) {
      currentDay = dayNumber;
      displayDayInfo = `${dayNumber}일차 `;
      themeElements.push(<h2 key={`day-${dayNumber}`}>{`${dayNumber}일차`}</h2>);
    }

    const handleToggle = () => {
      if (expandedIndex === i) {
        setExpandedIndex(null);
      } else {
        setExpandedIndex(i);
      }
    };

    themeElements.push(
      <div key={i} aria-current={isCurrent ? 'true' : undefined} className={styles['theme-item']}>
        {isCurrent ? (
          <>
            <h3>
              <span>{displayDayInfo}</span> <span>{formatTime(themeTime)}</span> <span>{currentTheme}</span>
            </h3>
            <div className={styles.detail}>
              <div className={styles['detail-content']}>
                <p>
                  남은 시간{' '}
                  <strong>
                    {remainingTime?.hours}시간 {remainingTime?.minutes}분 {remainingTime?.seconds}초
                  </strong>
                </p>
                <RewardList theme={currentTheme} />
              </div>
            </div>
          </>
        ) : (
          <div className={styles.controller}>
            <button type="button" onClick={handleToggle} className={expandedIndex === i ? styles.current : undefined}>
              <span>{displayDayInfo}</span> <span>{formatTime(themeTime)}</span> <span>{currentTheme}</span>
            </button>
          </div>
        )}
        {expandedIndex === i && !isCurrent && (
          <div className={styles.detail}>
            <div className={styles['detail-content']}>
              <RewardList theme={currentTheme} />
            </div>
          </div>
        )}
      </div>,
    );
  }

  return <div className={styles['all-container']}>{themeElements}</div>;
}

function isCurrentTheme(themeTime: Date, currentTime: Date): boolean {
  return currentTime >= themeTime && currentTime < new Date(themeTime.getTime() + THEME_INTERVAL);
}

function getRemainingTime(themeTime: Date, currentTime: Date) {
  const remainingTimeMs = Math.max(0, new Date(themeTime.getTime() + THEME_INTERVAL).getTime() - currentTime.getTime());

  const remainingHours = Math.floor(remainingTimeMs / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
  const remainingSeconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

  return {
    hours: remainingHours,
    minutes: remainingMinutes,
    seconds: remainingSeconds,
  };
}

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
