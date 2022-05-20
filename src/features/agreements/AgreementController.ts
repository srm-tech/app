import { NextApiRequest, NextApiResponse } from 'next';

import { HttpError, httpStatus } from '@/lib/error';
import { Router } from '@/lib/router';
import { check, oneOf, validate } from '@/lib/validator';

import AgreementModel, { Agreement } from './AgreementModel';
import { JWTToken } from '../session/jwt';
import { auth } from '../session/middleware';
import UserProfileModel from '../userProfile1/UserProfileModel';

const checkByKey = (v: keyof Agreement) => check(v);

const allChecks = [
  checkByKey('guruId').isMongoId(),
  checkByKey('businessId').isMongoId(),
  checkByKey('commissionCurrency').isIn(['AUD', 'USD']),
  checkByKey('commissionPaymentType').isIn(['prepaid', 'postpaid']),
  checkByKey('commissionType').isIn(['fixed', 'percent']),
  checkByKey('commissionAmount').isNumeric(),
];

const validateAgreement = async (req: NextApiRequest, res: NextApiResponse) => {
  return validate([allChecks])(req, res);
};

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  await validate([
    checkByKey('guruId').isMongoId(),
    checkByKey('businessId').isMongoId(),
  ])(req, res);
  const userProfile = await (
    await UserProfileModel()
  ).findOne(req.body.businessId);
  const data = await (
    await AgreementModel()
  ).create({ ...req.body, ...userProfile?.defaultCommission[0] });
  return res.json(data);
};

const search = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  const data = await (
    await AgreementModel()
  ).search({ businessId: req.query.businessId, guruId: user._id });
  return res.json(data);
};

const findOne = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  await validate([check('id').isMongoId()])(req, res);
  const data = await (await AgreementModel()).findOne(req.query.id);
  return res.json(data);
};

const update = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  await validate([oneOf(allChecks)])(req, res);
  const { _id, ...rest } = req.body;
  const data = await (
    await AgreementModel()
  ).updateOne(req.query.id, { ...rest });
  return res.json(data);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const protectedRouter = new Router(req, res, { auth });

  // collection
  // create
  await protectedRouter.post('/agreements', create);
  // search with filters
  await protectedRouter.get('/agreements', search);

  // item
  // get one row
  await protectedRouter.get('/agreements/:id', findOne);
  // update one row
  await protectedRouter.put('/agreements/:id', update);

  // fallback
  res.status(httpStatus.NOT_FOUND).end();
};

export default handler;
