/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import Form from "./form";
import Loading from "../../../../_helper/_loading";
// import { _dateFormatter } from "../../../../_helper/_dateFormate";
import {
  GetHsCodeByShipmentIdDDL,
  // GetHsCodeInfo,
  GetCustomsNameDDL,
  GetPaidByDDL,
  // GetBankListDDL,
  GetInstrumentTypeDDL,
  CreateCustomsDuty,
  getSingleData,
  EditCustomsDuty,
  GetCNFAgencyDDL,
  GetBankDDL,
  GetHSCodeInfoForCustomDuty,
} from "../helper";
// import { toast } from "react-toastify";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { _todayDate } from "../../../../_helper/_todayDate";

export default function CustomDutyForm() {
  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [hsCodeInfo, setHsCodeInfo] = useState({});

  const initData = {
    boeNo: "",
    boeDate: _todayDate(),
    paymentDate: _todayDate(),
    invoiceAmount: "",
    invoiceAmountBDT: "",
    exRate: "",
    fineBDT: "",
    AITExemptionBDT: "",
    docProcessFee: "",
    CnFIncomeTax: "",
    cnfVat: "",
    scanning: "",
    cnfAgencyDDL: "",
    custom: "",
    paidBy: "",
    assessmentValue: "",
    customDuty: hsCodeInfo?.cd || "",
    regulatoryDuty: hsCodeInfo?.rd || "",
    supplementaryDuty: hsCodeInfo?.sd || "",
    vat: hsCodeInfo?.vat || "",
    ait: hsCodeInfo?.ait || "",
    advanceTradeVat: hsCodeInfo?.atv || "",
    psi: hsCodeInfo?.psi || "",
    at: "",
    bank: "",
    instrumentType: "",
    grandTotal: hsCodeInfo?.sum || "",
  };

  // All states
  const { type, cdId } = useParams();
  const { state } = useLocation();
  const [objProps] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [hsCode, setHsCode] = useState([]);
  const [customsNameDDL, setCustomsNameDDL] = useState([]);
  const [bankDDL, setBankDDL] = useState([]);
  const [paidByDDL, setPaidByDDL] = useState([]);
  const [instrumentTypeDDL, setInstrumentTypeDDL] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [cnfAgencyDDL, setCnfAgencyDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [bankListDDL, setBankListDDL] = useState([]);
  // const [otherCharges, setOtherCharges] = useState(0);
  // const [edit, setEdit] = useState(true);
  // const [grandTotal, setGrandTotal] = useState("");
  // const [customsPayment, setCustomsPayment] = useState([]);

  // Reset button function
  const resetBtnRef = useRef();
  const resetBtnClick = () => {
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click();
    }
  };

  useEffect(() => {
    GetHSCodeInfoForCustomDuty(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      state?.poID,
      state?.shipmentId,
      setHsCodeInfo
    );
  }, [state?.poID, state?.shipmentId]);

  //get HSCode from api
  useEffect(() => {
    if (state?.shipmentId)
      GetHsCodeByShipmentIdDDL(state?.PoNo, state?.shipment, setHsCode);
  }, [state?.shipmentId]);

  // Get all DDL
  useEffect(() => {
    GetCustomsNameDDL(
      setCustomsNameDDL,
      profileData?.accountId,
      selectedBusinessUnit?.value
    );
    GetPaidByDDL(setPaidByDDL);

    GetInstrumentTypeDDL(setInstrumentTypeDDL);
  }, []);
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetBankDDL(
        setBankDDL,
        profileData?.accountId,
        selectedBusinessUnit?.value
      );
    }
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  useEffect(() => {
    if (cdId) {
      getSingleData(cdId, setSingleData, setLoading);
      GetHsCodeByShipmentIdDDL(state?.PoNo, state?.shipment, setHsCode);
    }
  }, [cdId]);

  const saveHandler = async (values, cb) => {
    if (cdId) {
      return EditCustomsDuty(cdId, values, profileData);
    }
    // else if (hsCode?.length > customsPayment?.length) {
    //   toast.warning("Please add all HS code");
    // }
    else {
      return CreateCustomsDuty(
        values,
        cb,
        profileData,
        selectedBusinessUnit?.value,
        state?.PoNo,
        state?.LcNo,
        state?.poID,
        state?.lcID,
        state?.shipmentId,
        state?.shipment,
        state?.sbuId,
        state?.plantId
      );
    }
  };

  //cnf agency ddl;

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value)
      GetCNFAgencyDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCnfAgencyDDL
      );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  // Calculate subtotal for all customs payment duty

  // const totalDuty = () => {
  //   let total = 0;
  //   customsPayment.forEach((item) => {
  //     total += parseFloat(item?.totalDuty);
  //   });
  //   return total.toFixed(4);
  // };

  // Calculate all other charges for "all customs payment"

  // const OtherCharge = () => {
  //   let total = 0;
  //   customsPayment.forEach((item) => {
  //     total += parseFloat(item?.otherCharges);
  //   });
  //   return total.toFixed(4);
  // };
  // const subTotal = totalDuty();
  // const totalOtherCharges = OtherCharge();

  // get other charges from some input fields in header

  // const getOtherCharges = (values) => {
  //   const total =
  //     Number(values?.fineBDT) +
  //     Number(values?.AITExemptionBDT) +
  //     Number(values?.docProcessFee) +
  //     Number(values?.CnFIncomeTax) +
  //     Number(values?.cnfVat) +
  //     Number(values?.scanning);
  //   const other = total / hsCode?.length;
  //   setOtherCharges(Number(other));
  // };

  // Calculate grand total for all customs payment

  // useEffect(() => {
  //   if (!cdId) {
  //     setGrandTotal(Number(totalOtherCharges) + Number(subTotal));
  //   }
  // }, [subTotal]);

  //remover single row data

  // const remover = (i) => {
  //   const filterData = customsPayment?.filter((item, index) => index !== i);
  //   setCustomsPayment(filterData);
  // };

  // Get customs duty and taxes by hsCode

  // const getHsCode = (hsCode, assValue, setFieldValue) => {
  //   GetHsCodeInfo(hsCode, assValue, setFieldValue);
  // };

  // Reset data for customs duty and taxes

  // const resetData = (setFieldValue) => {
  //   setFieldValue("HSCode", "");
  //   setFieldValue("customDuty", "");
  //   setFieldValue("regulatoryDuty", "");
  //   setFieldValue("supplementaryDuty", "");
  //   setFieldValue("vat", "");
  //   setFieldValue("ait", "");
  //   setFieldValue("advanceTradeVat", 0);
  //   setFieldValue("psi", "");
  //   setFieldValue("at", "");
  //   setFieldValue("assessmentValue", "");
  // };

  // const resetHeaders = () => {
  //   setCustomsPayment([]);
  // };

  // const addCustomPayment = (hsCode, values, setFieldValue) => {
  //   const total =
  //     Number(values?.customDuty || 0) +
  //     Number(values?.regulatoryDuty || 0) +
  //     Number(values?.supplementaryDuty || 0) +
  //     Number(values?.vat || 0) +
  //     Number(values?.ait || 0) +
  //     Number(values?.advanceTradeVat || 0) +
  //     Number(values?.psi || 0) +
  //     Number(values?.at || 0);

  //   // Create Data set for all customs payment (row level)
  //   const newData = {
  //     poNumber: state?.PoNo,
  //     lcNumber: state?.LcNo,
  //     shipmentId: state?.shipmentId,
  //     shipmentCode: state?.shipment,
  //     hscode: values?.HSCode?.label,
  //     assesmentTk: values?.assessmentValue,
  //     customDuty: values?.customDuty,
  //     totalDuty: total.toFixed(4),
  //     regulatoryDuty: values?.regulatoryDuty,
  //     supplimentaryDuty: values?.supplementaryDuty,
  //     vat: values?.vat,
  //     ait: values?.ait,
  //     advanceTradeVat: values?.advanceTradeVat,
  //     psi: values?.psi,
  //     at: values?.at,
  //     dutyVat: "",
  //     otherVat: "",
  //     otherCharges: otherCharges,
  //   };
  //   const newHsCode = customsPayment?.filter((item) => item?.hscode === hsCode);
  //   if (newHsCode?.length > 0) {
  //     toast.warning("This HS Code is already added");
  //   } else {
  //     setCustomsPayment([...customsPayment, newData]);
  //     resetData(setFieldValue);
  //   }
  // };

  // rowdto handler for catch data from row's input field in rowTable
  // const rowDtoHandler = (name, value, sl) => {
  //   let data = [...customsPayment];
  //   let _sl = data[sl];
  //   _sl[name] = +value;
  //   setCustomsPayment(data);
  // };

  let currency = hsCode?.map(item => ({
    currencyName: item?.currencyName
  }))
  let currencyName = Object.assign({...currency});

  return (
    <>
      {loading && <Loading />}
      <div className='mt-0'>
        <Form
          {...objProps}
          initData={
            cdId
              ? {
                  ...singleData,
                  // bank: state?.bankDDL,
                }
              : {
                  ...initData,
                  invoiceAmount: state?.invoiceAmount,
                  // bank: state?.bankDDL,
                  cnfAgencyDDL: state?.cnfAgency,
                }
          }
          saveHandler={saveHandler}
          profileData={profileData}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          rowDto={rowDto}
          setRowDto={setRowDto}
          setLoading={setLoading}
          hsCode={hsCode}
          customsNameDDL={customsNameDDL}
          paidByDDL={paidByDDL}
          instrumentTypeDDL={instrumentTypeDDL}
          viewType={type}
          cdId={cdId}
          resetBtnClick={resetBtnClick}
          resetBtnRef={resetBtnRef}
          cnfAgencyDDL={cnfAgencyDDL}
          bankDDL={bankDDL}
          currencyName={currencyName}
          hsCodeInfo={hsCodeInfo}
          // setEdit={setEdit}
          // remover={remover}
          // getHsCode={getHsCode}
          // addCustomPayment={addCustomPayment}
          // customsPayment={customsPayment}
          // bankListDDL={bankListDDL}
          // grandTotal={grandTotal}
          // setGrandTotal={setGrandTotal}
          // subTotal={subTotal}
          // resetHeaders={resetHeaders}
          // rowDtoHandler={rowDtoHandler}
          // getOtherCharges={getOtherCharges}
          // resetData={resetData}
        />
      </div>
    </>
  );
}
