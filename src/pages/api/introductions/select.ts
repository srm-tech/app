import { NextApiRequest, NextApiResponse } from 'next';
import getCurrentUser from '@/lib/get-current-user';
import getCollections from '@/models';
import { handleErrors } from '@/lib/middleware';

export default handleErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let result;
    const user = await getCurrentUser(req, res);
    const {} = await getCollections();

    if (req.method === 'POST') {
      const contacts = req.query.contacts;
      // result = await models.Introduction.selectContacts(
      //   introductionId: req.query.introductionId,
      //   user,
      //   contacts
      // );
      if (!result) {
        res.status(404).json({ statusCode: 404, message: 'Not found' });
      }
      res.status(200).json(result);
    } else {
      return res
        .status(405)
        .json({ statusCode: 405, message: 'Method not allowed' });
    }
  }
);
