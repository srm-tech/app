import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';
import models from '@/models';
import { handleErrors } from '@/lib/middleware';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    const user = getCurrentUser();
    if (req.method === 'GET') {
      result = await models.Introduction.readMany(user._id);
    } else if (req.method === 'POST') {
      await validate([
        check('firstName').isLength({ min: 1, max: 255 }),
        check('lastName').isLength({ min: 1, max: 255 }),
        check('email').isEmail(),
        check('mobile').isMobilePhone('any'),
        check('aboutTheJob').isLength({ min: 1, max: 1023 }),
      ])(req, res);
      if (req.query.action == 'continue') {
        result = await models.Introduction.create({
          userId: user._id,
          date: new Date(),
          type: 'introduction',
          ...req.query,
        });
      } else if (req.query.action === 'continue') {
        result = await models.Introduction.create({
          userId: user._id,
          date: new Date(),
          status: 'not sent yet',
          ...req.query,
        });
      } else if (req.query.action === 'draft') {
        result = await models.Introduction.create({
          userId: user._id,
          status: 'draft',
          date: new Date(),
          type: 'draft',
          ...req.query,
        });
      } else {
        return res.status(404).json({
          statusCode: 404,
          message: 'Not found. Maybe you should specify an "action" parameter?',
        });
      }
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }

    res.status(200).json(result);
    await models.client.close();
  }
);
