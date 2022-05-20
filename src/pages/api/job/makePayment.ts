import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { ObjectId } from '@/lib/db';
import { env } from '@/lib/envConfig';
import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { formatAmountForStripe } from '@/lib/stripe-helpers';
import { check, validate } from '@/lib/validator';

import getCollections from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { Introduction, UserProfile } = await getCollections();
    if (req.method === 'POST') {
      const user = await getCurrentUser(req, res);

      validate([
        check('amount').isNumeric(),
        check('jobId').isMongoId(),
        check('fee').isNumeric(),
      ]);

      let amount = req.body.amount;
      amount = parseFloat(amount);
      const jobId = req.body.jobId;
      let fee = req.body.fee;
      fee = parseFloat(fee);

      const job = await Introduction.getFinalise(new ObjectId(jobId));

      // if not job found – 404
      if (!job) {
        return res.status(404).end('not found');
      }

      // just for the convenience
      // const to = await models.UserProfile.getOne(job.business);
      // const from = job.user;
      const business = job.business; // await UserProfile.getOne(job.businessId);
      const customer = job.guru;

      // stripe
      const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
        apiVersion: '2020-08-27',
      });

      // check if business has a stripeId, if not – create it
      if (!business.stripeId) {
        const account = await stripe.accounts.create({ type: 'standard' });
        const stripeConnection = {
          _id: business._id,
          stripeId: account.id,
        };
        await UserProfile.addStripe(stripeConnection);
        business.stripeId = account.id; // add "stripeId" to the object in memory
      }

      // --- payment ---
      const session = await stripe.checkout.sessions.create(
        {
          payment_method_types: ['card'],

          line_items: [
            {
              name: `Payment for ${customer.firstName} ${customer.lastName} via introduce.guru`,
              amount: formatAmountForStripe(amount, env.CURRENCY),
              currency: env.CURRENCY,
              quantity: 1,
            },
          ],

          mode: 'payment',
          // automatic_tax: {
          //   enabled: true
          // },
          // tax_id_collection: { enabled: true },

          // customer_update: {
          //   name: 'auto',
          //   address: 'auto',
          // },

          success_url: `${
            env.BASE_URL
          }/app/job/${jobId}/paymentFinished?amount=${formatAmountForStripe(
            amount,
            env.CURRENCY
          )}`,
          cancel_url: `${env.BASE_URL}/app/job/${jobId}/finalize`,
        },
        {
          stripeAccount: customer.stripeId,
        }
      );
      // --- payment ends ---

      result = {
        statusCode: 200,
        message: 'OK',
        url: session.url,
      };
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).send({ message: 'Method Not Allowed' });
    }
    res.status(200).json(result);
  }
);
