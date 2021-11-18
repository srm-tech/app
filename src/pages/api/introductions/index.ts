import { NextApiRequest, NextApiResponse } from 'next';

import { easyGetAll } from '@/lib/api-helpers';

import Introduction from '@/models/Introduction';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  easyGetAll(req, res, Introduction);
}
