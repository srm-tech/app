import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import getCollections from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { MyContacts } = await getCollections();
    if (req.method === 'POST') {
      const user = await getCurrentUser(req, res);
      const contactId = req.body.contactId;
      await validate([check(contactId).isMongoId()]);
      result = await MyContacts.toggleFav(new ObjectId(contactId), user._id);
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json(result);
  }
);
