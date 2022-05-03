import { NextApiRequest, NextApiResponse } from 'next';

import { HttpError } from '@/lib/error';
import HttpStatusCode from '@/lib/httpStatus';
import { Router } from '@/lib/router';
import { check, validate } from '@/lib/validator';

import UserProfileModel, { UserProfile } from './UserProfileModel';
import {
  Commission,
  CommissionCurrency,
  CommissionPaymentType,
  CommissionType,
} from '../agreements/AgreementModel';
import { JWTToken } from '../session/jwt';
import { auth } from '../session/middleware';

type DefaultCommissionKeys<T> = {
  [K in keyof T as `defaultCommission.*.${string & K}`]: T[K];
};

const checkByCommissionKey = (v: keyof DefaultCommissionKeys<Commission>) =>
  check(v);
const checkByKey = (v: keyof UserProfile) => check(v);
const validateProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  validate([
    checkByKey('contactEmail').isEmail(),
    checkByKey('lastName').isLength({
      min: 1,
      max: 55,
    }),
    checkByKey('firstName').isLength({
      min: 1,
      max: 55,
    }),
    checkByKey('contactPhone').optional().isLength({
      min: 0,
      max: 55,
    }),
    checkByKey('businessName').optional().isLength({ min: 0, max: 255 }),
    checkByKey('isAcceptingIntroductions').optional().isBoolean(),
  ])(req, res);

  if (req.body.isAcceptingIntroductions) {
    validate([
      checkByKey('businessName').isLength({ min: 1, max: 255 }),
      checkByKey('businessCategory').isLength({ min: 1, max: 255 }),
      checkByKey('addressLine1').isLength({ min: 1, max: 255 }),
      checkByKey('addressLine2').optional().isLength({ min: 0, max: 255 }),
      checkByCommissionKey('defaultCommission.*.commissionCurrency').isIn([
        CommissionCurrency.AUD,
        CommissionCurrency.USD,
      ]),
      checkByCommissionKey('defaultCommission.*.commissionType').isIn([
        CommissionType.fixed,
        CommissionType.percent,
      ]),
      checkByCommissionKey('defaultCommission.*.commissionPaymentType').isIn([
        CommissionPaymentType.postpaid,
        CommissionPaymentType.prepaid,
      ]),
      checkByCommissionKey('defaultCommission.*.commissionValue').isNumeric(),
      checkByKey('abn')
        .optional({ checkFalsy: true })
        .isLength({ min: 11, max: 11 }),
      checkByKey('country').isLength({ min: 2, max: 2 }),
    ])(req, res);
  }
};

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  validateProfile(req, res);
  const data = await (
    await UserProfileModel()
  ).create({ ...req.body, isActive: true });
  return res.json(data);
};

const search = async (req: NextApiRequest, res: NextApiResponse) => {
  validate([check('q').isString().isLength({ min: 1, max: 100 })])(req, res);
  const userModel = await UserProfileModel();
  const data = await userModel.search(req.query.q.toString());
  return res.json(data);
};

const findOne = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  validate([check('id').isMongoId()])(req, res);
  const data = await (await UserProfileModel()).findOne(user._id);
  return res.json(data);
};

const update = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  validateProfile(req, res);
  const data = await (
    await UserProfileModel()
  ).updateOne(user._id, { ...req.body, isComplete: true });
  return res.json(data);
};

const getUserCommission = async (req: NextApiRequest, res: NextApiResponse) => {
  validate([check('id').isMongoId()])(req, res);
  const data = await (await UserProfileModel()).findOne(req.query.id);
  return res.json(data?.defaultCommission);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const protectedRouter = new Router(req, res, { auth });

  // collection
  // create
  await protectedRouter.post('/users', create);
  // search for users/business
  await protectedRouter.get('/users', search);

  // item
  // get single row
  await protectedRouter.get('/users/:id', findOne);
  // update single row
  await protectedRouter.put('/users/:id', update);
  // commission
  await protectedRouter.get('/users/:id/commission', getUserCommission);

  // fallback
  res.status(HttpStatusCode.NOT_FOUND).end();
};

export default handler;
