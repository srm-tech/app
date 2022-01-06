import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import sendMail from '@/lib/mail';
import { htmlStripeReminder } from '@/lib/utils';

import getCollections from '@/models';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { Introduction } = await getCollections();

    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.SECRET}`) {
        const jobs = await Introduction.waitingForGuru();

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: '2020-08-27',
        });

        for (const job of jobs) {
          const stripeAccount = await stripe.accounts.retrieve(
            job.user.stripeId
          );

          const result = {
            details: stripeAccount.details_submitted,
            charges: stripeAccount.charges_enabled,
          };

          if (!result.charges) {
            await Introduction.updateStatus(job._id, 'waiting for Guru');

            const data = {
              name: `${job.user.firstName} ${job.user.lastName}`,
              accountLink: job.user.accountLink,
            };

            const mailData = {
              from: process.env.EMAIL_FROM,
              to: job.user.contactEmail,
              subject: `A payment from ${data.name} is waiting for you in introduce.guru!`,
              // text: text(req.body),
              html: htmlStripeReminder(data),
            };
            sendMail(mailData);
            await Introduction.saveReminderDate(job._id);
          }
        }
        res.status(200).json({ success: true, result: jobs });
      } else {
        res.status(401).json({ success: false });
      }
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
