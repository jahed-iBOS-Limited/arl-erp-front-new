import React, { useEffect, useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import IWarningModal from "../../../../../_helper/_warningModal";
import { compressfile } from "../../../../../_helper/compressfile";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import { createG2GCustomizeBill, uploadAtt } from "../../helper";
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
};

export default function GhatLoadUnloadBill() {
  const [isDisabled, setDisabled] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  // const [gridData, setGridData] = useState([]);
  const [supplierDDL, setSupplierDDL] = useState([]);
  const [portDDL, getPortDDL] = useAxiosGet();
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();

  const { state: headerData } = useLocation();
  const billType = headerData?.billType?.value;

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getPortDDL(`/wms/FertilizerOperation/GetDomesticPortDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const getData = (values, searchTerm) => {
    const supplierId = values?.supplier?.value
      ? `&SupplierId=${values?.supplier?.value}`
      : "";
    getGridData(
      `/tms/LigterLoadUnload/GetGTOProgramMotherVessel?MotherVesselId=${values?.motherVessel?.value}${supplierId}&AccountId=${accId}&BusinessUnitId=${buId}`,
      (resData) => {
        const modifyData = resData?.map((item) => {
          return {
            ...item,
            isSelected: false,
          };
        });
        setGridData(modifyData);
      }
    );
  };

  const saveHandler = async (values, cb) => {
    try {
      const modifiedRow = gridData
        ?.filter((item) => item?.isSelected)
        ?.map((item) => {
          return {
            challanNo: item?.strDeliveryCode || "",
            deliveryId: item?.intMotherVesselId || 0,
            quantity: +item?.decProgramQnt || 0,
            ammount: +item?.numBillAmount,
            billAmount: +item?.numBillAmount,
            shipmentCode: item?.strDeliveryCode || "",
          };
        });
      if (modifiedRow.length === 0) {
        toast.warning("Please select at least one");
      } else {
        // if (
        //   gridData
        //     ?.filter((item) => item?.isSelected)
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
            accountId: accId,
            supplierId: values?.supplier?.value || 0,
            supplierName: values?.supplier?.label || "",
            unitId: buId,
            unitName: buName,
            billNo: values?.billNo,
            billDate: _dateFormatter(values?.billDate),
            paymentDueDate: _dateFormatter(values?.paymentDueDate),
            narration: values?.narration,
            billAmount: gridData
              ?.filter((item) => item?.isSelected)
              ?.reduce((a, b) => Number(a) + Number(b.numBillAmount), 0),
            plantId: headerData?.plant?.value,
            warehouseId: 0,
            actionBy: userId,
            sbuId: headerData?.sbu?.value || 0,
            billTypeId: billType || 0,
          },
          gtogRow: modifiedRow,
          image: images,
        };

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
        title="Ghat Load Unload Bill"
        getProps={setObjprops}
        isDisabled={isDisabled || loading}
      >
        {(isDisabled || loading) && <Loading />}
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          accId={accId}
          buId={buId}
          gridData={gridData}
          setGridData={setGridData}
          setFileObjects={setFileObjects}
          fileObjects={fileObjects}
          headerData={headerData}
          supplierDDL={supplierDDL}
          setSupplierDDL={setSupplierDDL}
          setDisabled={setDisabled}
          getData={getData}
          portDDL={portDDL}
        />
      </IForm>
    </div>
  );
}
