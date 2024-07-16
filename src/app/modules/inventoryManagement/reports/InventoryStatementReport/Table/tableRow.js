/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { _currentTime } from "../../../../_helper/_currentTime";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import { generateJsonToExcel } from "../../../../_helper/excel/jsonToExcel";
import { SetReportsInventoryStatementAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import {
  ItemSubCategory_api,
  businessUnitPlant_api,
  getItemCategoryDDLByTypeId_api,
  getItemTypeListDDL_api,
  getSBUList,
  inventoryStatement_api,
  wearhouse_api,
} from "../helper";
import PaginationTable from "./../../../../_helper/_tablePagination";
import AVGCoverageTable from "./TableAVGCoverage";
import TableAssetRegister from "./TableAssetRegister";
import TableForDetail from "./TableForDetail";
import TableForINVInOut from "./TableForINVInOut";
import DetailsModal from "./detailsModal";
import DetailsModalNew from "./detailsModalNew";
import RegisterNewTable from "./registerNewTable";

const validationSchema = Yup.object().shape({});

export function TableRow(props) {
  const {
    authData: { profileData, selectedBusinessUnit },
    localStorage: { reportsInventoryStatement },
  } = useSelector((store) => store, shallowEqual);

  const initData = {
    plant: reportsInventoryStatement?.plant || "",
    wh: reportsInventoryStatement?.wh || "",
    itemCategory: reportsInventoryStatement?.itemCategory || "",
    itemSubCategory: reportsInventoryStatement?.itemSubCategory || "",
    fromDate: reportsInventoryStatement?.fromDate || _todayDate(),
    fromTime: reportsInventoryStatement?.fromTime || _currentTime(),
    toDate: reportsInventoryStatement?.toDate || _todayDate(),
    toTime: reportsInventoryStatement?.toTime || _currentTime(),
    itemType: reportsInventoryStatement?.itemType || "",
    type: reportsInventoryStatement?.type || "",
    avgDays: reportsInventoryStatement?.avgDays || "",
  };

  const dispatch = useDispatch();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(500);
  const [loading, setLoading] = useState(false);
  const [, setSearchKeyword] = useState(null);
  const [fromValues, setFromValues] = useState([]);
  const [plantDDL, setPlantDDL] = useState([]);
  const [itemTypeOption, setItemTypeOption] = useState([]);
  const [itemCategoryDDL, setItemCategoryDDL] = useState([]);
  const [itemSUBCategoryDDL, setItemSubCategoryDDL] = useState([]);
  const [wareHouseDDL, setwareHouseDDL] = useState([]);
  const [inventoryStatement, setInventoryStatement] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [tableItem, setTableItem] = useState("");
  const [, setSbuList] = useState("");

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getSBUList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSbuList
      );
      // businessUnitPlant_api(
      //   profileData?.accountId,
      //   selectedBusinessUnit?.value,
      //   profileData?.userId,
      //   7,
      //   setPlantDDL
      // );
      getItemTypeListDDL_api(setItemTypeOption);
    }
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    inventoryStatement_api({
      type: fromValues?.type,
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      warehouseId: fromValues?.wh?.value,
      plantId: fromValues?.plant?.value,
      itemtypeId: fromValues?.itemType?.value,
      itemcatId: fromValues?.itemCategory?.value,
      itemSubId: fromValues?.itemSubCategory?.value,
      fromDate: fromValues?.fromDate,
      toDate: fromValues?.toDate,
      pageNo,
      pageSize,
      setter: setInventoryStatement,
      setLoading,
      search: searchValue,
      avgDays: fromValues?.avgDays,
    });
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(0, pageSize, searchValue);
    setPageNo(0);
  };

  const closingQty = (item) => {
    return item?.numClosisngQty;
  };

  const closingValue = (item) => {
    const sum = item?.numClosisngQty * item?.numAvgRate;
    return sum;
  };

  const generateExcel = (values, pageSize) => {
    inventoryStatement_api({
      type: values?.type,
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      warehouseId: values?.wh?.value,
      plantId: values?.plant?.value,
      itemtypeId: values?.itemType?.value,
      itemcatId: values?.itemCategory?.value,
      itemSubId: values?.itemSubCategory?.value,
      fromDate: values?.fromDate,
      toDate: values?.toDate,
      pageNo,
      pageSize,
      setter: (data) => {
        const header = [
          {
            text: "SL",
            textFormat: "number",
            alignment: "center:middle",
            key: "sl",
          },
          {
            text: "Item",
            textFormat: "text",
            alignment: "center:middle",
            key: "strItemName",
          },
          {
            text: "Item Code",
            textFormat: "text",
            alignment: "center:middle",
            key: "strItemCode",
          },
          {
            text: "UoM Name",
            textFormat: "text",
            alignment: "center:middle",
            key: "strUomName",
          },
          {
            text: "Warehouse",
            textFormat: "text",
            alignment: "center:middle",
            key: "strWhname",
          },
          {
            text: "Location/Bin",
            textFormat: "text",
            alignment: "center:middle",
            key: "strLocation_BIN",
          },
          {
            text: "Opening Qty",
            textFormat: "number",
            alignment: "center:middle",
            key: "numOpenQty",
          },
          {
            text: "Opening Value",
            textFormat: "money",
            alignment: "center:middle",
            key: "numOpenValue",
          },
          {
            text: "Adjust Inv Qty",
            textFormat: "number",
            alignment: "center:middle",
            key: "numAdjustQty",
          },
          {
            text: "Adjust Inv Value",
            textFormat: "money",
            alignment: "center:middle",
            key: "numAdjustValue",
          },
          {
            text: "Receive Inv Qty",
            textFormat: "number",
            alignment: "center:middle",
            key: "numReceiveQty",
          },
          {
            text: "Receive Inv Value",
            textFormat: "money",
            alignment: "center:middle",
            key: "numReceiveValue",
          },
          {
            text: "Received From Production Qty",
            textFormat: "number",
            alignment: "center:middle",
            key: "numProductionQty",
          },
          {
            text: "Received From Production Value",
            textFormat: "money",
            alignment: "center:middle",
            key: "numProductionValue",
          },
          {
            text: "Issue Inv Qty",
            textFormat: "number",
            alignment: "center:middle",
            key: "numIssueQty",
          },
          {
            text: "Issue Inv Value",
            textFormat: "money",
            alignment: "center:middle",
            key: "numIssueValue",
          },
          {
            text: "Purchase Return Qty",
            textFormat: "number",
            alignment: "center:middle",
            key: "numPurReturnQty",
          },
          {
            text: "Purchase Return Value",
            textFormat: "money",
            alignment: "center:middle",
            key: "numPurReturnValue",
          },
          {
            text: "Transfer in Qty",
            textFormat: "number",
            alignment: "center:middle",
            key: "numTransInQty",
          },
          {
            text: "Transfer in Value",
            textFormat: "money",
            alignment: "center:middle",
            key: "numTransInValue",
          },
          {
            text: "Transfer out Qty",
            textFormat: "number",
            alignment: "center:middle",
            key: "numTransOutQty",
          },
          {
            text: "Transfer out Value",
            textFormat: "money",
            alignment: "center:middle",
            key: "numTransOutValue",
          },
          {
            text: "Closing Qty",
            textFormat: "number",
            alignment: "center:middle",
            key: "_closingQty",
          },
          {
            text: "Closing Value",
            textFormat: "money",
            alignment: "center:middle",
            key: "_cloasingValue",
          },
        ];
        const registerNewHeader = [
          {
            text: "SL",
            textFormat: "number",
            alignment: "center:middle",
            key: "sl",
          },
          {
            text: "Item Name",
            textFormat: "text",
            alignment: "center:middle",
            key: "strItemName",
          },
          {
            text: "Item Code",
            textFormat: "text",
            alignment: "center:middle",
            key: "strItemCode",
          },
          {
            text: "UoM Name",
            textFormat: "text",
            alignment: "center:middle",
            key: "strBaseUOM",
          },
          {
            text: "Opening Qty",
            textFormat: "number",
            alignment: "center:middle",
            key: "numOpenQty",
          },
          // {
          //   text: "Opening Value",
          //   textFormat: "number",
          //   alignment: "center:middle",
          //   key: "numOpenValue",
          // },
          {
            text: "In Qty",
            textFormat: "money",
            alignment: "center:middle",
            key: "numInQty",
          },
          // {
          //   text: "In Value",
          //   textFormat: "money",
          //   alignment: "center:middle",
          //   key: "numInValue",
          // },
          {
            text: "Out Qty",
            textFormat: "number",
            alignment: "center:middle",
            key: "numOutQty",
          },
          // {
          //   text: "Out Value",
          //   textFormat: "number",
          //   alignment: "center:middle",
          //   key: "numOutValue",
          // },
          {
            text: "Cloasing Qty",
            textFormat: "money",
            alignment: "center:middle",
            key: "numCloseQty",
          },
          {
            text: "Closing Value",
            textFormat: "money",
            alignment: "center:middle",
            key: "numClosingValue",
          },
          {
            text: "Rate",
            textFormat: "number",
            alignment: "center:middle",
            key: "numRate",
          },
        ];
        const _data = data.map((item, index) => {
          return {
            ...item,
            _closingQty: closingQty(item),
            _cloasingValue: closingValue(item),
            sl: index + 1,
            numClosingValue: item?.numCloseQty * item?.numRate,
          };
        });
        generateJsonToExcel(
           [5,6].includes(values?.type?.value) ? registerNewHeader : header,
          _data
        );
      },
      setLoading,
      avgDays: values?.avgDays,
    });
  };

  useEffect(() => {
    if (initData?.plant) {
      wearhouse_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.userId,
        initData?.plant?.value,
        setwareHouseDDL
      );
      getItemCategoryDDLByTypeId_api(
        profileData.accountId,
        selectedBusinessUnit.value,
        initData?.itemType?.value,
        setItemCategoryDDL
      );
      ItemSubCategory_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        initData?.itemCategory?.value,
        setItemSubCategoryDDL
      );
    }
  }, []);

  return (
    <>
      <ICustomCard title="Inventory Statement">
        <>
          <Formik
            enableReinitialize={true}
            initialValues={initData}
            validationSchema={validationSchema}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <>
                <div className="row">
                  <div className="col-lg-12">
                    {loading && <Loading />}
                    <Form className="form form-label-right">
                      {loading && <Loading />}
                      <div className="row global-form">
                        <div className="col-lg-3 col-xl-2">
                          <NewSelect
                            name="type"
                            options={[
                              { value: 3, label: "Inventory In-Out" },
                              { value: 4, label: "Inventory Coverage" },
                              { value: 5, label: "Inventory Register New" },
                              { value: 6, label: "Inventory Statement" },
                            ]}
                            value={values?.type}
                            label="Type"
                            onChange={(valueOption) => {
                              setInventoryStatement([]);
                              setFieldValue("type", valueOption);
                              businessUnitPlant_api(
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                profileData?.userId,
                                7,
                                setPlantDDL,
                                valueOption?.value
                              );
                              dispatch(
                                SetReportsInventoryStatementAction({
                                  ...values,
                                  type: valueOption,
                                })
                              );
                              setInventoryStatement([]);
                            }}
                            placeholder="Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3 col-xl-2">
                          <NewSelect
                            name="plant"
                            options={plantDDL || []}
                            value={values?.plant}
                            label="Plant"
                            onChange={(valueOption) => {
                              setFieldValue("plant", valueOption);
                              setFieldValue("wh", "");
                              wearhouse_api(
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                profileData?.userId,
                                valueOption?.value,
                                setwareHouseDDL,
                                values?.type?.value
                              );
                              dispatch(
                                SetReportsInventoryStatementAction({
                                  ...values,
                                  plant: valueOption,
                                  wh: "",
                                })
                              );
                              setInventoryStatement([]);
                            }}
                            placeholder="Plant"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3 col-xl-2">
                          <NewSelect
                            name="wh"
                            options={[...wareHouseDDL] || []}
                            value={values?.wh}
                            label="WareHouse"
                            onChange={(valueOption) => {
                              setFieldValue("wh", valueOption);
                              dispatch(
                                SetReportsInventoryStatementAction({
                                  ...values,
                                  wh: valueOption,
                                })
                              );
                              setInventoryStatement([]);
                            }}
                            placeholder="WareHouse"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3 col-xl-2">
                          <NewSelect
                            name="itemType"
                            options={itemTypeOption || []}
                            value={values?.itemType}
                            label="Item Type"
                            onChange={(valueOption) => {
                              setFieldValue("itemType", valueOption);
                              valueOption?.value !== 0 &&
                                setFieldValue("itemCategory", "");

                              getItemCategoryDDLByTypeId_api(
                                profileData.accountId,
                                selectedBusinessUnit.value,
                                valueOption?.value,
                                setItemCategoryDDL
                              );
                              dispatch(
                                SetReportsInventoryStatementAction({
                                  ...values,
                                  itemType: valueOption,
                                  itemCategory: "",
                                })
                              );
                              setInventoryStatement([]);
                            }}
                            placeholder="Item Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3 col-xl-2">
                          <NewSelect
                            name="itemCategory"
                            options={itemCategoryDDL || []}
                            value={values?.itemCategory}
                            label="Item Category"
                            onChange={(valueOption) => {
                              setFieldValue("itemCategory", valueOption);
                              setFieldValue("itemSubCategory", "");
                              ItemSubCategory_api(
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                valueOption?.value,
                                setItemSubCategoryDDL
                              );
                              dispatch(
                                SetReportsInventoryStatementAction({
                                  ...values,
                                  itemCategory: valueOption,
                                  itemSubCategory: "",
                                })
                              );
                              setInventoryStatement([]);
                            }}
                            placeholder="Item Category"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3 col-xl-2">
                          <NewSelect
                            name="itemSubCategory"
                            options={itemSUBCategoryDDL || []}
                            value={values?.itemSubCategory}
                            label="Item Sub Category"
                            onChange={(valueOption) => {
                              setFieldValue("itemSubCategory", valueOption);
                              dispatch(
                                SetReportsInventoryStatementAction({
                                  ...values,
                                  itemSubCategory: valueOption,
                                })
                              );
                              setInventoryStatement([]);
                            }}
                            placeholder="Sub Category"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        {values?.type?.value === 4 ? null : (
                          <>
                            <div className="col-lg-3 col-xl-2">
                              <label>From date</label>
                              <div className="d-flex">
                                <div style={{ flex: "1" }}>
                                  <InputField
                                    value={values?.fromDate}
                                    name="fromDate"
                                    placeholder="From date"
                                    type="date"
                                    onChange={(e) => {
                                      dispatch(
                                        SetReportsInventoryStatementAction({
                                          ...values,
                                          fromDate: e?.target?.value,
                                        })
                                      );
                                      setInventoryStatement([]);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-3 col-xl-2">
                              <label>To Date</label>
                              <div className="d-flex">
                                <div style={{ flex: "1" }}>
                                  <InputField
                                    value={values?.toDate}
                                    name="toDate"
                                    placeholder="To date"
                                    type="date"
                                    onChange={(e) => {
                                      dispatch(
                                        SetReportsInventoryStatementAction({
                                          ...values,
                                          toDate: e?.target?.value,
                                        })
                                      );
                                      setInventoryStatement([]);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {values?.type?.value === 4 ? (
                          <div className="col-lg-3 col-xl-2">
                            <label>Avg. Days</label>
                            <div className="d-flex">
                              <div style={{ flex: "1" }}>
                                <InputField
                                  value={values?.avgDays}
                                  name="avgDays"
                                  placeholder="Avg. Days"
                                  type="number"
                                  onChange={(e) => {
                                    if (+e.target.value < 0) return;
                                    dispatch(
                                      SetReportsInventoryStatementAction({
                                        ...values,
                                        avgDays: e?.target?.value,
                                      })
                                    );
                                    setInventoryStatement([]);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ) : null}
                        <div
                          style={{ marginTop: "22px" }}
                          className="col text-right"
                        >
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              setInventoryStatement([]);
                              inventoryStatement_api({
                                type: values?.type,
                                accId: profileData?.accountId,
                                buId: selectedBusinessUnit?.value,
                                warehouseId: values?.wh?.value,
                                plantId: values?.plant?.value,
                                itemtypeId: values?.itemType?.value,
                                itemcatId: values?.itemCategory?.value,
                                itemSubId: values?.itemSubCategory?.value,
                                fromDate: values?.fromDate,
                                toDate: values?.toDate,
                                pageNo,
                                pageSize,
                                setter: setInventoryStatement,
                                setLoading,
                                avgDays: values?.avgDays,
                              });
                              setFromValues(values);
                            }}
                            disabled={
                              !values?.plant ||
                              !values?.wh ||
                              !values?.itemCategory ||
                              !values?.itemSubCategory ||
                              !values?.fromDate ||
                              (values?.type?.value !== 4 && !values?.toDate) ||
                              !values?.type ||
                              (values?.type?.value === 4 && !values?.avgDays)
                            }
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </Form>

                    {values?.plant &&
                      values?.wh &&
                      values?.itemCategory &&
                      values?.itemSubCategory &&
                      values?.fromDate &&
                      values?.toDate &&
                      values?.type &&
                      inventoryStatement?.length > 0 && (
                        <div className="my-1 d-flex justify-content-between">
                          <PaginationSearch
                            placeholder="Item Name And Code Search"
                            paginationSearchHandler={paginationSearchHandler}
                            setter={setSearchKeyword}
                          />
                          <div></div>
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={(e) =>
                              generateExcel(
                                values,
                                inventoryStatement[0].totalRows
                              )
                            }
                          >
                            Export Excel
                          </button>
                        </div>
                      )}

                    {values?.type?.value === 2 ? (
                      <TableForDetail
                        setTableItem={setTableItem}
                        inventoryStatement={inventoryStatement}
                        setIsShowModal={setIsShowModal}
                        closingQty={closingQty}
                        closingValue={closingValue}
                      />
                    ) : values?.type?.value === 3 ? (
                      <TableForINVInOut
                        setTableItem={setTableItem}
                        inventoryStatement={inventoryStatement}
                        setIsShowModal={setIsShowModal}
                        closingQty={closingQty}
                        closingValue={closingValue}
                      />
                    ) : values?.type?.value === 4 ? (
                      <AVGCoverageTable
                        setTableItem={setTableItem}
                        inventoryStatement={inventoryStatement}
                        setIsShowModal={setIsShowModal}
                      />
                    ) :  [5,6].includes(values?.type?.value) ? (
                      <RegisterNewTable
                        setTableItem={setTableItem}
                        inventoryStatement={inventoryStatement}
                        setIsShowModal={setShowNewModal}
                      />
                    ) : (
                      <TableAssetRegister
                        setTableItem={setTableItem}
                        inventoryStatement={inventoryStatement}
                        setShowNewModal={setShowNewModal}
                      />
                    )}
                  </div>
                </div>
                {inventoryStatement?.length > 0 && (
                  <PaginationTable
                    count={inventoryStatement[0].totalRows}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    rowsPerPageOptions={[500, 1000, 1500, 2000]}
                  />
                )}
                <IViewModal
                  title=""
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                >
                  <DetailsModal
                    type={values?.type?.value}
                    tableItem={tableItem}
                    values={values}
                  />
                </IViewModal>

                <IViewModal
                  title=""
                  show={showNewModal}
                  onHide={() => setShowNewModal(false)}
                >
                  <DetailsModalNew
                    type={values?.type?.value}
                    whId={values?.wh?.value}
                    tableItem={tableItem}
                    values={values}
                  />
                </IViewModal>
              </>
            )}
          </Formik>
        </>
      </ICustomCard>
    </>
  );
}
