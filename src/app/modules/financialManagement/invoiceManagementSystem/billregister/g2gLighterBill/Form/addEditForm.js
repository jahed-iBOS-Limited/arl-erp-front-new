import React, { useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import IWarningModal from "../../../../../_helper/_warningModal";
import { createG2GCustomizeBill } from "../../helper";
import Form from "./form";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";

const initData = {
  supplier: "",
  billNo: "",
  billDate: _todayDate(),
  paymentDueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
  narration: "",
  billAmount: "",
  toDate: _todayDate(),
  fromDate: _todayDate(),
  port: "",
  motherVessel: "",
  carrierName: "",
};

export default function G2GLighterBill() {
  const [isDisabled, setDisabled] = useState(false);
  const [uploadedImage, setUploadedImage] = useState([]);
  const [gridData, getGridData, loader, setGridData] = useAxiosGet([]);

  const { state: headerData } = useLocation();
  const billType = headerData?.billType?.value;

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, searchTerm) => {
    const search = searchTerm ? `&SearchTerm=${searchTerm}` : "";
    getGridData(
      `/tms/LigterLoadUnload/PreDataForLighterVesselCarrierBillG2G?AccountId=${accId}&BusinessUnitId=${buId}&MotherVesselId=${values?.motherVessel?.value}&CarrierAgentId=${values?.carrierName?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}${search}`
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
          (total, cur) => (total += +cur?.carrierTotalAmount),
          0
        );
        const rows = selectedRow?.map((item) => ({
          challanNo: item?.deliveryCode,
          deliveryId: item?.deliveryId || 0,
          quantity: +item?.surveyQuantity || 0,
          ammount: +item?.carrierTotalAmount,
          billAmount: +item?.carrierTotalAmount,
          shipmentCode: item?.deliveryCode,
          motherVesselId: +item?.motherVesselId,
          lighterVesselId: +item?.lighterVesselId,
          numFreightRateUSD: 0,
          numFreightRateBDT: 0,
          numCommissionRateBDT: 0,
          directRate: 0,
          dumpDeliveryRate: 0,
          damToTruckRate: 0,
          truckToDamRate: 0,
          lighterToBolgateRate: 0,
          bolgateToDamRate: 0,
          othersCostRate: +item?.carrierRate,
        }));

        const payload = {
          gtogHead: {
            billTypeId: billType || 0,
            accountId: accId,
            supplierId: values?.carrierName?.value,
            supplierName: values?.carrierName?.label,
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

  const loading = loader || isDisabled;

  const [objProps, setObjprops] = useState({});
  return (
    <div className="purchaseInvoice">
      <IForm
        title={headerData?.billType?.label}
        getProps={setObjprops}
        isDisabled={loading}
      >
        {loading && <Loading />}
        <Form
          {...objProps}
          buId={buId}
          accId={accId}
          getData={getData}
          gridData={gridData}
          initData={initData}
          setGridData={setGridData}
          saveHandler={saveHandler}
          setUploadedImage={setUploadedImage}
        />
      </IForm>
    </div>
  );
}
