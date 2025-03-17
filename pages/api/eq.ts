import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchEqData } from '@/lib/events';

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

  const eqOriginData = await fetchEqData();

  if (!eqOriginData) {
    res.status(500).json({ error: 'Failed to fetch data from Events API' });
    return;
  }

  const eqData = eqOriginData.results.map((item: any) => item.properties);

  res.status(200).json(eqData);
}
