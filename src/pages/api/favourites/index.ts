// todo: replace UserId

import { NextApiRequest, NextApiResponse } from 'next';

import { easyGetAll } from '@/lib/api-helpers';

import Favourite from '@/models/Favourites';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  easyGetAll(req, res, Favourite);
}
