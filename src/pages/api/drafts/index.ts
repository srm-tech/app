// todo: replace UserId

import getCurrentUser from '@/lib/get-current-user';
import Introduction from '@/models/Introduction';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = await getCurrentUser(req, res);
    const result = await Introduction.drafts(user._id);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
