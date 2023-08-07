/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */

import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _todayDate } from "../../../_chartinghelper/_todayDate";
import Loading from "../../../_chartinghelper/loading/_loading";
import { getSurveyNoDDL, getTripInformation, saveInvoice } from "../helper";
import Form from "./form";

const initData = {
  surveyNo: "",
  narration: "",
  billNo: "",
  billDate: _todayDate(),
  month: "",
  year: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const headers = [
  { name: "SL" },
  { name: "Description" },
  { name: "Voyage No" },
  { name: "Qty in Mts" },
  { name: "Rate" },
  { name: "Total(Taka)" },
];

export default function InvoiceForm() {
  const [loading, setLoading] = useState(false);
  const [surveyNoDDL, setSurveyNoDDL] = useState([]);
  const [tripInformation, setTripInformation] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getSurveyNoDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSurveyNoDDL,
      setLoading
    );
  }, [profileData, selectedBusinessUnit]);

  const GetTripInformation = (values) => {
    // const reportDate = _dateFormatter(
    //   new Date(values?.year?.value, values?.month?.value - 1, 1)
    // );
    getTripInformation(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      values?.surveyNo?.label,
      // reportDate,
      setTripInformation,
      setLoading
    );
  };

  const saveHandler = (values, cb) => {
    const payload = {
      header: {
        invoiceId: 0,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        surveyNo: values?.surveyNo?.label,
        narration: values?.narration,
        billNo: values?.billNo,
        billDate: values?.billDate,
        consigneePartyId: tripInformation?.objHeder?.consigneePartyId,
        consigneePartyName: tripInformation?.objHeder?.consigneePartyName,
        consigneeAddress: tripInformation?.objHeder?.consigneeAddress || "",
        motherVesselId: tripInformation?.objHeder?.motherVesselId,
        motherVesselName: tripInformation?.objHeder?.motherVesselName,
        voyageNo: tripInformation?.objHeder?.voyageNo,
        lcnumber: tripInformation?.objHeder?.lcnumber,
        cargoId: tripInformation?.objHeder?.cargoId,
        cargoName: tripInformation?.objHeder?.cargoName,
        numTotalAmount: tripInformation?.objList?.reduce(
          (a, b) => a + b?.numAmount,
          0
        ),
        actionby: profileData?.userId,
      },
      rows: tripInformation?.objList,
    };
    saveInvoice(payload, setLoading, cb);
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title={"Create Invoice"}
        initData={initData}
        saveHandler={saveHandler}
        setLoading={setLoading}
        surveyNoDDL={surveyNoDDL}
        headers={headers}
        tripInformation={tripInformation}
        GetTripInformation={GetTripInformation}
        selectedBusinessUnit={selectedBusinessUnit}
        setTripInformation={setTripInformation}
        loading={loading}
      />
    </>
  );
}
