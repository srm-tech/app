import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { ObjectId } from '@/lib/db';
import sendMail from '@/lib/mail';
import { handleErrors } from '@/lib/middleware';
import { htmlStripeReminder } from '@/lib/utils';

import getCollections from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { Introduction } = await getCollections();

    if (req.method === 'GET') {
      const id = new ObjectId(req.query.id.toString());
      const _job = await Introduction.details(id);
      let job;

      if (_job.length > 0) {
        job = _job[0]; // todo: make it better

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
        await Introduction.updateStatus(job._id, 'waiting for Guru');

        const data = {
          name: `${job.user.firstName} ${job.user.lastName}`,
          accountLink: job.user.accountLink,
        };

        const mailData = {
          from: process.env.EMAIL_FROM,
          to: job.user.email,
          subject: `A payment from ${req.body.name} is waiting for you in introduce.guru!`,
          // text: text(req.body),
          html: htmlStripeReminder(data),
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
