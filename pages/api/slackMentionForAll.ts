import type { NextApiRequest, NextApiResponse } from 'next';
import { fetcNotifications } from '@/lib/matching';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigins = [process.env.NEXT_PUBLIC_API_URL, 'https://lawar.vercel.app'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin || '')) {
    res.setHeader('Access-Control-Allow-Origin', origin || '');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const notificationsData = await fetcNotifications();
    if (!notificationsData) {
      res.status(500).json({ error: 'Failed to fetch data from Slack Mention API' });
      return;
    }
    res.status(200).json(notificationsData);
  } else if (req.method === 'POST') {
    try {
      const { userId, userName, messageBefore, message, postAt } = req.body;

      const response = await fetch(`${process.env.DAEROGI_API_URL}/api/lawar-slack-notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.DAEROGI_API_KEY}`,
        },
        body: JSON.stringify({
          data: {
            userId: userId,
            userName: userName,
            messageBefore: messageBefore,
            message: message,
            postAt: postAt,
          },
        }),
      });

      if (!response.ok) {
        return res.status(response.status).json({ message: '데이터를 저장하는 중 오류가 발생했습니다.' });
      }

      const data = await response.json();
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ message: '데이터를 저장하는 중 오류가 발생했습니다.' });
    }
  }
}
