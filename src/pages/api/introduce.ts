import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';
import models from '@/models';
import { handleErrors } from '@/lib/middleware';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    if (req.method === 'POST') {
      const user = getCurrentUser();
      await validate([
        check('phone_or_email').isString(),
        check('name').isLength({ min: 0, max: 255 }),
        check('contactId').isMongoId(),
      ])(req, res);
      result = await models.Introduction.now({
        userId: user._id,
        status: 'sent',
        ...req.query,
      });
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json({ result });
    await models.client.close();
  }
);
