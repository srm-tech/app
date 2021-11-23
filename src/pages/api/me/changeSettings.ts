import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';

import User from '@/models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const user = getCurrentUser();
      const result = await User.updateOne({
        userId: user._id,
        settings: req.query,
      });
      res.status(200).json({ result });
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
