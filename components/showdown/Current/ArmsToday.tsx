import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';
import { Theme } from '@/pages/showdown';
import styles from '@/styles/Showdown.module.sass';

export default function ArmsToday({
  competitions,
  matchingThemes,
}: {
  competitions: Theme[];
  matchingThemes: { [key: number]: string[] };
}) {
  const serverTime = useRecoilValue(serverTimeState);
  const [currentDay, setCurrentDay] = useState(1);
  const [themeIndex, setThemeIndex] = useState(0);
  const [competitionRotation, setCompetitionRotation] = useState<
    { theme: Theme; remainingTime: string; startTime: string }[]
  >([]);

  useEffect(() => {
    const calculateCompetitionRotation = () => {
      if (!serverTime || competitions.length === 0) return;

      // 주의 시작 날짜 (토요일)
      const startOfWeek = new Date(serverTime);
      startOfWeek.setUTCHours(2, 0, 0, 0);
      startOfWeek.setUTCDate(startOfWeek.getUTCDate() - ((startOfWeek.getUTCDay() + 1) % 7));

      // 오늘의 시작 시간 (00:00:00)
      const startOfToday = new Date(serverTime);
      startOfToday.setUTCHours(2, 0, 0, 0);

      // 내일의 시작 시간 (오늘 00:00:00 + 24시간)
      const startOfTomorrow = new Date(startOfToday);
      startOfTomorrow.setUTCDate(startOfTomorrow.getUTCDate() + 1);

      const elapsedSeconds = Math.floor((serverTime.getTime() - startOfToday.getTime()) / 1000);
      const currentThemeDuration = 14400; // 4시간 단위
      const totalThemes = competitions.length;

      const correctedElapsedSeconds = elapsedSeconds % (totalThemes * currentThemeDuration);
      const currentRotationIndex = Math.floor(correctedElapsedSeconds / currentThemeDuration) % totalThemes;

      const timeInCurrentTheme = correctedElapsedSeconds % currentThemeDuration;

      const competitionRotationList = [];
      for (let i = 0; i < 6; i++) {
        const adjustedIndex = (i + currentRotationIndex) % totalThemes;
        const rotatedIndex = (adjustedIndex + i) % totalThemes;

        const startTimeOffset = 11 * 3600;
        const startTimeInSeconds = (startTimeOffset + i * currentThemeDuration) % 86400;
        const startHours = Math.floor(startTimeInSeconds / 3600);
        const startMinutes = Math.floor((startTimeInSeconds % 3600) / 60);
        const startSeconds = startTimeInSeconds % 60;

        const startTimeFormatted = `${startHours.toString().padStart(2, '0')}:${startMinutes
          .toString()
          .padStart(2, '0')}:${startSeconds.toString().padStart(2, '0')}`;

        const remainingTimeInTheme =
          currentThemeDuration - ((timeInCurrentTheme + i * currentThemeDuration) % currentThemeDuration);
        const rotationHoursLeft = Math.floor(remainingTimeInTheme / 3600);
        const rotationMinutesLeft = Math.floor((remainingTimeInTheme % 3600) / 60);
        const rotationSecondsLeft = Math.floor(remainingTimeInTheme % 60);

        const remainingTimeFormatted = `${rotationHoursLeft.toString().padStart(2, '0')}시간 ${rotationMinutesLeft
          .toString()
          .padStart(2, '0')}분 ${rotationSecondsLeft.toString().padStart(2, '0')}초`;

        competitionRotationList.push({
          theme: competitions[rotatedIndex],
          remainingTime: remainingTimeFormatted,
          startTime: startTimeFormatted,
        });

        // 로그 출력
        console.log(`군비 경쟁 아이템 ${i + 1}:`);
        console.log(`시작 시간: ${startTimeFormatted}`);
        console.log(`남은 시간: ${remainingTimeFormatted}`);
      }
      setCompetitionRotation(competitionRotationList);

      // 오늘과 내일의 시작 시간을 로그로 출력
      console.log(`오늘 군비 경쟁 시작 날짜 및 시간: ${startOfToday}`);
      console.log(`내일 군비 경쟁 시작 날짜 및 시간: ${startOfTomorrow}`);
    };

    calculateCompetitionRotation();
  }, [serverTime, competitions]);

  return (
    <div className={styles.arms}>
      <h3>오늘의 군비 경쟁</h3>
      {competitionRotation.map((competition, index) => (
        <div
          key={index}
          className={matchingThemes[currentDay]?.includes(competition.theme.name) ? styles.active : undefined}
        >
          <h4>
            <strong>{competition.theme.name}</strong> <span>{competition.startTime}</span>
          </h4>
          {index === themeIndex && (
            <p>
              남은 시간 <strong>{competition.remainingTime}</strong>
            </p>
          )}
          <dl>
            {competition.theme.rewards.map((reward, idx) => (
              <div key={idx}>
                <dt>{reward.item}</dt>
                <dd>{reward.reward}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
