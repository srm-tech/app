import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';

import Introduction from '@/models/Introduction';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = getCurrentUser()._id;
  try {
    if (req.method === 'POST') {
      const introductionId: ObjectId = ObjectId(req.query.introductionId);
      validate([check(introductionId).isMongoId()]);
      const result = await Introduction.send(introductionId, user);

      res.status(200).json(result);
    } else {
      res.status(405).json({ statusCode: 405, message: 'Method not allowed' });
    }
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
