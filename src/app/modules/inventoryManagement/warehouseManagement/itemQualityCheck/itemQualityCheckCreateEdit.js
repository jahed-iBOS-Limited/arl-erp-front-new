import axios from "axios";
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
import HeaderTable from "./headerTable";
import { gateEntry, getRowWithItemId } from "./helper";

const initData = {
  po: "",
  poType: "",
  plant: "",
  warehouse: "",
  poNo: "",
};

export default function ItemQualityCheckCreateAndEditForm() {
  const {
    profileData: { accountId: accId,userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [objProps, setObjprops] = useState({});
  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [warehouseDDL, getWarehouseDDL] = useAxiosGet();
  const [poDDL, getPoDDL] = useAxiosGet();
  const [poTypeDDL, getPoTypeDDL] = useAxiosGet();
  const[,saveQcItem,loadQcITem]= useAxiosPost()
  const [
    headerData,
    getHeaderData,
    loadHeaderData,
    setHeaderData,
  ] = useAxiosGet([]);

  // variables
  let totalSystemDeduction = 0;
  const saveHandler = (values, cb) => {
    const payload = headerData?.map(item=>({
      headerObject:{
        actualQuantity:item?.actualQuantity,
      businessUnitId:buId,
      createdBy:userId,
      deductionPercentage:item?.deductionPercentage,
      deductionQuantity:item?.deductionQuantity,
      entryCode:item?.entryCode,
      gateEntryListId:item?.gateEntryItemListId,
      isReceived:item?.isReceived,
      itemId:item?.itemId,
      itemName:item?.itemName,
      netWeight:item?.netWeight,
      purchaseOrderId:values?.poNo?.value,
     
      qualityCheckId:0,
      supplierAddress:item?.address,
      supplierId:item?.supplierId,
      supplierName:item?.supplierName,
      unloadedDeductionQuantity:item?.unloadDeduct||0,
      uomId:item?.uomId,
      uomName:item?.uomName,
      vehicleId:item?.vehicleId,
      vehicleNo:item?.vehicleNo,
      },
      rowList:item?.rowList
    }))

    saveQcItem(
      `/mes/QCTest/CreateItemQualityCheck`,
      payload,
      ()=>{},
      true
    )
  };

  // all handler
  const handleHeaderData = (values) => {
    getHeaderData(
      `/mes/QCTest/GetPurchaseOrderInfoByPoId?purchaseOrderId=${values?.poNo?.value}`,
      (data) => {
        const updatedData = data?.map(item=>({...item,deductionPercentage:0,isReceived:true}))
        setHeaderData(updatedData);
      }
    );
  };
  const handleGetEntryCode = (e, itemId) => {
    const updatedHeaderData = [...headerData]?.map((item) => {
      if (item?.itemId === itemId) {
        return { ...item, entryCode: e.target.value };
      }
      return item;
    });
    setHeaderData(updatedHeaderData);
  };
  const handleUnloadDeduct = (e, index) => {
    const updatedHeaderData =[...headerData]
   const singleItem = updatedHeaderData[index]
    singleItem["unloadDeduct"] = +e.target.value;
    const totalDeduction = singleItem.deductionQuantity + +e.target.value;
    singleItem["actualQuantity"] = singleItem.netWeight > totalDeduction ? singleItem.netWeight- totalDeduction : 0
    setHeaderData(updatedHeaderData);
  };
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
  const handleStatus = (e, itemId) => {
    const updatedHeaderData = [...headerData]?.map((item) => {
      if (item?.itemId === itemId) {
        return { ...item, isReceived: e.target.value };
      }
      return item;
    });
    setHeaderData(updatedHeaderData);
  };
  console.log("headerData",headerData);
  const handleGetRow = async (itemId) => {
    try {
      const rowData = await getRowWithItemId(buId, itemId);
      const updatedHeaderData = [...headerData]?.map((item) => {
        if (item?.itemId === itemId) {
          return { ...item, rowList: rowData };
        }
        return item;
      });
      setHeaderData(updatedHeaderData);
    } catch (error) {
      console.log(error);
    }
  };
  const handleWarehouseComment =(commentValue,item,index)=>{
    const updatedHeaderData = [...headerData]
    updatedHeaderData[index] ={...item,warehouseComment:commentValue}
    setHeaderData(updatedHeaderData)
  }
  const handleHeaderRowDelete = (index)=>{
    const updatedHeaderData =[...headerData]
    updatedHeaderData.splice(index,1)
    setHeaderData(updatedHeaderData)
  }

  //row Items handler
  const actualValueHandler = (e, parentIndex, childIndex) => {
    const updatedHeaderData = [...headerData];
    const childRowItem = updatedHeaderData[parentIndex]["rowList"][childIndex]
    childRowItem.actualValue= +e.target?.value
    childRowItem.systemDeduction= +e.target?.value > childRowItem?.standardValue ? +e.target?.value - childRowItem?.standardValue :0 ;
    //calculate deduction qty value and actual value
    const rowItem = updatedHeaderData[parentIndex]
    rowItem.deductionPercentage = updatedHeaderData[parentIndex].rowList.reduce((acc,item)=>{
      return acc +item?.systemDeduction
     },0)
     rowItem.deductionQuantity = (rowItem.netWeight * rowItem.deductionPercentage) /100
    setHeaderData(updatedHeaderData);
  };
  const handleManualDeduction = (e, parentIndex, childIndex) => {
    const updatedHeaderData = [...headerData];
    const childRowItem = updatedHeaderData[parentIndex]["rowList"][childIndex]
    childRowItem.manualDeduction= +e.target?.value
    setHeaderData(updatedHeaderData);
  };
  const handleRemarks = (e, parentIndex, childIndex) => {
    const updatedHeaderData = [...headerData];
    const childRowItem = updatedHeaderData[parentIndex]["rowList"][childIndex]
    childRowItem.remarks= e.target?.value
    setHeaderData(updatedHeaderData);
  };

  const handleRowItemDelete = (parentIndex, childIndex) => {
    const updatedHeaderData = [...headerData];

    updatedHeaderData[parentIndex]["rowList"].splice(childIndex,1)
    //calculate deduction qty value and actual value
    const rowItem = updatedHeaderData[parentIndex]
    rowItem.deductionPercentage = updatedHeaderData[parentIndex].rowList.reduce((acc,item)=>{
      return acc +item?.systemDeduction
     },0)
     rowItem.deductionQuantity = (rowItem.netWeight * rowItem.deductionPercentage) /100
   
    setHeaderData(updatedHeaderData);
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
      //   validationSchema={validationSchema}
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
          {(loadHeaderData ||loadQcITem)&& <Loading />}
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
              {
                headerData?.length > 0 && <div style={{justifyContent:"flex-end",gap:"20px",marginTop:"20px"}} className="d-flex">
                <div>
                  <strong>PO-Validity Date : {_dateFormatter(headerData[0]?.poValidityDate)}</strong>
                </div>
                <div>
                  <strong>PO Qty: {headerData[0]?.poQuantity}</strong>
                </div>
                <div>
                  <strong>PO Qty: {headerData[0]?.mrrQuantity}</strong>
                </div>
                <div>
                  <strong>PO Qty: {headerData[0]?.restQuantity}</strong>
                </div>
          </div>
              }
              <div className="mt-4">
                <HeaderTable
                  headerData={headerData}
                  handleGetEntryCode={handleGetEntryCode}
                  handleGateEntryHandler={handleGateEntryHandler}
                  handleUnloadDeduct={handleUnloadDeduct}
                  handleStatus={handleStatus}
                  handleGetRow={handleGetRow}
                  handleWarehouseComment={handleWarehouseComment}
                  handleHeaderRowDelete={handleHeaderRowDelete}
                  totalSystemDeduction={totalSystemDeduction}
                  //this handler for child table
                  actualValueHandler={actualValueHandler}
                  handleManualDeduction={handleManualDeduction}
                  handleRemarks={handleRemarks}
                  handleRowItemDelete={handleRowItemDelete}
                />
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
