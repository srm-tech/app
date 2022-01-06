import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from '@/lib/db';
import { handleErrors } from '@/lib/middleware';

import getCollections from '@/models';

// TODO: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { Introduction } = await getCollections();
    let result;

    if (req.method === 'GET') {
      const _id = req.query.id.toString();
      const id = new ObjectId(_id);
      result = await Introduction.details(id);
    } else {
      res.setHeader('Allow', 'GET');
      return res.status(405).end('Method Not Allowed');
    }

    res.status(200).json(result);
  }
);
