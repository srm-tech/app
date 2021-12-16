import { NextApiRequest, NextApiResponse } from 'next';
import { redirect } from 'next/dist/server/api-utils';
import Stripe from 'stripe';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';

import models from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    if (req.method === 'GET') {
      const _user = getCurrentUser();
      const _id = req.query.jobId;
      const jobId = new ObjectId(_id);

      // get job data
      const job = await models.Introduction.getFinalise(_user._id, jobId);
      // if not job found – 404
      if (!job) {
        return res.status(404).end('not found');
      }

      // get sender data
      const user = await models.UserProfile.getOne(new ObjectId(job.from));

      // stripe
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2020-08-27',
      });

      const account = await stripe.accounts.create({ type: 'standard' });
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.BASE_URL}/api/job/refreshToken?jobId=${jobId}`,
        return_url: `${process.env.BASE_URL}/introductions`,
        type: 'account_onboarding',
      });

      return redirect(res, 303, accountLink.url);
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
  }
);
