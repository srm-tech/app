import { NextApiRequest, NextApiResponse } from 'next';

import { HttpError } from './error';
import HttpStatusCode from './httpStatus';

// And to throw an error when an error happens in a middleware
export function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

export function validateMiddleware(validations, validationResult) {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    console.log(11, errors.array()[0].nestedErrors);

    const nestedFields = errors
      .array()[0]
      .nestedErrors?.map((item) => item.param)
      .join(', ');

    const firstErr = errors.array()[0];
    throw new HttpError(
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      `${firstErr.msg} - ${nestedFields || firstErr.param}`
    );
  };
}

export const handleError =
  async (callback) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await callback(req, res);
    } catch (e) {
      console.error('IG Error:', e);
      const statusCode = (e as HttpError).statusCode || 500;
      res.status(statusCode).json({
        statusCode,
        message:
          statusCode === 500
            ? (e as HttpError).message || 'Oops, something went wrong.'
            : (e as HttpError).message,
      });
    }
  };

export const defaultErrorHandler =
  (callback) => async (req: NextApiRequest, res: NextApiResponse) => {
    callback(req, res);
  };

export const handleErrors =
  (callback) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await callback(req, res);
    } catch (e) {
      console.error('IG Error:', e);
      const statusCode = (e as HttpError).statusCode || 500;
      return res.status(statusCode).json({
        statusCode,
        message:
          statusCode === 500
            ? 'Oops, something went wrong.'
            : (e as HttpError).message,
      });
    }
  };
