import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import sendMail from '@/lib/mail';
import { handleErrors } from '@/lib/middleware';
import { htmlIntroduction } from '@/lib/utils';
import { check, validate } from '@/lib/validator';

import getCollections from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { Introduction, UserProfile } = await getCollections();
    const user = await getCurrentUser(req, res);
    if (req.method === 'GET') {
      result = await Introduction.readMany(user._id);
    } else if (req.method === 'POST') {
      // this endopoint requires user
      const guru = await getCurrentUser(req, res);
      await validate([
        check('customer.contactType').isIn(['phone', 'email']),
        req.body.contactType === 'email'
          ? check('customer.contact').isEmail()
          : check('customer.contact').isLength({ min: 1, max: 55 }),
        check('customer.name').isLength({ min: 1, max: 55 }),
        check('business.name').isLength({ min: 1, max: 55 }),
        check('business.company').isLength({ min: 1, max: 55 }),
        check('agreement.commissionCurrency').isLength({ min: 1, max: 3 }),
        check('agreement.commissionLabel').isLength({ min: 1, max: 55 }),
        check('agreement.commissionType').isLength({ min: 1, max: 55 }),
        check('agreement.commissionValue').isNumeric(),
        check('_id').isMongoId(),
      ])(req, res);
      const [firstName, lastName] = req.body.customer.name?.split(' ');
      // contact is not a user in our system
      const customer = {
        fullName: req.body.customer.name,
        firstName,
        lastName,
        phone:
          (req.body.customer.contactType === 'phone' &&
            req.body.customer.contact) ||
          '',
        email:
          (req.body.customer.contactType === 'email' &&
            req.body.customer.contact) ||
          '',
      };
      const businessProfile = await UserProfile.getOne(
        req.body.business._id.toString()
      );

      const business = {
        _id: req.body.business._id,
        firstName: businessProfile?.firstName,
        lastName: businessProfile?.lastName,
        name: `${businessProfile?.firstName} ${businessProfile?.lastName}`,
        company: businessProfile?.businessName,
        email: businessProfile?.email,
      };

      result = await Introduction.update(req.body._id, {
        status: 'pending',
        action: 'sent',
        customer,
        guru,
        business,
        agreement: req.body.agreement,
      });

      // send email
      const mailData = {
        from: process.env.EMAIL_FROM,
        to: business?.email,
        replyTo: business?.email,
        bcc: 'kris@introduce.guru',
        subject: `An introduction is waiting for you in introduce.guru!`,
        // text: text(req.body),
        html: htmlIntroduction(guru, customer, business),
      };
      const emailResult: any = await sendMail(mailData);
      console.info(emailResult?.messageId);
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }

    res.status(200).json(result);
  }
);
