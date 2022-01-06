import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';

import getCollections from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { Introduction, UserProfile } = await getCollections();
    if (req.method === 'POST') {
      const user = await getCurrentUser(req, res);
      const jobId = req.body.jobId;
      let amountPaid = req.body.amount;

      if (amountPaid) {
        amountPaid = parseInt(amountPaid) / 100.0;
      }

      const job = await Introduction.getFinalise(new ObjectId(jobId));
      if (job) {
        result = await Introduction.updateStatus(job._id, 'paid');
        const bus = await UserProfile.getOne(job.business._id);
        const cust = await UserProfile.getOne(job.user._id);
        if (bus && cust) {
          const result2 = await UserProfile.addCommission(
            bus._id,
            cust._id,
            amountPaid
          );
        }
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
  }
);
