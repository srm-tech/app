import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';
import models from '@/models';
import { handleErrors } from '@/lib/middleware';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    const user = getCurrentUser();
    if (req.method === 'GET') {
      result = await models.Introduction.readMany(user._id);
    } else if (req.method === 'POST') {
      await validate([
        check('contactType').isIn(['phone', 'email']),
        req.body.contactType === 'email'
          ? check('contact').isEmail()
          : check('contact').isLength({ min: 1, max: 55 }),
        check('name').isLength({ min: 1, max: 55 }),
        check('categoryId').isMongoId(),
      ])(req, res);
      const [firstName, lastName] = req.body.name?.split(' ');
      result = await models.Introduction.create({
        userId: user._id,
        status: 'draft',
        date: new Date(),
        fullName: req.body.contact,
        firstName,
        lastName,
        phone: (req.body.contactType === 'phone' && req.body.phone) || '',
        email: (req.body.contactType === 'email' && req.body.email) || '',
        categoryId: req.body.categoryId,
      });
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json(result);
    await models.client.close();
  }
);
