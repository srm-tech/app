import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import getCollections from '@/models';

// todo: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { MyContacts } = await getCollections();
    if (req.method === 'POST') {
      const user = await getCurrentUser(req, res);
      const invitationId = req.body.invitationId;
      await validate([check(invitationId).isMongoId()]);
      result = await MyContacts.decline(new ObjectId(invitationId), user._id);
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
  }
);
