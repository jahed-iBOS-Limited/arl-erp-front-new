import React, { useEffect, useState } from "react";
import PaginationSearch from "./../../../../_helper/_search";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
//import { useHistory } from 'react-router-dom'
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  getSBUList,
  getPlantList,
  getPurchaseOrgList,
  getTransactionGroupList,
  getWhList,
  getGRNStatementLanding,
} from "../helper";
import ILoader from "../../../../_helper/loader/_loader";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
//import PaginationTable from './../../../../_helper/_tablePagination'
import IView from "../../../../_helper/_helperIcons/_view";
import NewSelect from "../../../../_helper/_select";
import * as Yup from "yup";
import { _todayDate } from "../../../../_helper/_todayDate";
import PaginationTable from "../../../../_helper/_tablePagination";
import { setGRNStatementLandingAction } from "./../../../../_helper/reduxForLocalStorage/Actions";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { downloadFile } from "../../../../_helper/downloadFile";
import IViewModal from "../../../../_helper/_viewModal";
import { InventoryTransactionReportViewTableRow } from "../../../warehouseManagement/invTransaction/report/tableRow";

const validationSchema = Yup.object().shape({
  // toDate: Yup.string().when("fromDate", (fromDate, Schema) => {
  //   if (fromDate)
  //     return Schema.required("To date is required")
  // })
});

let initData = {
  wh: "",
  plant: "",
  sbu: "",
  status: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  transGroup: "",
  purchaseOrg: "",
};

