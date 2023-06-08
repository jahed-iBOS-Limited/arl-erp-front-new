import React, { useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { compressfile } from "../../../../../_helper/compressfile";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import IWarningModal from "../../../../../_helper/_warningModal";
import {
  createG2GCustomizeBill,
  getG2GCarrierData,
  uploadAtt,
} from "../../helper";
import Form from "./form";

const initData = {
  supplier: "",
  billNo: "",
  billDate: _todayDate(),
  paymentDueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
  narration: "",
  billAmount: "",
  toDate: _todayDate(),
  fromDate: _todayDate(),
};

export default function G2GCarrierBill() {
  const [isDisabled, setDisabled] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [purchaseOrderDDL, setpurchaseOrderDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [supplierDDL, setSupplierDDL] = useState([]);
  const { state: headerData } = useLocation();
  const billType = headerData?.billType?.value;

  const getData = (values, searchTerm) => {
    getG2GCarrierData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.supplier?.value || 0,
      values?.fromDate,
      values?.toDate,
      setGridData,
      setDisabled,
      searchTerm || ""
    );
  };

  const saveHandler = async (values, cb) => {
    try {
      const modifiedRow = gridData
        ?.filter((item) => item?.checked)
        ?.map((item) => {
          return {
            challanNo: item?.strDeliveryCode || "",
            deliveryId: item?.rowId || 0,
            quantity: +item?.receiveQnt || 0,
            ammount: +item?.carrierTotalAmount,
            billAmount: +item?.carrierTotalAmount,
            shipmentCode: item?.strDeliveryCode || "",
          };
        });
      if (modifiedRow.length === 0) {
        toast.warning("Please select at least one");
      } else {
        // if (
        //   gridData
        //     ?.filter((item) => item?.checked)
        //     ?.some((item) => item.totalShipingValue >= 0)
        // ) {
        //   return toast.warn("Bill Amount is not valid");
        // }
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
          gtogHead: {
            accountId: profileData?.accountId,
            supplierId: values?.supplier?.value || 0,
            supplierName: values?.supplier?.label || "",
            unitId: selectedBusinessUnit?.value,
            unitName: selectedBusinessUnit?.label,
            billNo: values?.billNo,
            billDate: _dateFormatter(values?.billDate),
            paymentDueDate: _dateFormatter(values?.paymentDueDate),
            narration: values?.narration,
            billAmount: gridData
              ?.filter((item) => item?.checked)
              ?.reduce((a, b) => Number(a) + Number(b.carrierTotalAmount), 0),
            plantId: gridData.length > 0 ? gridData[0]?.plantId || 130 : 130,
            warehouseId:
              gridData.length > 0 ? gridData[0]?.warehouseId || 0 : 0,
            actionBy: profileData?.userId,
            sbuId: headerData?.sbu?.value || 0,
            billTypeId: billType || 0,
          },
          gtogRow: modifiedRow,
          image: images,
        };
        console.log(obj);
        createG2GCustomizeBill(obj, cb, IWarningModal, setDisabled);
      }
    } catch (error) {
      setDisabled(false);
    }
  };
  const [objProps, setObjprops] = useState({});
  return (
    <div className="purchaseInvoice">
      <IForm
        title="G2G Carrier Bill"
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
          supplierDDL={supplierDDL}
          setSupplierDDL={setSupplierDDL}
          setDisabled={setDisabled}
          getData={getData}
        />
      </IForm>
    </div>
  );
}
