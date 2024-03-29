import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';

import Invitation from '@/models/Invitations';

// todo: replace userId
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const user = getCurrentUser();
      const invitationId = req.query.invitationId;
      const result = await Invitation.decline(user._id, ObjectId(invitationId));
      if (result.matchedCount == 0) {
        res.status(404).json({ statusCode: 404, message: 'Not found' });
      }
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.status(405).json({ statusCode: 405, message: 'Method not allowed' });
  }
}
