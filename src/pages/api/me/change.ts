import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import models from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
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
      ];

      if (req.body.commissionPerReceivedLeadCash) {
        validators.push(
          check('commissionPerReceivedLeadCash').optional().isNumeric()
        );
        req.body.commissionPerReceivedLeadCash = parseFloat(
          req.body.commissionPerReceivedLeadCash
        );
      }
      if (req.body.commissionPerCompletedLead) {
        validators.push(
          check('commissionPerCompletedLead').optional().isNumeric()
        );
        req.body.commissionPerCompletedLead = parseFloat(
          req.body.commissionPerCompletedLead
        );
      }
      if (req.body.commissionPerReceivedLeadPercent) {
        validators.push(
          check('commissionPerReceivedLeadPercent').optional().isNumeric()
        );
        req.body.commissionPerReceivedLeadPercent = parseFloat(
          req.body.commissionPerReceivedLeadPercent
        );
      }

      await validate(validators)(req, res);

      const result1 = await models.UserProfile.updateOne({
        userId: user._id,
        ...req.body,
      });
      const result2 = await models.Agreement.updateOne({
        userId: user._id,
        commissionType: req.body.commissionType,
        commissionPerReceivedLeadCash: req.body.commissionPerReceivedLeadCash,
        commissionPerCompletedLead: req.body.commissionPerCompletedLead,
        commissionPerReceivedLeadPercent:
          req.body.commissionPerReceivedLeadPercent,
      });

      result = {
        result1: result1,
        result2: result2,
      };
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json({ result });
    await models.client.close();
  }
);
