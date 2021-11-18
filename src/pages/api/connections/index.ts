import { NextApiRequest, NextApiResponse } from 'next';

import Connection from '@/models/Connections';
import { easyGetAll } from '@/lib/api-helpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  easyGetAll(req, res, Connection);
}
