import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';

import DashboardIntroductionsWidget from '@/models/widgets/DashboardIntroductions';

// todo: replace userId
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = getCurrentUser();
  if (req.method === 'GET') {
    try {
      const result = await DashboardIntroductionsWidget.get({
        userId: user._id,
      });
      res.status(200).json({
        connections: result,
      });
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  }
}

// import { NextApiRequest, NextApiResponse } from 'next';
// import nextConnect from 'next-connect';

// import getCurrentUser from '@/lib/get-current-user';

// import middleware from '@/middleware/database';

// const handler = nextConnect();

// handler.use(middleware);

// handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
//   const user = await getCurrentUser();
//   const introductionsPending = await req.db
//     .collection('introductions')
//     .find({ to: user._id, status: 'pending' })
//     .count();
//   const introductionsAccepted = await req.db
//     .collection('introductions')
//     .find({ to: user._id, status: 'accepted' })
//     .count();
//   const introductionsCompleted = await req.db
//     .collection('introductions')
//     .find({ to: user._id, status: 'completed' })
//     .count();
//   res.json({
//     introductionsPending: introductionsPending,
//     introductionsAccepted: introductionsAccepted,
//     introductionsCompleted: introductionsCompleted,
//   });
// });

// export default handler;
