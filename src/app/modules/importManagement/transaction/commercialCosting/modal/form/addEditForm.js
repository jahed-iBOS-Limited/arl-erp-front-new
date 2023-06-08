/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  createLCOpen,
  currencyLoadByPoId,
  getSingleData,
  updateLCOpen,
} from "../helper";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "./../../../../../_helper/_form";
import Loading from "./../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";

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
  origin: "",
  loadingPort: "",
  finalDestination: "",
  tolarance: "",
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
};

export default function AddEditForm({ lcId }) {
  const location = useLocation();
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [currencyByPOId, setCurrencyByPOId] = useState({});
  const [fileObjects, setFileObjects] = useState([]);
  const [uploadImage, setUploadImage] = useState([]);
  // get singleData
  const [singleData, setSingleData] = useState("");
  const [initFormData, setInitFormData] = useState(initData);
  const poId = location?.state?.searchableLandingPoNo?.poId;

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
    if (lcId) {
      getSingleData(lcId, setSingleData, setDisabled);
    }
  }, []);
  useEffect(() => {
    if (location?.state?.routeState === "create") {
      const { poNo, searchableLandingPoNo } = location?.state;
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
    }
  }, [location?.state?.routeState]);

  const saveHandler = async (values, cb) => {
    if (lcId) {
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

  return (
    <IForm
      title={"View LC Opening"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset
      isHiddenSave
      isHiddenBack
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          lcId
            ? singleData
            : {
                ...initFormData,
                currency: initFormData?.currency
                  ? initFormData.currency
                  : currencyByPOId?.currency,
              }
        }
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
        setUploadImage={setUploadImage}
        viewType={lcId}
        location={location}
        setDisabled={setDisabled}
        forDisable={location?.state?.poNo}
      />
    </IForm>
  );
}
