import { NextApiRequest, NextApiResponse } from 'next';
import { validate, check } from '@/lib/validator';
import models from '@/models';
import { handleErrors } from '@/lib/middleware';

// TODO: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    await models.client.connect();
    let result;

    if (req.method === 'GET') {
      if (req.query.q !== undefined) {
        await validate([check('q').isLength({ min: 0, max: 255 })])(req, res);
        result = await models.MyContacts.search({
          userId: 1,
          query: req.query.q.toString(),
        });
      } else {
        result = await models.MyContacts.readMany({ userId: 1 });
      }
    } else if (req.method === 'POST') {
      await validate([
        check('firstName').isLength({ min: 1, max: 255 }),
        check('lastName').isLength({ min: 1, max: 255 }),
        check('businessName').isLength({ min: 1, max: 255 }),
        check('businessCategory').isLength({ min: 1, max: 255 }),
        check('businessCategorySecondary').isLength({ min: 1, max: 255 }),
        check('email').isEmail(),
        check('phone').isLength({ min: 1, max: 50 }),
      ])(req, res);

      result = await models.MyContacts.create({
        userId: 1,
        ...req.body,
      });
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }

    res.status(200).json(result);
    await models.client.close();
  }
);
