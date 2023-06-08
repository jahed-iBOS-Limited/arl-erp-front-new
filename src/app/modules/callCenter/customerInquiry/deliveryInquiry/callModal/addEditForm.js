import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Form from "./form";
import * as Yup from "yup";
import {
  CreateDailyDeliveryStatus_api,
  GetDeliveryStatusReport_api,
} from "../helper";
import Loading from "./../../../../_helper/_loading";

const DailyDeliveryStatusForm = ({
  clickRowData,
  setOpen,
  pageNo,
  pageSize,
  commonGridFunc,
  landingValues,
}) => {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const initData = {
    agentName: `${profileData?.userId}, ${profileData?.userName}`,
    unit: clickRowData?.unit || "",
    customerName: clickRowData?.customerName || "",
    vehicleNo: clickRowData?.vehicleNo || "",
    challanNo: clickRowData?.challanNumber || "",
    challanVerification: "",
    customerAddress: clickRowData?.customerAddress || "",
    customerPhone: clickRowData?.customerPhone1 || "",
    productDescription: clickRowData?.productDescription || "",
    receivedStatus: { value: false, label: "No" },
    problemDetails: "",
    remarks: "",
    challanVerify: false,
  };

  const validationSchema = Yup.object().shape({
    agentName: Yup.string().required("Agent name is required"),
    unit: Yup.string().required("Unit is required"),
    customerName: Yup.string().required("Customer aame is required"),
    vehicleNo: Yup.string().required("Vehicle no is required"),
    challanNo: Yup.string().required("Challan no is required"),
    challanVerification: Yup.string().when(
      "receivedStatus",
      (receivedStatus, Schema) => {
        if (receivedStatus?.value === "true")
          return Schema.required("Challan aerification is required");
      }
    ),

    customerAddress: Yup.string().required("Customer address is required"),
    customerPhone: Yup.string().required("Customer phone is required"),
    productDescription: Yup.string().required(
      "Product description is required"
    ),
    receivedStatus: Yup.object().shape({
      label: Yup.string().required("Received status is required"),
      value: Yup.string().required("Received status is required"),
    }),
    // problemDetails: Yup.string().required("Problem details is required"),
  });

  const saveHandler = (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const {
        customerId,
        customerName,
        customerAddress,
        driverPhone,
        vehicleId,
        vehicleNo,
        challanId,
        challanNumber,
        productDescription,
      } = clickRowData;
      const payload = {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        userId: profileData?.userId,
        userName: profileData?.userName,
        customerId: customerId,
        customerName: customerName,
        customerAddress: customerAddress,
        customerPhoneNo: driverPhone,
        vehicleId: vehicleId,
        vehicleName: vehicleNo,
        deliveryId: challanId,
        deliveryNo: challanNumber,
        verifyDeliveryNo: values?.challanVerification || "",
        productDescription: productDescription,
        isReceived: values?.receivedStatus?.value || false,
        strProblemDetails: values?.problemDetails || "",
        strRemarks: values?.remarks || "",
        intActionBy: profileData?.userId,
      };
      CreateDailyDeliveryStatus_api(payload, cb, setDisabled);
    }
  };

  useEffect(() => {
    if (clickRowData?.challanId) {
      GetDeliveryStatusReport_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        clickRowData?.challanId,
        setRowDto,
        setDisabled
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickRowData]);
  return (
    <div>
      {isDisabled && <Loading />}
      <Form
        initData={initData}
        saveHandler={saveHandler}
        validationSchema={validationSchema}
        setOpen={setOpen}
        commonGridFunc={commonGridFunc}
        pageNo={pageNo}
        pageSize={pageSize}
        landingValues={landingValues}
        rowDto={rowDto}
      />
    </div>
  );
};

export default DailyDeliveryStatusForm;
