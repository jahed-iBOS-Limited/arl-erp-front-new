import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  // savePurchaseInvoice,
  getWarehouseDDL,
  // billregisterAttachment_action,
  getPurchaseOrgDDL,
  getSupplierDDlForTransportBill,
  createTransportBill,
  uploadAtt,
  // empAttachment_action,
} from "../../helper";
import "./purchaseInvoice.css";
import IForm from "../../../../../_helper/_form";
import { _todayDate } from "../../../../../_helper/_todayDate";
import Loading from "../../../../../_helper/_loading";
import { useLocation } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import IWarningModal from "../../../../../_helper/_warningModal";
import { toast } from "react-toastify";
import { compressfile } from "../../../../../_helper/compressfile";

const initData = {
  supplier: "",
  billNo: "",
  billDate: _todayDate(),
  paymentDueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
  narration: "",
  billAmount: "",
  warehouse: { value: 0, label: "All" },
  toDate: _todayDate(),
  fromDate: _todayDate()
};

export default function TransportBillForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [purchaseOrg, setpurchaseOrg] = useState([]);
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
  // const [challanDDL, setChallanDDL] = useState([]);
  const [supplierDDL, setSupplierDDL] = useState([]);
  const [warehouseDDL, setWareHouseDDL] = useState([]);
  // const [uploadImage, setUploadImage] = useState("");
  const { state: headerData } = useLocation();
  const billType = headerData?.billType?.value;
  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit.value &&
      headerData?.plant?.value
    ) {
      getWarehouseDDL(
        profileData.userId,
        profileData.accountId,
        selectedBusinessUnit.value,
        headerData?.plant?.value,
        setWareHouseDDL
      );
      getPurchaseOrgDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        headerData?.sbu?.value,
        setpurchaseOrg
      );
      getSupplierDDlForTransportBill(
        profileData.accountId,
        selectedBusinessUnit.value,
        setSupplierDDL
      );
    }
  }, [profileData, selectedBusinessUnit, headerData]);

  const saveHandler = async (values, cb) => {
    try {
      const modifiedRow = gridData
      ?.filter((item) => item?.checked)
      ?.map((item) => {
        return {
          shipmentCode: item?.shipmentCode,
          challanNo: item?.challanNo,
          tripId: item?.tripId,
          ammount: item?.totalCost,
          billAmount: item?.approvedAmount,
        };
      });
      if (modifiedRow.length === 0) {
        toast.warning("Please select at least one");
      } else {
        if (
          gridData
            ?.filter((item) => item?.checked)
            ?.some((item) => item.totalCost < item.approvedAmount)
        ) {
          return toast.warn("Bill Amount must be below from Net Amount");
        }
        if (fileObjects?.length < 1) {
          return toast.warn("Attachment must be added");
        }
        let images = [];
        setDisabled(true)
        const compressedFile = await compressfile(fileObjects?.map((f) => f.file));
        const uploadedImage = await uploadAtt(compressedFile);
        setDisabled(false)
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
            plantId: gridData.length > 0 ? gridData[0]?.plantId : 0,
            warehouseId: gridData.length > 0 ? gridData[0]?.warehouseId : 0,
            actionBy: profileData?.userId,
            sbuId: headerData?.sbu?.value,
            billTypeId: billType || 0,
          },
          row: modifiedRow,
          image: images,
        };
        createTransportBill(obj, cb, IWarningModal, setDisabled);
      }
    } catch (error) {
      setDisabled(false)
    }
  
  };

  const [objProps, setObjprops] = useState({});
  // console.log(headerData)
  return (
    <div className="purchaseInvoice">
      <IForm
        title="Transport Invoice"
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
          // setwarehouse={warehouse}
          // purchaseOrderDDLCall={purchaseOrderDDLCall}
          setpurchaseOrderDDL={purchaseOrderDDL}
          setpurchaseOrdrDDL={setpurchaseOrderDDL}
          // addDateToTheGrid={addDateToTheGrid}
          gridData={gridData}
          setGridData={setGridData}
          // remover={remover}
          // totalGrn={totalGrn}
          // challanDDL={challanDDL}
          profileData={profileData}
          // setChallanDDL={setChallanDDL}
          setFileObjects={setFileObjects}
          fileObjects={fileObjects}
          // setGridData={setGridData}
          purchaseOrderDDL={purchaseOrderDDL}
          // warehouse={warehouse}
          headerData={headerData}
          purchaseOrg={purchaseOrg}
          supplierDDL={supplierDDL}
          setSupplierDDL={setSupplierDDL}
          // setUploadImage={setUploadImage}
          warehouseDDL={warehouseDDL}
          setDisabled={setDisabled}

        />
      </IForm>
    </div>
  );
}
