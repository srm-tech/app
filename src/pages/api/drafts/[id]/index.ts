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
    } else if (req.method === 'PUT') {
      // this endopoint requires user
      const guruUser = await getCurrentUser(req, res);
      await validate([
        check('contactType').isIn(['phone', 'email']),
        req.body.contactType === 'email'
          ? check('contact').isEmail()
          : check('contact').isLength({ min: 1, max: 55 }),
        check('contactName').isLength({ min: 1, max: 55 }),
        check('businessName').isLength({ min: 1, max: 55 }),
        check('businessLabel').isLength({ min: 1, max: 55 }),
        check('businessId').isMongoId(),
        check('_id').isMongoId(),
      ])(req, res);
      result = await Introduction.update(req.body);
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json(result);
  }
);
