import React from 'react';
import { _todayDate } from '../../../_helper/_todayDate';

// type ddl
export const typeDDL = [
  { value: 1, label: 'Unallocated Profit Center' },
  { value: 2, label: 'Clearing GL' },
];

// allocation type
export const allocationTypeDDL = [
  { value: 1, label: 'Single Profit Center' },
  { value: 2, label: 'Multiple Profit Center' },
];

// landing init data
export const clearingJournalLandingData = {
  type: typeDDL[0],
  businessUnit: '',
  allocationType: '',
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

// disable unallowcated show button
export const isUnallowcatedShowButtonDisbaled = (values: any) => {
  const { type, businessUnit, fromDate, toDate, allocationType } = values;

  // common
  const commonField = !type || !businessUnit || !fromDate || !toDate;

  // unallocated type
  if (type?.value === 1) return commonField || !allocationType;
  if (type?.value === 2) return commonField;
};

// unallocated profit center
export const unallocatedProfitCenterInitData = { profitCenter: '' };

// clearing gl type

type clearingGLInitDataType = {
  gl: any;
  businessTransaction: any;
  profitCenter: any;
  profitProportion: any;
};
// clearing gl
export const clearingGLInitData: clearingGLInitDataType = {
  gl: '',
  businessTransaction: '',
  profitCenter: '',
  profitProportion: '',
};

// common data table reset
type CommonDataReset = {
  setUnallocatedProfitCenterData: React.Dispatch<React.SetStateAction<any[]>>;
  setClearingGLData: React.Dispatch<React.SetStateAction<any[]>>;
};

// clearing journal common data reset
export function commonDataReset(obj: CommonDataReset) {
  // destrcuture
  const { setClearingGLData, setUnallocatedProfitCenterData } = obj;

  setClearingGLData([]);
  setUnallocatedProfitCenterData([]);
}

// disable unallocatedProfitCenterData create button
export function isUnallocatedPCSaveButtonDisabled(
  arr: any,
  allocationType: any
): boolean {
  const selectedRowCount = selectedCount(arr);
  // if allocation type is single than has row data must can be multiple otherwise single
  return allocationType?.value === 1
    ? !(selectedRowCount > 0) // greater than 0
    : selectedRowCount !== 1;
}
// selected count
export const selectedCount = (arr: any[]): number => {
  return arr?.filter((item: any) => item?.isSelected)?.length || 0;
};

// cerate clearing gl create page save button disabled
export const isClearingGLSaveButtonDisabled = (
  values: any,
  totalProfitPoportion: number,
  allocationType: string
) => {
  const { gl, businessTransaction, profitCenter } = values;

  const commonFormValues = !gl || !businessTransaction || !profitCenter;

  if (allocationType === 'singleProfitCenter') {
    return commonFormValues;
  } else {
    return totalProfitPoportion !== 100;
  }
};

// allow single or multiple row selection
export function singleOrMultipleRowSelection({
  arr,
  setter,
  values,
  index,
  checkedValue,
}) {
  const { allocationType } = values;
  // if allocation type is single than has permission to select multiple row
  if (allocationType?.value === 1) {
    const copiedArr = [...arr];
    copiedArr[index]['isSelected'] = checkedValue;
    setter(copiedArr);
  }
  // if allocation type is multiple than has permission to select single
  else {
    const modifyArr = arr?.map((item: any, itemIndex: number): any[] => ({
      ...item,
      isSelected: index === itemIndex ? checkedValue : false,
    }));
    setter(modifyArr);
  }
}

// clearing gl profit center add button disabled
export function clearingGLProfitCenterAddButtonDisabled(
  values: any,
  totalProfitPoportion: number
): boolean {
  // destrcuture
  const { gl, businessTransaction, profitCenter, profitProportion } = values;

  // form values is empty or not
  const valuesCheckes =
    !gl || !businessTransaction || !profitCenter || !profitProportion;

  // total proportion check
  const totalProportionCheck = totalProfitPoportion >= 100;

  // next total proportion check
  const isTotalProportionOverflow =
    +totalProfitPoportion + +profitProportion > 100;

  return valuesCheckes || totalProportionCheck || isTotalProportionOverflow;
}

// unallocated profit center add button disabled
export function unAllocatedProfitCenterAddButtonDisabled(
  values: any,
  totalProfitPoportion: number
): boolean {
  // destrcuture
  const { profitCenter, profitProportion } = values;

  // form values is empty or not
  const valuesCheckes = !profitCenter || !profitProportion;

  // total proportion check
  const totalProportionCheck = totalProfitPoportion >= 100;

  // next total proportion check
  const isTotalProportionOverflow =
    +totalProfitPoportion + +profitProportion > 100;

  return valuesCheckes || totalProportionCheck || isTotalProportionOverflow;
}

// unAllocatedProfitCenterSaveButtonDisabled

export function unAllocatedProfitCenterSaveButtonDisabled(obj) {
  // destrcuture
  const { values, landingValues, totalProfitPoportion } = obj;
  const { profitCenter } = values;

  if (landingValues?.allocationType?.value === 1) {
    return !profitCenter;
  } else {
    return totalProfitPoportion !== 100;
  }
}
