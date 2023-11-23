/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import Loading from "../../../../../../_helper/_loading";
import {
  CreateInstancePolicy,
  GetInsurancePolicyLandingData,
  GetShipmentDDL,
  GetShipmentWiseInsurancePolicyById,
  EditInsurancePolicy,
} from "../helper";
import { _dateFormatter } from "../../../../../../_helper/_dateFormate";
import { useState } from "react";
import { useLocation, useParams } from "react-router";
import { toast } from "react-toastify";
import { EditShipmentWiseInsurancePolicy } from './../helper';

export default function ShipmentWisePolicy() {
  const { id } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [edit, setEdit] = useState(false);
  const [shipmentDDL, setShipmentDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const { state } = useLocation();
  //   // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  //   // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    GetShipmentDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      state?.item?.poNumber,
      setShipmentDDL
    );
    // Get Landing Data for Shipment Wise Insurance Policy
    GetInsurancePolicyLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      state?.item?.poNumber,
      setGridData
    );
  }, []);

  // Get Shipment Wise Insurance Policy By Id
  useEffect(() => {
    if (id && state?.checkbox === "shipmentWiseInsurancePolicy") {
      GetShipmentWiseInsurancePolicyById(id, setSingleData);
    }
  }, [id]);

  const initData = {
    shipment: "",
    // policyNumber: state?.policyNumber,
    policyNumber: state?.item?.providerPolicyPrefix,
    policyNumberActual: state?.item?.providerPolicyPrefix,
    policyDate: _dateFormatter(new Date()),
    dueDate: _dateFormatter(new Date()),
    billNo: "",
    invoiceAmount: "",
    // insuredBDT: "",
    totalAmount: "",
    vat: "",
  };

  // Save Handler
  const saveHandler = async (values, cb) => {
    if (Number(values?.vat) > Number(values?.totalAmount)) {
      return toast.warning("VAT can't be greater than Total Amount", {
        toastId: "vatAndTotalAmountCheck",
      });
    }
    if (id && profileData?.accountId && selectedBusinessUnit?.value) {
      const data = {
        rowId: state?.item?.rowId,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        shipmentId: values?.shipment?.value,
        billNumber: values?.billNo,
        policyNumber: values?.policyNumber,
        dtePolicyDate: values?.policyDate,
        dueDate: values?.dueDate,
        // accountId: profileData?.accountId,
        // businessUnitId: selectedBusinessUnit?.value,
        // shipmentId: values?.shipment?.value,
        // billNumber: values?.billNo,
        // dtePolicyDate: _dateFormatter(values?.policyDate),
        // numInvoiceAmount: values?.invoiceAmount,
        // numVatamount: +values?.vat,
        // numTotalAmount: +values?.totalAmount,
        // dueDate: _dateFormatter(values?.dueDate),
      };
      // Edit
      EditShipmentWiseInsurancePolicy(data, ()=>{
        GetInsurancePolicyLandingData(
              profileData?.accountId,
              selectedBusinessUnit?.value,
              state?.item?.ponumber,
              setGridData
            );
      })
      // EditInsurancePolicy(data, cb, () => {
      //   GetInsurancePolicyLandingData(
      //     profileData?.accountId,
      //     selectedBusinessUnit?.value,
      //     state?.item?.ponumber,
      //     setGridData
      //   );
      // });
    } else {
      const payload = {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        ponumber: state?.item?.poNumber,
        shipmentId: values?.shipment?.value,
        policyNumber: values?.policyNumber,
        dtePolicyDate: values?.policyDate,
        billNumber: values?.billNo ? values?.billNo : null,
        numInvoiceAmount: +values?.invoiceAmount,
        // numInsuredBdt: values?.insuredBDT,
        numVatamount: +values?.vat,
        numTotalAmount: +values?.totalAmount,
        dueDate: _dateFormatter(values?.dueDate),
        poId: state?.item?.poId,
        sbuId: state?.item?.sbuId,
        plantId: state?.item?.plantId,
        actionBy: profileData?.employeeId,
      };
      // Save
      CreateInstancePolicy(payload, cb, () => {
        GetInsurancePolicyLandingData(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          state?.item?.poNumber,
          setGridData
        );
      });
    }
  };

  return (
    <>
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={id ? singleData : initData}
          saveHandler={saveHandler}
          shipmentDDL={shipmentDDL}
          gridData={gridData}
          edit={id ? true : false}
          // policyNumber={state?.policyNumber}
          item={state?.item}
          poNumber={state?.item?.poNumber}
          routeState={state?.routeState}
        />
      </div>
    </>
  );
}
