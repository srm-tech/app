import * as React from 'react';

import { CommissionPaymentType, CommissionType } from './agreementConstants';
import { Agreement } from './AgreementModel';

export function parseAmount(amount: number, currency = 'AUD', prefix = '$') {
  return `$${amount}`;
  //  `$${amount?.toLocaleString(
  //   'en-AU',
  //   (currency && {
  //     style: 'currency',
  //     currency,
  //   }) ||
  //     {}
  // )}`;
}

export function parseCommissionAmount(item: Agreement) {
  if (!item) {
    return { displayValue: '', value: 0, isFixed: false };
  }
  const isFixed = item?.commissionType === CommissionType.fixed;
  return {
    displayValue: isFixed
      ? `$${item.commissionAmount}`
      : `${item.commissionAmount}%`,
    value: item.commissionAmount,
    isFixed,
  };
}

export function AgreementSummaryForGuru({ agreement, business }) {
  return (
    <div>
      <p>{business?.businessName} would like to offer you</p>
      <p className='font-medium text-green-700 text-lg'>
        {parseCommissionAmount(agreement).displayValue}
      </p>
      <p className='mt-4 underline'>Terms:</p>
      <p>
        Upon acceptance of this introduction {business?.businessName} agrees to
        pay {parseCommissionAmount(agreement).displayValue} commission{' '}
        {agreement?.commissionPaymentType === CommissionPaymentType.postpaid
          ? `after the deal is done.`
          : `upfront.`}
      </p>
      <p className='mt-4'>
        <span className=''>Agreed on:</span>{' '}
        {new Date(agreement?.createdAt).toLocaleDateString('en-AU')}
      </p>
    </div>
  );
}
export function DefaultAgreementSummaryForGuru({ defaultAgreement, business }) {
  return (
    <div>
      <p>{business?.businessName} would like to offer you</p>
      <p className='font-medium text-green-700 text-lg'>
        {parseCommissionAmount(defaultAgreement).displayValue}
      </p>
      <p className='mt-4 underline'>Terms:</p>
      <p>
        Upon acceptance of this introduction {business?.businessName} agrees to
        pay {parseCommissionAmount(defaultAgreement).displayValue} commission{' '}
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
        {parseCommissionAmount(agreement).displayValue}
      </p>
      <p className='mt-4 underline'>Terms:</p>
      <p>
        Upon acceptance of this introduction you are agreeing to pay{' '}
        {parseCommissionAmount(agreement).displayValue} commission{' '}
        {agreement?.commissionPaymentType === CommissionPaymentType.postpaid
          ? `after the deal is done.`
          : `upfront.`}
      </p>
      <p className='mt-4'>
        <span className=''>{guru.fullName} agreed to your terms on:</span>{' '}
        {new Date(agreement?.createdAt).toLocaleDateString('en-AU')}
      </p>
    </div>
  );
}
