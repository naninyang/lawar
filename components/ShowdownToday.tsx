import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { nowTimeState } from '@/atoms/timeState';
import { Alliance, Theme } from '@/pages/showdown';
import styles from '@/styles/Showdown.module.sass';

export default function ShowtimeToday({
  competitions,
  matchingThemes,
}: {
  competitions: Theme[];
  matchingThemes: { [key: number]: string[] };
}) {
  const nowTime = useRecoilValue(nowTimeState);
  const [currentDay, setCurrentDay] = useState(1);
  const [themeIndex, setThemeIndex] = useState(0);
  const [currentTheme, setCurrentTheme] = useState<Alliance | null>(null);
  const [nextTheme, setNextTheme] = useState<Alliance | null>(null);
  const [timeRemainingAlliance, setTimeRemainingAlliance] = useState('');
  const [timeRemainingArms, setTimeRemainingArms] = useState('');
  const [competitionRotation, setCompetitionRotation] = useState<
    { theme: Theme; remainingTime: string; startTime: string }[]
  >([]);
  const [nextDayCompetitionRotation, setNextDayCompetitionRotation] = useState<
    { theme: Theme; remainingTime: string; startTime: string }[]
  >([]);

  useEffect(() => {
    const calculateTheme = async () => {
      if (!nowTime) return;

      console.log('현재 서버 시간 (UTC-2):', nowTime.toString());

      // 오늘 11:00:00 서버 시간 (UTC-2) 기준 설정
      const startOfToday = new Date(nowTime);
      startOfToday.setHours(11, 0, 0, 0); // 서버 시간 기준 11:00:00으로 설정
      console.log('오늘 시작 시간 (서버 시간):', startOfToday.toString());

      // 내일 11:00:00 서버 시간 (UTC-2) 기준 설정
      const startOfTomorrow = new Date(startOfToday);
      startOfTomorrow.setDate(startOfToday.getDate() + 1);
      console.log('내일 시작 시간 (서버 시간):', startOfTomorrow.toString());

      // 현재 시간이 오늘 11:00 이전인지 여부에 따라 남은 시간 계산
      let remainingTimeMs;
      if (nowTime.getTime() < startOfToday.getTime()) {
        remainingTimeMs = startOfToday.getTime() - nowTime.getTime();
      } else {
        // 오늘 11:00 이후라면, 내일 11:00까지 남은 시간 계산
        remainingTimeMs = startOfTomorrow.getTime() - nowTime.getTime();
      }
      console.log('남은 시간 (밀리초):', remainingTimeMs);

      // 남은 시간 계산
      const hoursLeft = Math.floor(remainingTimeMs / (1000 * 60 * 60));
      const minutesLeft = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

      console.log('남은 시간:', `${hoursLeft}시간 ${minutesLeft}분 ${secondsLeft}초`);

      const remainingTimeFormatted = `${hoursLeft.toString().padStart(2, '0')}시간 ${minutesLeft
        .toString()
        .padStart(2, '0')}분 ${secondsLeft.toString().padStart(2, '0')}초`;

      setTimeRemainingAlliance(remainingTimeFormatted);

      const dayMap = {
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday',
        7: 'sunday',
      };

      try {
        const todayThemeApi = `/api/${dayMap[(startOfToday.getDay() + 1) as keyof typeof dayMap]}`;
        const response = await fetch(todayThemeApi);
        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${todayThemeApi}`);
        }
        const data = await response.json();
        setCurrentTheme(data);

        const nextThemeApi = `/api/${dayMap[(((startOfTomorrow.getDay() + 1) % 7) + 1) as keyof typeof dayMap]}`;
        const nextResponse = await fetch(nextThemeApi);
        if (!nextResponse.ok) {
          throw new Error(`Failed to fetch data from ${nextThemeApi}`);
        }
        const nextData = await nextResponse.json();
        setNextTheme(nextData);
      } catch (error) {
        console.error('Error fetching theme data:', error);
      }
    };

    calculateTheme();
    const interval = setInterval(calculateTheme, 1000); // 매초마다 테마를 계산하여 업데이트
    return () => clearInterval(interval);
  }, [nowTime]);

  useEffect(() => {
    const calculateCompetitionRotation = () => {
      if (!nowTime || competitions.length === 0) return;

      const kstOffset = 9 * 60 * 60 * 1000;
      const kstStartOfWeek = new Date(nowTime.getTime() + kstOffset);
      kstStartOfWeek.setDate(kstStartOfWeek.getDate() - ((kstStartOfWeek.getDay() + 1) % 7));
      kstStartOfWeek.setHours(11, 0, 0, 0); // KST 토요일 11:00:00 기준

      const elapsedSeconds = Math.floor((nowTime.getTime() - kstStartOfWeek.getTime()) / 1000);
      const currentThemeDuration = 14400; // 4시간
      const totalThemes = competitions.length;

      const currentRotationIndex = Math.floor(elapsedSeconds / currentThemeDuration) % totalThemes;
      setThemeIndex(currentRotationIndex); // themeIndex를 업데이트

      const timeInCurrentTheme = elapsedSeconds % currentThemeDuration;
      const timeLeft = currentThemeDuration - timeInCurrentTheme;
      const hoursLeft = Math.floor(timeLeft / 3600);
      const minutesLeft = Math.floor((timeLeft % 3600) / 60);
      const secondsLeft = timeLeft % 60;

      setTimeRemainingArms(
        `${hoursLeft.toString().padStart(2, '0')}시간 ${minutesLeft.toString().padStart(2, '0')}분 ${secondsLeft.toString().padStart(2, '0')}초`,
      );

      const competitionRotationList = [];
      for (let i = 0; i < 6; i++) {
        const rotatedIndex = (currentRotationIndex + i) % totalThemes;
        const startTimeInSeconds = (11 * 3600 + i * currentThemeDuration) % 86400;
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
        const rotationSecondsLeft = remainingTimeInTheme % 60;

        const remainingTimeFormatted = `${rotationHoursLeft.toString().padStart(2, '0')}시간 ${rotationMinutesLeft
          .toString()
          .padStart(2, '0')}분 ${rotationSecondsLeft.toString().padStart(2, '0')}초`;

        competitionRotationList.push({
          theme: competitions[rotatedIndex],
          remainingTime: remainingTimeFormatted,
          startTime: startTimeFormatted,
        });
      }
      setCompetitionRotation(competitionRotationList);

      const nextDayRotationList = [];
      for (let i = 0; i < 6; i++) {
        const rotatedIndex = (currentRotationIndex + i + 6) % totalThemes;
        const startTimeInSeconds = (11 * 3600 + i * currentThemeDuration) % 86400;
        const startHours = Math.floor(startTimeInSeconds / 3600);
        const startMinutes = Math.floor((startTimeInSeconds % 3600) / 60);
        const startSeconds = startTimeInSeconds % 60;

        const startTimeFormatted = `${startHours.toString().padStart(2, '0')}:${startMinutes
          .toString()
          .padStart(2, '0')}:${startSeconds.toString().padStart(2, '0')}`;

        const remainingTimeInTheme =
          currentThemeDuration - ((timeInCurrentTheme + (i + 6) * currentThemeDuration) % currentThemeDuration);
        const rotationHoursLeft = Math.floor(remainingTimeInTheme / 3600);
        const rotationMinutesLeft = Math.floor((remainingTimeInTheme % 3600) / 60);
        const rotationSecondsLeft = remainingTimeInTheme % 60;

        const remainingTimeFormatted = `${rotationHoursLeft.toString().padStart(2, '0')}시간 ${rotationMinutesLeft
          .toString()
          .padStart(2, '0')}분 ${rotationSecondsLeft.toString().padStart(2, '0')}초`;

        nextDayRotationList.push({
          theme: competitions[rotatedIndex],
          remainingTime: remainingTimeFormatted,
          startTime: startTimeFormatted,
        });
      }
      setNextDayCompetitionRotation(nextDayRotationList);
    };

    calculateCompetitionRotation();
    const interval = setInterval(calculateCompetitionRotation, 1000);
    return () => clearInterval(interval);
  }, [nowTime, competitions]);

  return (
    <div className={styles.contents}>
      <section>
        <div className={styles.themes}>
          <h3>연맹 대전 - {currentTheme?.title} [오늘]</h3>
          <p>
            남은 시간 <strong>{timeRemainingAlliance}</strong>
          </p>
          <dl>
            {currentTheme?.rewards.map((reward, index) => (
              <div key={index}>
                <dt>{reward.item}</dt>
                <dd>{reward.reward}</dd>
              </div>
            ))}
          </dl>
        </div>
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
      </section>
      <section>
        <div className={styles.themes}>
          <h3>연맹대전 - {nextTheme?.title} [내일]</h3>
          <p>내일 연맹 대전</p>
          <dl>
            {nextTheme?.rewards.map((reward, index) => (
              <div key={index}>
                <dt>{reward.item}</dt>
                <dd>{reward.reward}</dd>
              </div>
            ))}
          </dl>
        </div>
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
      </section>
    </div>
  );
}
