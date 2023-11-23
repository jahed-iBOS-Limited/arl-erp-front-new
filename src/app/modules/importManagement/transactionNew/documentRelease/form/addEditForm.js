/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import {
  documentReleaseCreate,
  initData,
  documentReleaseGetByShipmentId,
  getDocumentReleaseById,
  getCnfDDL,
} from "../helper";
import Form from "./form";
import IForm from "./../../../../_helper/_form";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function DocumentReleaseForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [isDisabledForAmount, setDisabledForAmount] = useState(true);
  const [objProps, setObjprops] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const [shipmentData, setShipmentData] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [cnfDDL, setCnfDDL] = useState([]);

  const location = useLocation();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const setter = (values) => {
    // values["netAmountFc"] =
    //   Number(values?.paymentAmount) -
    //   (Number(values?.pgAmount) + (Number(values?.otherCharges) || 0));
    values["sbuId"] = location?.state?.sbuId;
    values["plantId"] = location?.state?.plantId;

    // if (values?.paymentAmount < values?.pgAmount) {
    //   return toast.warn("PG Amount can not be greater than Payment Amount");
    // } else if (
    //   values?.paymentAmount <
    //   values?.otherCharges + values?.pgAmount
    // ) {
    //   return toast.warn(
    //     "PG & Other Amount can not be greater than Payment Amount"
    //   );
    // } else
    if (values?.tenorDays <= 0) {
      return toast.warn("Tenor Days Must Be Greater Than Zero");
    }

    // if (values?.tenorDays <= shipmentData?.tenorDaysForRowDto) {
      if (rowDto?.length > 0) {
        const lastTenorDays = rowDto[rowDto?.length - 1].tenorDays;
        if (lastTenorDays < values?.tenorDays) {
          setRowDto(rowDto)
          // bankAndLaborRateCalculation(values, rowDto)
        } else {
          return toast?.warn(
            "Tenor Days Must Be Greater then the Last Tenor Days"
          );
        }
      }
    // } else {
    //   return toast.warn("Tenor Days Can not be Greater then LC Tenor Days");
    // }

    //calculation net pay amount
    let bankRate = values?.numBankRate
      ? (((values?.paymentAmount + (values?.otherCharges || 0)) *
          values?.numBankRate) /
          100 /
          365) *
        values?.tenorDays
      : 0;

    let liborRate = values?.numLiborRate
      ? (((values?.paymentAmount + (values?.otherCharges || 0)) *
          values?.numLiborRate) /
          100 /
          365) *
        values?.tenorDays
      : 0;

    let netPayAmount =
      bankRate + liborRate + (values?.paymentAmount + (values?.otherCharges || 0));

    //create new object
    const obj = {
      ...values,
      pgAmount: values?.pgAmountCheck ? values?.paymentAmount : 0,
      netAmountFc:
        Number(values?.otherCharges || 0) + Number(values?.paymentAmount || 0),
      pgStatus: values?.pgAmountCheck ? "Yes" : "No",
      otherAmount: Number(values?.otherCharges || 0),
      isPG: values?.pgAmountCheck,
      netPayAmount: netPayAmount,
      bankRate: values?.numBankRate,
      liborRate: values?.numLiborRate
    };

    let newData = [...rowDto, obj];

    const totalAmount = newData.reduce(
      (accumulator, currentValue) => accumulator + currentValue.paymentAmount,
      0
    );

    if (values?.invoiceAmount < totalAmount) {
      return toast.warn("Payment Amount and Invoice Amount must be equal");
    } else {
      setRowDto(newData);
      return;
    }
  };

  // console.log(location, "location");
  // console.log(location?.state?.lcId, "location?.state?.lcId");
  const saveHandler = async (values, cb) => {
    values["sbuId"] = location?.state?.sbuId;
    values["plantId"] = location?.state?.plantId;
    if (values?.lcType?.label === "At Sight") {
      if (values?.docReleaseChargeAtSight < values?.vatOnDocReleaseAtSight) {
        return toast.warn("DOC Release Charge Must be Greater Than VAT Charge");
      }
    } else {
      if (values?.docReleaseCharge < values?.vatOnDocRelease) {
        return toast.warn("DOC Release Charge Must be Greater Than VAT Charge");
      }
    }

    return documentReleaseCreate(
      values,
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDisabled,
      location?.state?.shipmentId,
      rowDto,
      location?.state?.poId,
      location?.state?.lcId,
      cb
    );
  };
  useEffect(() => {
    if (location?.state?.shipmentId && location?.routeState !== "view") {
      documentReleaseGetByShipmentId(
        location?.state?.shipmentId,
        setShipmentData,
        setDisabled
      );
    } else if (location?.state?.shipmentId && location?.routeState === "view") {
      getDocumentReleaseById(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        location?.state?.shipmentId,
        shipmentData,
        setShipmentData,
        setRowDto,
        setDisabled
      );
    }
  }, [location?.state?.shipmentId]);

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  useEffect(() => {
    if (shipmentData?.lcType?.label !== "At Sight") {
      const totalAmount = rowDto.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue?.paymentAmount,
        0
      );
      if (totalAmount !== shipmentData?.invoiceAmount) {
        setDisabledForAmount(true);
      } else {
        setDisabledForAmount(false);
      }
    } else {
      setDisabledForAmount(false);
    }
  }, [rowDto, shipmentData]);
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getCnfDDL(profileData?.accountId, selectedBusinessUnit?.value, setCnfDDL);
    }
  }, [profileData, selectedBusinessUnit]);
  // console.log(shipmentData, initData);
  return (
    <IForm
      title="Beneficery Payment"
      getProps={setObjprops}
      // isDisabled={isDisabled}
      isDisabled={isDisabled || isDisabledForAmount}
      isHiddenReset={location?.routeState === "view"}
      // isHiddenBack={location?.routeState === "view"}
      isHiddenSave={location?.routeState === "view"}
    >
      <Form
        {...objProps}
        initData={location?.state?.shipmentId ? shipmentData : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        location={location}
        isDisabled={isDisabled}
        setDisabled={setDisabled}
        setPaymentData={setPaymentData}
        paymentData={paymentData}
        rowDto={rowDto}
        setRowDto={setRowDto}
        setter={setter}
        remover={remover}
        type={location?.routeState}
        cnfDDL={cnfDDL}
        setCnfDDL={setCnfDDL}
      />
    </IForm>
  );
}
