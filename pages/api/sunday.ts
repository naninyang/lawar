import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    title: '7일차 훈련 없음 (승차점수 0)',
    rewards: [{ item: '일정 없음', reward: 0 }],
  });
}
