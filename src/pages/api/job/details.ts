import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from '@/lib/db';
import { handleErrors } from '@/lib/middleware';

import models from '@/models';

// TODO: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    if (req.method === 'GET') {
      const id = new ObjectId(req.query.id);
      result = await models.Introduction.details(id);
    } else {
      res.setHeader('Allow', 'GET');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
    await models.client.close();
  }
);
