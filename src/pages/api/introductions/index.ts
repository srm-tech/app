import { NextApiRequest, NextApiResponse } from 'next';

import { easyGetAll } from '@/lib/api-helpers';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';

import Introduction from '@/models/Introduction';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = getCurrentUser();
  let result;
  if (req.method === 'GET') {
    easyGetAll(req, res, Introduction);
  } else if (req.method === 'POST') {
    await validate([
      check('firstName').isLength({ min: 1, max: 255 }),
      check('lastName').isLength({ min: 1, max: 255 }),
      check('email').isEmail(),
      check('mobile').isMobilePhone('any'),
      check('aboutTheJob').isLength({ min: 1, max: 1023 }),
    ])(req, res);
    try {
      if (req.query.action == 'continue') {
        result = await Introduction.create({
          userId: user._id,
          date: new Date(),
          ...req.query,
        });
      } else if (req.query.action == 'draft') {
        result = await Draft.create({
          userId: user._id,
          date: new Date(),
          ...req.query,
        });
      } else {
        res.status(404).json({ statusCode: 404, message: 'Not found' });
      }
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }

    res.status(200).json(result);
  } else {
    res.status(405).json({ statusCode: 405, message: 'Method not allowed' });
  }
}
