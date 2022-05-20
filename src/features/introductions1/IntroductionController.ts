import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { ObjectId } from '@/lib/db';
import { sendMail } from '@/lib/emails';
import { env } from '@/lib/envConfig';
import { HttpError, httpStatus } from '@/lib/error';
import { Router } from '@/lib/router';
import { formatAmountForStripe } from '@/lib/stripe-helpers';
import { htmlIntroduction } from '@/lib/utils';
import { body, check, oneOf, validate } from '@/lib/validator';

import { IntroductionStatus } from './introductionConstants';
import { newIntroductionTemplate } from './introductionEmailTemplates';
import IntroductionModel, {
  Introduction,
  IntroductionInput,
  NewIntroduction,
} from './IntroductionModel';
import { CommissionType } from '../agreements/agreementConstants';
import AgreementModel, { Agreement } from '../agreements/AgreementModel';
import { JWTToken } from '../session/jwt';
import { auth } from '../session/middleware';
import UserModel from '../user/UserModel';
import UserProfileModel, {
  Business,
  Customer,
  CustomerInput,
  Guru,
} from '../userProfile1/UserProfileModel';

// remapping of types to match validation nested object
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types
type BusinessKeys<T> = {
  [K in keyof T as `business.${string & K}`]: T[K];
};
const checkByBusinessKey = (v: keyof BusinessKeys<Business>) => check(v);

type CustomerKeys<T> = {
  [K in keyof T as `customer.${string & K}`]: T[K];
};
const checkByCustomerKey = (v: keyof CustomerKeys<CustomerInput>) => check(v);

type GuruKeys<T> = {
  [K in keyof T as `guru.${string & K}`]: T[K];
};
const checkByGuruKey = (v: keyof GuruKeys<Guru>) => check(v);

type AgreementKeys<T> = {
  [K in keyof T as `agreement.${string & K}`]: T[K];
};
const checkByIntroductionInputKey = (v: keyof IntroductionInput) => check(v);

const validateIntroduction = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await validate([
    checkByIntroductionInputKey('guruId').isMongoId(),
    checkByIntroductionInputKey('businessId').isMongoId(),
    checkByIntroductionInputKey('agreementId').isMongoId(),
    oneOf([
      checkByCustomerKey('customer.contact').isEmail(),
      checkByCustomerKey('customer.contactType').exists(),
    ]),
    checkByCustomerKey('customer.name').exists(),
  ])(req, res);
};

const obscureEmail = (email) => {
  const [name, domain] = email.split('@');
  return `${name[0]}${new Array(name.length).join('*')}@${domain[0]}${new Array(
    domain.length
  ).join('*')}`;
};
const obscurePhone = (str) => {
  return `${str[0]}${str[1]}${new Array(str.length - 1).join('*')}`;
};

