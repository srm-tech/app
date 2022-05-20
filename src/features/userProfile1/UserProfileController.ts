import { NextApiRequest, NextApiResponse } from 'next';

import { HttpError, httpStatus } from '@/lib/error';
import { Router } from '@/lib/router';
import { check, validate } from '@/lib/validator';

import { defaultProfile } from './userProfileConstants';
import UserProfileModel, {
  Business,
  BusinessSearch,
  UserProfile,
} from './UserProfileModel';
import {
  CommissionCurrency,
  CommissionPaymentType,
  CommissionType,
} from '../agreements/agreementConstants';
import { Commission } from '../agreements/AgreementModel';
import { JWTToken } from '../session/jwt';
import { auth } from '../session/middleware';

type DefaultCommissionKeys<T> = {
  [K in keyof T as `defaultCommission.*.${string & K}`]: T[K];
};

const checkByCommissionKey = (v: keyof DefaultCommissionKeys<Commission>) =>
  check(v);
const checkByKey = (v: keyof UserProfile) => check(v);
const validateProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  return validate([
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
};

const validateBusiness = async (req: NextApiRequest, res: NextApiResponse) => {
  return validate([
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
    checkByCommissionKey('defaultCommission.*.commissionAmount').isNumeric(),
    checkByKey('abn')
      .optional({ checkFalsy: true })
      .isLength({ min: 11, max: 11 }),
    checkByKey('country').isLength({ min: 2, max: 2 }),
  ])(req, res);
};

const register = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  await validateProfile(req, res);
  if (req.body.isAcceptingIntroductions) {
    await validateBusiness(req, res);
  }
  const data = await (
    await UserProfileModel()
  ).create(user._id, { ...req.body, isActive: true });
  return res.json(data);
};

const searchBusiness = async (req: NextApiRequest, res: NextApiResponse) => {
  await validate([check('q').isString().isLength({ min: 1, max: 100 })])(
    req,
    res
  );
  const userModel = await UserProfileModel();
  const data = await userModel.search(req.query.q.toString());
  const result: BusinessSearch[] = data.map((item) => ({
    userId: item.userId,
    businessCategory: item.businessCategory,
    businessName: item.businessName,
    firstName: item.firstName,
    fullName: item.fullName,
    rating: item.rating,
  }));
  return res.json(result);
};

const findMe = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  const data = await (await UserProfileModel()).findOne(user._id);
  return res.json({ ...defaultProfile, ...data });
};

const updateMe = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  await validateProfile(req, res);
  const data = await (
    await UserProfileModel()
  ).updateOne(user._id, { ...req.body, isComplete: true });
  return res.json(data);
};

const getUserCommission = async (req: NextApiRequest, res: NextApiResponse) => {
  await validate([check('userId').isMongoId()])(req, res);
  const data = await (await UserProfileModel()).findOne(req.query.userId);
  return res.json(data?.defaultCommission);
};

const remove = async (req: NextApiRequest, res: NextApiResponse) => {
  await validate([check('userId').isMongoId()])(req, res);
  const result = await (await UserProfileModel()).delete(req.query.userId);
  return res.json(result);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const publicRouter = new Router(req, res);
  const protectedRouter = new Router(req, res, { auth });

  // collection
  // create
  await protectedRouter.post('/userProfile', register);
  // search for userProfile/business
  await publicRouter.get('/userProfile', searchBusiness);

  // item
  // get single row
  await protectedRouter.get('/userProfile/me', findMe);
  // update single row
  await protectedRouter.put('/userProfile/me', updateMe);
  // commission
  await publicRouter.get('/userProfile/:userId/commission', getUserCommission);

  // TODO: hide, testing only
  await protectedRouter.delete('/userProfile/:userId', remove);
  // fallback
  res.status(httpStatus.NOT_FOUND).end();
};

export default handler;
