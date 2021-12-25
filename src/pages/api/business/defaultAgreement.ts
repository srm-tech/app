import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import getCollections from '@/models';

// TODO: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { Agreement } = await getCollections();
    const user = await getCurrentUser(req, res);
    if (req.method === 'POST') {
      await validate([
        check('commissionPerReceivedLeadCash').isNumeric(),
        check('commissionPerCompletedLead').isNumeric(),
        check('commissionPerReceivedLeadPercent').isNumeric(),
      ])(req, res);
      result = await Agreement.create({
        userId: user._id,
        ...req.body,
      });
    } else if (req.method === 'GET') {
      result = await Agreement.findOne(user._id);
      if (!result) {
        result = {
          commissionPerReceivedLeadCash: 0,
          commissionPerCompletedLead: 0,
          commissionPerReceivedLeadPercent: 0,
        };
      }
    } else {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
  }
);
