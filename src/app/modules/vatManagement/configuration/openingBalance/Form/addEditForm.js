import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { GetOpeningBalanceByBranchId_api, saveDeduction_api, saveOpenningBalance_api } from "../helper";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  id: undefined,
  vat: "",
  sd: "",
  surcharge: "",
  date: _todayDate(),
};

export default function OpeningBalanceForm({
  status,
  formValues,
  getDeductionDataFunc,
  getOpenningBalenceFunc,
  setShowModel
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [openingBalncByBranchId, setOpeningBalncByBranchId] = useState("");
  const [objProps, setObjprops] = useState({});
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (status === "deduction") {
        const payload = {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          taxBranchId: formValues?.branch?.value,
          sd: +values?.sd,
          vat: +values?.vat,
          transactionDate: values?.date,
        };
        saveDeduction_api(
          payload,
          setDisabled,
          cb,
          getDeductionDataFunc,
          formValues
        );
      } else {
        const payload = {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          taxBranchId: formValues?.branch?.value,
          numSd: +values?.sd,
          numVat: +values?.vat,
          numSurcharge: +values?.surcharge,
          dteInsertionTime: _todayDate(),
          dteTransactionDate:_todayDate(),
        };

        saveOpenningBalance_api(
          payload,
          setDisabled,
          cb,
          getOpenningBalenceFunc,
          formValues
        );
      }
    } else {
      setDisabled(false);
    }
  };
  useEffect(() => {
    if(status !== "deduction" && formValues?.branch?.value) {
      GetOpeningBalanceByBranchId_api(formValues?.branch?.value,setOpeningBalncByBranchId )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[formValues] )

  return (
    <IForm title="" getProps={setObjprops} isDisabled={isDisabled} isHiddenBack={true}>
      {isDisabled && <Loading />}

      <Form
        {...objProps}
        initData={openingBalncByBranchId || initData}
        saveHandler={saveHandler}
        status={status}
        isDisabled={isDisabled}
        setShowModel={setShowModel}
      />
    </IForm>
  );
}
