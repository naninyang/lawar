import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchEventsData } from '@/lib/events';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const eventsData = await fetchEventsData();

  if (!eventsData) {
    res.status(500).json({ error: 'Failed to fetch data from Events API' });
    return;
  }

  res.status(200).json(eventsData);
}
