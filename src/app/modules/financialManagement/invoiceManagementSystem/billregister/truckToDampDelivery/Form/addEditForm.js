import React, { useEffect, useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import IWarningModal from "../../../../../_helper/_warningModal";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import { createG2GCustomizeBill } from "../../helper";
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
  port: "",
  motherVessel: "",
  shipPoint: "",
  lighterVessel: "",
};

export default function TruckToDampDeliveryBill() {
  const [isDisabled, setDisabled] = useState(false);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();
  const [uploadedImage, setUploadedImage] = useState([]);
  const [lighterDDL, getLighterDDL] = useAxiosGet();
  const [shipPointDDL, getShipPointDDL] = useAxiosGet();

  const { state: headerData } = useLocation();
  const billType = headerData?.billType?.value;

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, searchTerm) => {
    getGridData(
      `/tms/LigterLoadUnload/GetLighterTruckToDumpDeliveryPagination?BusinessUnitId=${buId}&lighterVesselId=${values?.lighterVessel?.value}&shipPointId=${values?.shipPoint?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&isTruckToDumpApprove=1&BillTypeId=31`,

      (resData) => {
        const modifyData = resData?.map((item) => {
          return {
            ...item,
            isSelected: false,
            billAmount: item?.truckToDumpAmount + item?.dumpOtherCost,
          };
        });
        setGridData(modifyData);
      }
    );
  };

  useEffect(() => {
    getShipPointDDL(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const saveHandler = async (values, cb) => {
    if (uploadedImage?.length < 1) {
      return toast.warn("Please attach a document");
    }
    try {
      const selectedRow = gridData?.filter((item) => item?.isSelected);

      if (selectedRow.length === 0) {
        toast.warning("Please select at least one");
      } else {
        const totalAmount = selectedRow?.reduce(
          (total, cur) => (total += +cur?.billAmount),
          0
        );
        const rows = selectedRow?.map((item) => ({
          challanNo: item?.deliveryCode,
          deliveryId: item?.rowId || 0,
          quantity: +item?.truckToDumpQnt || 0,
          ammount: +item?.billAmount,
          billAmount: +item?.billAmount,
          shipmentCode: item?.deliveryCode,
          motherVesselId: item?.motherVesselId,
          lighterVesselId: item?.lighterVesselId,
          numFreightRateUSD: 0,
          numFreightRateBDT: 0,
          numCommissionRateBDT: 0,
          directRate: item?.directRate,
          dumpDeliveryRate: item?.dumpDeliveryRate,
          damToTruckRate: item?.damToTruckRate,
          truckToDamRate: item?.truckToDamRate,
          lighterToBolgateRate: item?.lighterToBolgateRate,
          bolgateToDamRate: item?.bolgateToDamRate,
          othersCostRate: +item?.totalRate || 0,
          shipPointId: item?.shipPointId,
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
            billDate: values?.fromDate,
            paymentDueDate: values?.toDate,
            // billDate: values?.billDate,
            // paymentDueDate: values?.paymentDueDate,
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
        title={headerData?.billType?.label}
        getProps={setObjprops}
        isDisabled={isDisabled || loading}
      >
        {(isDisabled || loading) && <Loading />}
        <Form
          {...objProps}
          buId={buId}
          accId={accId}
          getData={getData}
          gridData={gridData}
          initData={initData}
          headerData={headerData}
          lighterDDL={lighterDDL}
          setGridData={setGridData}
          saveHandler={saveHandler}
          shipPointDDL={shipPointDDL}
          getLighterDDL={getLighterDDL}
          setUploadedImage={setUploadedImage}
        />
      </IForm>
    </div>
  );
}
