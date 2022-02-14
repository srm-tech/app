import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import getCollections from '@/models';
import UserProfile from '@/features/userProfile/UserProfileModel';
import { ObjectId } from 'mongodb';

export const commissionLabel = {
  commissionPerReceivedLead: 'received introduction',
  commissionPerCompletedLead: 'completed service',
  commissionPerReceivedLeadPercent: 'received introduction (%)',
};

// TODO: replace userId
export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { Agreement, UserProfile } = await getCollections();
    if (req.method === 'GET') {
      await validate([check('id').isMongoId()])(req, res);
      const businessId = req.query.id;
      const business = await UserProfile.getOne(
        new ObjectId(businessId.toString())
      );
      result = {
        _id: business?._id,
        name: `${business?.firstName} ${business?.lastName}`,
        company: business?.businessName,
      };
    } else {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).send({ message: 'Method Not Allowed' });
    }
    res.status(200).json(result);
  }
);