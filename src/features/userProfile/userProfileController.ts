import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import getCollections from '@/models';
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { UserProfile } = await getCollections();
    if (req.method === 'GET') {
      const user = await getCurrentUser(req, res);
      result = await UserProfile.getOne(user._id);
    } else if (req.method === 'PUT') {
      const user = await getCurrentUser(req, res);
      const validators = [
        check('isAcceptingIntroductions').optional().isBoolean(),
        check('commissionPerReceivedLead').optional().isNumeric(),
        check('commissionPerCompletedLead').optional().isNumeric(),
        check('commissionPerReceivedLeadPercent').optional().isNumeric(),
        check('commissionType').optional().isString(),
      ];
      await validate(validators)(req, res);
      if (req.body.commissionType) {
        req.body.isBusiness = true;
        req.body.commissionValue = req.body[req.body.commissionType];
      }

      await UserProfile.updateOne(user._id, {
        isAcceptingIntroductions: req.body.isAcceptingIntroductions,
        commissionPerReceivedLead: req.body.commissionPerReceivedLead,
        commissionPerCompletedLead: req.body.commissionPerCompletedLead,
        commissionPerReceivedLeadPercent:
          req.body.commissionPerReceivedLeadPercent,
        commissionType: req.body.commissionType,
        commissionValue: req.body.commissionValue,
      });
      result = await UserProfile.getOne(user._id);
    } else if (req.method === 'POST') {
      const user = await getCurrentUser(req, res);

      const validators = [
        check('firstName').isLength({ min: 1, max: 255 }),
        check('lastName').isLength({ min: 1, max: 255 }),
        check('businessName').isLength({ min: 1, max: 255 }),
        check('businessCategory').isLength({ min: 1, max: 255 }),
        check('contactEmail').isEmail(),
        check('contactPhone').isLength({ min: 1, max: 255 }),
        check('address1').isLength({ min: 1, max: 255 }),
        check('address2').optional().isLength({ min: 0, max: 255 }),
        check('address3').optional().isLength({ min: 0, max: 255 }),
        check('abn')
          .optional({ checkFalsy: true })
          .isLength({ min: 11, max: 11 }),
        check('country').isLength({ min: 2, max: 2 }),
        check('commissionType').optional().isString(),
      ];

      await validate(validators)(req, res);

      req.body.isBusiness = false;

      if (req.body.commissionType) {
        req.body.isBusiness = true;
        req.body.commissionValue = req.body[req.body.commissionType];
      }
      result = await UserProfile.updateOne(user._id, {
        ...req.body,
      });
    } else {
      res.setHeader('Allow', 'GET');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
  }
);
