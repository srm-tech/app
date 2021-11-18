import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';

import Draft from '@/models/Drafts';

// todo: replace userId
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ message: 'Method not allowed' });
    }
    const user = getCurrentUser();
    await validate([
      check('assignedId').isMongoId(),
      check('documentId').isMongoId(),
    ])(req, res);
    const result = await Draft.create({
      userId: user._id,
      date: new Date(),
      ...req.body,
    });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
