import React, { useState, useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAxiosPost from '../../../../../_helper/customHooks/useAxiosPost';
import { _dateFormatter } from '../../../../../_helper/_dateFormate';
import IForm from '../../../../../_helper/_form';
import Loading from '../../../../../_helper/_loading';
import { _todayDate } from '../../../../../_helper/_todayDate';
import { createLoanRegister, loadRegisterEdit } from '../../helper';
import LoanRegisterViewForm from '../view/loanRegisterViewForm';

const initData = {
  bank: '',
  facility: '',
  account: '',
  openingDate: _todayDate(),
  loanAccNo: '',
  termDays: '',
  principle: '',
  interestRate: '',
  disbursementPurpose: '',
  facilityRemarks: '',
  remarks: '',
  IsNBFI: false,
  NBFI: '',
};

export default function LoanRegisterCreate({
  history,
  match: {
    params: { id, editId, renewId },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [modifyData, setModifyData] = useState(null);
  const [, renewSave] = useAxiosPost();
  const location = useLocation();
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    if (renewId || editId) {
      setModifyData({
        bank:
          location?.state?.intBankId && location?.state?.strBankName
            ? {
                value: location.state.intBankId,
                label: location.state.strBankName,
              }
            : '',
        facility:
          location?.state?.intLoanFacilityId && location?.state?.facilityName
            ? {
                value: location.state.intLoanFacilityId,
                label: location.state.facilityName,
              }
            : '',
        account:
          location?.state?.intBankAccountId &&
          location?.state?.strBankAccountNumber
            ? {
                value: location.state.intBankAccountId,
                label: location.state.strBankAccountNumber,
              }
            : '',
        openingDate: location?.state?.dteStartDate
          ? _dateFormatter(location.state.dteStartDate)
          : '',
        loanAccNo: location?.state?.strLoanAccountName || '',
        termDays: location?.state?.intTenureDays || 0,
        principle: location?.state?.numPrinciple || 0,
        interestRate: location?.state?.numInterestRate || 0,
        disbursementPurpose:
          location?.state?.disbursementPurposeId &&
          location?.state?.disbursementPurposeName
            ? {
                value: location.state.disbursementPurposeId,
                label: location.state.disbursementPurposeName,
              }
            : '',
        remarks: location?.state?.loanRemarks || '',
        IsNBFI: location?.state?.intNbfiId > 0 ? true : false,
        NBFI:
          location?.state?.intNbfiId && location?.state?.strNbfiName
            ? {
                value: location.state.intNbfiId,
                label: location.state.strNbfiName,
              }
            : '',
      });
    }
  }, [renewId, location, editId]);
  const singleData = useSelector((state) => {
    return state.costControllingUnit?.singleData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (!values?.bank) {
      setDisabled(false);
      return toast.warn('Please Select Bank');
    }
    if (!values?.account) {
      setDisabled(false);
      return toast.warn('Please Select Bank Account');
    }
    if (!values?.facility) {
      setDisabled(false);
      return toast.warn('Please Select Facility');
    }

    if (values?.IsNBFI && !values?.NBFI) {
      setDisabled(false);
      return toast.warn('Please Select NBFI');
    }

    if (renewId) {
      renewSave(
        `/fino/FundManagement/FundLoanAccountRenew?accountId=${
          profileData?.accountId
        }&businessUnitId=${
          location?.state?.intBusinessUnitId || selectedBusinessUnit?.value
        }&loanAccId=${renewId}&bankId=${
          location?.state?.intBankId
        }&bankAccId=${values?.account?.value}&facilityId=${
          values?.facility?.value
        }&startDate=${
          values?.openingDate
        }&tenureDays=${+values?.termDays}&numPrinciple=${+values?.principle}&numIntRate=${+values?.interestRate}&actionById=${
          profileData?.userId
        }&disbursementPurposeId=${
          values?.disbursementPurpose?.value || 0
        }&disbursementPurposeName=${values?.disbursementPurpose?.label || ''}`,
        null,
        null,
        true
      );

      return;
    }

    if (editId) {
      const editPayload = {
        loanAccountId: +editId,
        accountId: profileData?.accountId,
        branchId:
          location?.state?.intBusinessUnitId || selectedBusinessUnit?.value,
        loanAcc: values?.loanAccNo || '',
        facilityId: values?.facility?.value || 0,
        startDate: values?.openingDate || '',
        tenureDays: +values?.termDays || 0,
        numPrinciple: +values?.principle || 0,
        numIntRate: +values?.interestRate || 0,
        actionById: profileData?.userId || 0,
        disbursementPurposeId: values?.disbursementPurpose?.value || 0,
        disbursementPurposeName: values?.disbursementPurpose?.label || '',
        loanRemarks: values?.remarks || '',
        intNbfiId: values?.NBFI?.value || null,
      };
      loadRegisterEdit({ editPayload, setDisabled, cb });
      return;
    }

    createLoanRegister(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.loanAccNo,
      values?.bank?.value,
      values?.account?.value,
      values?.facility?.value,
      values?.openingDate,
      +values?.termDays,
      +values?.principle,
      +values?.interestRate,
      values?.disbursementPurpose?.value || 0,
      values?.disbursementPurpose?.label || '',
      profileData?.userId,
      setDisabled,
      cb,
      false,
      0,
      values?.facilityRemarks,
      values?.remarks,
      values?.NBFI?.value || null
    );
  };

  return (
    <IForm
      title={
        renewId
          ? `Renew Loan Register`
          : editId
            ? `Edit Loan Register`
            : `Create Loan Register`
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <LoanRegisterViewForm
        {...objProps}
        initData={modifyData || singleData || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={editId || false}
        renewId={renewId}
        location={location}
      />
    </IForm>
  );
}
