/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getBankDDLAction,
  getBankAccountTypeDDLAction,
  saveBankAccount,
  saveEditedBankAccount,
  getSingleById,
  setBankAccountSingleEmpty,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import Loading from "./../../../../_helper/_loading";

const initData = {
  id: undefined,
  bank: "",
  branch: "",
  bankAccountType: "",
  accountName: "",
  accountNumber: "",
  generalLedger: "",
};

export default function BankAccountForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get bank ddl from store
  const bankDDL = useSelector((state) => {
    return state?.bankAccount?.bankDDL;
  }, shallowEqual);

  //Dispatch Get bank action for get codeType ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(getBankDDLAction());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get bankAccountType ddl from store
  const bankAccountTypeDDL = useSelector((state) => {
    return state?.bankAccount?.bankAccountTypeDDL;
  }, shallowEqual);

  //Dispatch Get bankAccountType action for get codeType ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(getBankAccountTypeDDLAction());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get single vehicleUnit from store
  const singleData = useSelector((state) => {
    return state.bankAccount?.singleData;
  }, shallowEqual);

  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getSingleById(id));
    } else {
      dispatch(setBankAccountSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          bankAccountId: +id,
          bankAccountName: values?.accountName,
          bankAccountNo: values?.accountNumber,
          bankAccountTypeId: values?.bankAccountType?.value,
          bankId: values?.bank?.value,
          bankBranchId: values?.branch?.value,
          generalLedgerId: values?.generalLedger?.value,
          actionBy: profileData.userId,
        };
        dispatch(saveEditedBankAccount(payload, setDisabled));
      } else {
        const payload = {
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          bankAccountName: values?.accountName,
          bankAccountNo: values?.accountNumber,
          bankAccountTypeId: values?.bankAccountType?.value,
          bankId: values?.bank?.value,
          bankBranchId: values?.branch?.value,
          generalLedgerId: values?.generalLedger?.value,
          actionBy: profileData.userId,
        };
        dispatch(saveBankAccount({ data: payload, cb, setDisabled }));
      }
    } else {
      setDisabled(false);
      
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Bank Account"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        bankDDL={bankDDL}
        bankAccountTypeDDL={bankAccountTypeDDL}
        profileData={profileData}
        isEdit={id || false}
      />
    </IForm>
  );
}
