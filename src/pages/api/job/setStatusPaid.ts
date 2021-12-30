import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';

import models from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    if (req.method === 'POST') {
      const user = await getCurrentUser(req, res);
      const jobId = req.body.jobId;
      let amountPaid = req.body.amount;

      if (amountPaid) {
        amountPaid = parseInt(amountPaid) / 100.0;
      }

      const job = await models.Introduction.getFinalise(
        new ObjectId(user._id),
        new ObjectId(jobId)
      );

      if (job) {
        result = await models.Introduction.updateStatus(
          new ObjectId(jobId),
          'paid'
        );
        const bus = await models.UserProfile.getOne(job.business);
        const cust = job.user;

        const result2 = await models.UserProfile.addCommission(
          bus._id,
          cust._id,
          amountPaid
        );
      }

      if (!result) {
        return res.status(404).json({ statusCode: 404, message: 'Not found' });
      }
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json(result);
    await models.client.close();
  }
);
