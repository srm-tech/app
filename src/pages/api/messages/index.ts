import { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from '@/lib/db';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';

import Message from '@/models/Messages';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let result;
    const user = getCurrentUser();
    if (req.method === 'GET') {
      const user = getCurrentUser();
      result = await Message.readMany(user._id);
    } else if (req.method === 'POST') {
      await validate([
        check('subject').isLength({ min: 1, max: 255 }),
        check('content').isLength({ min: 1, max: 1023 }),
      ])(req, res);
      result = await Message.create({ userId: user._id, ...req.body });
    } else if (req.method === 'DELETE') {
      result = await Message.deleteOne(user._id, ObjectId(req.query.messageId));
      // no result: the message with given id & userId does not exist
      if (!result) {
        res.status(404).json({ statusCode: 404, message: 'Not found' });
      }
    } else {
      res.status(405).json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
