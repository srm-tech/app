import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import getCollections from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { UserProfile } = await getCollections();
    if (req.method === 'POST') {
      const user = await getCurrentUser(req, res);

      const validators = [
        check('firstName').isLength({ min: 1, max: 255 }),
        check('lastName').isLength({ min: 1, max: 255 }),
        check('businessName').isLength({ min: 1, max: 255 }),
        check('businessCategory').isLength({ min: 1, max: 255 }),
        check('email').isEmail(),
        check('address1').isLength({ min: 1, max: 255 }),
        check('address2').optional().isLength({ min: 0, max: 255 }),
        check('address3').optional().isLength({ min: 0, max: 255 }),
        check('abn').isLength({ min: 11, max: 11 }),
        check('country').isLength({ min: 2, max: 2 }),
        check('commissionType').optional().isString(),
        check('commissionPerReceivedLead').optional().isNumeric(),
        check('commissionPerCompletedLead').optional().isNumeric(),
        check('commissionPerReceivedLeadPercent').optional().isNumeric(),
      ];

      await validate(validators)(req, res);

      req.body.isBusiness = false;

      if (req.body.commissionType) {
        req.body.isBusiness = true;
      }

      const valueFromRequest = req.body[req.body.commissionType];
      const value = parseFloat(valueFromRequest);
      req.body[req.body.commissionType] = value;

      const result = await UserProfile.updateOne(user._id, {
        ...req.body,
      });
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json({ result });
  }
);
