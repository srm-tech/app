import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import models from '@/models';
import { handleErrors } from '@/lib/middleware';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    if (req.method === 'GET') {
      const user = getCurrentUser();
      result = await models.Favourite.readMany(user._id);
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json(result);
    await models.client.close();
  }
);
