import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';

import DashboardIntroductionsWidget from '@/models/widgets/DashboardIntroductions';

// todo: replace userId
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const user = getCurrentUser();
      const result = await DashboardIntroductionsWidget.get({
        userId: user._id,
      });
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  }
}
