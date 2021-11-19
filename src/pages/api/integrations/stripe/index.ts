import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { formatAmountForStripe } from '@/lib/stripe-helpers';
import { CURRENCY, STRIPE_CANCEL_PAGE, STRIPE_SUCCESS_PAGE } from '@/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const amount: number = req.body.amount;
    try {
      const params: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: [
          {
            name: '$' + amount + ' Plan',
            amount: formatAmountForStripe(amount, CURRENCY),
            currency: CURRENCY,
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/${STRIPE_SUCCESS_PAGE}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/${STRIPE_CANCEL_PAGE}?session_id={CHECKOUT_SESSION_ID}`,
      };
      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (err) {
      res
        .status(500)
        .json({ statusCode: 500, message: (err as Error).message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
