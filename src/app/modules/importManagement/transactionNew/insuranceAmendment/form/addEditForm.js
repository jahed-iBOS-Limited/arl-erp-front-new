/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import Loading from "../../../../_helper/_loading";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  createInsurancAmendment,
  getInsuranceSingleData,
  GetLcAmendmentDDL,
} from "../helper";
import IForm from "../../../../_helper/_form";
import removeComma from "../../../../_helper/_removeComma";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { toast } from 'react-toastify';

const initData = {
  coverNoteNumber: "",
  poId: "",
  ponumber: "",
  lcnumber: "",
  reason: "",
  amendmentDate: _todayDate(),
  numVatamount: "",
  exchangeRate: "",
  insuranceDate: "",
  piamountFC: "",
  piamountBDT: "",
  dueDate: _todayDate(),
  totalCharge: "",
  lcAmendment: "",
};

export default function InsuranceAmendmentForm({ singleItem, type }) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [edit, setEdit] = useState(true);
  const [insuranceSingleData, setInsuranceSingleData] = useState({});
  const [lcAmendmentDDL, setLcAmendmentDDL] = useState([]);

  const setter = (payload) => {
    setRowDto([...rowDto, payload]);
  };

  // get user profile and business data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const history = useHistory();
  const { state } = useLocation();
  const saveHandler = async (values, cb) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      if(values?.totalCharge > +values?.numVatamount){
        const payload = {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          actionBy: profileData?.employeeId,
          poId: values?.poId,
          ponumber: values?.ponumber,
          coverNoteNumber: values?.coverNoteNumber,
          reason: values?.reason,
          amendmentDate: new Date(values?.amendmentDate),
          piamountFC: removeComma(values?.piamountFC),
          piamountBDT: values?.piamountBDT,
          vat: removeComma(values?.numVatamount),
          exchangeRate: removeComma(values?.exchangeRate),
          insuranceDate: new Date(values?.insuranceDate),
          dueDate: new Date(values?.dueDate),
          lcid: insuranceSingleData?.lcid,
          lcnumber: insuranceSingleData?.lcnumber,
          totalCharge: values?.totalCharge,
          sbuId: insuranceSingleData?.sbuId,
          plantId: insuranceSingleData?.plantId,
          lcAmendmentId: values?.lcAmendment?.value,
          // lcAmendmentId: insuranceSingleData?.lcAmendmentId,
        };
        createInsurancAmendment(setDisabled, payload, cb);
      }
      else{
        toast.warn('VAT can not be greater than Total Charge', {toastId: 'vat'})
      }
    }
  };

  const remover = (payload) => {
    const filterArr = rowDto.filter((itm, index) => +index !== +payload);
    setRowDto(filterArr);
  };

  console.log(state, "new state");

  useEffect(() => {
    getInsuranceSingleData(
      setDisabled,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      state?.poNumber,
      setInsuranceSingleData
    );
    GetLcAmendmentDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      state?.poId,
      setLcAmendmentDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const backHandler = () => {
    history.goBack();
  };

  return (
    <>
      <IForm
        title="Insurance Amendment"
        getProps={setObjprops}
        isDisabled={isDisabled}
        isHiddenReset={singleItem?.type === "view"}
        isHiddenBack={singleItem?.type === "view"}
        isHiddenSave={singleItem?.type === "view"}
      >
        {isDisabled && <Loading />}

        <Form
          {...objProps}
          initData={
            singleItem?.insuranceAmendmentId
              ? { ...singleItem, numVatamount: singleItem?.vat }
              : initData
          }
          saveHandler={saveHandler}
          profileData={profileData}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          setter={setter}
          remover={remover}
          rowDto={rowDto}
          setRowDto={setRowDto}
          setEdit={setEdit}
          isDisabled={isDisabled}
          state={state}
          backHandler={backHandler}
          insuranceSingleData={insuranceSingleData}
          singleItem={singleItem}
          lcAmendmentDDL={lcAmendmentDDL}
          type={type}
        />
      </IForm>
    </>
  );
}
