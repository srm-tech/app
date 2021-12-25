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
      const jobs = await models.Introduction.details(
        new ObjectId(req.body.jobId)
      );
      let job;
      if (jobs.length > 0) job = jobs[0];
      const business = job.business._id;
      const guru = job.user._id;
      const payload = {
        business: business,
        guru: guru,
        comment: req.body.comment,
        rate: req.body.rate,
        jobId: job._id,
      };
      result = await models.Review.create(payload);
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
    await models.client.close();
  }
);
