/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  gdetBusinessTransactionId_api,
  getGeneralLedgerDDL,
  saveBusinessTransaction,
} from "../helper";
import IForm from "../../../../_helper/_form";
import { editBusinessTransaction_api } from "./../helper";
import Loading from "./../../../../_helper/_loading";

const initData = {
  businessTransactionCode: "",
  businessTransactionName: "",
  generalLedger: "",
  isInternalExpense: false
};

export default function BusinessUnitForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state?.authData?.selectedBusinessUnit;
  }, shallowEqual);

  const [generalLedger, setgeneralLedger] = useState([]);
  const [singleData, setSingleData] = useState([]);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getGeneralLedgerDDL(
        profileData.accountId,
        selectedBusinessUnit?.value,
        setgeneralLedger
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          businessTransactionId: +id,
          businessTransactionName: values?.businessTransactionName,
          generalLedgerId: values?.generalLedger.value,
          generalLedgerName: values?.generalLedger.label,
          actionBy: profileData.userId,
          generalLedgerCode: values?.generalLedger.code,
          isInternalExpense: values?.isInternalExpense
        };
        editBusinessTransaction_api(payload, setDisabled);
      } else {
        const payload = {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          businessTransactionName: values?.businessTransactionName,
          businessTransactionCode: " ",
          generalLedgerId: values?.generalLedger.value,
          generalLedgerName: values?.generalLedger.label,
          actionBy: profileData.userId,
          generalLedgerCode: values?.generalLedger.code,
          isInternalExpense: values?.isInternalExpense
        }

        saveBusinessTransaction(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  useEffect(() => {
    if (id) {
      gdetBusinessTransactionId_api(
        profileData.accountId,
        selectedBusinessUnit.value,
        id,
        setSingleData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    return () => {
      setSingleData([]);
    };
  }, []);
  return (
    <div className="businessTransaction">
      <IForm
        title="Create Business Transaction"
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={id ? singleData : initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          generalLedger={generalLedger}
          isEdit={id || false}
        />
      </IForm>
    </div>
  );
}
