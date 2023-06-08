/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation, useParams } from "react-router-dom";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getVatAdjustmentById,
  editVatAdjustment,
  getTaxBranchDDL,
  createVatAdjustment,
} from "../helper";
import Loading from "../../../../_helper/_loading";

const initData = {
  taxBranchAddress: "",
  adjustmentPurpose: "",
  taxTransactionType: "",
  componentName: "",
  amount: "",
  adjustmentDate: _todayDate(),
  adjustmentReason: "",
  adjustmentType: "",
};

export default function VatAdjustmentCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const location = useLocation();
  const params = useParams();
  // taxbranch ddl
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;
  useEffect(() => {
    if (params?.id) {
      getVatAdjustmentById(params?.id, setSingleData);
    }
  }, [params]); // location
  const [taxBranchDDL, setTaxBranchDDL] = useState([]);

  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit?.value &&
      profileData?.userId
    ) {
      getTaxBranchDDL(
        profileData?.userId,
        profileData.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const payload = {
          adjustmentId: +params?.id,
          taxTransactionTypeId: +values?.taxTransactionType?.value,
          taxBranchId: +values?.taxBranchName?.value,
          taxBranchName: values?.taxBranchName?.label,
          taxBranchAddress: values?.taxBranchAddress,
          adjustmentDate: values?.adjustmentDate,
          adjustmentReason: values?.adjustmentReason,
          actionBy: +profileData?.userId,
          componentId: +values?.componentName?.value,
          amount: +values?.amount,
          adjustmentTypeId: values?.adjustmentType?.value,
          categoryTypeId: values?.taxTransactionType?.value || 0,
          taxComponentId: values?.componentName?.value || 0,
          adjustmentPurposeId: values?.adjustmentPurpose?.value,
          adjustmentPurposeName: values?.adjustmentPurpose?.label,
        };

        editVatAdjustment(payload, setDisabled);
      } else {
        const payload = {
          accountId: +profileData?.accountId,
          businessUnitId: +selectedBusinessUnit?.value,
          taxTransactionTypeId: +values?.taxTransactionType?.value,
          taxBranchId: +location?.state?.selectedTaxBranchDDL?.value,
          taxBranchName: location?.state?.selectedTaxBranchDDL?.label,
          taxBranchAddress: values?.taxBranchAddress,
          adjustmentDate: values?.adjustmentDate,
          adjustmentReason: values?.adjustmentReason,
          actionBy: +profileData?.userId,
          componentId: +values?.componentName?.value,
          amount: +values?.amount,
          adjustmentTypeId: values?.adjustmentType?.value,
          categoryTypeId: values?.taxTransactionType?.value || 0,
          taxComponentId: values?.componentName?.value || 0,
          adjustmentPurposeId: values?.adjustmentPurpose?.value,
          adjustmentPurposeName: values?.adjustmentPurpose?.label,
        };
        createVatAdjustment(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  return (
    <IForm
      title={"Create Vat Adjustment"}
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
        setRowDto={setRowDto}
        setSingleData={setSingleData}
        isEdit={params?.id || false}
        setTaxBranchDDL={setTaxBranchDDL}
        location={location}
      />
    </IForm>
  );
}
