import { NextApiRequest, NextApiResponse } from 'next';

import { check, validate } from '@/lib/validator';

import User from '@/models/User';

// TODO: replace userId
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      let result;
      if (req.query.q !== undefined) {
        await validate([check('q').isLength({ min: 1, max: 255 })])(req, res);
        result = await User.searchForGuru({
          query: req.query.q.toString(),
        });
      } else {
        result = await User.searchForGuru('');
      }
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
