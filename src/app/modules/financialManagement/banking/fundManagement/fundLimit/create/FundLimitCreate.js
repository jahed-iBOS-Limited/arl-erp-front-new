import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { createFundLimit } from "../../helper";
import { useLocation } from "react-router-dom";
import LimitForm from "./Form";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";

function addDays(date, days=180) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return _dateFormatter(result);
}
const initData = {
  bank: "",
  facility: "",
  limit: "",
  updatedDate: _todayDate(),
  tenorDays: "",
  sanctionReference: "",
  limitExpiryDate: addDays(_todayDate()),

};

export default function FundLimitCreate({
  match: {
    params: { id },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const { state, landingRowData } = useLocation();

  console.log("state", state);
  console.log("landingRowData", landingRowData);

  const saveHandler = async (values, cb) => {
    if (!values?.bank) {
      setDisabled(false);
      return toast.warn("Please Select Bank");
    }

    if (!values?.facility) {
      setDisabled(false);
      return toast.warn("Please Select Facility");
    }

    const payloadForCreateAndEdit = {
      bankLoanLimitId: +id || 0,
      accountId: profileData?.accountId,
      businessUnitId: +id
        ? landingRowData?.businessUnitId
        : state?.businessUnit?.value,
      bankId: values?.bank?.value,
      facilityId: values?.facility?.value,
      numLimit: +values?.limit || 0,
      loanUpdateDate: values?.updatedDate,
      lastActionDatetime: _todayDate(),
      intActionBy: profileData?.userId,
      tenureDays: values?.tenorDays|| 0,
      sanctionReference:values?.sanctionReference || "",
      limitExpiryDate: values?.limitExpiryDate || "",
      isActive: true,
    };
    createFundLimit(payloadForCreateAndEdit, setDisabled, cb);
  };

  return (
    <IForm
      title={`Create Fund Limit`}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <LimitForm
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        landingRowData = {landingRowData}
      />
    </IForm>
  );
}
