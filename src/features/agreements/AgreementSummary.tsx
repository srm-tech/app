import * as React from 'react';

import { CommissionPaymentType, CommissionType } from './agreementConstants';
import { Agreement } from './AgreementModel';

export function parseAmount(amount: number, currency = 'AUD') {
  return `${amount?.toLocaleString(
    'en-AU',
    (currency && {
      style: 'currency',
      currency,
    }) ||
      {}
  )}`;
}

export function parseCommissionAmount(item: Agreement) {
  const isFixed = item.commissionType === CommissionType.fixed;
  return {
    value: `${parseAmount(
      item.commissionAmount,
      (isFixed && item?.commissionCurrency) || ''
    )}${isFixed ? '' : '%'}`,
    isFixed,
  };
}

export function AgreementSummaryForGuru({ agreement, business }) {
  return (
    <div>
      <p>{business?.businessName} would like to offer you</p>
      <p className='font-medium text-green-700 text-lg'>
        {parseCommissionAmount(agreement).value}
      </p>
      <p className='mt-4 underline'>Terms:</p>
      <p>
        Upon acceptance of this introduction {business?.businessName} will pay{' '}
        {parseCommissionAmount(agreement).value} commission{' '}
        {agreement?.commissionPaymentType === CommissionPaymentType.postpaid
          ? `after the deal is done.`
          : `upfront.`}
      </p>
      <p className='mt-4'>
        <span className=''>Agreed on:</span>{' '}
        {new Date(agreement?.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
export function DefaultAgreementSummaryForGuru({ defaultAgreement, business }) {
  return (
    <div>
      <p>{business?.businessName} would like to offer you</p>
      <p className='font-medium text-green-700 text-lg'>
        {parseCommissionAmount(defaultAgreement).value}
      </p>
      <p className='mt-4 underline'>Terms:</p>
      <p>
        Upon acceptance of this introduction {business?.businessName} will pay{' '}
        {parseCommissionAmount(defaultAgreement).value} commission{' '}
        {defaultAgreement?.commissionPaymentType ===
        CommissionPaymentType.postpaid
          ? `after the deal is done.`
          : `upfront.`}
      </p>
    </div>
  );
}
export function AgreementSummaryForBusiness({ agreement, guru }) {
  return (
    <div>
      <p>Your commission offered to {guru?.fullName}</p>
      <p className='font-medium text-green-700 text-lg'>
        {parseCommissionAmount(agreement).value}
      </p>
      <p className='mt-4 underline'>Terms:</p>
      <p>
        Upon acceptance of this introduction you are agreeing to pay{' '}
        {parseCommissionAmount(agreement).value} commission{' '}
        {agreement?.commissionPaymentType === CommissionPaymentType.postpaid
          ? `after the deal is done.`
          : `upfront.`}
      </p>
      <p className='mt-4'>
        <span className=''>{guru.fullName} agreed to your terms on:</span>{' '}
        {new Date(agreement?.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
