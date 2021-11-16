import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import getCurrentUser from '@/lib/get-current-user';

import middleware from '@/middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getCurrentUser();
  const c1 = await req.db
    .collection('connections')
    .find({ user1: user._id, status: 'completed' })
    .count();
  const c2 = await req.db
    .collection('connections')
    .find({ user2: user._id, status: 'completed' })
    .count();
  res.json({
    connections: c1 + c2,
  });
});

export default handler;
