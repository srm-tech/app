import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';

import getCollections from '@/models';
import { check, validate } from '@/lib/validator';
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { UserProfile } = await getCollections();
    if (req.method === 'GET') {
      const user = await getCurrentUser(req, res);
      result = await UserProfile.getOne(user._id);
    } else {
      res.setHeader('Allow', 'GET');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
  }
);
