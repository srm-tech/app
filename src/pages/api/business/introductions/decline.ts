import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';
import models from '@/models';
import { handleErrors } from '@/lib/middleware';

// todo: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    await models.client.connect();
    let result;
    if (req.method === 'POST') {
      const user = await getCurrentUser(req, res);
      const introId = req.query.introId;
      await validate([check('invitationId').isMongoId()]);
      result = await models.Introduction.decline(user._id, introId);
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json(result);
    models.client.close();
  }
);
