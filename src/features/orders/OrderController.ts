import { NextApiRequest, NextApiResponse } from 'next';

import { sendMail } from '@/lib/emails';
import { env } from '@/lib/envConfig';
import { HttpError, httpStatus } from '@/lib/error';
import { Router } from '@/lib/router';
import { body, check, oneOf, validate } from '@/lib/validator';

import OrderModel, { Order } from './OrderModel';
import IntroductionModel, { Quote } from '../introductions/IntroductionModel';
import { JWTToken } from '../session/jwt';
import { auth } from '../session/middleware';

const checkByKey = (v: keyof Order) => check(v);

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const introductionModel = await IntroductionModel();
  const introduction = await introductionModel.findOne(req.query.id);
  const quote = calculateQuote(introduction);
  const orderModel = await OrderModel();
  const order = orderModel.create(quote);
  return res.json(order);
};

const findOne = async (req: NextApiRequest, res: NextApiResponse) => {
  const order = await OrderModel();
  const data = await order.findOne(req.query.id);
  return res.json(data);
};

const update = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  // await validate([check("status")])(req, res);
  const { _id, ...rest } = req.body;
  const order = await OrderModel();
  await order.updateOne(_id, {
    invoiceUrl: `${env.BASE_URL}/orders/${_id}/invoice`,
  });
  return res.json(order);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const protectedRouter = new Router(req, res, { auth });

  // collection
  // create
  await protectedRouter.post('/introductions', create);

  // item
  // get one row
  await protectedRouter.get('/introductions/:id', findOne);
  // update one row
  await protectedRouter.put('/introductions/:id', update);

  // fallback
  res.status(httpStatus.NOT_FOUND).end();
};

export default handler;
function calculateQuote(
  introduction:
    | import('mongodb').WithId<
        import('../introductions/IntroductionModel').Introduction
      >
    | null
) {
  throw new Error('Function not implemented.');
}
