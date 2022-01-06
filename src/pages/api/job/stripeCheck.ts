import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { ObjectId } from '@/lib/db';
import sendMail from '@/lib/mail';
import { handleErrors } from '@/lib/middleware';
import { htmlNewStripeAccount } from '@/lib/utils';

import getCollections from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { Introduction, UserProfile } = await getCollections();

    if (req.method === 'GET') {
      const id = new ObjectId(req.query.id.toString());
      const jobs = await Introduction.details(id);
      let job;
      if (jobs.length > 0) {
        job = jobs[0]; // todo: make it better
        result = {
          stripeCheck: job.user.stripeId ? true : false,
        };
      } else {
        result = {
          stripeCheck: false,
        };
      }

      // send email to user if not stripe
      if (!result.stripeCheck && jobs.length > 0) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: '2020-08-27',
        });

        const account = await stripe.accounts.create({
          type: 'standard',
          country: job.user.country,
          email: job.user.email,
        });
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `${process.env.BASE_URL}/api/job/refreshToken?jobId=${id}`,
          return_url: `${process.env.BASE_URL}/introductions`,
          type: 'account_onboarding',
        });

        job.user.stripeId = account.id;
        job.user.accountLink = accountLink.url;

        const guru = {
          _id: job.user._id,
          stripeId: account.id,
          accountLink: accountLink.url,
        };

        const addDataToProfile = await UserProfile.addStripe(guru);
        await Introduction.updateStatus(job._id, 'waiting for Guru');

        result.mailSent =
          addDataToProfile.acknowledged && addDataToProfile.modifiedCount === 1
            ? true
            : false;

        const data = {
          name: `${job.user.firstName} ${job.user.lastName}`,
          accountLink: accountLink.url,
        };

        const mailData = {
          from: process.env.EMAIL_FROM,
          to: job.user.email,
          subject: `A payment from ${req.body.name} is waiting for you in introduce.guru!`,
          // text: text(req.body),
          html: htmlNewStripeAccount(data),
        };
        sendMail(mailData);
      }
    } else {
      res.setHeader('Allow', 'GET');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
  }
);
