import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';

import BusinessInvitations from '@/models/BusinessInvitations';

// TODO: replace userId
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const user = getCurrentUser();
    await validate([
      check('email').isEmail(),
      check('commisionPerReceivedLeadCash').isNumeric(),
      check('commissionPerCompletedLead').isNumeric(),
      check('commissionPerReceivedLeadPercent').isNumeric(),
      check('message').isLength({ min: 1, max: 1024 }),
    ])(req, res);
    try {
      const result = await BusinessInvitations.inviteGuruNonMember({
        userId: user._id,
        date: new Date(),
        status: 'not sent yet',
        ...req.body,
      });
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
