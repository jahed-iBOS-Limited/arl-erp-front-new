/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import Form from "./form";
import {
  createLCOpen,
  currencyLoadByPoId,
  getSingleData,
  updateLCOpen,
} from "../helper";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
  poNo: "",
  lcNo: "",
  lcDate: _todayDate(),
  lastShipmentDate: _todayDate(),
  lcExpiredDate: _todayDate(),
  dueDate: _todayDate(),
  encoTerms: "",
  materialType: "",
  lcType: "",
  bankName: "",
  bankAccount: "",
  origin: "",
  loadingPort: "",
  finalDestination: "",
  tolarance: 0,
  currency: "",
  PIAmountFC: "",
  PIAmountFCNumber: "",
  lcTenor: 0,
  pgAmount: "",
  pgDueDate: _todayDate(),
  totalBankCharge: "",
  vatOnCharge: "",
  attachment: "",
  indemnityBond: "",
  bondLicense: "",
  duration: _todayDate(),
  exchangeRate: "",
  PIAmountBDT: "",
  PIAmountBDTNumber: "",
  poId: "",
  description: "",
  plantId: "",
  sbuId: "",
  lcMarginPercent: "",
  lcMarginValue: "",
  lcMarginDueDate: "",
};

export default function AddEditForm() {
  const location = useLocation();
  const params = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [currencyByPOId, setCurrencyByPOId] = useState({});
  const [fileObjects, setFileObjects] = useState([]);
  const [uploadImage, setUploadImage] = useState([]);
  const [bankAccountDDL, getAccountDDL, , setAccountDDL] = useAxiosGet();

  // get singleData
  const [singleData, setSingleData] = useState("");
  const [initFormData, setInitFormData] = useState(initData);
  const poId = location?.state?.searchableLandingPoNo?.poId;
  // console.log(location, "location");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (poId) {
      currencyLoadByPoId(
        setCurrencyByPOId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        poId
      );
    }
  }, [poId]);

  useEffect(() => {
    if (params?.pid) {
      getSingleData(params?.pid, setSingleData, setDisabled);
    }
  }, []);
  useEffect(() => {
    if (location?.state?.routeState === "create") {
      const { poNo, searchableLandingPoNo } = location?.state;
      // console.log("searchableLandingPoNo", searchableLandingPoNo);
      // console.log("location?.state?.poNo", location?.state?.poNo);
      setInitFormData({
        ...initFormData,
        currency: poNo?.currencyId
          ? {
              label: poNo?.currencyName,
              value: poNo?.currencyId,
            }
          : "",

        poNo: searchableLandingPoNo?.label,
        // poNo:
        //   location?.state?.poNo?.pinumber || searchableLandingPoNo?.label,
        poId: searchableLandingPoNo?.poId,
        exchangeRate: poNo?.currencyName === "Taka" ? 1 : "",
        PIAmountBDT: poNo?.currencyName === "Taka" ? poNo?.piAmount : "",
        // PIAmountBDT: poNo?.currencyName === "Taka" ? poNo?.piAmountFC : "",
        // lcNo:state?.poNo?.
        lastShipmentDate: _dateFormatter(poNo?.lastShipDate) || _todayDate(),
        lcExpiredDate: _dateFormatter(poNo?.expireDate) || _todayDate(),
        encoTerms: poNo?.incotermId
          ? {
              label: poNo?.incotermName,
              value: poNo?.incotermId,
            }
          : "",
        materialType: poNo?.metarialTypeId
          ? {
              label: poNo?.metarialTypeName,
              value: poNo?.metarialTypeId,
            }
          : "",
        lcType: poNo?.lctypeId
          ? {
              label: poNo?.lctypeName,
              value: poNo?.lctypeId,
            }
          : "",
        bankName: poNo?.bankId
          ? {
              label: poNo?.bankName,
              value: poNo?.bankId,
            }
          : "",
        origin: poNo?.countryOfOriginId
          ? {
              label: poNo?.countryOfOriginName,
              value: poNo?.countryOfOriginId,
            }
          : "",
        loadingPort: poNo?.loadingPort,
        finalDestination: poNo?.destinationPortId
          ? {
              label: poNo?.destinationPortName,
              value: poNo?.destinationPortId,
            }
          : "",
        tolarance: poNo?.tolerance,
        PIAmountFC: poNo?.piAmount,
        description: poNo?.description,
        sbuId: searchableLandingPoNo?.sbuId,
        plantId: searchableLandingPoNo?.plantId,
      });

      getAccountDDL(
        `/imp/ImportCommonDDL/GetBankAccountIdNameDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&BankId=${poNo?.bankId}`
      );
    }
  }, [location?.state?.routeState]);

  const saveHandler = async (values, cb) => {
    if (!uploadImage[0]?.id && !values?.attachment) {
      return toast.error("Please upload a document");
    } 
    if (values?.lcMarginValue > 0 && !values?.lcMarginDueDate) {
      return toast.warn("LC Margine Due Date is required");
    }
    if (params?.pid) {
      return updateLCOpen(
        setDisabled,
        values,
        profileData,
        selectedBusinessUnit,
        uploadImage
        // cb
      );
    }
    if (values?.totalBankCharge < values?.vatOnCharge) {
      return toast.warn("Total Charge Must Be Greater Then VAT Charge");
    }
    return createLCOpen(
      setDisabled,
      values,
      profileData,
      selectedBusinessUnit,
      uploadImage,
      cb
    );
  };

  // console.log(location?.state?.poNo, "poNo");
  console.log(currencyByPOId);
  return (
    <IForm
      title={
        params?.type === "edit"
          ? "Edit LC Opening"
          : params?.type === "view"
          ? "View LC Opening"
          : "LC Opening"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          params?.pid
            ? singleData
            : {
                ...initFormData,
                currency: initFormData?.currency
                  ? initFormData.currency
                  : currencyByPOId?.currency,
                PIAmountFC: initFormData?.PIAmountFC
                  ? initFormData.PIAmountFC
                  : currencyByPOId?.currency?.piAmountFC,
              }
        }
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
        setUploadImage={setUploadImage}
        viewType={params?.type}
        location={location}
        setDisabled={setDisabled}
        forDisable={location?.state?.poNo}
        bankAccountDDL={bankAccountDDL}
        getAccountDDL={getAccountDDL}
        setAccountDDL={setAccountDDL}
      />
    </IForm>
  );
}
