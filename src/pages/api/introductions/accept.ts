import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import models from '@/models';

// todo: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    if (req.method === 'POST') {
      const user = await getCurrentUser(req, res);
      const introId = req.body.introId;
      validate([check(introId).isMongoId()]);

      // accept introduction
      result = await models.Introduction.accept(
        user._id,
        new ObjectId(introId)
      );

      const intros = await models.Introduction.details(new ObjectId(introId));
      if (intros.length > 0) {
        const intro = intros[0];
        const newContact = await models.MyContacts.addNew(
          user._id,
          new ObjectId(intro.user._id)
        );
      }
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
    await models.client.close();
  }
);
