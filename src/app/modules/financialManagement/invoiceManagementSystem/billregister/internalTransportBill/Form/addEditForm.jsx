import React, { useEffect, useState } from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { compressfile } from "../../../../../_helper/compressfile";
import useAxiosPost from "../../../../../_helper/customHooks/useAxiosPost";
import {
  getPurchaseOrgDDL,
  getShippointDDL,
  getSupplierDDlForTransportBill,
  getWarehouseDDL,
  uploadAtt,
} from "../../helper";
import IForm from "./../../../../../_helper/_form";
import Loading from "./../../../../../_helper/_loading";
import { _todayDate } from "./../../../../../_helper/_todayDate";
import Form from "./form";
import "./purchaseInvoice.css";

const initData = {
  supplier: "",
  billNo: "",
  billDate: _todayDate(),
  paymentDueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
  narration: "",
  billAmount: "",
  warehouse: "",
  toDate: _todayDate(),
  fromDate: _todayDate(),
};

export default function InternalTransportBillForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [purchaseOrg, setpurchaseOrg] = useState([]);
  const [shippointDDL, setShippointDDL] = useState([]);
  const [, postData, loading] = useAxiosPost();

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [purchaseOrderDDL, setpurchaseOrderDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  // const [challanDDL, setChallanDDL] = useState([]);
  const [supplierDDL, setSupplierDDL] = useState([]);
  const [warehouseDDL, setWareHouseDDL] = useState([]);
  const [images, setImages] = useState([]);
  const { state: headerData } = useLocation();
  const billType = headerData?.billType?.value;

  useEffect(() => {
    if (accId && buId && headerData?.plant?.value) {
      getWarehouseDDL(
        userId,
        accId,
        buId,
        headerData?.plant?.value,
        setWareHouseDDL
      );
      getPurchaseOrgDDL(accId, buId, headerData?.sbu?.value, setpurchaseOrg);
      getSupplierDDlForTransportBill(accId, buId, setSupplierDDL);
      getShippointDDL(userId, accId, buId, setShippointDDL);
    }
  }, [accId, buId, headerData, userId]);

  const uploadImage = async (cb) => {
    setDisabled(true);
    const compressedFile = await compressfile(fileObjects?.map((f) => f.file));
    const uploadedImage = await uploadAtt(compressedFile);
    setImages(uploadedImage);
    setDisabled(false);
    if (uploadedImage) {
      cb();
    }
  };

  // const saveHandler = async (values, cb) => {
  //   try {
  //     const modifiedRow = gridData
  //       ?.filter((item) => item?.checked)
  //       ?.map((item) => {
  //         return {
  //           shipmentCostID: item?.intshipmentcostid || 0,
  //           challanNo: item?.challanNo || "",
  //           quantity: item?.decChallanQnt || 0,
  //           ammount: item?.numNetPayable || 0,
  //           billAmount: item?.approvedAmount || 0,
  //           shipmentCode: item?.strShipmentCode || "",
  //         };
  //       });
  //     if (modifiedRow.length === 0) {
  //       toast.warning("Please select at least one");
  //     } else {
  //       if (
  //         gridData
  //           ?.filter((item) => item?.checked)
  //           ?.some((item) => item.totalCost < item.approvedAmount)
  //       ) {
  //         return toast.warn("Bill Amount must be below from Net Amount");
  //       }
  //       if (fileObjects?.length < 1) {
  //         return toast.warn("Attachment must be added");
  //       }
  //       let images = [];
  //       setDisabled(true);
  //       const compressedFile = await compressfile(
  //         fileObjects?.map((f) => f.file)
  //       );
  //       const uploadedImage = await uploadAtt(compressedFile);
  //       setDisabled(false);
  //       if (uploadedImage.data?.length > 0) {
  //         images = uploadedImage?.data?.map((data) => {
  //           return {
  //             imageId: data?.id,
  //           };
  //         });
  //       }

  //       const obj = {
  //         head: {
  //           accountId: profileData?.accountId,
  //           supplierId: values?.supplier?.value,
  //           supplierName: values?.supplier?.label,
  //           unitId: selectedBusinessUnit?.value,
  //           unitName: selectedBusinessUnit?.label,
  //           billNo: values?.billNo,
  //           billDate: _dateFormatter(values?.billDate),
  //           paymentDueDate: _dateFormatter(values?.paymentDueDate),
  //           narration: values?.narration,
  //           billAmount: gridData
  //             ?.filter((item) => item?.checked)
  //             ?.reduce((a, b) => Number(a) + Number(b.approvedAmount), 0),
  //           plantId: headerData?.plant?.value || 0,
  //           actionBy: profileData?.userId,
  //           sbuId: headerData?.sbu?.value,
  //           billTypeId: billType || 0,
  //           warehouseId: values?.warehouse?.value || 0,
  //         },
  //         row: modifiedRow,
  //         image: images,
  //       };
  //       postInternalTransportBillEntry_api(obj, cb, IWarningModal, setDisabled);
  //     }
  //   } catch (error) {
  //     setDisabled(false);
  //   }
  // };

  const saveHandler = (values, cb) => {
    const selectedRows = gridData?.filter((item) => item?.checked);

    if (selectedRows.length > 0) {
      if (images?.length < 1) {
        return toast.warning("Attachment must be added!");
      }
      const payload = {
        head: {
          accountId: accId,
          supplierId: 0,
          supplierName: "",
          unitId: buId,
          unitName: buName,
          sbuId: 58,
          billNo: values?.billNo,
          billDate: values?.billDate,
          paymentDueDate: values?.paymentDueDate,
          narration: values?.narration,
          billAmount: selectedRows?.reduce(
            (acc, row) => acc + +row.netPayable,
            0
          ),
          plantId: headerData?.plant?.value,
          warehouseId: values?.shippoint?.value,
          actionBy: userId,
          billTypeId: billType,
          shipPointId: values?.shippoint?.value,
        },
        image: images?.data?.map((i) => ({
          imageId: i?.id,
        })),
        row: selectedRows?.map((element) => ({
          shipmentCode: element?.shipmentCode,
          challanNo: element?.challanNo || "",
          tripId: 0,
          shipmentCostId: element?.shipmentCostId,
          ammount: +element?.netPayable,
          billAmount: +element?.netPayable,
        })),
      };
      postData(
        `/fino/OthersBillEntry/OwnTransportBillNetPay`,
        payload,
        () => {
          cb();
        },
        true
      );
    } else {
      return toast.warning("Please select at least one row!");
    }
  };

  const [objProps, setObjprops] = useState({});
  // console.log(headerData)
  return (
    <div className="purchaseInvoice">
      <IForm
        title="Internal Transport Bill"
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {(isDisabled || loading) && <Loading />}
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          accId={accId}
          buId={buId}
          setpurchaseOrderDDL={purchaseOrderDDL}
          setpurchaseOrdrDDL={setpurchaseOrderDDL}
          gridData={gridData}
          setGridData={setGridData}
          setFileObjects={setFileObjects}
          fileObjects={fileObjects}
          purchaseOrderDDL={purchaseOrderDDL}
          headerData={headerData}
          purchaseOrg={purchaseOrg}
          supplierDDL={supplierDDL}
          setSupplierDDL={setSupplierDDL}
          warehouseDDL={warehouseDDL}
          setDisabled={setDisabled}
          shippointDDL={shippointDDL}
          uploadImage={uploadImage}
        />
      </IForm>
    </div>
  );
}
