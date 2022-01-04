import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import getCollections from '@/models';
import { handleErrors } from '@/lib/middleware';

// todo: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const user = await getCurrentUser(req, res);
    const { DashBoardConnectionsWidget } = await getCollections();
    if (req.method === 'GET') {
      result = await DashBoardConnectionsWidget.get({
        userId: user._id,
      });
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json({
      connections: result,
    });
  }
);
