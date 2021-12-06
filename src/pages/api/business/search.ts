import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import models from '@/models';

// TODO: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('achieved search function');
    let result;
    await models.client.connect();
    if (req.method === 'GET') {
      const user = getCurrentUser();
      await validate([check('q').isLength({ min: 1, max: 255 })])(req, res);
      result = await models.UserProfile.searchForBusiness(req.query.q);
      // result = {}
    } else {
      res.setHeader('Allow', 'GET');
      return res.status(405).end('Method Not Allowed');
    }

    res.status(200).json(result);
    await models.client.close();
  }
);
