import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import models from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    if (req.method === 'POST') {
      const user = getCurrentUser();
      await validate([
        check('firstName').isLength({ min: 1, max: 255 }),
        check('lastName').isLength({ min: 1, max: 255 }),
        check('businessName').isLength({ min: 1, max: 255 }),
        check('businessCategory').isLength({ min: 1, max: 255 }),
        check('email').isEmail(),
        // check('phone').isLength({ min: 1, max: 50 }),
      ])(req, res);
      result = await models.UserProfile.updateOne({
        userId: user._id,
        ...req.body,
      });
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json({ result });
    await models.client.close();
  }
);
