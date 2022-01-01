import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { ObjectId } from '@/lib/db';
import sendMail from '@/lib/mail';
import { handleErrors } from '@/lib/middleware';

import models from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    if (req.method === 'GET') {
      const id = new ObjectId(req.query.id);
      const _job = await models.Introduction.details(id);
      let job;
      console.log('job:', job);
      if (_job.length > 0) {
        job = _job[0]; // todo: make it better
        console.log('job:', job);
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: '2020-08-27',
        });

        const stripeAccount = await stripe.accounts.retrieve(job.user.stripeId);

        result = {
          details: stripeAccount.details_submitted,
          charges: stripeAccount.charges_enabled,
        };
      }

      if (!result.charges) {
        await models.Introduction.updateStatus(job._id, 'waiting for Guru');

        const data = {
          name: `${job.user.firstName} ${job.user.lastName}`,
          accountLink: job.user.accountLink,
        };

        const mailData = {
          from: process.env.EMAIL_FROM,
          to: job.user.email,
          subject: `A payment from ${req.body.name} is waiting for you in introduce.guru!`,
          // text: text(req.body),
          html: html(data),
        };
        sendMail(mailData);
      }
    } else {
      res.setHeader('Allow', 'GET');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
    await models.client.close();
  }
);

function html(data) {
  const backgroundColor = '#f9f9f9';
  const textColor = '#444444';
  const mainBackgroundColor = '#ffffff';

  return `
  <body style="background: ${backgroundColor}; padding-bottom: 20px; padding-top: 20px;">

  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px; margin-bottom: 20px">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
       <p>You have a payment to collect from ${data.name} in introduce.guru!</p>

      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <p>
        But first you have to provide details and payment data to make the payment possible.
        </p>
      </td>
    </tr>

    <tr>
      <td>
        <p>Best Regards</p>
        <p>${data.name}</p>
      </td>
    </tr>
    
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 10px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}
