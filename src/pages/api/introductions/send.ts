import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';
import models from '@/models';
import { handleErrors } from '@/lib/middleware';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const userId = await getCurrentUser(req, res)._id;
    await models.client.connect();
    if (req.method === 'POST') {
      validate([check('introductionId').isMongoId()]);
      result = await models.Introduction.finalise({
        _id: req.query.introductionId,
        userId,
        ...req.body,
      });
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json(result);
    await models.client.close();
  }
);
