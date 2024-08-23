import { useEffect, useState } from 'react';
import Seo from '@/components/Seo';
import styles from '@/styles/Showdown.module.sass';

type Reward = {
  item: string;
  reward: number;
};

type Theme = {
  name: string;
  rewards: Reward[];
};

const competitions: Theme[] = [
  {
    name: '영웅 증가',
    rewards: [
      { item: '정예 모집 1회', reward: 400 },
      { item: '한번에 최소 2,000점의 영웅 경험치 소모', reward: 1 },
      { item: '다이아 포함 패키지 구매 (1다이아)', reward: 30 },
    ],
  },
  {
    name: '도시 건설',
    rewards: [
      { item: '건물 전투력 1점 증가', reward: 1 },
      { item: '건설 가속 1분 사용', reward: 10 },
      { item: '다이아 포함 패키지 구매 (1다이아)', reward: 30 },
    ],
  },
  {
    name: '유닛 증가',
    rewards: [
      { item: '1레벨 유닛 1개 훈련', reward: 5 },
      { item: '2레벨 유닛 1개 훈련', reward: 6 },
      { item: '3레벨 유닛 1개 훈련', reward: 7 },
      { item: '4레벨 유닛 1개 훈련', reward: 13 },
      { item: '5레벨 유닛 1개 훈련', reward: 15 },
      { item: '6레벨 유닛 1개 훈련', reward: 19 },
      { item: '7레벨 유닛 1개 훈련', reward: 22 },
      { item: '8레벨 유닛 1개 훈련', reward: 25 },
      { item: '9레벨 유닛 1개 훈련', reward: 28 },
    ],
  },
  {
    name: '테크 연구',
    rewards: [
      { item: '테크 전투력 1점 증가', reward: 1 },
      { item: '테크 가속 1분 사용', reward: 10 },
      { item: '다이아 포함 패키지 구매 (1다이아)', reward: 30 },
    ],
  },
  {
    name: '드론 강화',
    rewards: [
      { item: '드론 전투 데이터 사용 10점', reward: 1 },
      { item: '체력 1점 소모', reward: 100 },
      { item: '다이아 포함 패키지 구매 (1다이아)', reward: 30 },
    ],
  },
];

const matchingThemes: { [key: number]: string[] } = {
  1: ['드론 강화'],
  2: ['도시 건설'],
  3: ['테크 연구'],
  4: ['영웅 증가'],
  5: ['도시 건설', '테크 연구', '유닛 증가'],
  6: ['도시 건설', '테크 연구', '유닛 증가'],
};

