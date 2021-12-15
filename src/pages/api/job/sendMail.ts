import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';
import sendMail from '@/lib/mail';
import { handleErrors } from '@/lib/middleware';

import models from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    if (req.method === 'POST') {
      const _user = getCurrentUser();
      const jobId = req.body.jobId;
      const amount = req.body.amount;

      // get job data
      let job = await models.Introduction.getFinalise(
        _user._id,
        new ObjectId(jobId)
      );

      // if not job found – 404
      if (!job) {
        return res.status(404).end('not found');
      }
      job = job[0];

      // get sender data
      const user = await models.UserProfile.getOne(new ObjectId(job.from));
      req.body.name = `${user.firstName} ${user.lastName}`;

      // stripe
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2020-08-27',
      });

      // todo: fix it!
      // const account = await stripe.accounts.create({type: 'standard'});
      const account = {
        id: 'acct_1K6ldwRFsSLgGzfG',
      };
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.BASE_URL}/refresh`,
        return_url: `${process.env.BASE_URL}/myContacts`,
        type: 'account_onboarding',
      });

      req.body.stripeId = account.id;
      req.body.accountLink = accountLink.url;

      const guru = {
        _id: job.user._id,
        stripeId: account.id,
        accountLink: accountLink.url,
      };

      const addDataToProfile = await models.UserProfile.addStripe(guru);
      await models.Introduction.updateStatus(job._id, 'waiting for Guru');
      if (
        addDataToProfile.acknowledged &&
        addDataToProfile.modifiedCount === 1
      ) {
        result = {
          message: 'OK',
        };
      } else {
        result = {
          message: 'Something wrong',
        };
      }

      const mailData = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `A payment from ${req.body.name} is waiting for you in introduce.guru!`,
        // text: text(req.body),
        html: html(req.body),
      };
      sendMail(mailData);

      if (!result) {
        return res.status(404).json({ statusCode: 404, message: 'Not found' });
      }
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
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
       <p>You have $${data.amount} to collect from ${data.name} in introduce.guru!</p>

      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <p>
        <a href="${data.accountLink}">
          But first you have to connect to introduce.guru via Stripe:
        </a>
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

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text(data) {
  return '';
}
