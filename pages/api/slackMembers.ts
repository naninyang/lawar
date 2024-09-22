import { NextApiRequest, NextApiResponse } from 'next';

type SlackUser = {
  id: string;
  name: string;
  real_name: string;
};

type SlackApiResponse = {
  members: SlackUser[];
};

async function fetchSlackUsersWithBackoff(retries = 5) {
  const slackToken = process.env.SLACK_TOKEN;

  if (!slackToken) {
    throw new Error('Slack bot token is missing');
  }

  for (let i = 0; i < retries; i++) {
    const response = await fetch('https://slack.com/api/users.list', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${slackToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : Math.pow(2, i) * 1000;
      console.log(`Rate limit exceeded. Retrying after ${waitTime / 1000} seconds.`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    } else {
      return await response.json();
    }
  }

  throw new Error('Failed to fetch Slack users after several retries');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data: SlackApiResponse = await fetchSlackUsersWithBackoff();

    if (!data || !data.members) {
      return res.status(500).json({ error: 'Failed to fetch members from Slack API' });
    }

    const members = data.members.map((user) => ({
      id: user.id,
      name: user.name,
      realName: user.real_name,
    }));

    res.status(200).json({ members });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
