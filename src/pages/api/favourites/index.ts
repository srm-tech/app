// todo: replace UserId

import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';

import Favourite from '@/models/Favourites';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = getCurrentUser();
    const result = await Favourite.readMany(user._id);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
