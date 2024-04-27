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
import { gateEntry, headerTableHeaders } from "./helper";
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
          headersList:[]
        }));
        setHeaderData(updatedData);
      }
    );
  };

  // grand parent handler
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
    const updatedHeaderData = [...headerData]
    const singleGrandParentItem = updatedHeaderData[grandParentIndex]
    singleGrandParentItem.entryCode = e.target.value
    setHeaderData(updatedHeaderData);
  };
  const handleQcQtyBeg = (e, grandParentIndex) => {
    const updatedHeaderData = [...headerData]
    const singleGrandParentItem = updatedHeaderData[grandParentIndex]
    singleGrandParentItem.qcQtyBeg = e.target.value
    setHeaderData(updatedHeaderData);
  };
  const handleQcQty = (e, grandParentIndex) => {
    const updatedHeaderData = [...headerData]
    const singleGrandParentItem = updatedHeaderData[grandParentIndex]
    singleGrandParentItem.qcQty = e.target.value
    setHeaderData(updatedHeaderData);
  };

  const handleAdd =(grandParentIndex,grandParentItem)=>{
    const updatedHeaderData =[...headerData]
    const singleGrandParentItem = updatedHeaderData[grandParentIndex]
    singleGrandParentItem.headersList=[...singleGrandParentItem?.headersList,grandParentItem]
    setHeaderData(updatedHeaderData)
  }
console.log("headerData",headerData);
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
        // saveHandler(values, () => {
        //   resetForm(initData);
        // });
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
          {false && <Loading />}
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
                    <strong>PO Qty: {headerData[0]?.mrrQuantity}</strong>
                  </div>
                  <div>
                    <strong>PO Qty: {headerData[0]?.restQuantity}</strong>
                  </div>
                </div>
              )}
              <div className="mt-4">
                <CommonTable headersData={headerTableHeaders}>
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
                    />
                  ))}
                </CommonTable>
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
