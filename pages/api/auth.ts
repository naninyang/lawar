import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

type Message = {
  message: string;
  hashedValue?: string;
};

const plainAlliance = process.env.ALLIANCE;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method is allowed' });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: '비번도 입력하지 않고 입장하시려구요? 앙대여~' });
  }

  if (!plainAlliance) {
    return res.status(500).json({ message: '서버 오류: 비밀번호가 설정되지 않았습니다.' });
  }

  try {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(plainAlliance, saltRounds);
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (isMatch) {
      const hashedValue = await bcrypt.hash('true', saltRounds);
      res.setHeader('Set-Cookie', `auth=${hashedValue}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24};`);
      return res.status(200).json({ message: '로기킹! 😎', hashedValue });
    } else {
      return res.status(401).json({ message: '땡! 틀렸지롱! 🤪' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
}
