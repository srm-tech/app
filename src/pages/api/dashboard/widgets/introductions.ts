import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';

import getCollections from '@/models';

// todo: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { DashboardIntroductionsWidget } = await getCollections();
    if (req.method === 'GET') {
      const user = await getCurrentUser(req, res);
      result = await DashboardIntroductionsWidget.get({
        userId: user._id,
      });
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json(result);
  }
);
