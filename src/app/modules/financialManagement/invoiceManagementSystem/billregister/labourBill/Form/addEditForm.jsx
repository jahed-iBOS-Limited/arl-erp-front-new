/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  getShippointDDL,
  PostLabourBillEntry_api,
  uploadAtt,
} from "../../helper";
import IForm from "./../../../../../_helper/_form";
import { _todayDate } from "./../../../../../_helper/_todayDate";
import Loading from "./../../../../../_helper/_loading";
import { useLocation } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import IWarningModal from "../../../../../_helper/_warningModal";
import { toast } from "react-toastify";
import { compressfile } from "../../../../../_helper/compressfile";
import { _todaysEndTime,_todaysStartTime } from './../../../../../_helper/_currentTime';

const initData = {
  supplier: "",
  billNo: "",
  billDate: _todayDate(),
  paymentDueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
  narration: "",
  billAmount: "",
  warehouse: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  fromTime: _todaysStartTime(),
  toTime: _todaysEndTime(),

};

export default function LabourBillForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);

  const [shippointDDL, setShippointDDL] = useState([]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [purchaseOrderDDL, setpurchaseOrderDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  const { state: headerData } = useLocation();

  const billType = headerData?.billType?.value;
  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit.value) {
      getShippointDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setShippointDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    try {
      const modifiedRow = gridData
        ?.filter((item) => item?.checked)
        ?.map((item) => {
          return {
            shipmentCode: item?.shipmentCode,
            challanNo: item?.challanNo,
            tripId: item?.tripId,
            ammount: +item?.labourBillAmount,
            billAmount: +item?.approvedAmount,
          };
        });
      if (modifiedRow.length === 0) {
        toast.warning("Please select at least one");
      } else {
        if (
          gridData
            ?.filter((item) => item?.checked)
            ?.some((item) => item.labourBillAmount < item.approvedAmount)
        ) {
          return toast.warn("Bill Amount must be below from Net Amount");
        }
        if (fileObjects?.length < 1) {
          return toast.warn("Attachment must be added");
        }
        let images = [];
        setDisabled(true);
        const compressedFile = await compressfile(
          fileObjects?.map((f) => f.file)
        );
        const uploadedImage = await uploadAtt(compressedFile);
        setDisabled(false);
        if (uploadedImage.data?.length > 0) {
          images = uploadedImage?.data?.map((data) => {
            return {
              imageId: data?.id,
            };
          });
        }

        const obj = {
          head: {
            accountId: profileData?.accountId,
            supplierId: values?.supplier?.value,
            supplierName: values?.supplier?.label,
            unitId: selectedBusinessUnit?.value,
            unitName: selectedBusinessUnit?.label,
            billNo: values?.billNo,
            billDate: _dateFormatter(values?.billDate),
            paymentDueDate: _dateFormatter(values?.paymentDueDate),
            narration: values?.narration,
            billAmount: gridData
              ?.filter((item) => item?.checked)
              ?.reduce((a, b) => Number(a) + Number(b.approvedAmount), 0),
            plantId: headerData?.plant?.value,
            actionBy: profileData?.userId,
            sbuId: headerData?.sbu?.value,
            billTypeId: billType || 0,
          },
          row: modifiedRow,
          image: images,
        };
        PostLabourBillEntry_api(obj, cb, IWarningModal, setDisabled);
      }
    } catch (error) {
      setDisabled(false);
    }
  };
  const [objProps, setObjprops] = useState({});
  return (
    <IForm
      title={
        billType === 9
          ? "Labour Bill (Bill Register)"
          : "Load Unload (Bill Register)"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        setpurchaseOrderDDL={purchaseOrderDDL}
        setpurchaseOrdrDDL={setpurchaseOrderDDL}
        gridData={gridData}
        setGridData={setGridData}
        profileData={profileData}
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
        purchaseOrderDDL={purchaseOrderDDL}
        headerData={headerData}
        shippointDDL={shippointDDL}
        setDisabled={setDisabled}
      />
    </IForm>
  );
}
