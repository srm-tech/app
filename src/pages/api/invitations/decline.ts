import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';

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
      await validate([check(invitationId).isMongoId()]);
      const result = await Invitation.decline(
        user._id,
        new ObjectId(invitationId)
      );
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
