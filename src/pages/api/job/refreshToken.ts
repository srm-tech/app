import { NextApiRequest, NextApiResponse } from 'next';
import { redirect } from 'next/dist/server/api-utils';
import Stripe from 'stripe';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';

import getCollections from '@/models';
import { env } from '@/lib/envConfig';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { Introduction, UserProfile } = await getCollections();
    if (req.method === 'GET') {
      const _user = await getCurrentUser(req, res);
      const _id = req.query.jobId.toString();
      const jobId = new ObjectId(_id);

      // get job data
      const job = await Introduction.getFinalise(jobId);
      // if not job found – 404
      if (!job) {
        return res.status(404).end('not found');
      }

      // get sender data
      const user = await UserProfile.getOne(new ObjectId(job.from));

      // stripe
      const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
        apiVersion: '2020-08-27',
      });

      const account = await stripe.accounts.create({ type: 'standard' });
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${env.BASE_URL}/api/job/refreshToken?jobId=${jobId}`,
        return_url: `${env.BASE_URL}/introductions`,
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
