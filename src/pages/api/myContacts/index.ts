import { ObjectId } from 'bson';
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

    const user = getCurrentUser();

    if (req.method === 'GET') {
      if (req.query.q !== undefined) {
        await validate([check('q').isLength({ min: 0, max: 255 })])(req, res);
        result = await models.MyContacts.search({
          userId: user._id,
          query: req.query.q.toString(),
        });
      } else {
        result = await models.MyContacts.readMany({ userId: user._id });
      }
    } else if (req.method === 'POST') {
      await validate([
        check('contactId').isMongoId(),
        check('status').isLength({ min: 1, max: 255 }),
        // check('firstName').isLength({ min: 1, max: 255 }),
        // check('lastName').isLength({ min: 1, max: 255 }),
        // check('businessName').isLength({ min: 1, max: 255 }),
        // check('businessCategory').isLength({ min: 1, max: 255 }),
        // check('businessCategorySecondary').isLength({ min: 1, max: 255 }),
        // check('email').isEmail(),
        // check('phone').isLength({ min: 1, max: 50 }),
      ])(req, res);
      req.body.contactId = new ObjectId(req.body.contactId);
      result = await models.MyContacts.create({
        userId: user._id,
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
