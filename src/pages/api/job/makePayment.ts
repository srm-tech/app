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

      validate([
        check('amount').isNumeric(),
        check('jobId').isMongoId(),
        check('fee').isNumeric(),
      ]);

      const amount = req.body.amount;
      const jobId = req.body.jobId;
      const fee = req.body.fee;
      const stripeId = req.body.stripeId;

      const job = await models.Introduction.getFinalise(
        user._id,
        new ObjectId(jobId)
      );
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
    await models.client.close();
  }
);
