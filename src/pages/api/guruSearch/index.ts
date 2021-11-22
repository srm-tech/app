import { NextApiRequest, NextApiResponse } from 'next';

import { check, validate } from '@/lib/validator';

import Business from '@/models/Business';

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
        result = await Business.searchForBusiness({
          query: req.query.q.toString(),
        });
      }
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
