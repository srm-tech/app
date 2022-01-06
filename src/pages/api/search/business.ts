import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';
import getCollections from '@/models';
import { connectToDatabase } from '@/lib/db';

// TODO: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { UserProfile } = await getCollections();
    if (req.method === 'GET') {
      if (req.query.q !== undefined) {
        await validate([check('q').isLength({ min: 0, max: 255 })])(req, res);
        result =
          (await UserProfile.searchForBusinessQuick(req.query.q.toString())) ||
          [];
      } else {
        const user = await getCurrentUser(req, res);
        result = await UserProfile.readMany({ userId: user._id });
      }
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }

    res.status(200).json(result);
  }
);