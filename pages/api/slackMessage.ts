import { NextApiRequest, NextApiResponse } from 'next';
import { WebClient } from '@slack/web-api';

const token = process.env.SLACK_TOKEN;

const client = new WebClient(token);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { channel, text, postAt, userId } = req.body;

    try {
      const result = await client.chat.scheduleMessage({
        channel,
        text: `<@${userId}> ${text}`,
        post_at: postAt,
      });

      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error });
    }
  } else {
    res.status(405).json({ message: 'Only POST requests are allowed' });
  }
}
