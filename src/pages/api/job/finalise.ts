import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';

import models from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    if (req.method === 'GET') {
      const user = getCurrentUser();
      const jobId = req.query.jobId;

      result = await models.Introduction.getFinalise(
        user._id,
        new ObjectId(jobId)
      );

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
