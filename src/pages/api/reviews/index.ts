import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import { check, validate } from '@/lib/validator';
import getCollections from '@/models';
import { handleErrors } from '@/lib/middleware';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const { Review } = await getCollections();
    if (req.method === 'POST') {
      const user = await getCurrentUser(req, res);
      await validate([
        check('stars').isNumeric(),
        check('comment').isLength({ min: 0, max: 1023 }),
        check('reviewedId').isMongoId(),
      ])(req, res);
      result = await Review.create({
        userId: user._id,
        ...req.query,
      });
      res.status(200).json({ result });
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).send({ message: 'Method Not Allowed' });
    }
  }
);
