import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { pricing } from '@/components/home/Pricing';
import { env } from '@/lib/envConfig';
import { handleErrors } from '@/lib/middleware';

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    if (req.method === 'POST') {
      const priceId: string = req.body.priceId;
      const checkPrice = await stripe.prices.retrieve(priceId);
      if (!checkPrice) {
        res.status(404);
      }
      const plan = pricing.tiers.find((el) => el.stripePriceId === priceId);
      const params: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: [
          {
            quantity: 1,
            price: plan?.stripePriceId,
          },
        ],
        mode: 'payment',
        submit_type: 'pay',
        success_url: `${req.headers.origin}/${env.STRIPE_SUCCESS_PAGE}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/${env.STRIPE_CANCEL_PAGE}?session_id={CHECKOUT_SESSION_ID}`,
      };
      result = await stripe.checkout.sessions.create(params);
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).send({ message: 'Method Not Allowed' });
    }
    res.status(200).json(result);
  }
);
