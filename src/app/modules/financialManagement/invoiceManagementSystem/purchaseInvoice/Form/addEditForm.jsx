/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  getSingleDataForEdit,
  savePurchaseInvoice,
  getSBUDDL,
  getPlantDDL,
  getWarehouseDDL,
  getPurchaseOrgDDL,
  getSupplierDDL,
  getPurchaseDDL,
  savePurchaseEditInvoice,
  getGRNDDL,
  purchaseInvoiceAttachment_action,
} from "../helper";
import IForm from "../../../../_helper/_form";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "../purchaseInvoice.css";
import Loading from "./../../../../_helper/_loading";

const initData = {
  SBU: "",
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
  deductionAmount: "",
};

export default function PurchaseInvoiceForm({
  history,
  match: {
    params: { id },
  },
}) {
  const location = useLocation();
  const [isDisabled, setDisabled] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //From DDL State
  const [SBUDDL, setSBUDDL] = useState([]);
  const [purchaseOrg, setpurchaseOrg] = useState([]);
  const [plant, setPlant] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
  const [supplierDDl, setsupplierDDl] = useState([]);
  const [purchaseOrderDDL, setpurchaseOrderDDL] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [grnGridData, setgrnGridData] = useState([]);
  const [grnDDLData, setgrnDDLData] = useState([]);

  //state for input
  const [grossInvoiceAmount, setginvoiceAmount] = useState("");
  const [deductionAmount, setdeducationAmount] = useState(0);

  let netPayment = grossInvoiceAmount - deductionAmount;

  //Get Api Data
  useEffect(() => {
    getSBUDDL(profileData.accountId, selectedBusinessUnit.value, setSBUDDL);

    if (
      (profileData?.accountId &&
      selectedBusinessUnit?.value &&
      location?.state?.selectSBU?.value)
    ) {
      getPurchaseOrgDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        location?.state?.selectSBU?.value,
        setpurchaseOrg
      );
    }

    getPlantDDL(
      profileData.userId,
      profileData.accountId,
      selectedBusinessUnit.value,
      setPlant
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  useEffect(() => {
    if (id) {
      getSingleDataForEdit(id, setSingleData);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      setginvoiceAmount(singleData?.objHeaderDTO?.grossInvoiceAmount);
      setdeducationAmount(singleData?.objHeaderDTO?.deductionAmount);
      if (singleData) {
        setgrnGridData(singleData?.objRowListDTO);
      }
    }
  }, [singleData]);


  let singleDataCB = () =>{
    getSingleDataForEdit(id, setSingleData);
  }

  useEffect(() => {
    if (id) {
    } else {
      if (location?.state?.selectSBU) {
        getSupplierDDL(
          profileData.accountId,
          selectedBusinessUnit.value,
          location?.state?.selectSBU?.value,
          setsupplierDDl
        );
      }

      if (
        location?.state?.selectSBU &&
        location?.state?.selectplant &&
        location?.state?.selectwarehouse
      ) {
        // getGRNDDL(profileData.accountId,
        //   selectedBusinessUnit?.value,
        //   location?.state.selectSBU.value,
        //   location?.state.selectplant.value,
        //   location?.state.selectwarehouse.value, setgrnDDLData)
      }

      // if (location?.state.selectSBU && location?.state.selectpurchaseOrg && location?.state.selectplant && location?.state.selectwarehouse) {
      // if (
      //   location?.state.selectSBU &&
      //   location?.state?.selectpurchaseOrg &&
      //   location?.state?.selectplant &&
      //   location?.state?.selectwarehouse
      // ) {
      //   getPurchaseDDL(
      //     profileData?.accountId,
      //     selectedBusinessUnit?.value,
      //     location?.state?.selectSBU?.value,
      //     location?.state?.selectpurchaseOrg?.value,
      //     location?.state?.selectplant?.value,
      //     location?.state?.selectwarehouse?.value,
      //     setpurchaseOrderDDL
      //   );
      // }
    }
  }, [location]);

  const warehouseDLLFind = (plantId) => {
    getWarehouseDDL(
      profileData.accountId,
      selectedBusinessUnit.value,
      plantId,
      setWarehouse
    );
  };

  // const purchaseOrderDDLCall = (sbu, purchaseOrg, plant, warehouse) => {
  //   // if (sbu && purchaseOrg && plant && warehouse) {
  //   if (sbu) {
  //     getPurchaseDDL(
  //       profileData?.accountId,
  //       selectedBusinessUnit?.value,
  //       sbu?.value,
  //       purchaseOrg?.value,
  //       plant?.value,
  //       warehouse?.value,
  //       setpurchaseOrderDDL
  //     );
  //   }
  // };

  const getSupplierDDLData = (sbuId) => {
    if (sbuId?.value) {
      getSupplierDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        sbuId?.value,
        setsupplierDDl
      );
    }
  };

  const addGRNtoTheGrid = (values) => {
    if (values.checked === false) {
      let data = grnGridData?.find(
        (data) => data?.referenceId === values?.selectGRN?.value
      );
      if (data) {
        toast.warning("GRN Already added");
        // alert("GRN Already added");
      } else {
        setgrnGridData([
          ...grnGridData,
          {
            referenceId: values?.selectGRN?.value,
            referenceAmount: values?.selectGRN?.amount,
            referenceName: values?.selectGRN?.label,
            actionBy: profileData.userId,
            lastActionDateTime: _todayDate(),
            serverDateTime: _todayDate(),
            active: true,
          },
        ]);
      }
    } else {
      let data = grnDDLData?.map((data) => {
        return {
          referenceId: data?.value,
          referenceAmount: data?.amount,
          actionBy: profileData?.userId,
          lastActionDateTime: _todayDate(),
          serverDateTime: _todayDate(),
          referenceName: data?.label,
          active: true,
        };
      });
      setgrnGridData(data);
    }
  };

  const remover = (id) => {
    let data = grnGridData.filter((data, index) => index !== id);
    setgrnGridData(data);
  };

  const totalGrn = grnGridData?.reduce(
    (total, value) => total + value.referenceAmount,
    0
  );

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        let rowDatas = grnGridData.map((data) => {
          return {
            rowId: data.rowId || 0,
            supplierInvoiceId: +id,
            referenceId: data.referenceId,
            referenceAmount: data.referenceAmount,
            actionBy: data.actionBy,
          };
        });
        const payload = {
          supplierInvoiceId: +id,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          totalReferenceAmount: +totalGrn,
          grossInvoiceAmount: +grossInvoiceAmount,
          deductionAmount: +deductionAmount,
          netPaymentAmount: netPayment,
          remarks: values.remarks || "",
        };
        if (fileObjects.length > 0) {
          //true image attachment
          purchaseInvoiceAttachment_action(fileObjects).then((data) => {
            const modifyPlyload = {
              headerData: {
                ...payload,
                attachmentId: data[0]?.id || "",
              },
              rowData: rowDatas,
            };
            if (grnGridData.length) {
              savePurchaseEditInvoice(modifyPlyload, cb,setDisabled,singleDataCB);
            } else {
              toast.warning("You must have to add atleast one item");
            }
          });
        } else {
          //false image attachment
          if (grnGridData.length) {
            const modifyPlyload = {
              headerData: {
                ...payload,
                attachmentId: values?.attachmentId || "",
              },
              rowData: rowDatas,
            };
            savePurchaseEditInvoice(modifyPlyload, cb, setDisabled, singleDataCB);
          } else {
            toast.warning("You must have to add atleast one item");
          }
        }
      } else {
        // creage api
        const payload = {
          supplierInvoiceCode: values.invoiceNumber,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          businessUnitName: selectedBusinessUnit.label,
          sbuid: values.SBU.value,
          sbuname: values.SBU.label,
          purchaseOrganizationId: values.purchaseOrg.value,
          purchaseOrganizationName: values.purchaseOrg.label,
          plantId: values.plant.value,
          plantName: values.plant.label,
          warehouseId: values.warehouse.value,
          warehouseName: values.warehouse.label,
          businessPartnerId: values.purchaseOrder.supplierId || 0,
          purchaseOrderId: values.purchaseOrder.value,
          purchaseOrderNo: values.purchaseOrder.label,
          purchaseOrderDate: values.invoiceDate,
          invoiceNumber: values.invoiceNumber,
          invoiceDate: values.invoiceDate,
          totalReferenceAmount: totalGrn,
          grossInvoiceAmount: +grossInvoiceAmount,
          deductionAmount: +deductionAmount,
          advanceAdjustmentAmount:
            values?.purchaseOrder?.advanceAdjustmentAmount || 0,
          netPaymentAmount: netPayment,
          paymentDueDate: values.paymentDueDate,
          remarks: values.remarks || "",
          actionBy: profileData.userId,
          lastActionDateTime: values.invoiceDate,
          serverDateTime: values.invoiceDate,
          active: true,
        };

        if (fileObjects.length > 0) {
          purchaseInvoiceAttachment_action(fileObjects).then((data) => {
            const modifyPlyload = {
              headerData: {
                ...payload,
                attachmentId: data[0]?.id || "",
              },
              rowListData: grnGridData,
            };
            if (grnGridData.length) {
              savePurchaseInvoice(
                modifyPlyload,
                cb,
                setgrnGridData,
                setginvoiceAmount,
                setdeducationAmount,
                setDisabled
              );
            } else {
              toast.warning("You must have to add atleast one item");
            }
          });
        } else {
          if (grnGridData.length) {
            const modifyPlyload = {
              headerData: {
                ...payload,
                attachmentId: "",
              },
              rowListData: grnGridData,
            };
            savePurchaseInvoice(
              modifyPlyload,
              cb,
              setgrnGridData,
              setginvoiceAmount,
              setdeducationAmount,
              setDisabled
            );
          } else {
            toast.warning("You must have to add atleast one item");
          }
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <div className="purchaseInvoice">
      <IForm
        title="Create Purchase Invoice"
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={id ? singleData?.objHeaderDTO : initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          isEdit={id || false}
          setSBUDDL={SBUDDL}
          setpurchaseOrg={purchaseOrg}
          setplant={plant}
          setwarehouse={warehouse}
          warehouseDLLFind={warehouseDLLFind}
          setsupplierDDl={supplierDDl}
          // purchaseOrderDDLCall={purchaseOrderDDLCall}
          setpurchaseOrderDDL={purchaseOrderDDL}
          setpurchaseOrdrDDL={setpurchaseOrderDDL}
          addGRNtoTheGrid={addGRNtoTheGrid}
          grnGridData={grnGridData}
          remover={remover}
          totalGrn={totalGrn}
          grossInvoiceAmount={grossInvoiceAmount}
          setginvoiceAmount={setginvoiceAmount}
          deductionAmount={deductionAmount}
          setdeducationAmount={setdeducationAmount}
          netPayment={netPayment}
          id={id}
          singleData={singleData}
          // getGRNDDLAction={getGRNDDLAction}
          grnDDLData={grnDDLData}
          location={location.state}
          getSupplierDDLData={getSupplierDDLData}
          profileData={profileData}
          setgrnDDLData={setgrnDDLData}
          setFileObjects={setFileObjects}
          fileObjects={fileObjects}
          setgrnGridData={setgrnGridData}
          purchaseOrderDDL={purchaseOrderDDL}
          purchaseOrg={location?.state?.selectpurchaseOrg?.value}
          plantValue = {location?.state?.selectplant?.value}
          warehouseValue = {location?.state?.selectwarehouse?.value}
          sbuValue={location?.state.selectSBU.value}
        />
      </IForm>
    </div>
  );
}
