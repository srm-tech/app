import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import getCurrentUser from '@/lib/get-current-user';

import middleware from '@/middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getCurrentUser();
  const introductionsPending = await req.db
    .collection('introductions')
    .find({ to: user._id, status: 'pending' })
    .count();
  const introductionsAccepted = await req.db
    .collection('introductions')
    .find({ to: user._id, status: 'accepted' })
    .count();
  const introductionsCompleted = await req.db
    .collection('introductions')
    .find({ to: user._id, status: 'completed' })
    .count();
  res.json({
    introductionsPending: introductionsPending,
    introductionsAccepted: introductionsAccepted,
    introductionsCompleted: introductionsCompleted,
  });
});

export default handler;
