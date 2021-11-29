import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';
import models from '@/models';
import { handleErrors } from '@/lib/middleware';

// TODO: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    if (req.method === 'POST') {
      const user = getCurrentUser();
      await validate([
        check('revenue').isNumeric(),
        check('reward').isNumeric(),
        check('tip_bonus').isNumeric(),
        check('totalPayment').isNumeric(),
        check('introId').isMongoId(),
      ])(req, res);
      result = await models.Introduction.finalise({
        userId: user._id,
        ...req.query,
      });
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
    await models.client.close();
  }
);
