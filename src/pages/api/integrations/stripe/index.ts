import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { handleErrors } from '@/lib/middleware';
import { formatAmountForStripe } from '@/lib/stripe-helpers';

import { env } from '@/lib/envConfig';

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    if (req.method === 'POST') {
      const amount: number = req.body.amount;

      const params: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: [
          {
            name: '$' + amount + ' Plan',
            amount: formatAmountForStripe(amount, env.CURRENCY),
            currency: env.CURRENCY,
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/${env.STRIPE_SUCCESS_PAGE}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/${env.STRIPE_CANCEL_PAGE}?session_id={CHECKOUT_SESSION_ID}`,
      };
      result = await stripe.checkout.sessions.create(params);
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
  }
);
