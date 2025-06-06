import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    day: '월요일',
    title: '1일차 레이더 훈련 (승차점수 1점)',
    rewards: [
      { item: '체력 1점 소모', reward: 375 },
      { item: '레이더 임무 1회 완료', reward: 30000 },
      { item: '한번에 최소 660점의 영웅 경험치 소모', reward: 2.5 },
      { item: '드론 전투 데이터 1점 소모', reward: 7.5 },
      { item: '드론 부품 1개 소모', reward: 6250 },
      { item: '다이아 포함 패키지 구매 (1다이아)', reward: 30 },
      { item: '식량 100 채집', reward: 50 },
      { item: '강철 100 채집', reward: 50 },
      { item: '금화 60 채집', reward: 50 },
      { item: '(드론)칩 상자를 열어 고급칩 획득마다', reward: 2812.5 },
    ],
    items: [
      '체력 소모',
      '레이더 임무 완료',
      '영웅 경험치 소모',
      '드론 전투 데이터 소모',
      '드론 부품 소모',
      '다이아 포함 패키지 구매',
      '식량 채집',
      '강철 채집',
      '금화 채집',
      '드론 스킬칩 획득',
    ],
  });
}
