import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    title: '2일차 기지 건설 (승차점수 2점)',
    rewards: [
      { item: '건설 가속 1분 사용', reward: 115 },
      { item: '건물 전투력 1점 증가', reward: 21 },
      { item: 'UR 교역 화물차 1회 출발', reward: 200000 },
      { item: '주황 은밀한 임무 1개 수행', reward: 150000 },
      { item: '다이아 포함 패키지 구매 (1다이아)', reward: 30 },
      { item: '생존자 모집 1회 진행', reward: 3000 },
    ],
  });
}
