import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    title: '4일차 영웅 육성 (승차점수 2점)',
    rewards: [
      { item: '정예 모집 1회', reward: 3450 },
      { item: '한번에 최소 660점의 영웅 경험치 소모', reward: 2 },
      { item: 'UR 영웅 조각 1개 소모', reward: 20000 },
      { item: 'SSR 영웅 조각 1개 소모', reward: 7000 },
      { item: 'SR 영웅 조각 1개 소모', reward: 2000 },
      { item: '스킬 훈장 1개 소모', reward: 20 },
      { item: '다이아 포함 패키지 구매 (1다이아)', reward: 30 },
      { item: '전속 무기 조각 1개 소모시', reward: 20000 },
    ],
    items: [
      '정예 모집',
      '영웅 경험치 소모',
      'UR 영웅 조각 소모',
      'SSR 영웅 조각 소모',
      'SR 영웅 조각 소모',
      '스킬 훈장 소모',
      '다이아 포함 패키지 구매',
      '전속 무기 조각 소모',
    ],
  });
}
