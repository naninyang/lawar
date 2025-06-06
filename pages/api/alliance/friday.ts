import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    day: '금요일',
    title: '5일차 전면 준비 (승차점수 2점)',
    rewards: [
      { item: '레이더 임무 1회 완료', reward: 30000 },
      { item: '건설 가속 1분 사용', reward: 150 },
      { item: '건물 전투력 1점 증가', reward: 30 },
      { item: '테크 가속 1분 가속', reward: 150 },
      { item: '테크 전투력 1점 증가', reward: 30 },
      { item: '훈련 가속 1분 사용', reward: 150 },
      { item: '1레벨 유닛 1개 훈련', reward: 60 },
      { item: '2레벨 유닛 1개 훈련', reward: 90 },
      { item: '3레벨 유닛 1개 훈련', reward: 120 },
      { item: '4레벨 유닛 1개 훈련', reward: 150 },
      { item: '5레벨 유닛 1개 훈련', reward: 180 },
      { item: '6레벨 유닛 1개 훈련', reward: 210 },
      { item: '7레벨 유닛 1개 훈련', reward: 240 },
      { item: '8레벨 유닛 1개 훈련', reward: 270 },
      { item: '9레벨 유닛 1개 훈련', reward: 300 },
      { item: '10레벨 유닛 1개 훈련', reward: 330 },
      { item: '다이아 포함 패키지 구매 (1다이아)', reward: 30 },
      { item: '임의 오버로드 훈련 가이드 100개 소모', reward: 25000 },
      { item: '오버로드 훈련 가이드 100개 소모', reward: 1562.5 },
      { item: '오버로드 훈련 확인증 1개 소모', reward: 3750 },
      { item: '오버로드 친밀도 배지 1개 소모', reward: 75000 },
      { item: '오버로드 스킬 훈장 1개 소모', reward: 12.5 },
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
      '오버로드',
    ],
  });
}
