import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import getCurrentUser from '@/lib/get-current-user';

import middleware from '@/middleware/database';

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getCurrentUser();
  const introductions = await req.db
    .collection('introductions')
    .aggregate([
      {
        $match: {
          to: user._id,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'from',
          foreignField: '_id',
          as: 'invitedBy',
        },
      },
      {
        $unset: ['from', 'to'],
      },
      {
        $unwind: '$invitedBy',
      },
    ])
    .sort({
      date: -1,
    })
    .toArray();

  res.json({
    introductions: introductions,
  });
});

export default handler;
