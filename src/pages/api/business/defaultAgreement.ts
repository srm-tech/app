import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import getCollections from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { Agreement } = await getCollections();
    const user = await getCurrentUser(req, res);
    if (req.method === 'GET') {
      let filter = user._id.toString();
      if (req.query.businessId) {
        filter = req.query.businessId.toString();
      }
      result = await Agreement.findOne(filter);
      if (!result) {
        result = {
          commissionPerReceivedLead: 0,
          commissionPerCompletedLead: 0,
          commissionPerReceivedLeadPercent: 0,
        };
      }
    } else if (req.method === 'POST') {
      await validate([
        check('commissionPerReceivedLead').isNumeric(),
        check('commissionPerCompletedLead').isNumeric(),
        check('commissionPerReceivedLeadPercent').isNumeric(),
        check('commissionType').isString(),
      ])(req, res);
      result = await Agreement.create({
        userId: user._id,
        ...req.body,
      });
    } else {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
  }
);
