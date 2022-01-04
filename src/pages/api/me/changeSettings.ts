import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import getCollections from '@/models';
import { handleErrors } from '@/lib/middleware';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { User } = await getCollections();
    if (req.method === 'POST') {
      const user = await getCurrentUser(req, res);
      result = await User.updateOne({
        userId: user._id,
        settings: req.query,
      });
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json({ result });
  }
);
