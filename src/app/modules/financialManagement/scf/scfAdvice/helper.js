import { _todayDate } from '../../../_helper/_todayDate';
import React from 'react';
import * as Yup from 'yup';

// advice type ddl
export const adviceTypeDDL = [{ label: 'SCF', value: 1 }];

// init data
export const initData = {
  date: _todayDate(),
  bankAccount: '',
  adviceType: adviceTypeDDL[0],
};

// fetch scf landing data
export function fetchSCFLandingData(obj) {
  // destructure obj
  const { getSCFLandingData, selectedBusinessUnit, profileData, values } = obj;
  const { date, bankAccount } = values;
  // get data
  getSCFLandingData(
    `/fino/Advice/GetAdviceViewSCF?Account=${profileData?.accountId}&Unit=${selectedBusinessUnit?.value}&Date=${date}&BankAsPartnerId=${bankAccount?.bankAsPartnerId}`,
  );
}

// fetch bank as partner ddl
export function fetchBankAsParterDDL(obj) {
  // destrcuture
  const { getBankAsPartnerDDL, selectedBusinessUnit } = obj;

  getBankAsPartnerDDL(
    `/fino/CommonFino/GetBankAsSupplierDDL?businessUnitId=${selectedBusinessUnit.value}`,
  );
}

// validation
export const validation = Yup.object().shape({
  date: Yup.date().required('Date is required'),
  bankAccount: Yup.object()
    .shape({
      label: Yup.string().required('Bank account is required'),
      value: Yup.string().required('Bank account is required'),
    })
    .required('Bank account required'),
  adviceType: Yup.object()
    .shape({
      label: Yup.string().required('Advice label required'),
      value: Yup.string().required('Advice value required'),
    })
    .required('Advice type required'),
});
