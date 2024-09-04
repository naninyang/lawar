import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchDaerogiItem, fetchDaerogiItems } from '@/lib/daerogi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowedOrigins = [process.env.NEXT_PUBLIC_API_URL, 'https://vercel.com/dev1studio/lawar'];
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

  const id = Number(req.query.id);

  if (!id) {
    const daerogiData = await fetchDaerogiItems();
    if (!daerogiData) {
      res.status(500).json({ error: 'Failed to fetch data from Daerogi API' });
      return;
    }
    res.status(200).json(daerogiData);
  } else {
    const daerogiData = await fetchDaerogiItem(id);
    if (!daerogiData) {
      res.status(500).json({ error: 'Failed to fetch data from Daerogi API' });
      return;
    }
    res.status(200).json(daerogiData);
  }
}
