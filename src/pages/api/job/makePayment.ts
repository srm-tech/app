import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { formatAmountForStripe } from '@/lib/stripe-helpers';
import { check, validate } from '@/lib/validator';

import { env } from '@/config';
import getCollections from '@/models';

// todo: replace userId
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
      amount = parseInt(amount);
      const jobId = req.body.jobId;
      let fee = req.body.fee;
      fee = parseInt(fee);

      const job = await Introduction.getFinalise(user._id, new ObjectId(jobId));
      // if not job found – 404
      if (!job) {
        return res.status(404).end('not found');
      }

      // just for the convenience
      const from = await UserProfile.getOne(job.from);
      const to = job.user;
      // stripe
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2020-08-27',
      });

      // check if business has a stripeId, if not – create it
      if (!from.stripeId) {
        const account = await stripe.accounts.create({ type: 'standard' });
        const business = {
          _id: from._id,
          stripeId: account.id,
        };
        await UserProfile.addStripe(business);
        from.stripeId = account.id;
      }

      const session = await stripe.checkout.sessions.create(
        {
          payment_method_types: ['card'],
          line_items: [
            {
              name: `Payment for ${to.firstName} ${to.lastName} via introduce.guru`,
              amount: formatAmountForStripe(amount, env.CURRENCY),
              currency: env.CURRENCY,
              quantity: 1,
            },
          ],
          payment_intent_data: {
            application_fee_amount: formatAmountForStripe(fee, env.CURRENCY),
          },
          mode: 'payment',
          success_url: `${process.env.BASE_URL}/job/paymentFinished?jobId=${jobId}`,
          cancel_url: `${process.env.BASE_URL}/job/finalise?jobId=${jobId}`,
        },
        {
          stripeAccount: to.stripeId,
        }
      );
      result = {
        statusCode: 200,
        message: 'OK',
        url: session.url,
      };
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
  }
);
