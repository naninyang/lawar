import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { nowTimeState } from '@/atoms/timeState';
import Seo from '@/components/Seo';
import ShowdownToday from '@/components/ShowdownToday';
import ShowdownAll from '@/components/ShowdownAll';
import styles from '@/styles/Showdown.module.sass';

export type Reward = {
  item: string;
  reward: number;
};

export type Theme = {
  name: string;
  rewards: Reward[];
};

export type Alliance = {
  title: string;
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
  const nowTime = useRecoilValue(nowTimeState);
  const [viewMode, setViewMode] = useState<'today' | 'all'>('today');

  return (
    <main className={styles.showdown}>
      <Seo
        pageTitle="오늘의 테마 및 군비 경쟁"
        pageDescription="오늘의 테마에 맞는 군비 시간을 확인하세요"
        pageImg={`https://lawar.dev1stud.io/og-base.webp?ts=${timestamp}`}
      />
      <h2>오늘의 테마 및 군비 경쟁</h2>
      {nowTime ? (
        <>
          <ul className={styles.tabs}>
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
          </ul>
          {viewMode === 'today' ? (
            <ShowdownToday competitions={competitions} matchingThemes={matchingThemes} />
          ) : (
            <ShowdownAll competitions={competitions} matchingThemes={matchingThemes} />
          )}
        </>
      ) : (
        <p>데이터를 불러오는 중입니다 :)</p>
      )}
    </main>
  );
}
