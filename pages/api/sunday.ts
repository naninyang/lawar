import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    title: '7일차 휴식',
    rewards: [{ item: '일정 없음', reward: 0 }],
  });
}
