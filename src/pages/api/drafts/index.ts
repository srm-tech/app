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
        check('customer.contactType').isIn(['phone', 'email']),
        req.body.contactType === 'email'
          ? check('customer.contact').isEmail()
          : check('customer.contact').isLength({ min: 1, max: 55 }),
        check('customer.name').isLength({ min: 1, max: 55 }),
        check('business.name').isLength({ min: 1, max: 55 }),
        check('business.company').isLength({ min: 1, max: 55 }),
        check('business._id').isMongoId(),
      ])(req, res);
      const today = new Date();
      result = await Introduction.create({
        status: 'draft',
        updatedAt: new Date(),
        expiresAt: new Date(new Date().setDate(today.getDate() + 3)),
        business: {
          _id: req.body.business._id,
          company: req.body.business.company,
          name: req.body.business.name,
        },
        customer: {
          name: req.body.customer.name,
          contact: req.body.customer.contact,
          contactType: req.body.customer.contactType,
        },
      });
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json(result);
  }
);
