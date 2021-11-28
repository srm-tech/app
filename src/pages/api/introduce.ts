import { NextApiRequest, NextApiResponse } from 'next';

import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';

import Introduction from '@/models/Introduction';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const user = getCurrentUser();
      await validate([
        check('phone_or_email').isString(),
        check('name').isLength({ min: 0, max: 255 }),
        check('contactId').isMongoId(),
      ])(req, res);
      const result = await Introduction.now({
        userId: user._id,
        status: 'sent',
        ...req.query,
      });
      res.status(200).json({ result });
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
