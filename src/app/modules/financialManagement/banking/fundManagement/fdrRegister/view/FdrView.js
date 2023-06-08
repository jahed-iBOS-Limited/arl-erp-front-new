import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { createAndUpdateFDR, getFdrById, renewFDR } from "../../helper";
import FdrViewForm from "./FdrViewFrom";

const initData = {
  bank: "",
  fdrNo: "",
  leanTo: "",
  openingDate: _todayDate(),
  termDays: "",
  principle: "",
  interestRate: "",
};

export default function FdrView({
  history,
  match: {
    params: { id },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState({});

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
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
    };
    if (id) {
      renewFDR(payload, cb);
    } else {
      createAndUpdateFDR(payload, setDisabled, cb);
    }
  };

  useEffect(() => {
    if (id) {
      getFdrById(+id, setSingleData, setDisabled);
    }
  }, [id]);

  return (
    <IForm
      // title={`Create FDR Register`}
      customTitle={`View FDR Register`}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenSave={true}
    >
      {isDisabled && <Loading />}
      <FdrViewForm
        {...objProps}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        setLoading={setDisabled}
      />
    </IForm>
  );
}
