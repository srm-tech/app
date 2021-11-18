import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import getCurrentUser from '@/lib/get-current-user';

import middleware from '@/middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getCurrentUser();
  const invitationsSent = await req.db
    .collection('invitations')
    .find({ to: user._id })
    .count();
  const invitationsReceived = await req.db
    .collection('invitations')
    .find({ from: user._id })
    .count();

  res.json({
    invitationsSent: invitationsSent,
    invitationsReceived: invitationsReceived,
  });
});

export default handler;
