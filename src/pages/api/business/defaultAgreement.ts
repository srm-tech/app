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
    const user = getCurrentUser();
    if (req.method === 'POST') {
      await validate([
        check('commissionPerReceivedLeadCash').isNumeric(),
        check('commissionPerCompletedLead').isNumeric(),
        check('commissionPerReceivedLeadPercent').isNumeric(),
      ])(req, res);
      result = await models.Agreement.create({
        userId: user._id,
        ...req.body,
      });
    } else if (req.method === 'GET') {
      result = await models.Agreement.findOne(user._id);
    } else {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
    await models.client.close();
  }
);
