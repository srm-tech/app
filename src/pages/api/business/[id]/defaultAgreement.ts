import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { handleErrors } from '@/lib/middleware';
import { check, validate } from '@/lib/validator';

import getCollections from '@/models';
import UserProfile from '@/models/UserProfiles';
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
        commissionType: business?.commissionType,
        commissionValue: business?.[business?.commissionType],
        commissionCurrency: business?.commissionCurrency || 'AUD',
        commissionLabel: commissionLabel[business?.commissionType || ''],
      };
    } else {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).end('Method Not Allowed');
    }
    res.status(200).json(result);
  }
);
