import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';

import Introduction from '@/models/Introduction';

// TODO: replace userId
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const user = getCurrentUser();
    await validate([
      check('aboutTheJob').isLength({ min: 1, max: 1023 }),
      check('timeToFinish').isNumeric(),
      check('introId').isMongoId(),
    ])(req, res);
    try {
      const result = await Introduction.timeToFinish({
        userId: user._id,
        ...req.query,
      });
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
