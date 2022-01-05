import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';
import getCollections from '@/models';
import { handleErrors } from '@/lib/middleware';
import { ObjectId } from 'mongodb';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { Introduction, UserProfile } = await getCollections();
    if (req.method === 'GET') {
      await validate([check('id').isMongoId()])(req, res);
      result = await Introduction.getOne(req.query.id);
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json(result);
  }
);
