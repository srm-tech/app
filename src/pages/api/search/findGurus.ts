import { NextApiRequest, NextApiResponse } from 'next';

import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import getCollections from '@/models';

// TODO: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { UserProfile } = await getCollections();
    if (req.method === 'GET') {
      let result;
      if (req.query.q !== undefined) {
        await validate([check('q').isLength({ min: 1, max: 255 })])(req, res);
        result = await UserProfile.searchForGuru({
          query: req.query.q.toString(),
        });
      } else {
        result = await UserProfile.searchForGuru({ query: '' });
      }
    } else {
      res.setHeader('Allow', 'GET');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
  }
);
