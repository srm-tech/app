import { ObjectId } from 'bson';
import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import getCollections from '@/models';

// TODO: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { MyContacts } = await getCollections();
    let result;

    const user = await getCurrentUser(req, res);

    if (req.method === 'GET') {
      result = await MyContacts.readOne(user._id, { contactId: req.query.id });
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).send({ message: 'Method Not Allowed' });
    }

    res.status(200).json(result);
  }
);
