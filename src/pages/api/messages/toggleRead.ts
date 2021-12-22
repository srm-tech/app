import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import models from '@/models';
import { handleErrors } from '@/lib/middleware';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    const user = await getCurrentUser(req, res);

    if (req.method !== 'POST') {
      result = await models.Message.toggleRead(
        user._id,
        req.query.messageId.toString()
      );
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }

    // no result: the message with given id & userId does not exist
    if (!result) {
      return res.status(404).json({ statusCode: 404, message: 'Not found' });
    }

    res.status(200).json(result);
    await models.client.close();
  }
);
