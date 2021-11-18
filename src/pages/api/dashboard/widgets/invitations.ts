import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';

import DashboardInvitationsWidget from '@/models/widgets/DashboardInvitations';

// todo: replace userId
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const user = getCurrentUser();
      const result = await DashboardInvitationsWidget.get({ userId: user._id });
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  }
}
