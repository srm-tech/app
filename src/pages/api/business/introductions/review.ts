import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import models from '@/models';

// TODO: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    if (req.method === 'POST') {
      const user = await getCurrentUser(req, res);
      await validate([
        check('commisionPerReceivedLeadCash').isNumeric(),
        check('commissionPerCompletedLead').isNumeric(),
        check('commissionPerReceivedLeadPercent').isNumeric(),
        check('message').isLength({ min: 1, max: 1024 }),
        check('introId').isMongoId(),
      ])(req, res);

      result = await models.Introduction.reviewDefaultAgreement({
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
