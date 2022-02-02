import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';

import getCollections from '@/models';
import { check, validate } from '@/lib/validator';
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { UserProfile } = await getCollections();
    if (req.method === 'GET') {
      const user = await getCurrentUser(req, res);
      result = await UserProfile.getOne(user._id);
    } else if (req.method === 'PUT') {
      await validate([
        check('contactEmail').isEmail(),
        check('contactPhone').isLength({ min: 1, max: 55 }),
        check('firstName').isLength({ min: 1, max: 55 }),
        check('lastName').isLength({ min: 1, max: 55 }),
        check('businessName').isLength({ min: 1, max: 55 }),
      ])(req, res);
      const user = await getCurrentUser(req, res);
      result = await UserProfile.create(user._id, {
        isActive: true,
        ...req.body,
      });
    } else {
      res.setHeader('Allow', 'GET');
      return res.status(405).send({ message: 'Method Not Allowed' });
    }
    res.status(200).json(result);
  }
);
