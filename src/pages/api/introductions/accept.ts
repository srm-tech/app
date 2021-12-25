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
    const { Introduction, MyContacts } = await getCollections();
    if (req.method === 'POST') {
      const user = await getCurrentUser(req, res);
      const introId = req.body.introId;
      await validate([check(introId).isMongoId()]);
      result = await Introduction.accept(user._id, new ObjectId(introId));
      validate([check(introId).isMongoId()]);

      // accept introduction
      result = await Introduction.accept(user._id, new ObjectId(introId));

      const intros = await Introduction.details(new ObjectId(introId));
      if (intros.length > 0) {
        const intro = intros[0];
        const newContact = await MyContacts.addNew(
          user._id,
          new ObjectId(intro.user._id)
        );
      }
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
  }
);
