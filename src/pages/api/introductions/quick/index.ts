import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';
import models from '@/models';
import { handleErrors } from '@/lib/middleware';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();

    const guruUser = await getCurrentUser(req, res);
    if (!guruUser) return res.status(404).send('User not found');
    if (req.method === 'GET') {
      result = await models.Introduction.readMany(guruUser._id);
    } else if (req.method === 'POST') {
      await validate([
        check('contactType').isIn(['phone', 'email']),
        req.body.contactType === 'email'
          ? check('contact').isEmail()
          : check('contact').isLength({ min: 1, max: 55 }),
        check('name').isLength({ min: 1, max: 55 }),
      ])(req, res);
      const [firstName, lastName] = req.body.name?.split(' ');
      const contact = req.body.contact;
      // check if contact exists
      let guruContact = await models.UserProfile.searchForCustomer(
        contact,
        req.body.contactType
      );
      // if contact doesn't exist, create one
      if (!guruContact) {
        guruContact = await models.UserProfile.create({
          status: 'draft',
          date: new Date(),
          fullName: req.body.name,
          firstName,
          lastName,
          phone: (req.body.contactType === 'phone' && req.body.contact) || '',
          email: (req.body.contactType === 'email' && req.body.contact) || '',
        });
      }
      result = await models.Introduction.create({
        customer: guruContact._id,
        business: req.body.businessId,
        introducedBy: guruUser._id,
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
