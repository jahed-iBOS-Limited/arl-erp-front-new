/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import Loading from "../../../../../../_helper/_loading";
import {
  GetCurrencyTypeDDL,
  GetInsuranceCoverageDDL,
  GetInsuranceTypeDDL,
  GetProviderDDL,
  GetPaymentTypeDDL,
  GetInsuranceCoverNoteById,
  EditInstanceCoverNote,
  CreateInsuranceCoverNote,
} from "../helper";
import { _dateFormatter } from "../../../../../../_helper/_dateFormate";
import { useLocation, useParams } from "react-router";
import { toast } from "react-toastify";
import removeComma from "../../../../../../_helper/_removeComma";

const initData = {
  poNo: "",
  poId: "",
  coverage: "",
  shipmentType: "",
  provider: "",
  paymentBy: "",
  insuranceDate: _dateFormatter(new Date()),
  dueDate: _dateFormatter(new Date()),
  coverNoteNumber: "",
  PIAmountFC: "",
  PIAmountFCNumber: "",
  currency: "",
  exchangeRate: "",
  PIAmountBDT: "",
  PIAmountBDTNumber: "",
  insuredAmount: "",
  vat: "",
  total: "",
  attachment: "",
  prefix: "",
};

export default function InsurancePolicyForm() {
  const { id, type } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [open, setOpen] = useState(false);

  const [singleData, setSingleData] = useState([]);
  const [initFOrmData, setInitFOrmData] = useState(initData);
  const [shipmentTypeDDL, setShipmentTypeDDL] = useState([]);
  const [providerDDL, setProviderDDL] = useState([]);
  const [currencyTypeDDL, setCurrencyTypeDDL] = useState([]);
  const [insuranceCoverageDDL, setInsuranceCoverageDDL] = useState([]);
  const [paymentTypeDDL, setPaymentTypeDDL] = useState([]);
  const [fileObjects, setFileObjects] = useState([]);
  const [uploadImage, setUploadImage] = useState([]);
  const [dataByPO, setDataByPO] = useState([]);
  const [viewType, setViewType] = useState(type);
  const [calculationFormData, setCalculationFormData] = useState("");

  //   // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  //   // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const { state } = useLocation();

  // GetDDL
  useEffect(() => {
    GetInsuranceTypeDDL(setShipmentTypeDDL);
    GetProviderDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setProviderDDL
    );
    GetCurrencyTypeDDL(setCurrencyTypeDDL);
    GetInsuranceCoverageDDL(setInsuranceCoverageDDL);
    GetPaymentTypeDDL(setPaymentTypeDDL);
  }, []);

  useEffect(() => {
    if (id && state.checkbox === "insuranceCoverNote") {
      GetInsuranceCoverNoteById(id, setSingleData);
    }
  }, [id]);

  // Save Handler
  const saveHandler = async (values, cb) => {
    if (Number(values?.vat) > Number(values?.total)) {
      return toast.error("VAT can't be greater than Total Amount");
    }
    if (id && profileData?.accountId && selectedBusinessUnit?.value) {
      const data = {
        insuranceCoverId: id,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        coverageId: values?.coverage?.value,
        insuranceTypeId: values?.shipmentType?.value,
        providerId: values?.provider?.value,
        paymentById: values?.paymentBy?.value,
        dteInsuranceDate: values?.insuranceDate,
        coverNoteNumber: values?.coverNoteNumber,
        currencyId: values?.currencyId,
        numExchangeRate: +values?.exchangeRate,
        numPiAmountFC: Number(removeComma(values?.PIAmountFC)),
        numPIAmountBDT: Number(removeComma(values?.PIAmountBDT)),
        numVatamount: +values?.vat,
        numTotalAmount: +values?.total,
        coverNoteDocumentId: uploadImage[0]?.id,
        dueDate: values?.dueDate,
      };
      // Save Edited Data
      EditInstanceCoverNote(data, cb);
    } else {
      // console.log("valuesAdd", values?.PIAmountBDT, values?.PIAmountFC);
      const payload = {
        poId: values?.poId,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        sbuId: dataByPO?.sbuId,
        plantId: dataByPO?.plantId,
        poNumber: values?.poNo,
        coverageId: values?.coverage?.value,
        insuranceTypeId: values?.shipmentType?.value,
        providerId: values?.provider?.value,
        paymentById: values?.paymentBy?.value,
        dteInsuranceDate: values?.insuranceDate,
        coverNoteNumber: values?.coverNoteNumber,
        currencyId: values?.currency?.value,
        numExchangeRate: +values?.exchangeRate,
        numPIAmountBDT: Number(removeComma(values?.PIAmountBDT)),
        numPIAmountFC: Number(removeComma(values?.PIAmountFC)),
        numVatamount: +values?.vat,
        numTotalAmount: +values?.total,
        dueDate: values?.dueDate,
        coverNoteDocumentId: uploadImage[0]?.id || "",
        actionBy: profileData?.employeeId,
        numDiscountAmount: calculationFormData?.discountOnCommision,
        numNetAmount: calculationFormData?.netPaid,
      };
      // console.log("payload", payload);
      // Save Created Data
      CreateInsuranceCoverNote(payload, cb);
    }
  };
  console.log('singleData: ', singleData);
  return (
    <>
      {isDisabled && <Loading />}
      <div className='mt-0'>
        <Form
          {...objProps}
          initData={
            id
              ? {
                  ...singleData,
                  coverNoteNumberActual: singleData?.providerPolicyPrefix,
                }
              : { ...initFOrmData, poNo: state?.po?.label }
          }
          saveHandler={saveHandler}
          shipmentTypeDDL={shipmentTypeDDL}
          providerDDL={providerDDL}
          currencyTypeDDL={currencyTypeDDL}
          insuranceCoverageDDL={insuranceCoverageDDL}
          paymentTypeDDL={paymentTypeDDL}
          open={open}
          setOpen={setOpen}
          setFileObjects={setFileObjects}
          fileObjects={fileObjects}
          setUploadImage={setUploadImage}
          coverNotePreFix={state?.coverNotePreFix}
          accountId={profileData?.accountId}
          buId={selectedBusinessUnit?.value}
          viewType={viewType}
          setDataByPO={setDataByPO}
          singleData={singleData}
          setSingleData={setSingleData}
          setInitFOrmData={setInitFOrmData}
          initialValue={initData}
          setViewType={setViewType}
          calculationFormData={calculationFormData}
          setCalculationFormData={setCalculationFormData}
        />
      </div>
    </>
  );
}
