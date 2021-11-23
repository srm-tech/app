import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';

import Review from '@/models/Reviews';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const user = getCurrentUser();
      await validate([
        check('stars').isNumeric(),
        check('comment').isLength({ min: 0, max: 1023 }),
        check('reviewedId').isMongoId(),
      ]);
      const obj = await Review.create({ userId: user._id, ...req.query });
      res.status(200).json({ obj });
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
