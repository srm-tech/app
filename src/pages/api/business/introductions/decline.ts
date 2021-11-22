import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';

import Introduction from '@/models/Introduction';

// todo: replace userId
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const user = getCurrentUser();
      const introId = req.query.introId;
      await validate([check('invitationId').isMongoId()]);
      const result = await Introduction.decline(user._id, ObjectId(introId));
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.status(405).json({ statusCode: 405, message: 'Method not allowed' });
  }
}
