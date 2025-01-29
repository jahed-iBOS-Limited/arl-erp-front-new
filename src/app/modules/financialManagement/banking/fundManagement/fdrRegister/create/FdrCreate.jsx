import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { createAndUpdateFDR, getFdrById } from "../../helper";
import FdrForm from "./Form";

const initData = {
  bank: "",
  fdrNo: "",
  leanTo: "",
  openingDate: _todayDate(),
  termDays: "",
  oldPrincipal: "",
  principle: "",
  interestRate: "",
  bankBranch: "",
  bankAccount: "",
  ait: "",
  exDuty: "",
  interest: "",
};

export default function FdrCreate({
  history,
  match: {
    params: { id },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [oldPrincipal, setPrincipal] = useState(null);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    console.log(values);
    if (!values?.bank) {
      setDisabled(false);
      return toast.warn("Please Select Bank");
    }
    if (!values?.bankBranch) {
      setDisabled(false);
      return toast.warn("Please Select Branch");
    }
    // if (!values?.bankAccount) {
    //   setDisabled(false);
    //   return toast.warn("Please Select Bank Account");
    // }
    if(values?.termDays <= 0) return toast.warn("Term (Days) must be greater than zero");
    if(values?.principle <= 0) return toast.warn("Principal must be greater than zero");
    if(values?.interestRate <= 0) return toast.warn("Interest Rate must be greater than zero");

    const payload = {
      sl: 0,
      intFdrAccountId: +id || 0,
      strFdrAccountNo: values?.fdrNo,
      intVersion: 0,
      intBusinessUnitId: selectedBusinessUnit?.value,
      intBankId: values?.bank?.value,
      strBankName: values?.bank?.label,
      dteStartDate: values?.openingDate,
      intTenureDays: +values?.termDays,
      dteMaturityDate: _todayDate(),
      numPrinciple: +values?.principle || 0,
      numInterestRate: +values?.interestRate || 0,
      isActive: true,
      intActionBy: profileData?.userId,
      dteLastActionDate: _todayDate(),
      strLienTo: values?.leanTo || "",
      intBankBranchId: values?.bankBranch?.value || 0,
      intBankAccountId: values?.bankAccount?.value || 0,
      typeId: +id ? 2 : 1, //typeId 1 for create new Fdr And typeId 2 for renew FDR
      numAit: +values?.ait || 0,
      numExDuty: +values?.exDuty || 0,
      numInterest: +values?.interest || 0,
    };
    // if (id) {
    //   renewFDR(payload, setDisabled, cb);
    // } else {
    createAndUpdateFDR(payload, setDisabled, cb);
    // }
  };

  useEffect(() => {
    if (id) {
      getFdrById(+id, setSingleData, setDisabled, setPrincipal);
    }
  }, [id]);
  return (
    <IForm
      // title={`Create FDR Register`}
      customTitle={id ? `Renew FDR Register` : `Create FDR Register`}
      getProps={setObjprops}
      isDisabled={isDisabled}
      // isHiddenSave={id ? true : false}
    >
      {isDisabled && <Loading />}
      <FdrForm
        {...objProps}
        setLoading={setDisabled}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        oldPrincipal={oldPrincipal}
      />
    </IForm>
  );
}