const IssueReportTable = () => {
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [poList, setPoList] = useState([]);
  // ddl state
  const [sbuList, setSbuList] = useState("");
  const [plantList, setPlantList] = useState("");
  const [whList, setWhList] = useState("");
  const [, setTransGroupDDL] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState("");
  const dispatch = useDispatch();
  // landing
  const [landing, setLanding] = useState([]);

  // loading
  const [loading, setLoading] = useState(false);

  // redux data
  const {
    profileData,
    selectedBusinessUnit,
    GRNStatementLanding,
  } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
      GRNStatementLanding: state.localStorage.GRNStatementLanding,
    };
  });

  // get ddl
  useEffect(() => {
    getSBUList(profileData?.accountId, selectedBusinessUnit?.value, setSbuList);
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getPlantList(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantList
      );
      getTransactionGroupList(setTransGroupDDL);
    }
    if (GRNStatementLanding?.sbu?.value) {
      getGRNStatementLanding(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setLoading,
        setLanding,
        GRNStatementLanding?.sbu?.value,
        GRNStatementLanding?.plant?.value,
        GRNStatementLanding?.wh?.value,
        GRNStatementLanding?.fromDate,
        GRNStatementLanding?.toDate,
        GRNStatementLanding?.purchaseOrg?.value,
        pageNo,
        pageSize,
        GRNStatementLanding
      );
    }
    getPurchaseOrgList(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPoList
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getGRNStatementLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate,
      values?.purchaseOrg?.value,
      pageNo,
      pageSize
    );
  };

  const viewPurchaseOrderData = (values) => {
    getGRNStatementLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate,
      values?.purchaseOrg?.value,
      pageNo,
      pageSize
    );
  };

  const paginationSearchHandler = (value, values) => {
    getGRNStatementLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate,
      values?.purchaseOrg?.value,
      pageNo,
      pageSize,
      value
    );
  };

  const downloadExcelFile = (values) => {
    let api = `/wms/GrnStatement/newGrnStatementReportDownload?PurchaseOrganization=${
      values?.purchaseOrg?.value
    }&SbuId=${values?.sbu?.value}&PlantId=${values?.plant?.value}&WarehouseId=${
      values?.wh?.value
    }&FromDate=${values?.fromDate}&Todate=${
      values?.toDate
    }&PageNo=${pageNo}&PageSize=${10000}&viewOrder=desc`;
    downloadFile(api, "GRN Statement", "xlsx", setLoading);
  };

  return (
    <ICustomCard title="GRN Statement">
      <>
        <Formik
          enableReinitialize={true}
          validationSchema={validationSchema}
          initialValues={{ ...initData, ...GRNStatementLanding }}
          //validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
          }) => (
            <>
              <Form className="form form-label-left">
                <div
                  className="row global-form"
                  style={{ background: " #d6dadd" }}
                >
                  <div className="col-lg-3">
                    <NewSelect
                      name="sbu"
                      options={sbuList || []}
                      value={values?.sbu}
                      label="SBU"
                      onChange={(v) => {
                        setFieldValue("sbu", v);
                      }}
                      placeholder="SBU"
                      errors={errors}
                      touched={touched}
                    />{" "}
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="purchaseOrg"
                      options={poList || []}
                      value={values?.purchaseOrg}
                      label="Purchase Organization"
                      onChange={(optionValue) => {
                        setFieldValue("purchaseOrg", optionValue);
                      }}
                      placeholder="Purchase Organization"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="plant"
                      options={plantList || []}
                      value={values?.plant}
                      label="Plant"
                      onChange={(v) => {
                        getWhList(
                          profileData?.userId,
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          v?.value,
                          setWhList
                        );
                        setFieldValue("plant", v);
                        setFieldValue("wh", "");
                      }}
                      placeholder="Plant"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="wh"
                      options={whList || []}
                      value={values?.wh}
                      label="Warehouse"
                      onChange={(v) => {
                        setFieldValue("wh", v);
                      }}
                      placeholder="Warehouse"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <NewSelect
                      name="transGroup"
                      options={transGroupDDL || []}
                      value={values?.transGroup}
                      label="Transaction Group"
                      onChange={(v) => {
                        setFieldValue("transGroup", v);
                      }}
                      placeholder="Transaction Group"
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From date"
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 mt-5">
                    <button
                      type="submit"
                      className="btn btn-primary mr-1"
                      disabled={
                        !values?.plant ||
                        !values?.wh ||
                        !values?.sbu ||
                        !values?.fromDate ||
                        !values?.toDate
                      }
                      onClick={() => {
                        dispatch(setGRNStatementLandingAction(values));

                        viewPurchaseOrderData(values);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-primary"
                      type="button"
                      disabled={
                        !values?.plant ||
                        !values?.wh ||
                        !values?.sbu ||
                        !values?.fromDate ||
                        !values?.toDate
                      }
                      onClick={(e) => downloadExcelFile(values)}
                    >
                      Export Excel
                    </button>
                  </div>
                </div>
              </Form>
              <div className="row">
                {/* {loading && <Loading />} */}

                <div className="col-lg-12">
                  <PaginationSearch
                    placeholder="Transaction Code Search"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table table-font-size-sm">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>GRN Code</th>
                          <th>PO No</th>
                          <th>Supplier Code</th>
                          <th>Supplier Name</th>
                          <th>GRN Date</th>
                          {/* <th>Item ID</th> */}
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>UoM</th>
                          <th>Quantity</th>
                          <th>Value</th>
                          <th>VAT</th>
                          <th>Remarks</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      {loading ? (
                        <ILoader />
                      ) : (
                        <tbody>
                          {landing?.data?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.inventoryTransactionCode}</td>
                              <td>{item?.referenceCode}</td>
                              <td>{item?.strBusinessPartnerCode}</td>
                              <td>{item?.businessPartnerName}</td>
                              <td>{_dateFormatter(item?.transactionDate)}</td>
                              {/* <td>{item?.itemId}</td> */}
                              <td>{item?.strItemCode}</td>
                              <td>{item?.itemName}</td>
                              <td>{item?.uoMname}</td>
                              <td>{item?.transactionQuantity}</td>
                              <td>
                                {numberWithCommas(
                                  (item?.transactionValue || 0).toFixed(2)
                                )}
                              </td>
                              <td>
                                {numberWithCommas(
                                  (item?.vatAmount || 0).toFixed(2)
                                )}
                              </td>
                              <td>{item?.remarks}</td>
                              <td className="text-center align-middle">
                                {" "}
                                <span>
                                  <IView
                                    clickHandler={() => {
                                      // history.push({
                                      //   pathname: `/inventory-management/warehouse-management/inventorytransaction/reportview/${item?.inventoryTransactionId}/${item?.inventoryTransectionGroupId}`,
                                      //   item,
                                      // })
                                      setCurrentItem(item);
                                      setIsShowModal(true);
                                    }}
                                  />
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
              <IViewModal
                show={isShowModal}
                onHide={() => setIsShowModal(false)}
                title="View GRN Statement"
              >
                <InventoryTransactionReportViewTableRow
                  Invid={currentItem?.inventoryTransactionId}
                  grId={currentItem?.inventoryTransectionGroupId}
                  isHiddenBackBtn={true}
                />
              </IViewModal>
              {landing?.data?.length > 0 && (
                <PaginationTable
                  count={landing?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                  rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 300, 400, 500]}
                />
              )}
            </>
          )}
        </Formik>
      </>
    </ICustomCard>
  );
};

export default IssueReportTable;
