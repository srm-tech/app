import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';
import getCollections from '@/models';
import { handleErrors } from '@/lib/middleware';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { Introduction } = await getCollections();
    if (req.method === 'POST') {
      await validate([
        check('contactType').isIn(['phone', 'email']),
        req.body.contactType === 'email'
          ? check('contact').isEmail()
          : check('contact').isLength({ min: 1, max: 55 }),
        check('contactName').isLength({ min: 1, max: 55 }),
        check('businessName').isLength({ min: 1, max: 55 }),
      ])(req, res);
      const today = new Date();
      result = await Introduction.create({
        status: 'draft',
        date: new Date(),
        expiresAt: new Date(new Date().setDate(today.getDate() + 3)),
        ...req.body,
      });
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json(result);
  }
);
