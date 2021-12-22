import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import models from '@/models';

// TODO: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    await models.client.connect();
    let result;

    const user = await getCurrentUser(req, res);

    if (req.method === 'GET') {
      if (req.query.q !== undefined) {
        await validate([check('q').isLength({ min: 0, max: 255 })])(req, res);
        result = await models.UserProfile.searchForBusiness(
          req.query.q.toString()
        );
      } else {
        result = await models.UserProfile.readMany({ userId: user._id });
      }
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }

    res.status(200).json(result);
    await models.client.close();
  }
);