export default function Showdown() {
  const timestamp = Date.now();
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [nextTheme, setNextTheme] = useState<Theme | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [nextThemeDay, setNextThemeDay] = useState(1);
  const [themeIndex, setThemeIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [viewMode, setViewMode] = useState<'today' | 'all'>('today');
  const [competitionRotation, setCompetitionRotation] = useState<
    { theme: Theme; remainingTime: string; startTime: string }[]
  >([]);
  const [nextDayCompetitionRotation, setNextDayCompetitionRotation] = useState<
    { theme: Theme; remainingTime: string; startTime: string }[]
  >([]);

  useEffect(() => {
    const calculateCompetitionRotation = () => {
      const now = new Date();
      const kstOffset = 9 * 60 * 60 * 1000;
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const kstDate = new Date(utcTime + kstOffset);

      const startOfCompetition = new Date(kstDate);
      startOfCompetition.setDate(kstDate.getDate() - ((kstDate.getDay() + 2) % 7));
      startOfCompetition.setHours(11, 0, 0, 0);

      const elapsedSeconds = Math.floor((kstDate.getTime() - startOfCompetition.getTime()) / 1000);
      const currentThemeDuration = 14400;
      const totalThemes = competitions.length;

      const currentRotationIndex = Math.floor(elapsedSeconds / currentThemeDuration) % totalThemes;
      const timeInCurrentTheme = elapsedSeconds % currentThemeDuration;
      const timeLeft = currentThemeDuration - timeInCurrentTheme;
      const hoursLeft = Math.floor(timeLeft / 3600);
      const minutesLeft = Math.floor((timeLeft % 3600) / 60);
      const secondsLeft = timeLeft % 60;

      setTimeRemaining(
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
  }, []);

  useEffect(() => {
    const calculateTheme = async () => {
      const now = new Date();
      const kstOffset = 9 * 60 * 60 * 1000;
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      const kstDate = new Date(utcTime + kstOffset);

      const startOfWeek = new Date(kstDate);
      startOfWeek.setDate(kstDate.getDate() - ((kstDate.getDay() + 6) % 7));
      startOfWeek.setHours(11, 0, 0, 0);

      const elapsedSeconds = Math.floor((kstDate.getTime() - startOfWeek.getTime()) / 1000);
      const daysElapsed = Math.floor(elapsedSeconds / (24 * 3600));

      const todayDayIndex = daysElapsed % 7;
      const nextDayIndex = (todayDayIndex + 1) % 7;

      setCurrentDay(todayDayIndex + 1);
      setNextThemeDay(nextDayIndex + 1);

      const secondsSinceStartOfDay = elapsedSeconds % (24 * 3600);
      const remainingSecondsToday = 24 * 3600 - secondsSinceStartOfDay;
      const hoursLeft = Math.floor(remainingSecondsToday / 3600);
      const minutesLeft = Math.floor((remainingSecondsToday % 3600) / 60);
      const secondsLeft = remainingSecondsToday % 60;

      setTimeRemaining(
        `${hoursLeft.toString().padStart(2, '0')}시간 ${minutesLeft.toString().padStart(2, '0')}분 ${secondsLeft.toString().padStart(2, '0')}초`,
      );

      const dayMap = {
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday',
        7: 'sunday',
      };

      const todayThemeApi = `/api/${dayMap[(todayDayIndex + 1) as keyof typeof dayMap]}`;
      const response = await fetch(todayThemeApi);
      const data = await response.json();
      setCurrentTheme(data);

      const nextThemeApi = `/api/${dayMap[(nextDayIndex + 1) as keyof typeof dayMap]}`;
      const nextResponse = await fetch(nextThemeApi);
      const nextData = await nextResponse.json();
      setNextTheme(nextData);
    };

    calculateTheme();
    const interval = setInterval(calculateTheme, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.showdown}>
      <Seo
        pageTitle="오늘의 테마 및 군비 경쟁"
        pageDescription="오늘의 테마에 맞는 군비 시간을 확인하세요"
        pageImg={`https://lawar.dev1stud.io/og-base.webp?ts=${timestamp}`}
      />
      <h2>오늘의 테마 및 군비 경쟁</h2>
      {currentTheme && nextTheme ? (
        <>
          {/* <ul className={styles.tabs}>
            <li className={viewMode === 'today' ? styles.current : undefined}>
              <button type="button" onClick={() => setViewMode('today')}>
                오늘 기준
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setViewMode('all')}>
                전체 보기
              </button>
            </li>
          </ul> */}
          {viewMode === 'today' ? (
            <div className={styles.contents}>
              <section>
                <div className={styles.themes}>
                  <h3>연맹 대전 - {currentTheme.name} [오늘]</h3>
                  <p>
                    남은 시간 <strong>{timeRemaining}</strong>
                  </p>
                  <dl>
                    {currentTheme.rewards.map((reward, index) => (
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
                      className={
                        matchingThemes[currentDay]?.includes(competition.theme.name) ? styles.active : undefined
                      }
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
                  <h3>연맹대전 - {nextTheme.name} [내일]</h3>
                  <p>내일 연맹 대전</p>
                  <dl>
                    {nextTheme.rewards.map((reward, index) => (
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
                        matchingThemes[nextThemeDay]?.includes(competition.theme.name) ? styles.active : undefined
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
          ) : (
            <div className={styles.contents}>
              <h2>전체 보기</h2>
              {competitions.map((competition, index) => (
                <div
                  key={index}
                  className={matchingThemes[currentDay]?.includes(competition.name) ? styles.active : undefined}
                >
                  <h3>
                    {competition.name} - {index + 1}일차
                  </h3>
                  <dl>
                    {competition.rewards.map((reward, idx) => (
                      <div key={idx}>
                        <dt>{reward.item}</dt>
                        <dd>{reward.reward}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p>데이터를 불러오는 중입니다 :)</p>
      )}
    </main>
  );
}
