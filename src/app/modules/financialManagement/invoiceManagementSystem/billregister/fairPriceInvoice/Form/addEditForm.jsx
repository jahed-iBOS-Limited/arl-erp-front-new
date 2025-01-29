import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  saveFairPriceShopInvoice,
  getWarehouseDDL,
  uploadAttachment,
  getPurchaseOrganizationDDL
} from "../../helper";
import { toast } from "react-toastify";
import "./purchaseInvoice.css";
import IForm from "../../../../../_helper/_form";
import { _todayDate } from "../../../../../_helper/_todayDate";
import Loading from "../../../../../_helper/_loading";
import { useLocation } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { compressfile } from "../../../../../_helper/compressfile";
import { getImageuploadStatus } from "../../../../../_helper/_commonApi";

const initData = {
  purchaseOrg: "",
  plant: "",
  warehouse: "",
  supplierName: "",
  purchaseOrder: "",
  invoiceNumber: "",
  invoiceDate: _todayDate(),
  remarks: "",
  selectGRN: "",
  checked: false,
  ginvoiceAmount: "",
  deducationAmount: "",
  invoiceAmount: "",
  paymentDueDate: _todayDate(),
  grossInvoiceAmount: "",
  deductionAmount: 0,
  netPaymentAmount: "",
  advanceAdjustment: true,
  totalAdjustedBalance: "",
  new_Adv_Adjustment: "",
  curentAdjustmentBalance: "",
};

