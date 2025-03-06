import moment from 'moment';
import React from 'react';
import { _formatMoney } from '../../../../../_helper/_formatMoney';
import { formatDate } from './utils';
const marginBottom = '9px';
const SanctionedWorkingCapitalPdf = ({ singleItem, selectedBusinessUnit }) => {
  const {
    bankShortName,
    numPrinciple,
    dteStartDate,
    strBankName,
    bankBranchAddress,
    facilityName,
    strBankAccountNumber,
    fundLimitAmount,
    numInterestRate,
    bankBranchName,
    sanctionReference,
    intTenureDays,
  } = singleItem || {};
  const { buShortName, label } = selectedBusinessUnit;

  const lacks =
    numPrinciple > 0 ? `${Math.round(numPrinciple / 100000)}L` : '0L';
  return (
    <div style={{ margin: '40px 71px 0px' }}>
      <p style={{ marginBottom }} className="font-weight-bolder">
        Ref : {buShortName}/{bankShortName}/STL/{lacks}/
        {moment(dteStartDate).format('YYYY.MM.DD')}
      </p>
      <p style={{ marginBottom }} className="font-weight-bolder">
        Date : {formatDate(dteStartDate)}
      </p>
      <p style={{ marginBottom }}>The Head of Branch</p>
      <p style={{ marginBottom }}>{strBankName}</p>
      <p style={{ marginBottom }}>{bankBranchName} Branch</p>
      <p style={{ marginBottom }}>{bankBranchAddress}</p>

      <p style={{ marginBottom }} className="font-weight-bolder">
        Subject : Request for disbursement of {facilityName} of BDT{' '}
        {_formatMoney(numPrinciple)} with {intTenureDays} days tenor against{' '}
        {label} A/C No: {strBankAccountNumber}.
      </p>

      <p style={{ marginBottom }}>Dear Sir/ Madam,</p>
      <p style={{ marginBottom }}>Greetings from Akij Group,</p>
      <p style={{ marginBottom }}>
        We are delighted to inform you that, {label} has been availing a credit
        facility {'('}Ref:{' '}
        <span class="font-weight-bolder">{sanctionReference}</span>
        {') '}
        of{' '}
        <span className="font-weight-bolder">
          BDT {_formatMoney(fundLimitAmount)}
        </span>{' '}
        from your Bank.
      </p>
      <p style={{ marginBottom }}>
        Now we are seeking disbursement of BDT{' '}
        <span className="font-weight-bolder">
          {_formatMoney(numPrinciple)}{' '}
        </span>{' '}
        as {facilityName} with a{' '}
        <span class="font-weight-bolder">
          {intTenureDays} days tenor @{numInterestRate}%
        </span>
        p.a.
      </p>
      <p style={{ marginBottom }}>
        We would be very much thankful if you kindly accommodate the
        above-mentioned facilities request,{' '}
        <span className="font-weight-bolder">
          send the disbursed loan statement voucher,
        </span>{' '}
        and help us grow with your Bank’s support.
      </p>
      <p style={{ marginBottom }}>Kind Regards,</p>

      <p style={{ marginBottom }}>
        For, <span className="font-weight-bolder">{label}</span>
      </p>

      <div className="d-flex" style={{ marginTop: '90px' }}>
        <p style={{ marginRight: '50px' }}>Authorized Signatory</p>
        <p>Authorized Signatory</p>
      </div>
    </div>
  );
};

export default SanctionedWorkingCapitalPdf;
