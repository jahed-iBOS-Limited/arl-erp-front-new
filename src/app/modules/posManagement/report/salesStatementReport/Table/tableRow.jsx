/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
// import {
//   getAssetAssignReportData,
// } from "../helper";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import {
  businessUnitPlant_api,
  wearhouse_api,
  inventoryStatement_api,
  ItemSubCategory_api,
  getItemTypeListDDL_api,
  getItemCategoryDDLByTypeId_api,
  getSBUList,
} from "../helper";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _currentTime } from "../../../../_helper/_currentTime";
import IViewModal from "../../../../_helper/_viewModal";
import DetailsModal from "./detailsModal";
import TableForSummary from "./TableForSummary";
import TableForDetail from "./TableForDetail";
import { downloadFile } from "../../../../_helper/downloadFile";
import TableAssetRegister from "./TableAssetRegister";
import { SetReportsInventoryStatementAction } from "../../../../_helper/reduxForLocalStorage/Actions";

const validationSchema = Yup.object().shape({});

export function TableRow(props) {
  const { reportsInventoryStatement } = useSelector(
    (state) => state?.localStorage
  );

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
  };

  const dispatch = useDispatch();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);

  const [loading, setLoading] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [searchKeyword, setSearchKeyword] = useState(null);
  const [fromValues, setFromValues] = useState([]);
  const [plantDDL, setPlantDDL] = useState([]);
  const [itemTypeOption, setItemTypeOption] = useState([]);
  const [itemCategoryDDL, setItemCategoryDDL] = useState([]);
  const [itemSUBCategoryDDL, setItemSubCategoryDDL] = useState([]);
  const [wareHouseDDL, setwareHouseDDL] = useState([]);
  const [inventoryStatement, setInventoryStatement] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [tableItem, setTableItem] = useState("");
  const [sbuList, setSbuList] = useState("");

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getSBUList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSbuList
      );
      businessUnitPlant_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.userId,
        7,
        setPlantDDL
      );
      getItemTypeListDDL_api(setItemTypeOption);
      // ItemCategory_api(profileData?.accountId,
      //   selectedBusinessUnit?.value,setItemCategoryDDL)
    }
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    inventoryStatement_api(
      fromValues?.type,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      // fromValues?.sbu?.value,
      fromValues?.wh?.value,
      fromValues?.plant?.value,
      fromValues?.itemType?.value,
      fromValues?.itemCategory?.value,
      fromValues?.itemSubCategory?.value,
      fromValues?.fromDate,
      fromValues?.toDate,
      pageNo,
      pageSize,
      setInventoryStatement,
      setLoading,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(0, pageSize, searchValue);
    setPageNo(0);
  };

  const downloadFileBasedOnType = (values) => {
    const searchPath = searchKeyword ? `Search=${searchKeyword}&` : "";

    let api;
    if (values?.type?.value === 2) {
      // api = `/wms/WmsReport/InventoryStatementNewDownload?${searchPath}AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&warehouseId=${values?.wh?.value}&plantId=${values?.plant?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&Itemtype=${values?.itemType?.value}&ItemCategory=${values?.itemCategory?.value}&itemSubCategory=${values?.itemSubCategory?.value}&PageNo=${1}&PageSize=${10000}&viewOrder=desc`
      api = `/wms/WmsReport/InventoryStatementDetailDownload?${searchPath}AccountId=${
        profileData?.accountId
      }&BusinessUnitId=${selectedBusinessUnit?.value}&warehouseId=${
        values?.wh?.value
      }&plantId=${values?.plant?.value}&fromDate=${values?.fromDate}&toDate=${
        values?.toDate
      }&Itemtype=${values?.itemType?.value}&ItemCategory=${
        values?.itemCategory?.value
      }&itemSubCategory=${
        values?.itemSubCategory?.value
      }&PageNo=${pageNo}&PageSize=${10000}&viewOrder=desc`;
    } else {
      api = `/wms/WmsReport/InventoryRegisterDownload?AccountId=${
        profileData?.accountId
      }&BusinessUnitId=${selectedBusinessUnit?.value}&warehouseId=${
        values?.wh?.value
      }&plantId=${values?.plant?.value}&fromDate=${values?.fromDate}&toDate=${
        values?.toDate
      }&type=${values?.type?.value}&Itemtype=${
        values?.itemType?.value
      }&ItemCategory=${values?.itemCategory?.value}&itemSubCategory=${
        values?.itemSubCategory?.value
      }&PageNo=${pageNo}&PageSize=${10000}&viewOrder=desc`;
    }

    downloadFile(api, "Inventory Statement", "xlsx", setLoading);
  };

  return (
    <>
      <ICustomCard title="Sales Statement">
        <>
          <Formik
            enableReinitialize={true}
            initialValues={initData}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {}}
          >
            {({ errors, touched, setFieldValue, isValid, values }) => (
              <>
                <div className="row">
                  <div className="col-lg-12">
                    {loading && <Loading />}
                    <Form className="form form-label-right">
                      {/* Form */}
                      {loading && <Loading />}
                      <div className="row global-form">
                        <div className="col-lg-2">
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
                                setwareHouseDDL
                              );
                              dispatch(
                                SetReportsInventoryStatementAction({
                                  ...values,
                                  plant: valueOption,
                                  wh: "",
                                })
                              );
                            }}
                            placeholder="Plant"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="wh"
                            options={wareHouseDDL || []}
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
                            }}
                            placeholder="WareHouse"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
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
                                  itemCategory: ""
                                })
                              );
                            }}
                            placeholder="Item Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
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
                                  itemSubCategory: ""
                                })
                              );
                            }}
                            placeholder="Item Category"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
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
                            }}
                            placeholder="Sub Category"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="type"
                            options={[
                              { value: 2, label: "Inventory Register" },
                              { value: 1, label: "Service Register" },
                              { value: 3, label: "Asset Register" },
                            ]}
                            value={values?.type}
                            label="Type"
                            onChange={(valueOption) => {
                              setInventoryStatement([]);
                              setFieldValue("type", valueOption);
                              dispatch(
                                SetReportsInventoryStatementAction({
                                  ...values,
                                  type: valueOption,
                                })
                              );
                            }}
                            placeholder="Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
                          <label>From date</label>
                          <div className="d-flex">
                            <InputField
                              value={values?.fromDate}
                              name="fromDate"
                              placeholder="From date"
                              type="date"
                              onChange={(e)=>{
                                dispatch(
                                  SetReportsInventoryStatementAction({
                                    ...values,
                                    fromDate: e?.target?.value
                                  })
                                );
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-2 mt-1">
                          <label>To date</label>
                          <div className="d-flex">
                            <InputField
                              value={values?.toDate}
                              name="toDate"
                              placeholder="To date"
                              type="date"
                              onChange={(e)=>{
                                dispatch(
                                  SetReportsInventoryStatementAction({
                                    ...values,
                                    toDate: e?.target?.value
                                  })
                                );
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ marginTop: "22px" }} className="col-lg-2">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              inventoryStatement_api(
                                values?.type,
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                // values?.sbu?.value,
                                values?.wh?.value,
                                values?.plant?.value,
                                values?.itemType?.value,
                                values?.itemCategory?.value,
                                values?.itemSubCategory?.value,
                                values?.fromDate,
                                values?.toDate,
                                pageNo,
                                pageSize,
                                setInventoryStatement,
                                setLoading
                              );
                              setFromValues(values);
                            }}
                            disabled={
                              !values?.plant ||
                              !values?.wh ||
                              !values?.itemCategory ||
                              !values?.itemSubCategory ||
                              !values?.fromDate ||
                              // !values?.fromTime ||
                              !values?.toDate ||
                              !values?.type
                              //||
                              // !values?.toTime
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
                      // values?.fromTime &&
                      values?.toDate &&
                      values?.type &&
                      inventoryStatement?.length > 0 && (
                        <div className="my-1 d-flex justify-content-between">
                          <PaginationSearch
                            placeholder="Item Name And Code Search"
                            paginationSearchHandler={paginationSearchHandler}
                            setter={setSearchKeyword}
                          />
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={(e) => downloadFileBasedOnType(values)}
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
                      />
                    ) : (
                      <TableAssetRegister
                        setTableItem={setTableItem}
                        inventoryStatement={inventoryStatement}
                        setIsShowModal={setIsShowModal}
                      />
                    )}
                  </div>
                </div>
                {inventoryStatement?.length > 0 && (
                  <PaginationTable
                    count={inventoryStatement[0]?.totalRow}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    rowsPerPageOptions={[
                      5,
                      10,
                      20,
                      50,
                      100,
                      200,
                      300,
                      400,
                      500,
                    ]}
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
              </>
            )}
          </Formik>
        </>
      </ICustomCard>
    </>
  );
}