export default function SupplerInvoiceForm() {
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

  const [warehouse, setWarehouse] = useState([]);

  const [purchaseOrderDDL, setpurchaseOrderDDL] = useState([]);
  const [grnGridData, setgrnGridData] = useState([]);

  const { state: headerData } = useLocation();

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
        setWarehouse
      );
      getPurchaseOrganizationDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setpurchaseOrg
      );
    }
  }, [profileData, selectedBusinessUnit, headerData]);

  const remover = (id) => {
    let data = grnGridData.filter((data, index) => index !== id);
    setgrnGridData(data);
  };

  const totalGrn = grnGridData?.reduce(
    (total, value) => total + +value?.mrrAmount || 0,
    0
  );

  const modalView = (code) => {
    return confirmAlert({
      title: `Bill Code: ${code} `,
      message: "",
      buttons: [],
    });
  };

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      let rowDetailsList=[]
      grnGridData.forEach(data=>{
        return data?.objItemInfo?.forEach(item=>{
          rowDetailsList.push({
            "referenceId": data?.mrrId,
            "referenceAmount": data?.mrrAmount,
            "itemId": item?.itemId,
            "itemName": item?.itemName,
            "uoMId": item?.uoMId,
            "uoMName": item?.uoMName,
            "numQuantity": item?.itemQuantity,
            "numValue": item?.itemAmount,
            "challanNo": data?.challanNo
          })
        })
      })

      // creage api
      const payload = {
        supplierInvoiceCode: values.invoiceNumber,
        accountId: profileData.accountId,
        businessUnitId: selectedBusinessUnit.value,
        businessUnitName: selectedBusinessUnit.label,
        sbuid: headerData.sbu.value,
        sbuname: headerData.sbu.label,
        purchaseOrganizationId: values.purchaseOrg.value,
        purchaseOrganizationName: values.purchaseOrg.label,
        plantId: headerData.plant.value,
        plantName: headerData.plant.label,
        warehouseId: values.warehouse.value,
        warehouseName: values.warehouse.label,
        businessPartnerId: values.purchaseOrder.supplierId || 0,
        purchaseOrderId: values.purchaseOrder.value,
        purchaseOrderNo: values.purchaseOrder.label,
        purchaseOrderDate: values.invoiceDate,
        invoiceNumber: values.invoiceNumber,
        invoiceDate: values.invoiceDate,
        totalReferenceAmount: totalGrn,
        grossInvoiceAmount: +values?.grossInvoiceAmount,
        deductionAmount: +values?.deductionAmount,
        advanceAdjustmentAmount:
          values?.purchaseOrder?.advanceAdjustmentAmount || 0,
        netPaymentAmount:
          +values?.grossInvoiceAmount - +values?.new_Adv_Adjustment || 0,
        paymentDueDate: values.paymentDueDate,
        remarks: values.remarks || "",
        actionBy: profileData.userId,
        lastActionDateTime: values.invoiceDate,
        serverDateTime: values.invoiceDate,
        active: true,
        advanceAmount: +values?.new_Adv_Adjustment,
        businessPartnerName: values.purchaseOrder.supplierName,
        businessPartnerAddress: values?.purchaseOrder?.supplierAddress,
        contactNumber: values?.purchaseOrder?.supplierPhone,
        emailAddress: values?.purchaseOrder?.supplierEmail,
        binNo: "string",
        licenseNo: "string"
      };
      try {
        setDisabled(true);
        const r = await getImageuploadStatus(profileData?.accountId);
        if (r?.data) {
          if (fileObjects.length < 1) {
            setDisabled(false);
            return toast.warn("Attachment required");
          } else {
            const compressedFile = await compressfile(
              fileObjects?.map((f) => f.file)
            );
            // console.log(compressedFile)
            uploadAttachment(compressedFile, setDisabled)
              .then((data) => {
                const modifyPlyload = {
                  headerData: {
                    ...payload,
                  },
                  imageData: data?.map((data) => {
                    return {
                      imageId: data?.id,
                    };
                  }),
                  rowListData: grnGridData.map(data=>{
                    return {
                      "actionBy": profileData?.userId,
                      "referenceAmount": data?.mrrAmount,
                      "referenceId": data?.mrrId,
                      "referenceName": data?.mrrCode,
                    }
                  }),
                  rowDetailsList: rowDetailsList
                };
                if (grnGridData.length) {
                  saveFairPriceShopInvoice(
                    modifyPlyload,
                    cb,
                    setgrnGridData,
                    setDisabled,
                    setFileObjects,
                    modalView
                  );
                } else {
                  toast.warning("You must have to add atleast one item");
                }
              })
              .catch((err) => {
                setDisabled(false);
              });
          }
        } else {
          if (grnGridData.length) {
            if (fileObjects.length > 0) {
              const compressedFile = await compressfile(
                fileObjects?.map((f) => f.file)
              );
              // console.log(compressedFile)
              uploadAttachment(compressedFile, setDisabled)
                .then((data) => {
                  const modifyPlyload = {
                    headerData: {
                      ...payload,
                    },
                    imageData: data?.map((data) => {
                      return {
                        imageId: data?.id,
                      };
                    }),
                    rowListData: grnGridData.map(data=>{
                      return {
                        "actionBy": profileData?.userId,
                        "referenceAmount": data?.mrrAmount,
                        "referenceId": data?.mrrId,
                        "referenceName": data?.mrrCode,
                      }
                    }),
                    rowDetailsList: rowDetailsList
                  };
                  saveFairPriceShopInvoice(
                    modifyPlyload,
                    cb,
                    setgrnGridData,
                    setDisabled,
                    setFileObjects,
                    modalView
                  );
                })
                .catch((err) => {
                  setDisabled(false);
                });
            } else {
              const modifyPlyload = {
                headerData: {
                  ...payload,
                },
                imageData: [],
                rowListData: grnGridData.map(data=>{
                  return {
                    "actionBy": profileData?.userId,
                    "referenceAmount": data?.mrrAmount,
                    "referenceId": data?.mrrId,
                    "referenceName": data?.mrrCode,
                  }
                }),
                rowDetailsList: rowDetailsList
              };
              saveFairPriceShopInvoice(
                modifyPlyload,
                cb,
                setgrnGridData,
                setDisabled,
                setFileObjects,
                modalView
              );
            }
          } else {
            toast.warning("You must have to add atleast one item");
          }
        }
      } catch (error) {
        setDisabled(false);
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <div className="purchaseInvoice">
      <IForm
        title="Fair Price Shop Invoice"
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
          setwarehouse={warehouse}
          // purchaseOrderDDLCall={purchaseOrderDDLCall}
          setpurchaseOrderDDL={purchaseOrderDDL}
          setpurchaseOrdrDDL={setpurchaseOrderDDL}
          grnGridData={grnGridData}
          remover={remover}
          totalGrn={totalGrn}
          profileData={profileData}
          setFileObjects={setFileObjects}
          fileObjects={fileObjects}
          setgrnGridData={setgrnGridData}
          purchaseOrderDDL={purchaseOrderDDL}
          warehouse={warehouse}
          headerData={headerData}
          purchaseOrg={purchaseOrg}
        />
      </IForm>
    </div>
  );
}
