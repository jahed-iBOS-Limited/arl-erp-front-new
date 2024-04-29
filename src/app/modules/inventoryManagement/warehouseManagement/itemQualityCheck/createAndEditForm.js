import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

import axios from "axios";
import CommonTable from "../../../_helper/commonTable";
import GrandParentTableBody from "./grandParentTableBody";
import {
  gateEntry,
  getRowWithItemId,
  grandParentTableHeaders,
  grandParentTotalSum,
} from "./helper";
import { QcManagementContext } from "./qcManagementContext";
const initData = {
  po: "",
  poType: "",
  plant: "",
  warehouse: "",
  poNo: "",
};
export default function QualityCheckCreateForm() {
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [objProps, setObjprops] = useState({});
  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [warehouseDDL, getWarehouseDDL] = useAxiosGet();
  const [poDDL, getPoDDL] = useAxiosGet();
  const [poTypeDDL, getPoTypeDDL] = useAxiosGet();
  const [, saveQcItem, loadQcITem] = useAxiosPost();
  const [
    headerData,
    getHeaderData,
    loadHeaderData,
    setHeaderData,
  ] = useAxiosGet([]);

  //general handler
  const handleHeaderData = (values) => {
    getHeaderData(
      `/mes/QCTest/GetPurchaseOrderInfoByPoId?purchaseOrderId=${values?.poNo?.value}`,
      (data) => {
        const updatedData = data?.map((item) => ({
          ...item,
          deductionPercentage: 0,
          isReceived: true,
          headersList: [],
        }));
        setHeaderData(updatedData);
      }
    );
  };
  const handleGetQCItemParameterConfig = async (
    itemId,
    grandParentIndex,
    parentIndex
  ) => {
    try {
      const rowData = await getRowWithItemId(buId, itemId);
      const updatedHeaderData = [...headerData];
      const parentSingleData =
        updatedHeaderData[grandParentIndex]["headersList"][parentIndex];
      parentSingleData.rowList = rowData;
      setHeaderData(updatedHeaderData);
    } catch (error) {
      console.log(error);
    }
  };

  // Grand parent of First level handler
  const handleGateEntryHandler = async (code, itemId) => {
    try {
      const gateEntryObj = await gateEntry(buId, code);
      const updatedHeaderData = [...headerData]?.map((item) => {
        if (item?.itemId === itemId) {
          return { ...item, ...gateEntryObj };
        }
        return item;
      });
      setHeaderData(updatedHeaderData);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetEntryCode = (e, grandParentIndex) => {
    const updatedHeaderData = [...headerData];
    const singleGrandParentItem = updatedHeaderData[grandParentIndex];
    singleGrandParentItem.entryCode = e.target.value;
    setHeaderData(updatedHeaderData);
  };
  const handleQcQtyBeg = (e, grandParentIndex) => {
    const updatedHeaderData = [...headerData];
    const singleGrandParentItem = updatedHeaderData[grandParentIndex];
    singleGrandParentItem.qcQtyBeg = +e.target.value;
    setHeaderData(updatedHeaderData);
  };
  const handleQcQty = (e, grandParentIndex) => {
    const updatedHeaderData = [...headerData];
    const singleGrandParentItem = updatedHeaderData[grandParentIndex];
    singleGrandParentItem.qcQty = +e.target.value;
    setHeaderData(updatedHeaderData);
  };
  const handleAdd = (grandParentIndex, grandParentItem) => {
    const updatedHeaderData = [...headerData];
    const singleGrandParentItem = updatedHeaderData[grandParentIndex];
    singleGrandParentItem.headersList = [
      ...singleGrandParentItem?.headersList,
      {
        itemId: grandParentItem?.itemId,
        itemName: grandParentItem?.itemName,
        uomName: grandParentItem?.uomName,
        qcQuantityBag: 0,
        qcQuantity: 0,
        deductionPercentage: 0,
        deductionQuantity: 0,
        actualQuantity: 0,
        unloadedDeductionQuantity: 0,
        remarks: "",
        rowList: [],
      },
    ];
    setHeaderData(updatedHeaderData);
  };
  const handleStatus = (e, grandParentIndex) => {
    const updatedHeaderData = [...headerData];
    const singleGrandParentItem = updatedHeaderData[grandParentIndex];
    singleGrandParentItem.isReceived = e.target.value;
    setHeaderData(updatedHeaderData);
  };
  const handleHeaderRowDelete = (index) => {
    const updatedHeaderData = [...headerData];
    updatedHeaderData.splice(index, 1);
    setHeaderData(updatedHeaderData);
  };
  const handleWarehouseComment = (commentValue, item, index) => {
    const updatedHeaderData = [...headerData];
    updatedHeaderData[index] = { ...item, warehouseComment: commentValue };
    setHeaderData(updatedHeaderData);
  };
  // Grand Parent handler finish

  // Parent handler start or 2nd level table handler start
  const handleQcQtyBegForParent = (e, grandParentIndex, parentIndex) => {
    const updatedHeaderData = [...headerData];
    const grandParentItem = updatedHeaderData[grandParentIndex]  
  
    const challanQtyDeviedResult = (grandParentItem?.qcQty / grandParentItem?.qcQtyBeg)
    console.log("challanQtyDeviedResult",challanQtyDeviedResult);  
    const parentSingleData =grandParentItem["headersList"][parentIndex];
    parentSingleData.qcQuantityBag = +e.target.value;
    parentSingleData.qcQuantity =challanQtyDeviedResult* +e.target.value
     //calculate actual value and deduction qty
     parentSingleData.deductionPercentage = parentSingleData.rowList.reduce(
      (acc, item) => {
        return acc + item?.manualDeduction;
      },
      0
    );
    parentSingleData.deductionQuantity =
      (parentSingleData.qcQuantity * parentSingleData.deductionPercentage) /
      100;
    parentSingleData.actualQuantity =
      parentSingleData.qcQuantity -
      (parentSingleData.deductionQuantity +
        parentSingleData.unloadedDeductionQuantity);
        const grandTotalSum = grandParentTotalSum(
          grandParentItem?.headersList
        );
        grandParentItem.actualQuantity = grandTotalSum.actualQuantity;
        grandParentItem.deductionQuantity = grandTotalSum.deductionQuantity;
        grandParentItem.totalQcQty = grandTotalSum.qcQuantity;
        grandParentItem.unloadDeductionQuantity =
          grandTotalSum.unloadedDeductionQuantity;

    setHeaderData(updatedHeaderData);
  };
  const handleQcQtyForParent = (e, grandParentIndex, parentIndex) => {
    const updatedHeaderData = [...headerData];
    const grandParentSingleItem = updatedHeaderData[grandParentIndex];
    const parentSingleData = grandParentSingleItem["headersList"][parentIndex];
    parentSingleData.qcQuantity = +e.target.value;
    //calculate actual value and deduction qty
    parentSingleData.deductionPercentage = parentSingleData.rowList.reduce(
      (acc, item) => {
        return acc + item?.manualDeduction;
      },
      0
    );
    parentSingleData.deductionQuantity =
      (parentSingleData.qcQuantity * parentSingleData.deductionPercentage) /
      100;
    parentSingleData.actualQuantity =
      parentSingleData.qcQuantity -
      (parentSingleData.deductionQuantity +
        parentSingleData.unloadedDeductionQuantity);
    const grandTotalSum = grandParentTotalSum(
      grandParentSingleItem?.headersList
    );
    grandParentSingleItem.actualQuantity = grandTotalSum.actualQuantity;
    grandParentSingleItem.deductionQuantity = grandTotalSum.deductionQuantity;
    grandParentSingleItem.totalQcQty = grandTotalSum.qcQuantity;
    grandParentSingleItem.unloadDeductionQuantity =
      grandTotalSum.unloadedDeductionQuantity;
    setHeaderData(updatedHeaderData);
  };
  const handleUnloadDeductForParent = (e, grandParentIndex, parentIndex) => {
    const updatedHeaderData = [...headerData];
    const grandParentSingleItem = updatedHeaderData[grandParentIndex];
    const parentSingleData = grandParentSingleItem["headersList"][parentIndex];
    parentSingleData.unloadedDeductionQuantity = +e.target.value;
    //calculate actual value and deduction qty
    parentSingleData.deductionPercentage = parentSingleData.rowList.reduce(
      (acc, item) => {
        return acc + item?.manualDeduction;
      },
      0
    );
    parentSingleData.deductionQuantity =
      (parentSingleData.qcQuantity * parentSingleData.deductionPercentage) / 100;
    const checkValidity =
      parentSingleData.qcQuantity >
      parentSingleData.deductionQuantity +
        parentSingleData.unloadedDeductionQuantity;
    parentSingleData.actualQuantity = checkValidity
      ? parentSingleData.qcQuantity -
        (parentSingleData.deductionQuantity +
          parentSingleData.unloadedDeductionQuantity)
      : 0;

    //  total qcQty,deducQty,unloadTimeDeduct,ActualQty Calculation
    const grandTotalSum = grandParentTotalSum(
      grandParentSingleItem?.headersList
    );
    grandParentSingleItem.actualQuantity = grandTotalSum.actualQuantity;
    grandParentSingleItem.deductionQuantity = grandTotalSum.deductionQuantity;
    grandParentSingleItem.totalQcQty = grandTotalSum.qcQuantity;
    grandParentSingleItem.unloadDeductionQuantity =
      grandTotalSum.unloadedDeductionQuantity;
    setHeaderData(updatedHeaderData);
  };
  const handleRemarksForParent = (e, grandParentIndex, parentIndex) => {
    const updatedHeaderData = [...headerData];
    const parentSingleData =
      updatedHeaderData[grandParentIndex]["headersList"][parentIndex];
    parentSingleData.remarks = e.target.value;
    setHeaderData(updatedHeaderData);
  };
  const handleHeaderRowDeleteFromParent = (grandParentIndex, parentIndex) => {
    const updatedHeaderData = [...headerData];
    const grandParentSingleItem = updatedHeaderData[grandParentIndex];
    updatedHeaderData[grandParentIndex]["headersList"].splice(parentIndex, 1);
    const grandTotalSum = grandParentTotalSum(
      grandParentSingleItem?.headersList
    );
    grandParentSingleItem.actualQuantity = grandTotalSum.actualQuantity;
    grandParentSingleItem.deductionQuantity = grandTotalSum.deductionQuantity;
    grandParentSingleItem.totalQcQty = grandTotalSum.qcQuantity;
    grandParentSingleItem.unloadDeductionQuantity =
      grandTotalSum.unloadedDeductionQuantity;
    setHeaderData(updatedHeaderData);
  };
  // Parent handler end or 2nd level table handler end

  //row Items handler start
  const actualValueHandler = (e, grandParentIndex, parentIndex, childIndex) => {
    const updatedHeaderData = [...headerData];
    const childRowItem =
      updatedHeaderData[grandParentIndex]["headersList"][parentIndex][
        "rowList"
      ][childIndex];
    childRowItem.actualValue = +e.target?.value;
    childRowItem.systemDeduction =
      +e.target?.value > childRowItem?.standardValue
        ? +e.target?.value - childRowItem?.standardValue
        : 0;
    setHeaderData(updatedHeaderData);
  };
  const handleManualDeduction = (
    e,
    grandParentIndex,
    parentIndex,
    childIndex
  ) => {
    const updatedHeaderData = [...headerData];
    const grandParentSingleItem =updatedHeaderData[grandParentIndex]
    const parentItem =grandParentSingleItem["headersList"][parentIndex];
    const childRowItem = parentItem["rowList"][childIndex];
    childRowItem.manualDeduction = +e.target?.value;
    //calculate deduction qty value and actual value
    parentItem.deductionPercentage = parentItem.rowList.reduce((acc, item) => {
      return acc + item?.manualDeduction;
    }, 0);
    parentItem.deductionQuantity =
      (parentItem.qcQuantity * parentItem.deductionPercentage) / 100;
    parentItem.actualQuantity =
      parentItem.qcQuantity -
      (parentItem.deductionQuantity + parentItem.unloadedDeductionQuantity);
      //grand total sum
      const grandTotalSum = grandParentTotalSum(
        grandParentSingleItem?.headersList
      );
      grandParentSingleItem.actualQuantity = grandTotalSum.actualQuantity;
      grandParentSingleItem.deductionQuantity = grandTotalSum.deductionQuantity;
      grandParentSingleItem.totalQcQty = grandTotalSum.qcQuantity;
      grandParentSingleItem.unloadDeductionQuantity =
        grandTotalSum.unloadedDeductionQuantity;
    setHeaderData(updatedHeaderData);
  };
  const handleRemarks = (e, grandParentIndex, parentIndex, childIndex) => {
    const updatedHeaderData = [...headerData];
    const childRowItem =
      updatedHeaderData[grandParentIndex]["headersList"][parentIndex][
        "rowList"
      ][childIndex];
    childRowItem.remarks = e.target?.value;
    setHeaderData(updatedHeaderData);
  };
  const handleRowItemDelete = (grandParentIndex, parentIndex, childIndex) => {
    const updatedHeaderData = [...headerData];
    const grandParentSingleItem =updatedHeaderData[grandParentIndex]
    const parentItem =grandParentSingleItem["headersList"][parentIndex];
    updatedHeaderData[grandParentIndex]["headersList"][parentIndex][
      "rowList"
    ].splice(childIndex, 1);
      //calculate deduction qty value and actual value
      parentItem.deductionPercentage = parentItem.rowList.reduce((acc, item) => {
        return acc + item?.manualDeduction;
      }, 0);
      parentItem.deductionQuantity =
        (parentItem.qcQuantity * parentItem.deductionPercentage) / 100;
      parentItem.actualQuantity =
        parentItem.qcQuantity -
        (parentItem.deductionQuantity + parentItem.unloadedDeductionQuantity);
        //grand total sum
        const grandTotalSum = grandParentTotalSum(
          grandParentSingleItem?.headersList
        );
        grandParentSingleItem.actualQuantity = grandTotalSum.actualQuantity;
        grandParentSingleItem.deductionQuantity = grandTotalSum.deductionQuantity;
        grandParentSingleItem.totalQcQty = grandTotalSum.qcQuantity;
        grandParentSingleItem.unloadDeductionQuantity =
          grandTotalSum.unloadedDeductionQuantity;

    setHeaderData(updatedHeaderData);
  };

  console.log("headerData", headerData);

  // save handler
  const saveHandler = (values, cb) => {
    const payload = headerData?.map(item=>({
      headerObject:{
      actualQuantity:item?.actualQuantity,
      businessUnitId:buId,
      purchaseOrderId:values?.poNo?.value,
      createdBy:userId,
      supplierId:item?.supplierId,
      supplierName:item?.supplierName,
      supplierAddress:item?.address,
      itemId:item?.itemId,
      itemName:item?.itemName,
      uomId:item?.uomId,
      uomName:item?.uomName,
      entryCode:item?.entryCode,
      gateEntryListId:item?.gateEntryItemListId,
      vehicleId:item?.vehicleId,
      vehicleNo:item?.vehicleNo,
      netWeight:item?.netWeight,
      deductionQuantity:item?.deductionQuantity,
      unloadedDeductionQuantity:item?.unloadDeduct||0,
      isReceived:item?.isReceived,
      warehouseComment:item?.warehouseComment||"",
      challanQuantityBag:item?.qcQtyBeg
      },
      headerDetailsList:item?.headersList?.map(parentItem=>({
        qcQuantityBag:parentItem.qcQuantityBag,
        qcQuantity:parentItem.qcQuantity,
        deductionPercentage:parentItem.deductionPercentage,
        deductionQuantity:parentItem.deductionQuantity,
        actualQuantity:parentItem.actualQuantity,
        unloadedDeductionQuantity:parentItem.unloadedDeductionQuantity,
        remarks:parentItem.remarks,
        rowList:parentItem?.rowList
      }))
    }))

    saveQcItem(
      `/mes/QCTest/CreateItemQualityCheck`,
      payload,
      ()=>{},
      true
    )
  };
  // effects
  useEffect(() => {
    getPlantDDL(
      `/wms/Plant/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    getPoTypeDDL(`/procurement/PurchaseOrder/GetOrderTypeListDDL`);
    getPoDDL(
      `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loadHeaderData && <Loading />}
          <IForm title="Create Item Quality Check" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="po"
                    options={poDDL || []}
                    value={values?.po}
                    label="Purchase Organization"
                    onChange={(valueOption) => {
                      setFieldValue("po", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="poType"
                    options={poTypeDDL || []}
                    value={values?.poType}
                    label="PO Type"
                    onChange={(valueOption) => {
                      setFieldValue("poType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      setFieldValue("warehouse", "");
                      setFieldValue("plant", valueOption);
                      if (!valueOption) return;
                      getWarehouseDDL(
                        `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${accId}&businessUnitId=${buId}&PlantId=${valueOption?.value}`
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="warehouse"
                    options={warehouseDDL || []}
                    value={values?.warehouse}
                    label="Warehouse"
                    onChange={(valueOption) => {
                      setFieldValue("warehouse", valueOption);
                    }}
                    isDisabled={!values?.plant}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>PO No</label>
                  <SearchAsyncSelect
                    selectedValue={values?.poNo}
                    handleChange={(valueOption) => {
                      setFieldValue("poNo", valueOption);
                    }}
                    placeholder="Search PO No"
                    loadOptions={(v) => {
                      if (v?.length < 3) return [];
                      return axios
                        .get(
                          `/mes/QCTest/GetPendingQCPurchaseOrder?businessUnitId=${buId}&purchaseOrganizationId=${values?.po?.value}&purchaseOrderType=${values?.poType?.value}&plantId=${values?.plant.value}&warehouseId=${values?.warehouse?.value}&search=${v}`
                        )
                        .then((res) => res?.data);
                    }}
                    isDisabled={!values?.warehouse}
                  />
                </div>
                <div className="col-lg-3" style={{ marginTop: 20 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => {
                      handleHeaderData(values);
                    }}
                    disabled={!values?.plant || !values?.warehouse}
                  >
                    View
                  </button>
                </div>
              </div>
              {headerData?.length > 0 && (
                <div
                  style={{
                    justifyContent: "flex-end",
                    gap: "20px",
                    marginTop: "20px",
                  }}
                  className="d-flex"
                >
                  <div>
                    <strong>
                      PO-Validity Date :{" "}
                      {_dateFormatter(headerData[0]?.poValidityDate)}
                    </strong>
                  </div>
                  <div>
                    <strong>PO Qty: {headerData[0]?.poQuantity}</strong>
                  </div>
                  <div>
                    <strong>MRR Qty: {headerData[0]?.mrrQuantity}</strong>
                  </div>
                  <div>
                    <strong>Rest Qty: {headerData[0]?.restQuantity}</strong>
                  </div>
                </div>
              )}
              <div className="mt-4">
                <QcManagementContext.Provider
                  value={{
                    handleGetQCItemParameterConfig,
                    handleQcQtyBegForParent,
                    handleQcQtyForParent,
                    handleUnloadDeductForParent,
                    handleRemarksForParent,
                    handleHeaderRowDeleteFromParent,
                    actualValueHandler,
                    handleManualDeduction,
                    handleRemarks,
                    handleRowItemDelete,
                  }}
                >
                  <CommonTable headersData={grandParentTableHeaders}>
                    {headerData?.map((grandParentItem, grandParentIndex) => (
                      <GrandParentTableBody
                        key={grandParentIndex}
                        grandParentIndex={grandParentIndex}
                        grandParentItem={grandParentItem}
                        handleGetEntryCode={handleGetEntryCode}
                        handleGateEntryHandler={handleGateEntryHandler}
                        handleQcQtyBeg={handleQcQtyBeg}
                        handleQcQty={handleQcQty}
                        handleAdd={handleAdd}
                        handleStatus={handleStatus}
                        handleHeaderRowDelete={handleHeaderRowDelete}
                        handleWarehouseComment={handleWarehouseComment}
                      />
                    ))}
                  </CommonTable>
                </QcManagementContext.Provider>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
