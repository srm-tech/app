import { NextApiRequest, NextApiResponse } from 'next';
import { check, validate } from '@/lib/validator';
import models from '@/models';
import { handleErrors } from '@/lib/middleware';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    await models.client.connect();
    if (req.method === 'GET') {
      res
        .status(200)
        .json(models.Category.search({ query: req.query.q.toString() }));
    } else if (req.method === 'POST') {
      await validate([
        check('category').isIn(['phone', 'email']),
        req.body.contactType === 'email'
          ? check('contact').isEmail()
          : check('contact').isLength({ min: 1, max: 55 }),
        check('name').isLength({ min: 1, max: 55 }),
      ])(req, res);

      result = '';
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
    res.status(200).json(result);
    await models.client.close();
  }
);
