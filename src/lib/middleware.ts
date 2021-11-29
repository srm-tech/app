import { NextApiRequest, NextApiResponse } from 'next';

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

    res.status(422).json({ errors: errors.array() });
  };
}

export const handleErrors =
  (callback) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await callback(req, res);
    } catch (e) {
      console.error(e);

      return res
        .status(500)
        .json({ statusCode: 500, message: (e as Error).message });
    }
  };
