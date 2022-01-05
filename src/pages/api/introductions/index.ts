import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import getCollections from '@/models';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { Introduction, UserProfile } = await getCollections();
    const user = await getCurrentUser(req, res);
    if (req.method === 'GET') {
      result = await Introduction.readMany(user._id);
    } else if (req.method === 'POST') {
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
      const [firstName, lastName] = req.body.contactName?.split(' ');
      const contact = req.body.contact;
      // check if contact exists
      let customer: any = await UserProfile.searchForCustomer(
        contact,
        req.body.contactType
      );
      // if contact doesn't exist, create one
      if (!customer) {
        const newUserProfile = await UserProfile.create({
          isActive: false,
          date: new Date(),
          fullName: req.body.contactName,
          firstName,
          lastName,
          phone: (req.body.contactType === 'phone' && req.body.contact) || '',
          email: (req.body.contactType === 'email' && req.body.contact) || '',
        });
        customer = await UserProfile.getOne(newUserProfile.insertedId);
      }
      result = await Introduction.update(req.body._id, {
        status: 'active',
        customerId: customer._id,
        guruId: guruUser._id,
      });
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }

    res.status(200).json(result);
  }
);
