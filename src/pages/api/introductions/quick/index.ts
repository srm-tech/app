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

    const guruUser = await getCurrentUser(req, res);
    if (!guruUser) return res.status(404).send('User not found');
    if (req.method === 'GET') {
      result = await Introduction.readMany(guruUser._id);
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
        check('draftId').isMongoId(),
      ])(req, res);
      const [firstName, lastName] = req.body.contactName?.split(' ');
      const contact = req.body.contact;
      // check if contact exists
      let guruContact = await UserProfile.searchForCustomer(
        contact,
        req.body.contactType
      );
      // if contact doesn't exist, create one
      if (!guruContact) {
        guruContact = await UserProfile.create({
          status: 'draft',
          date: new Date(),
          fullName: req.body.contactName,
          firstName,
          lastName,
          phone: (req.body.contactType === 'phone' && req.body.contact) || '',
          email: (req.body.contactType === 'email' && req.body.contact) || '',
        });
      }
      result = await Introduction.update({
        _id: req.body._id,
        customer: new ObjectId(guruContact._id),
        business: new ObjectId(req.body.businessId),
        introducedBy: new ObjectId(guruUser._id),
      });
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json(result);
  }
);
