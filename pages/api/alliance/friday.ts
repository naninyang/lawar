import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    title: '5일차 전면 준비 (승차점수 2점)',
    rewards: [
      { item: '레이더 임무 1회 완료', reward: 23000 },
      { item: '건설 가속 1분 사용', reward: 115 },
      { item: '건물 전투력 1점 증가', reward: 21 },
      { item: '테크 가속 1분 가속', reward: 115 },
      { item: '테크 전투력 1점 증가', reward: 21 },
      { item: '훈련 가속 1분 사용', reward: 115 },
      { item: '1레벨 유닛 1개 훈련', reward: 46 },
      { item: '2레벨 유닛 1개 훈련', reward: 69 },
      { item: '3레벨 유닛 1개 훈련', reward: 92 },
      { item: '4레벨 유닛 1개 훈련', reward: 115 },
      { item: '5레벨 유닛 1개 훈련', reward: 138 },
      { item: '6레벨 유닛 1개 훈련', reward: 161 },
      { item: '7레벨 유닛 1개 훈련', reward: 184 },
      { item: '8레벨 유닛 1개 훈련', reward: 207 },
      { item: '9레벨 유닛 1개 훈련', reward: 230 },
      { item: '10레벨 유닛 1개 훈련', reward: 253 },
      { item: '다이아 포함 패키지 구매 (1다이아)', reward: 30 },
      { item: '드론 스킬칩 1점 획득마다', reward: 2000 },
    ],
    items: [
      '레이더 임무 완료',
      '건설 가속 사용',
      '건물 전투력 증가',
      '테크 가속 사용',
      '테크 전투력 증가',
      '훈련 가속 사용',
      '유닛 훈련',
      '다이아 포함 패키지 구매',
      '드론 스킬칩 획득',
    ],
  });
}
