import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';
import models from '@/models';
import { handleErrors } from '@/lib/middleware';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;

    const user = getCurrentUser();
    await models.client.connect();
    if (req.method === 'GET') {
      const user = getCurrentUser();
      result = await models.Message.readMany(user._id);
    } else if (req.method === 'POST') {
      await validate([
        check('subject').isLength({ min: 1, max: 255 }),
        check('content').isLength({ min: 1, max: 1023 }),
      ])(req, res);
      result = await models.Message.create({ userId: user._id, ...req.body });
    } else if (req.method === 'DELETE') {
      result = await models.Message.deleteOne(
        user._id,
        req.query.messageId.toString()
      );
      // no result: the message with given id & userId does not exist
      if (!result) {
        res.status(404).json({ statusCode: 404, message: 'Not found' });
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
