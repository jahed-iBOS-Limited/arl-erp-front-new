/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import Form from "./form";
import IForm from "../../../../_helper/_form";

import {
  getBranchDDL,
  getDepositTypeDDL,
  getBankNameDDL,
  getDivisionNameDDL,
  getDepositorNameDDL,
  saveEditedTresuaryDeposit,
  singleDataById,
  saveTresuaryDeposit,
} from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "../../../../_helper/_loading";

const initData = {
  branchName: "",
  branchAddress: "",
  depositeType: "",
  depositAmount: "",
  depositDate: _todayDate(),
  challanNo: "",
  challanDate: _todayDate(),
  instrumentNo: "",
  instrumentDate: _todayDate(),
  bankName: "",
  bankBranch: "",
  divisionName: "",
  districtName: "",
  depositorName: "",
  designation: "",
  description: "",
};

export default function TresuaryDepositForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const location = useLocation();
  const params = useParams();
  const [branchName, setBranchName] = useState("");
  const [depositeType, setDepositType] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [divisionName, setDivisionName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [depositorName, setDepositorName] = useState("");
  // console.log("location", location?.state?.selectedTaxBranchDDL?.value);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //SingleData to view
  const [singleData, setSingleData] = useState("");

  useEffect(() => {
    getDepositTypeDDL(setDepositType);
    getBankNameDDL(setBankName);
  }, []);

  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit?.value &&
      profileData?.userId
    ) {
      getBranchDDL(
        profileData?.userId,
        profileData.accountId,
        selectedBusinessUnit?.value,
        setBranchName
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (profileData?.countryId) {
      getDivisionNameDDL(
        profileData?.countryId,

        setDivisionName
      );
    }
  }, [profileData]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getDepositorNameDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDepositorName
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (params?.id) {
      singleDataById(params?.id, setSingleData);
    }
  }, [params]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const payload = {
          tresuaryId: +params?.id,
          depositorName: values?.depositorName?.label || '',
          depositDate: values?.depositDate ||  new Date(),
          depositAmount: +values?.depositAmount,
          designation: values?.designation,
          actionBy: +profileData?.userId,
          narration: values?.description,
        };

        saveEditedTresuaryDeposit(payload, setDisabled);
      } else {
        const payload = {
          trChallanNo: `${values?.challanNo}`,
          trChallanDate: values?.challanDate ||  new Date(),
          bankId: +values?.bankName?.value,
          bankName: values?.bankName?.label,
          bankBranchId: +values?.bankBranch?.value,
          bankBranchName: values?.bankBranch?.label,
          depositId: values?.depositorName?.value,
          depositTypeId: +values?.depositeType?.value || 0,
          depositorName: values?.depositorName?.label || '',
          depositDate: values?.depositDate ||  new Date(),
          instumentNo: `${values?.instrumentNo}`,
          instrumentDate: values?.instrumentDate ||  new Date(),
          depositAmount: +values?.depositAmount,
          accountId: +profileData?.accountId,
          businessUnitId: +selectedBusinessUnit?.value,
          businessUnitName: selectedBusinessUnit?.label,
          taxBranchId: +location?.state?.selectedTaxBranchDDL?.value,
          taxBranchName: location?.state?.selectedTaxBranchDDL?.label,
          taxBranchAddress: values?.branchAddress,
          designation: values?.designation,
          actionBy: +profileData?.userId,
          narration: values?.description,
        };
        saveTresuaryDeposit(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  return (
    <IForm
      title="Create Treasury Deposit"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        accountId={profileData?.accountId}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        branchName={branchName}
        bankName={bankName}
        bankBranch={bankBranch}
        setBankBranch={setBankBranch}
        districtName={districtName}
        setDistrictName={setDistrictName}
        depositeType={depositeType}
        divisionName={divisionName}
        depositorName={depositorName}
        setSingleData={setSingleData}
        state={location?.state}
        isEdit={params?.id || false}
      />
    </IForm>
  );
}
