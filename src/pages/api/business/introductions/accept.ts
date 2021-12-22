import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';
import models from '@/models';
import { handleErrors } from '@/lib/middleware';

// todo: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    if (req.method === 'POST') {
      const user = await getCurrentUser(req, res);
      const introId = req.query.introId;
      await validate([check('invitationId').isMongoId()]);
      result = await models.Introduction.accept(user._id, introId);
      result.id = introId;
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json(result);
    models.client.close();
  }
);