const create = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  await validateIntroduction(req, res);

  const userProfileModel = await UserProfileModel();
  const introductionModel = await IntroductionModel();
  const agreementModel = await AgreementModel();
  const customer: CustomerInput = req.body.customer;
  const [customerFirstName, customerLastName] =
    customer?.name?.split(' ') || [];

  // introduction is done by guru so we need current user profile for reference in introduction
  const guruProfile = await userProfileModel.findOne(user._id);

  // business profile is also needed for introduction
  const businessProfile = await userProfileModel.findOne(req.body.businessId);

  // load agreement between guru and business
  const agreementData = await agreementModel.findOne(req.body.agreementId);

  if (!guruProfile || !businessProfile || !agreementData) {
    throw new HttpError(
      httpStatus.BAD_REQUEST,
      'Missing required data for introduction create.'
    );
  }

  const today = new Date();
  const newIntroduction: NewIntroduction = {
    status: IntroductionStatus.PENDING,
    customer: {
      fullName: customer?.name,
      firstName: customerFirstName,
      lastName: customerLastName,
      contactPhone:
        (customer.contactType === 'phone' && customer.contact) || '',
      contactEmail:
        (customer.contactType === 'email' && customer.contact) || '',
    },
    guru: {
      userId: guruProfile.userId,
      firstName: guruProfile.firstName,
      lastName: guruProfile.lastName,
      fullName: `${guruProfile.firstName} ${guruProfile.lastName}`,
      contactEmail: guruProfile.contactEmail,
      contactPhone: guruProfile.contactPhone,
      rating: guruProfile.rating,
    },
    business: {
      userId: businessProfile.userId,
      firstName: businessProfile.firstName,
      lastName: businessProfile.lastName,
      fullName: `${businessProfile.firstName} ${businessProfile.lastName}`,
      businessName: businessProfile.businessName,
      businessCategory: businessProfile.businessCategory,
      contactEmail: businessProfile.contactEmail,
      contactPhone: businessProfile.contactPhone,
      rating: businessProfile.rating,
    },
    agreement: agreementData,
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: new Date(new Date().setDate(today.getDate() + 3)),
  };

  // send email
  const mailData = {
    from: env.EMAIL_FROM,
    to: newIntroduction.business.contactEmail,
    replyTo: newIntroduction.business.contactEmail,
    bcc: 'kris@introduce.guru',
    subject: `An introduction is waiting for you in introduce.guru!`,
    // text: text(req.body),
    html: newIntroductionTemplate(
      env.BASE_URL,
      newIntroduction.guru,
      newIntroduction.customer,
      newIntroduction.business
    ),
  };

  const data = await introductionModel.create(newIntroduction);
  await sendMail(mailData);

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
  return res.json(
    data.map((item) => {
      const isPending = item.status === IntroductionStatus.PENDING;
      const isBusiness = item.business.userId === user._id;
      const newItem = { ...item };
      if (isPending && isBusiness) {
        const firstName = item.customer.firstName;
        const lastName =
          (item.customer.lastName && `${item.customer.lastName.charAt(0)}.`) ||
          '';
        newItem.customer = {
          contactEmail: item.customer.contactEmail
            ? obscureEmail(item.customer.contactEmail)
            : '',
          contactPhone: obscurePhone(item.customer.contactPhone),
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`,
        };
      }
      return newItem;
    })
  );
};

const findOne = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await (await IntroductionModel()).findOne(req.query.id);
  return res.json(data);
};

const update = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  // await validate([check("status")])(req, res);
  const { _id, ...rest } = req.body;
  const introductionModel = await IntroductionModel();
  const introduction = await introductionModel.findOne(_id);
  const isGuru = introduction?.guru.userId === user._id;
  if (req.body.status === IntroductionStatus.CANCELLED && !isGuru) {
    throw new HttpError(httpStatus.BAD_REQUEST, 'Only guru can cancel');
  }
  const newIntroduction = {
    ...introduction,
    ...rest,
  };
  await introductionModel.updateOne(req.query.id, newIntroduction);
  return res.json(newIntroduction);
};

const calculateQuote = (introduction) => {
  const isFixed =
    introduction?.agreement.commissionType === CommissionType.fixed;
  const amountOwned = isFixed
    ? introduction?.agreement.commissionAmount || 0
    : (Number(introduction?.agreement.commissionAmount) *
        Number(introduction?.agreement.dealValue)) /
      100;
  const STRIPE_FEE_FIXED = 0.3;
  const STRIPE_FEE_PERCENT = 2.9;
  const GST = 0.1;
  const amountWithGst = amountOwned + amountOwned * GST;
  const stripeFee =
    (amountWithGst * STRIPE_FEE_PERCENT) / 100 + STRIPE_FEE_FIXED;
  const introduceGuruFee = Number(
    Number(amountOwned * Number(env.TRANSACTION_FEE) + stripeFee).toFixed(2)
  );
  const tip = 0; // TODO
  const total = Number(Number(amountOwned + tip + introduceGuruFee).toFixed(2));
  return {
    amountOwned,
    introduceGuruFee,
    total,
  };
};

const getQuote = async (req: NextApiRequest, res: NextApiResponse) => {
  const introductionModel = await IntroductionModel();
  const introduction = await introductionModel.findOne(req.query.id);
  return res.json(calculateQuote(introduction));
};

const makePayment = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  await validate([check('id').isMongoId()])(req, res);
  const introductionModel = await IntroductionModel();
  const userProfileModel = await UserProfileModel();
  const introduction = await introductionModel.findOne(req.query.id);

  if (!introduction) {
    throw new HttpError(
      httpStatus.NOT_FOUND,
      `Can't find introduction ${req.query.id}`
    );
  }

  // get quote
  const quote = calculateQuote(introduction);

  // stripe
  const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
    apiVersion: '2020-08-27',
  });

  // check if business has a stripeId, if not – create it
  const userProfile = await userProfileModel.findOne(user._id);
  let customerId = userProfile?.stripeId || '';
  if (!customerId) {
    const customer = await stripe.customers.create();
    customerId = customer.id;
    await userProfileModel.updateOne(user._id, { stripeId: customerId });
  }

  // payment
  const params = {
    customer: customerId,
    mode: 'payment',
    tax_id_collection: { enabled: true },
    customer_update: {
      name: 'auto',
      address: 'auto',
    },
    line_items: [
      {
        name: `Payment for ${introduction.guru.fullName} via introduce.guru`,
        amount: formatAmountForStripe(
          quote.total,
          introduction.agreement.commissionCurrency
        ),
        currency: introduction.agreement.commissionCurrency,
        quantity: 1,
      },
    ],
    payment_method_types: ['card'],
    success_url: `${
      env.BASE_URL
    }/app/introductions/?paymentStatus=success&amount=${formatAmountForStripe(
      quote.total,
      introduction.agreement.commissionCurrency
    )}&introductionId=${introduction._id}`,
    cancel_url: `${env.BASE_URL}/app/introductions?paymentStatus=cancelled&introductionId=${introduction._id}`,
  } as Stripe.Checkout.SessionCreateParams;
  const session = await stripe.checkout.sessions.create(params);

  return res.json(session);
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
  // make payment for introduction
  await protectedRouter.get('/introductions/:id/quote', getQuote);
  await protectedRouter.get('/introductions/:id/payment', makePayment);

  // fallback
  res.status(httpStatus.NOT_FOUND).end();
};

export default handler;
