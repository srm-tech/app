import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import getCollections from '@/models';

// TODO: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { Introduction } = await getCollections();
    if (req.method === 'POST') {
      const user = await getCurrentUser(req, res);
      await validate([
        check('revenue').isNumeric(),
        check('reward').isNumeric(),
        check('tip_bonus').isNumeric(),
        check('totalPayment').isNumeric(),
        check('introId').isMongoId(),
      ])(req, res);
      result = await Introduction.finalise({
        userId: user._id,
        ...req.query,
      });
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).send({ message: 'Method Not Allowed' });
    }
    res.status(200).json(result);
  }
);
