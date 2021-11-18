import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';

import Message from '@/models/Messages';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // const user = getCurrentUser();
    if (req.method !== 'POST') {
      res.status(405).json({ statusCode: 405, message: 'Method not allowed' });
    }
    const user = getCurrentUser();
    const result = await Message.toggleRead(
      user._id,
      ObjectId(req.query.messageId)
    );

    // no result: the message with given id & userId does not exist
    if (!result) {
      res.status(404).json({ statusCode: 404, message: 'Not found' });
    }

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
