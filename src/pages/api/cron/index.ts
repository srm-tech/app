import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import sendMail from '@/lib/mail';
import { htmlNewStripeAccount, htmlStripeReminder } from '@/lib/utils';

import getCollections from '@/models';
import models from '@/models';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await models.client.connect();
    const { Introduction } = await getCollections();

    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.SECRET}`) {
        const jobs = await models.Introduction.waitingForGuru();

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: '2020-08-27',
        });

        for (const job of jobs) {
          // job: create token if does not exist todo: not necessary

          // const name = `${job.user.firstName} ${job.user.lastName}`;
          // const id = job._id;

          // if (!job.stripeId) {
          //   const account = await stripe.accounts.create({
          //     type: 'standard',
          //     country: job.user.country,
          //     email: job.user.email,
          //   });
          //   const accountLink = await stripe.accountLinks.create({
          //     account: account.id,
          //     refresh_url: `${process.env.BASE_URL}/api/job/refreshToken?jobId=${id}`,
          //     return_url: `${process.env.BASE_URL}/introductions`,
          //     type: 'account_onboarding',
          //   });

          //   job.user.stripeId = account.id;
          //   job.user.accountLink = accountLink.url;

          //   const guru = {
          //     _id: job.user._id,
          //     stripeId: account.id,
          //     accountLink: accountLink.url,
          //   };

          //   const addDataToProfile = await models.UserProfile.addStripe(guru);
          //   await models.Introduction.updateStatus(job._id, 'waiting for Guru');

          //   const data = {
          //     name: `${job.user.firstName} ${job.user.lastName}`,
          //     accountLink: accountLink.url,
          //   };

          //   const mailData = {
          //     from: process.env.EMAIL_FROM,
          //     to: job.user.email,
          //     subject: `A payment from ${data.name} is waiting for you in introduce.guru!`,
          //     // text: text(req.body),
          //     html: htmlNewStripeAccount(data),
          //   };
          //   sendMail(mailData);
          // }

          // job: send reminder

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
              to: job.user.email,
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
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
  await models.client.close();
}
