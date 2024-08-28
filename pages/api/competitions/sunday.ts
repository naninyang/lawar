import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    title: '2일차',
    themes: [
      {
        name: '도시 건설',
        time: '11:00:00',
        rewards: [
          { item: '건물 전투력 1점 증가', reward: 1 },
          { item: '건설 가속 1분 사용', reward: 10 },
          { item: '다이아 포함 패키지 구매 (1다이아)', reward: 30 },
        ],
      },
      {
        name: '유닛 증가',
        time: '15:00:00',
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
        time: '19:00:00',
        rewards: [
          { item: '테크 전투력 1점 증가', reward: 1 },
          { item: '테크 가속 1분 사용', reward: 10 },
          { item: '다이아 포함 패키지 구매 (1다이아)', reward: 30 },
        ],
      },
      {
        name: '드론 강화',
        time: '23:00:00',
        rewards: [
          { item: '드론 전투 데이터 사용 10점', reward: 1 },
          { item: '체력 1점 소모', reward: 100 },
          { item: '다이아 포함 패키지 구매 (1다이아)', reward: 30 },
        ],
      },
      {
        name: '영웅 증가',
        time: '03:00:00',
        rewards: [
          { item: '정예 모집 1회', reward: 400 },
          { item: '한번에 최소 2,000점의 영웅 경험치 소모', reward: 1 },
          { item: '다이아 포함 패키지 구매 (1다이아)', reward: 30 },
        ],
      },
      {
        name: '도시 건설',
        time: '07:00:00',
        rewards: [
          { item: '건물 전투력 1점 증가', reward: 1 },
          { item: '건설 가속 1분 사용', reward: 10 },
          { item: '다이아 포함 패키지 구매 (1다이아)', reward: 30 },
        ],
      },
    ],
    matching: null,
  });
}
