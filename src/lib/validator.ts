import { check, CustomValidator, validationResult } from 'express-validator';
import isValidABN from 'is-valid-abn';

import { initMiddleware, validateMiddleware } from '@/lib/middleware';

export const isABN: CustomValidator = (value) => {
  if (!isValidABN(value)) {
    return Promise.reject('The ABN is not valid');
  }
};

export const validate = (params) =>
  initMiddleware(validateMiddleware(params, validationResult));

export { check };
