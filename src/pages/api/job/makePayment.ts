import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import { env } from '@/config';
import models from '@/models';

// todo: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    if (req.method === 'POST') {
      const user = getCurrentUser();
      const amount = req.body.amount;
      const jobId = req.body.jobId;
      const toId = req.body.to;

      const job = await models.Introduction.getFinalise(
        user._id,
        new ObjectId(jobId),
        new ObjectId(toId)
      );
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2020-08-27',
      });
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: env.CURRENCY,
        payment_method_types: ['card'],
        on_behalf_of: job[0].user.stripeId, // connected user Stripe id
      });
      console.log('pi', paymentIntent);
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
    await models.client.close();
  }
);
