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
      await validate([
        check('firstName').isLength({ min: 1, max: 255 }),
        check('lastName').isLength({ min: 1, max: 255 }),
        check('businessName').isLength({ min: 1, max: 255 }),
        check('businessCategory').isLength({ min: 1, max: 255 }),
        check('businessCategorySecondary').isLength({ min: 1, max: 255 }),
        check('email').isEmail(),
        check('phone').isLength({ min: 1, max: 50 }),
      ])(req, res);
      const result = await User.updateOne({ userId: user._id, ...req.query });
      res.status(200).json({ result });
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
