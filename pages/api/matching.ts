import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchMatchingItem, fetchMatchingItems } from '@/lib/matching';

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

  const id = Array.isArray(req.query.documentId) ? req.query.documentId[0] : req.query.documentId;

  if (!id) {
    const matchingData = await fetchMatchingItems();
    if (!matchingData) {
      res.status(500).json({ error: 'Failed to fetch data from Matching API' });
      return;
    }
    res.status(200).json(matchingData);
  } else {
    const matchingData = await fetchMatchingItem(id);
    if (!matchingData) {
      res.status(500).json({ error: 'Failed to fetch data from Matching API' });
      return;
    }
    res.status(200).json(matchingData);
  }
}
