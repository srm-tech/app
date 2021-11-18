import { NextApiRequest, NextApiResponse } from 'next';

import { easyGetAll } from '@/lib/api-helpers';

import Draft from '@/models/Drafts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  easyGetAll(req, res, Draft);
}
