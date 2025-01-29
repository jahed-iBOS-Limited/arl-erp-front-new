/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useParams } from "react-router-dom";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  createRouteCostComponent,
  getRouteCostComponent,
  editRouteCostComponent,
  getBusinessTransactionDDL,
  getGeneralLedgerDDL_api,
} from "../helper";
import Loading from "../../../../_helper/_loading";

const initData = {
  transportRouteCostComponent: "",
  businessTransaction: "",
  generalLedger: "",
};

export default function CostComponentCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [businessTransactionDDL, setBusinessTransactionDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [generalLedger, setgeneralLedger] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const params = useParams();
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getBusinessTransactionDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setBusinessTransactionDDL
      );
      getGeneralLedgerDDL_api(
        profileData.accountId,
        selectedBusinessUnit?.value,
        setgeneralLedger
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (params?.id) {
      getRouteCostComponent(profileData?.accountId, params?.id, setSingleData);
    }
  }, [profileData, params]);
  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const payload = {
          transportRouteCostComponentId: +params?.id,
          transportRouteCostComponent: values?.transportRouteCostComponent,
          actionBy: +profileData?.userId,
          generalLedgerId: values?.generalLedger?.value,
          generalLedgerCode: values?.generalLedger?.code,
        };
        editRouteCostComponent(payload, setDisabled);
      } else {
        const payload = {
          accountId: +profileData?.accountId,
          transportRouteCostComponent: values?.transportRouteCostComponent,
          actionBy: +profileData?.userId,
          generalLedgerId: values?.generalLedger?.value,
          generalLedgerCode: values?.generalLedger?.code,
        };
        createRouteCostComponent(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };
  return (
    <IForm
      title={"Create Cost Component"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        rowDto={rowDto}
        accountId={profileData?.accountId}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        businessTransactionDDL={businessTransactionDDL}
        setRowDto={setRowDto}
        setSingleData={setSingleData}
        isEdit={params?.id || false}
        generalLedger={generalLedger}
      />
    </IForm>
  );
}
