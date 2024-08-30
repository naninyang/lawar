import type { NextApiRequest, NextApiResponse } from 'next';
import { getTasks } from '@/lib/todoist';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tasks = await getTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load tasks' });
  }
}
