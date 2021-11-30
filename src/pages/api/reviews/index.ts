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
        check('stars').isNumeric(),
        check('comment').isLength({ min: 0, max: 1023 }),
        check('reviewedId').isMongoId(),
      ])(req, res);
      result = await models.Review.create({
        userId: user._id,
        ...req.query,
      });
      res.status(200).json({ result });
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    await models.client.close();
  }
);
