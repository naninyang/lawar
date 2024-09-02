import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchEventsData } from '@/lib/events';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://lawar.dev1stud.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const eventsData = await fetchEventsData();

  if (!eventsData) {
    res.status(500).json({ error: 'Failed to fetch data from Events API' });
    return;
  }

  res.status(200).json(eventsData);
}
