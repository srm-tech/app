import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import getCollections from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const user = await getCurrentUser(req, res);

    const { Introduction } = await getCollections();
    if (req.method === 'POST') {
      validate([check('introductionId').isMongoId()]);
      result = await Introduction.finalise({
        _id: req.query.introductionId,
        userId: user._id,
        ...req.body,
      });
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json(result);
  }
);
