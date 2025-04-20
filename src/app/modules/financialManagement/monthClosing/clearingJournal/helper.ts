import React from 'react';
import { _todayDate } from '../../../_helper/_todayDate';

// type ddl
export const typeDDL = [
  { value: 1, label: 'Unallocated Profit Center' },
  { value: 2, label: 'Loss Gain Journal' },
];

// landing init data
export const clearingJournalLandingData = {
  type: typeDDL[0],
  businessUnit: '',
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

// disable unallowcated show button
export const isUnallowcatedShowButtonDisbaled = (values: any) => {
  const { type, businessUnit, fromDate, toDate } = values;

  // loss gain & unallocated type
  return ![1, 2].includes(type?.value) || !businessUnit || !fromDate || !toDate;
};

// unallocated profit center
export const unallocatedProfitCenterInitData = { profitCenter: '' };

// loss gain journal
export const lossGainJournalInitData = {
  gl: '',
  businessTransaction: '',
  profitCenter: '',
};

// common data table reset
type CommonDataReset = {
  setUnallocatedProfitCenterData: React.Dispatch<React.SetStateAction<any[]>>;
  setLossGainJournalData: React.Dispatch<React.SetStateAction<any[]>>;
};

// clearing journal common data reset
export function commonDataReset(obj: CommonDataReset) {
  // destrcuture
  const { setLossGainJournalData, setUnallocatedProfitCenterData } = obj;

  setLossGainJournalData([]);
  setUnallocatedProfitCenterData([]);
}

// selected count
export const selectedCount = (arr: any[]): number => {
  return arr?.filter((item: any) => item?.isSelected)?.length || 0;
};

// cerate loss gain create page save button disabled
export const isLossGainSaveButtonDisabled = (values) => {
  const { gl, businessTransaction, profitCenter } = values;
  return !gl || !businessTransaction || !profitCenter;
};
