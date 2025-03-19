/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "./../../../../_helper/_loading";
import { getBankDDl, saveBankChequePrint } from "./../helper";

const initData = {
  bank: "",
  branch: "",
  bankAccount: "",
  accountNumber: "",
  prefix: "",
  startNo: "",
  endNo: "",
};

export default function ChequePrintSetupForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [bankDDL, setBankDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //Dispatch Get bank action for get codeType ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getBankDDl(setBankDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  //Dispatch single data action and empty single data for create
  // useEffect(() => {
  //   if (id) {
  //     dispatch(getSingleById(id));
  //   } else {
  //     dispatch(setBankAccountSingleEmpty());
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [id]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {};
        console.log("Edit", payload);
        // dispatch(saveEditedBankAccount(payload, setDisabled));
      } else {
        const payload = {
          id: 0,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          bankAccountId: values?.bankAccount?.value,
          bankBranchId: values?.branch?.value,
          bankId: values?.bank?.value,
          accountNo: values?.bankAccount?.label,
          prefix: values?.prefix || "",
          startNo: values?.startNo,
          endNo: values?.endNo,
          currentNo: 0,
          actionBy: profileData?.userId,
        };
        saveBankChequePrint(payload, setDisabled, cb);
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Cheque Print Setup"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        bankDDL={bankDDL}
        isEdit={id || false}
      />
    </IForm>
  );
}
