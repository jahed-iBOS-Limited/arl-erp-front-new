import React, { useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import IWarningModal from "../../../../../_helper/_warningModal";
import { createG2GCustomizeBill, getG2GBillData } from "../../helper";
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

export default function G2GGodownUnloadBill() {
  const [isDisabled, setDisabled] = useState(false);
  const [uploadedImage, setUploadedImage] = useState([]);
  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [gridData, setGridData] = useState([]);
  const { state: headerData } = useLocation();
  const billType = headerData?.billType?.value;

  const getData = (values, searchTerm) => {
    getG2GBillData(
      accId,
      buId,
      values?.supplier?.value || 0,
      values?.fromDate,
      values?.toDate,
      2,
      setGridData,
      setDisabled,
      searchTerm || ""
    );
  };

  const saveHandler = async (values, cb) => {
    if (uploadedImage?.length < 1) {
      return toast.warn("Please attach a document");
    }
    try {
      const selectedRow = gridData?.filter((item) => item?.checked);

      if (selectedRow.length === 0) {
        toast.warning("Please select at least one");
      } else {
        const totalAmount = selectedRow?.reduce(
          (total, cur) => (total += +cur?.goDownLabourAmount),
          0
        );
        const rows = selectedRow?.map((item) => ({
          challanNo: item?.deliveryCode,
          deliveryId: item?.deliveryId || 0,
          quantity: +item?.quantity || 0,
          ammount: +item?.goDownLabourAmount,
          billAmount: +item?.goDownLabourAmount,
          shipmentCode: item?.deliveryCode,
          motherVesselId: 0,
          lighterVesselId: 0,
          numFreightRateUSD: 0,
          numFreightRateBDT: 0,
          numCommissionRateBDT: 0,
          directRate: 0,
          dumpDeliveryRate: 0,
          damToTruckRate: 0,
          truckToDamRate: 0,
          lighterToBolgateRate: 0,
          bolgateToDamRate: 0,
          othersCostRate: +item?.godownUnloadLabourRate,
        }));

        const payload = {
          gtogHead: {
            billTypeId: billType || 0,
            accountId: accId,
            supplierId: values?.supplier?.value,
            supplierName: values?.supplier?.label,
            sbuId: headerData?.sbu?.value || 0,
            unitId: buId,
            unitName: buName,
            billNo: values?.billNo,
            billDate: values?.billDate,
            paymentDueDate: values?.paymentDueDate,
            narration: values?.narration,
            billAmount: totalAmount,
            plantId: headerData?.plant?.value || 0,
            warehouseId: 0,
            actionBy: userId,
          },
          gtogRow: rows,
          image: [
            {
              imageId: uploadedImage[0]?.id,
            },
          ],
        };

        createG2GCustomizeBill(payload, cb, IWarningModal, setDisabled);
      }
    } catch (error) {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});
  return (
    <div className="purchaseInvoice">
      <IForm
        title="G2G Godown Unload Bill"
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          buId={buId}
          accId={accId}
          getData={getData}
          gridData={gridData}
          initData={initData}
          headerData={headerData}
          setGridData={setGridData}
          saveHandler={saveHandler}
          setUploadedImage={setUploadedImage}
        />
      </IForm>
    </div>
  );
}
