import MyContacts from '@/models/MyContacts';
import { NextApiRequest, NextApiResponse } from 'next';
import { validate, check } from '@/lib/validator';

// TODO: replace userId
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      let result;
      console.log(req.query);
      if (req.query.q !== undefined) {
        await validate([check('q').isLength({ min: 0, max: 255 })])(req, res);
        result = await MyContacts.search({
          userId: 1,
          query: req.query.q.toString(),
        });
      } else {
        result = await MyContacts.readMany({ userId: 1 });
      }
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else if (req.method === 'POST') {
    await validate([
      check('firstName').isLength({ min: 1, max: 255 }),
      check('lastName').isLength({ min: 1, max: 255 }),
      check('businessName').isLength({ min: 1, max: 255 }),
      check('businessCategory').isLength({ min: 1, max: 255 }),
      check('businessCategorySecondary').isLength({ min: 1, max: 255 }),
      check('email').isEmail(),
      check('phone').isLength({ min: 1, max: 50 }),
    ])(req, res);
    try {
      const result = await MyContacts.create({ userId: 1, ...req.body });
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
