import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';
import getCollections from '@/models';
import { handleErrors } from '@/lib/middleware';

// TODO: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { BusinessInvitations } = await getCollections();
    if (req.method === 'POST') {
      const user = await getCurrentUser(req, res);
      await validate([
        check('email').isEmail(),
        check('commissionPerReceivedLeadCash').isNumeric(),
        check('commissionPerCompletedLead').isNumeric(),
        check('commissionPerReceivedLeadPercent').isNumeric(),
        check('message').isLength({ min: 1, max: 1024 }),
      ])(req, res);

      result = await BusinessInvitations.inviteGuruNonMember({
        userId: user._id,
        date: new Date(),
        status: 'not sent yet',
        ...req.body,
      });
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }

    res.status(200).json(result);
  }
);
