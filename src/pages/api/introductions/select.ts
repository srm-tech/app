import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';

import Introduction from '@/models/Introduction';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = getCurrentUser()._id;
  try {
    if (req.method === 'POST') {
      const contacts = req.query.contacts;
      const introductionId: ObjectId = ObjectId(req.query.introductionId);
      const result = await Introduction.selectContacts(
        introductionId,
        user,
        contacts
      );
      if (!result) {
        res.status(404).json({ statusCode: 404, message: 'Not found' });
      }
      res.status(200).json(result);
    } else {
      res.status(405).json({ statusCode: 405, message: 'Method not allowed' });
    }
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
