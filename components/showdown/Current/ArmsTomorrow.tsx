import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { serverTimeState } from '@/atoms/timeState';
import { Theme } from '@/pages/showdown';
import styles from '@/styles/Showdown.module.sass';

export default function ArmsTomorrow({
  competitions,
  matchingThemes,
}: {
  competitions: Theme[];
  matchingThemes: { [key: number]: string[] };
}) {
  const serverTime = useRecoilValue(serverTimeState);
  const [nextDayCompetitionRotation, setNextDayCompetitionRotation] = useState<{ theme: Theme; startTime: string }[]>(
    [],
  );

  useEffect(() => {
    const calculateCompetitionRotation = () => {
      if (!serverTime || competitions.length === 0) return;

      const startOffset = 11 * 3600;
      const startOfWeek = new Date(serverTime);
      startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 1) % 7));
      startOfWeek.setUTCHours(2, 0, 0, 0);

      const elapsedSeconds = Math.floor((serverTime.getTime() - startOfWeek.getTime()) / 1000);
      const currentThemeDuration = 14400;
      const totalThemes = competitions.length;

      const correctedElapsedSeconds = (elapsedSeconds + startOffset) % (totalThemes * currentThemeDuration);
      const currentRotationIndex = Math.floor(correctedElapsedSeconds / currentThemeDuration) % totalThemes;

      const nextDayRotationList = [];
      for (let i = 0; i < 6; i++) {
        const adjustedIndex = (i + currentRotationIndex) % totalThemes;
        const rotatedIndex = (adjustedIndex + i + 6) % totalThemes;
        const startTimeInSeconds = (startOffset + i * currentThemeDuration) % 86400;
        const startHours = Math.floor(startTimeInSeconds / 3600);
        const startMinutes = Math.floor((startTimeInSeconds % 3600) / 60);
        const startSeconds = startTimeInSeconds % 60;

        const startTimeFormatted = `${startHours.toString().padStart(2, '0')}:${startMinutes
          .toString()
          .padStart(2, '0')}:${startSeconds.toString().padStart(2, '0')}`;

        nextDayRotationList.push({
          theme: competitions[rotatedIndex],
          startTime: startTimeFormatted,
        });
      }
      setNextDayCompetitionRotation(nextDayRotationList);
    };

    calculateCompetitionRotation();
    const intervalArms = setInterval(calculateCompetitionRotation, 1000);
    return () => clearInterval(intervalArms);
  }, [serverTime, competitions]);

  return (
    <div className={styles.arms}>
      <h3>내일의 군비 경쟁</h3>
      {nextDayCompetitionRotation.map((competition, index) => (
        <div
          key={index}
          className={
            matchingThemes[nextDayCompetitionRotation.indexOf(competition) + 1]?.includes(competition.theme.name)
              ? styles.active
              : undefined
          }
        >
          <h4>
            <strong>{competition.theme.name}</strong> <span>{competition.startTime}</span>
          </h4>
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
