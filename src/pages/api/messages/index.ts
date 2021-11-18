import { NextApiRequest, NextApiResponse } from 'next';

import { easyGetAll } from '@/lib/api-helpers';

import Message from '@/models/Messages';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  easyGetAll(req, res, Message);
}
