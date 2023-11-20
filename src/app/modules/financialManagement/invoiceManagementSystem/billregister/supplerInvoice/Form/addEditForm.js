import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  savePurchaseInvoice,
  getWarehouseDDL,
  uploadAttachment,
  getPurchaseOrgDDL,
  getTdsVdsAmount,
} from "../../helper";
import { toast } from "react-toastify";
import "./purchaseInvoice.css";
import IForm from "./../../../../../_helper/_form";
import { _todayDate } from "./../../../../../_helper/_todayDate";
import Loading from "./../../../../../_helper/_loading";
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
  invoiceDate: "",
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
  isTDS: false,
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
  const [grnDDLData, setgrnDDLData] = useState([]);
  const [tdsVdsAmount, setTdsVdsAmount] = useState({});

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
      getPurchaseOrgDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        headerData?.sbu?.value,
        setpurchaseOrg
      );
    }
  }, [profileData, selectedBusinessUnit, headerData]);

  const addGRNtoTheGrid = (values, setFieldValue, supplierAmountInfo) => {
    if (values.checked === false) {
      let data = grnGridData?.find(
        (data) => data?.referenceId === values?.selectGRN?.value
      );
      if (data) {
        toast.warning("GRN Already added");
        // alert("GRN Already added");
      } else {
        // let refAmount = values?.selectGRN?.amount + values?.selectGRN?.vatAmount

        const {
          amount,
          monVatAmount,
          numCommission,
          numFreight,
          othersAmount,
          numGrossDiscount,
        } = values?.selectGRN;

        let refAmount =
          (+amount || 0) +
          (+monVatAmount || 0) +
          (+numCommission || 0) +
          (+numFreight || 0) +
          (+othersAmount || 0) -
          (+numGrossDiscount || 0);

        let data = [
          ...grnGridData,
          {
            referenceId: values?.selectGRN?.value,
            challanNo: values?.selectGRN?.challanNo,
            referenceAmount: (refAmount || 0).toFixed(2),
            referenceName: values?.selectGRN?.label.split("(")[0],
            inventoryTransectionGroupId:
              values?.selectGRN?.inventoryTransectionGroupId,
            actionBy: profileData.userId,
            lastActionDateTime: _todayDate(),
            serverDateTime: _todayDate(),
            active: true,
          },
        ];

        setgrnGridData(data);
        const totalGrn = data?.reduce(
          (total, value) => total + +value?.referenceAmount || 0,
          0
        );
        getTdsVdsAmount(
          profileData?.accountId,
          values?.purchaseOrder?.supplierId,
          values?.purchaseOrder?.value,
          totalGrn,
          setTdsVdsAmount
        );
        // let totalAmount = totalGrn + values?.selectGRN?.amount;
        setFieldValue("grossInvoiceAmount", totalGrn);
        setFieldValue("paymentDueDate", values?.selectGRN?.duePaymentDate);
        // const diff =
        //   Number(supplierAmountInfo?.poAdvanceAmount?.toFixed(2)) -
        //   Number(supplierAmountInfo?.totalAdjustedBalance?.toFixed(2));
        if (Number(supplierAmountInfo?.poPendingAdjustment) >= totalGrn) {
          setFieldValue("new_Adv_Adjustment", totalGrn);
          setFieldValue(
            "curentAdjustmentBalance",
            values?.totalAdjustedBalance - totalGrn
          );
        } else {
          setFieldValue(
            "new_Adv_Adjustment",
            Number(supplierAmountInfo?.poPendingAdjustment)
          );
          setFieldValue(
            "curentAdjustmentBalance",
            values?.totalAdjustedBalance - supplierAmountInfo?.poAdvanceAmount
          );
        }
      }

    
    } else {
      let data = grnDDLData?.map((data) => {
        let refAmount =
          (+data?.amount || 0) +
          (+data?.monVatAmount || 0) +
          (+data?.numCommission || 0) +
          (+data?.numFreight || 0) +
          (+data?.othersAmount || 0) -
          (+data?.numGrossDiscount || 0);

        return {
          referenceId: data?.value,
          challanNo: data?.challanNo,
          referenceAmount: (refAmount || 0).toFixed(2),
          actionBy: profileData?.userId,
          inventoryTransectionGroupId: data?.inventoryTransectionGroupId,
          lastActionDateTime: _todayDate(),
          serverDateTime: _todayDate(),
          referenceName: data?.label.split("(")[0],
          active: true,
        };
      });
      setgrnGridData(data);

      const totalGrn = data?.reduce(
        (total, value) => total + +value?.referenceAmount || 0,
        0
      );
      getTdsVdsAmount(
        profileData?.accountId,
        values?.purchaseOrder?.supplierId,
        values?.purchaseOrder?.value,
        totalGrn,
        setTdsVdsAmount
      );
      setFieldValue("grossInvoiceAmount", totalGrn);
      setFieldValue(
        "paymentDueDate",
        grnDDLData[grnDDLData?.length - 1]?.duePaymentDate
      );
      // const diff =
      //   Number(supplierAmountInfo?.poAdvanceAmount?.toFixed(2)) -
      //   Number(supplierAmountInfo?.totalAdjustedBalance?.toFixed(2));
      if (Number(supplierAmountInfo?.poPendingAdjustment) >= totalGrn) {
        setFieldValue("new_Adv_Adjustment", totalGrn);
        setFieldValue(
          "curentAdjustmentBalance",
          values?.totalAdjustedBalance - totalGrn
        );
      } else {
        setFieldValue(
          "new_Adv_Adjustment",
          Number(supplierAmountInfo?.poPendingAdjustment)
        );
        setFieldValue(
          "curentAdjustmentBalance",
          values?.totalAdjustedBalance - supplierAmountInfo?.poAdvanceAmount
        );
      }

    }
  };

  const remover = (id, setFieldValue, supplierAmountInfo) => {
    let data = grnGridData.filter((data, index) => index !== id);
    const totalGrn = data?.reduce(
      (total, value) => total + +value?.referenceAmount || 0,
      0
    );
    setFieldValue("grossInvoiceAmount", totalGrn);
    // const diff =
    //   Number(supplierAmountInfo?.poAdvanceAmount?.toFixed(2)) -
    //   Number(supplierAmountInfo?.totalAdjustedBalance?.toFixed(2));
    if (Number(supplierAmountInfo?.poPendingAdjustment) >= totalGrn) {
      setFieldValue("new_Adv_Adjustment", totalGrn);
    } else {
      setFieldValue(
        "new_Adv_Adjustment",
        Number(supplierAmountInfo?.poPendingAdjustment)
      );
    }
    setgrnGridData(data);
  };

  const totalGrn = grnGridData?.reduce(
    (total, value) => total + +value?.referenceAmount || 0,
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
        plantId: values?.purchaseOrder?.plantId || 0,
        plantName: values?.purchaseOrder?.plant || "",
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
                  rowListData: grnGridData,
                };
                if (grnGridData.length) {
                  savePurchaseInvoice(
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
                    rowListData: grnGridData,
                  };
                  savePurchaseInvoice(
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
                rowListData: grnGridData,
              };
              savePurchaseInvoice(
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
    <div className='purchaseInvoice'>
      <IForm
        title='Supplier invoice'
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
          addGRNtoTheGrid={addGRNtoTheGrid}
          grnGridData={grnGridData}
          remover={remover}
          totalGrn={totalGrn}
          grnDDLData={grnDDLData}
          profileData={profileData}
          setgrnDDLData={setgrnDDLData}
          setFileObjects={setFileObjects}
          fileObjects={fileObjects}
          setgrnGridData={setgrnGridData}
          purchaseOrderDDL={purchaseOrderDDL}
          warehouse={warehouse}
          headerData={headerData}
          purchaseOrg={purchaseOrg}
          tdsVdsAmount={tdsVdsAmount}
        />
      </IForm>
    </div>
  );
}
