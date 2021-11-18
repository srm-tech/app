import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';

import DashBoardConnectionsWidget from '@/models/widgets/DashboardConnections';

// todo: replace userId
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = getCurrentUser();
  if (req.method === 'GET') {
    try {
      const result = await DashBoardConnectionsWidget.get({ userId: user._id });
      res.status(200).json({
        connections: result,
      });
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  }
}
