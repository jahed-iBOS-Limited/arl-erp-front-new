import React, { useEffect, useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../../_helper/customHooks/useAxiosPost";
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
  port: { value: 1, label: "Chittagong " },
  motherVessel: "",
};

export default function HatchLaborBill() {
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();
  const [images, setImages] = useState([]);
  const [, billPost, loader] = useAxiosPost();
  const [vesselDDL, getVesselDDL] = useAxiosGet();

  const { state: headerData } = useLocation();
  const billType = headerData?.billType?.value;

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getVesselDDL(
      `/wms/FertilizerOperation/GetMotherVesselProgramInfo?PortId=${1}&businessUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const getData = (values) => {
    getGridData(
      `/tms/LigterLoadUnload/GetGTOGProgramInfoForBillRegister?AccountId=${accId}&BusinessUnitId=${buId}&MotherVesselId=${
        values?.motherVessel?.value
      }&BillType=${billType}&PortId=${values?.port?.value || 0}&SupplierId=${
        values?.supplier?.value
      }&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`,
      (resData) => {
        const modifyData = resData?.map((item) => {
          return {
            ...item,
            billAmount: item?.hatchLabourRate * item?.programQnt,
            isSelected: false,
          };
        });
        setGridData(modifyData);
      }
    );
  };

  const saveHandler = async (values, cb) => {
    if (images?.length < 1) {
      return toast.warn("Please attach a document");
    }
    const selectedItems = gridData?.filter((item) => item?.isSelected);
    if (selectedItems?.length < 1) {
      return toast.warn("Please select at least one row!");
    }
    const totalBill = selectedItems?.reduce(
      (acc, item) => acc + +item?.totalAmount,
      0
    );
    const payload = {
      gtogHead: {
        billTypeId: billType,
        accountId: accId,
        supplierId: values?.supplier?.value,
        supplierName: values?.supplier?.label,
        sbuId: 68,
        unitId: buId,
        unitName: buName,
        billNo: values?.billNo,
        billDate: values?.billDate,
        paymentDueDate: values?.paymentDueDate,
        narration: values?.narration,
        billAmount: totalBill || 0,
        plantId: 0,
        warehouseId: 0,
        actionBy: userId,
      },
      gtogRow: selectedItems?.map((item) => {
        return {
          accountId: accId,
          businessUnitId: buId,
          intSbuId: headerData?.sbu?.value,
          motherVesselId: item?.motherVesselId,
          actionby: userId,
          narration: values?.narration || "",
          challanNo: "",
          deliveryId: item?.programId,
          quantity: item?.receiveQnt,
          ammount: item?.totalAmount,
          billAmount: item?.totalAmount || 0,
          shipmentCode: "",
          lighterVesselId: item?.hatchLabourId,
          numFreightRateUSD: 0,
          numFreightRateBDT: item?.hatchLabourRate || 0,
          numCommissionRateBDT: 0,
          damToTruckRate: 0,
          truckToDamRate: 0,
          bolgateToDamRate: 0,
          othersCostRate: item?.hatchLabourRate,
          directRate: item?.hatchLabourRate || 0,
          dumpDeliveryRate: 0,
          lighterToBolgateRate: 0,
        };
      }),

      image: images?.map((image) => {
        return {
          imageId: image?.id,
        };
      }),
    };

    billPost(
      `/wms/GTOGTransport/PostGTOGTransportBillEntry`,
      payload,
      () => {
        getData(values);
      },
      true
    );
  };
  const [objProps, setObjprops] = useState({});
  return (
    <div className="purchaseInvoice">
      <IForm
        title="G2G Hatch Labor Bill"
        getProps={setObjprops}
        isDisabled={loader || loading}
      >
        {(loader || loading) && <Loading />}
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          accId={accId}
          buId={buId}
          headerData={headerData}
          gridData={gridData}
          setGridData={setGridData}
          getData={getData}
          setImages={setImages}
          vesselDDL={vesselDDL}
        />
      </IForm>
    </div>
  );
}
