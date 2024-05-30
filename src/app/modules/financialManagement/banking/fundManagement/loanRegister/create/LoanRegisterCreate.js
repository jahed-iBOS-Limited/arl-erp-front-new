import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosPost from "../../../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { createLoanRegister } from "../../helper";
import LoanRegisterViewForm from "../view/loanRegisterViewForm";

const initData = {
  bank: "",
  facility: "",
  account: "",
  openingDate: _todayDate(),
  loanAccNo: "",
  termDays: "",
  principle: "",
  interestRate: "",
  disbursementPurpose:""

};

export default function LoanRegisterCreate({
  history,
  match: {
    params: { id, renewId },
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
    if (renewId) {
      setModifyData({
        bank: {
          value: location?.state?.intBankId,
          label: location?.state?.strBankName,
        },
        facility: {
          value: location?.state?.intLoanFacilityId,
          label: location?.state?.facilityName,
        },
        account: {
          value: location?.state?.intBankAccountId,
          label: location?.state?.strBankAccountNumber,
        },
        openingDate: _dateFormatter(location?.state?.dteStartDate),
        loanAccNo: location?.state?.strLoanAccountName || "",
        termDays: location?.state?.intTenureDays || 0,
        principle: location?.state?.numPrinciple || 0,
        interestRate: location?.state?.numInterestRate || 0,
      });
    }
  }, [renewId, location]);

  const singleData = useSelector((state) => {
    return state.costControllingUnit?.singleData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (!values?.bank) {
      setDisabled(false);
      return toast.warn("Please Select Bank");
    }
    if (!values?.account) {
      setDisabled(false);
      return toast.warn("Please Select Bank Account");
    }
    if (!values?.facility) {
      setDisabled(false);
      return toast.warn("Please Select Facility");
    }

    if (renewId) {
      renewSave(
        `/fino/FundManagement/FundLoanAccountRenew?accountId=${
          profileData?.accountId
        }&businessUnitId=${
          selectedBusinessUnit?.value
        }&loanAccId=${renewId}&bankId=${location?.state?.intBankId}&bankAccId=${
          values?.account?.value
        }&facilityId=${values?.facility?.value}&startDate=${
          values?.openingDate
        }&tenureDays=${+values?.termDays}&numPrinciple=${+values?.principle}&numIntRate=${+values?.interestRate}&actionById=${
          profileData?.userId
        }&disbursementPurposeId=${values?.disbursementPurpose?.value||0}&disbursementPurposeName=${values?.disbursementPurpose?.label||""}`,
        null,
        null,
        true
      );

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
      values?.disbursementPurpose?.value||0,
      values?.disbursementPurpose?.label||"",
      profileData?.userId,
      setDisabled,
      cb
    );
  };

  return (
    <IForm
      title={renewId ? `Renew Loan Register` : `Create Loan Register`}
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
        isEdit={id || false}
        renewId={renewId}
      />
    </IForm>
  );
}
