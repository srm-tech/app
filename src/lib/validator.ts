import {
  body,
  check,
  CustomValidator,
  oneOf,
  validationResult,
} from 'express-validator';
import isValidABN from 'is-valid-abn';
import { NextApiRequest, NextApiResponse } from 'next';

import { HttpError, httpStatus } from './error';

export const isABN: CustomValidator = (value) => {
  if (!isValidABN(value)) {
    return Promise.reject('The ABN is not valid');
  }
};

export const validate =
  (validations) => async (req: NextApiRequest, res: NextApiResponse) => {
    // await all validation
    await Promise.all(validations.map((validation) => validation.run(req)));
    // turn validation into a handy error object
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return;
    }
    const nestedFields = errors
      .array()[0]
      .nestedErrors?.map((item) => item.param)
      .join(', ');

    const firstErr = errors.array()[0];
    throw new HttpError(
      httpStatus.UNPROCESSABLE_ENTITY,
      `${firstErr.msg} - ${nestedFields || firstErr.param}`
    );
  };

export { body, check, oneOf };
