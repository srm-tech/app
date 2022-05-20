import { NextApiRequest, NextApiResponse } from 'next';

import { HttpError, httpStatus } from '@/lib/error';
import { Router } from '@/lib/router';
import { check, oneOf, validate } from '@/lib/validator';

import RatingModel, { NewRating, Rating } from './RatingModel';
import { JWTToken } from '../session/jwt';
import { auth } from '../session/middleware';
import UserProfileModel from '../userProfile/UserProfileModel';

const checkByKey = (v: keyof NewRating) => check(v);

const validateRating = async (req: NextApiRequest, res: NextApiResponse) => {
  return validate([
    checkByKey('userId').isMongoId(),
    checkByKey('from').isMongoId(),
    checkByKey('comment').optional().isLength({ min: 1, max: 350 }),
    checkByKey('rating').isNumeric(),
  ])(req, res);
};

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  await validateRating(req, res);
  const ratingModel = await RatingModel();
  await ratingModel.create({ ...req.body });
  const [data] = await ratingModel.searchStats({ userId: req.body.userId });
  if (data?.avgRating) {
    await (
      await UserProfileModel()
    ).updateOne(`${req.body.userId}`, {
      rating: Number(Number(data?.avgRating).toFixed(1)),
    });
  }
  return res.json(data);
};

const search = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  const data = await (await RatingModel()).search({ userId: req.query.userId });
  return res.json(data);
};

const searchStats = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  const [rating] = await (
    await RatingModel()
  ).searchStats({ userId: req.query.userId });
  return res.json(rating);
};

const findOne = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  await validate([check('id').isMongoId()])(req, res);
  const data = await (await RatingModel()).findOne(req.query.id);
  return res.json(data);
};

const update = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: JWTToken
) => {
  await validateRating(req, res);
  const { _id, ...rest } = req.body;
  const data = await (await RatingModel()).updateOne(req.query.id, { ...rest });
  return res.json(data);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const protectedRouter = new Router(req, res, { auth });

  // collection
  // create
  await protectedRouter.post('/ratings', create);
  // search with filters
  await protectedRouter.get('/ratings', search);

  await protectedRouter.get('/ratings/stats', searchStats);

  // item
  // get one row
  await protectedRouter.get('/ratings/:id', findOne);
  // update one row
  await protectedRouter.put('/ratings/:id', update);

  // fallback
  res.status(httpStatus.NOT_FOUND).end();
};

export default handler;
