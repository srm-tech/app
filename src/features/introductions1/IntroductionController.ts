import { NextApiRequest, NextApiResponse } from 'next';

import { HttpError } from '@/lib/error';
import HttpStatusCode from '@/lib/httpStatus';
import { Router } from '@/lib/router';
import { body, check, oneOf, validate } from '@/lib/validator';

import IntroductionModel, {
  Business,
  Customer,
  Guru,
  Introduction,
  IntroStatus,
} from './IntroductionModel';
import { Agreement } from '../agreements/AgreementModel';
import { JWTToken } from '../session/jwt';
import { auth } from '../session/middleware';

// remapping of types to match validation nested object
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types
type BusinessKeys<T> = {
  [K in keyof T as `business.${string & K}`]: T[K];
};
const checkByBusinessKey = (v: keyof BusinessKeys<Business>) => check(v);

type CustomerKeys<T> = {
  [K in keyof T as `customer.${string & K}`]: T[K];
};
const checkByCustomerKey = (v: keyof CustomerKeys<Customer>) => check(v);

type GuruKeys<T> = {
  [K in keyof T as `guru.${string & K}`]: T[K];
};
const checkByGuruKey = (v: keyof GuruKeys<Guru>) => check(v);

type AgreementKeys<T> = {
  [K in keyof T as `agreement.${string & K}`]: T[K];
};
const checkByAgreementKey = (v: keyof AgreementKeys<Agreement>) => check(v);

const validateIntroduction = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await validate([
    checkByBusinessKey('business.userId').isMongoId(),
    oneOf(
      [
        checkByBusinessKey('business.contactEmail').isEmail(),
        checkByBusinessKey('business.contactPhone').exists(),
      ],
      'Contact details required'
    ),
    checkByBusinessKey('business.firstName').isLength({ min: 1, max: 55 }),
    checkByBusinessKey('business.lastName').isLength({ min: 1, max: 55 }),
    checkByBusinessKey('business.fullName')
      .optional()
      .isLength({ min: 1, max: 55 }),
    checkByBusinessKey('business.businessCategory').isLength({
      min: 1,
      max: 55,
    }),
    checkByBusinessKey('business.businessName').isLength({ min: 1, max: 55 }),

    checkByCustomerKey('customer.userId').isMongoId(),
    oneOf(
      [
        checkByCustomerKey('customer.contactEmail').isEmail(),
        checkByCustomerKey('customer.contactPhone').exists(),
      ],
      'Contact details required'
    ),
    checkByCustomerKey('customer.firstName').isLength({ min: 1, max: 55 }),
    checkByCustomerKey('customer.lastName').isLength({ min: 1, max: 55 }),
    checkByCustomerKey('customer.fullName')
      .optional()
      .isLength({ min: 1, max: 55 }),

    checkByGuruKey('guru.userId').isMongoId(),
    oneOf(
      [
        checkByGuruKey('guru.contactEmail').isEmail(),
        checkByGuruKey('guru.contactPhone').exists(),
      ],
      'Contact details required'
    ),
    checkByGuruKey('guru.firstName').isLength({ min: 1, max: 55 }),
    checkByGuruKey('guru.lastName').isLength({ min: 1, max: 55 }),
    checkByGuruKey('guru.fullName').optional().isLength({ min: 1, max: 55 }),

    checkByAgreementKey('agreement._id').isMongoId(),
    checkByAgreementKey('agreement.commissionCurrency').isIn(['AUD', 'USD']),
    checkByAgreementKey('agreement.commissionPaymentType').isIn([
      'prepaid',
      'postpaid',
    ]),
    checkByAgreementKey('agreement.commissionType').isIn(['fixed', 'percent']),
    checkByAgreementKey('agreement.commissionValue').isNumeric(),
  ])(req, res);
};

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  await validateIntroduction(req, res);
  const data = await (
    await IntroductionModel()
  ).create({
    ...req.body,
    status: IntroStatus.pending,
    expiresAt: new Date(new Date().setDate(new Date().getDate() + 3)), // 3days to respond to introduction
  });
  return res.json(data);
};

const search = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  const data = await (
    await IntroductionModel()
  ).search({ businessId: user._id, guruId: user._id });
  return res.json(data);
};

const findOne = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await (await IntroductionModel()).findOne(req.query.id);
  return res.json(data);
};

const update = async (req: NextApiRequest, res: NextApiResponse) => {
  // await validate([check("status")])(req, res);
  const { _id, ...rest } = req.body;
  const data = await (
    await IntroductionModel()
  ).updateOne(req.query.id, {
    status: IntroStatus.accepted,
  });
  return res.json(data);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const protectedRouter = new Router(req, res, { auth });

  // collection
  // create
  await protectedRouter.post('/introductions', create);
  // search
  await protectedRouter.get('/introductions', search);

  // item
  // get one row
  await protectedRouter.get('/introductions/:id', findOne);
  // update one row
  await protectedRouter.put('/introductions/:id', update);

  // fallback
  res.status(HttpStatusCode.NOT_FOUND).end();
};

export default handler;
