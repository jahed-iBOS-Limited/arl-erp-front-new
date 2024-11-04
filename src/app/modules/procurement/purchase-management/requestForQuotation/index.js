import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import NewSelect from "../../../_helper/_select";
import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../_helper/_inputField";
import IView from "../../../_helper/_helperIcons/_view";
import IEdit from "../../../_helper/_helperIcons/_edit";
import { _threeMonthAgoDate, _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import PaginationTable from "../../../_helper/_tablePagination";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  _dateFormatter,
  _dateTimeFormatter,
} from "../../../_helper/_dateFormate";
import Chips from "../../../_helper/chips/Chips";
import { createQuotationPrepare, rfqReportExcel } from "./helper";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import LocalAirportOutlinedIcon from "@material-ui/icons/LocalAirportOutlined";
import IConfirmModal from "../../../_helper/_confirmModal";
import PaginationSearch from "../../../_helper/_search";
import RfqModalForView from "./viewDetailsModal/rfqModalForView";
import { eProcurementBaseURL } from "../../../../App";
import { toast } from "react-toastify";
const initData = {
  purchaseOrganization: { value: 0, label: "ALL" },
  rfqType: { value: 1, label: "Standard RFQ" },
  sbu: "",
  plant: "",
  warehouse: "",
  status: { value: 0, label: "All" },
  fromDate: _threeMonthAgoDate(),
  toDate: _todayDate(),
};
export default function RequestForQuotationLanding() {
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const [rfqCode, setRfqCode] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [status, setStatus] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const [
    purchangeOrgListDDL,
    getPurchaseOrgListDDL,
    purchaseOrgListDDLloader,
  ] = useAxiosGet();
  const [
    landingData,
    getLandingData,
    landingDataLoader,
    setLandingData,
  ] = useAxiosGet();
  const [plantListDDL, getPlantListDDL, plantListDDLloader] = useAxiosGet();
  const [
    warehouseListDDL,
    getWarehouseListDDL,
    warehouseListDDLloader,
  ] = useAxiosGet();
  const [sbuListDDL, getSbuListDDL, sbuListDDLloader] = useAxiosGet();
  const [, getExcelData, excelDataLoader] = useAxiosGet();
  const [, sendToSupplier, sendToSupplierLoader] = useAxiosPost();

  useEffect(() => {
    getSbuListDDL(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Status=true`,
      (data) => {
        if (data && data[0]) {
          initData.sbu = data[0];
          getWarehouseListDDL(
            `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PlantId=${data[0]?.value}`
          );
        }
      }
    );
    getPlantListDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
    );
    getPurchaseOrgListDDL(
      `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // businessUnitId: sbu?.businessUnitId,
  //       plantId: 0,
  //       warehouseId: 0,
  //       status: topBarActiveitem?.nameForApi,
  //       pageNo: currentPage,
  //       pageSize: 30,
  //       search: searchQuery,

  const getData = (values, pageNo, pageSize, searchValue = "") => {
    getLandingData(
      `${eProcurementBaseURL}/RequestForQuotation/GetRequestForQuotationLanding?businessUnitId=${
        selectedBusinessUnit?.value
      }&plantId=${0}&warehouseId=${0}&status=${
        values?.status?.label
      }&pageNo=${pageNo}&pageSize=${pageSize}&search=${searchValue}`
    );
  };

  const sendNotificationToSupplier = (requestForQuotationId, cb) => {
    const payload = {
      requestForQuotationId: requestForQuotationId,
      businessUnitId: selectedBusinessUnit?.value,
    };
    sendToSupplier(
      `/procurement/RequestForQuotation/SendRequestForQuotationToSupplier`,
      payload,
      cb,
      true
    );
  };

  const notifySupplierHanlder = (
    requestForQuotationId,
    requestForQuotationCode,
    cb
  ) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to send mail for ${requestForQuotationCode}`,
      closeOnClickOutside: false,
      yesAlertFunc: () => {
        sendNotificationToSupplier(requestForQuotationId, cb);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getData(values, pageNo, pageSize, searchValue);
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  const handleREQReadyForPrepared = async (values, rfqId) => {
    const data = await createQuotationPrepare(profileData?.userId, rfqId);
    if (data && data?.statusCode === 200) {
      toast.success("RFQ Ready for Prepared");
      getData(values, pageNo, pageSize);
    } else {
      toast.warn("Failed to Prepared RFQ");
    }
  };
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
          {(purchaseOrgListDDLloader ||
            landingDataLoader ||
            plantListDDLloader ||
            warehouseListDDLloader ||
            sbuListDDLloader ||
            excelDataLoader ||
            sendToSupplierLoader) && <Loading />}
          <IForm
            title="Request for Quotation"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    col-lg-2
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        "/mngProcurement/purchase-management/rfq/create"
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="row global-form">
                {/* <div className="col-lg-2">
                  <NewSelect
                    name="purchaseOrganization"
                    options={
                      [{ value: 0, label: "ALL" }, ...purchangeOrgListDDL] || []
                    }
                    value={values?.purchaseOrganization}
                    label="Purchase Organization"
                    onChange={(v) => {
                      setFieldValue("purchaseOrganization", v);
                      setLandingData([]);
                    }}
                    placeholder="Purchase Organization"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="rfqType"
                    options={[
                      { value: 1, label: "Standard RFQ" },
                      { value: 2, label: "Open Tendering" },
                      { value: 3, label: "Limited Tendering" },
                      { value: 4, label: "Single Stage Tendering" },
                      { value: 5, label: "Two Stage Tendering" },
                    ]}
                    value={values?.rfqType}
                    label="RFQ Type"
                    onChange={(v) => {
                      setFieldValue("rfqType", v);
                      setLandingData([]);
                    }}
                    placeholder="RFQ Type"
                    errors={errors}
                    touched={touched}
                    // isDisabled={true}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="sbu"
                    options={sbuListDDL || []}
                    value={values?.sbu}
                    label="SBU"
                    onChange={(v) => {
                      setFieldValue("sbu", v);
                      setLandingData([]);
                    }}
                    placeholder="SBU"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="plant"
                    options={plantListDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(v) => {
                      if (v) {
                        setFieldValue("plant", v);
                        setFieldValue("warehouse", "");
                        setLandingData([]);
                        getWarehouseListDDL(
                          `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PlantId=${v?.value}`
                        );
                      } else {
                        setFieldValue("plant", "");
                        setFieldValue("warehouse", "");
                      }
                    }}
                    placeholder="Plant"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="warehouse"
                    options={warehouseListDDL || []}
                    value={values?.warehouse}
                    label="Warehouse"
                    onChange={(v) => {
                      setFieldValue("warehouse", v);
                      setLandingData([]);
                    }}
                    placeholder="Warehouse"
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.plant}
                  />
                </div> */}
                <div className="col-lg-2">
                  <NewSelect
                    name="status"
                    options={[
                      { value: 0, label: "All" },
                      { value: 1, label: "Live" },
                      { value: 2, label: "Prepared" },
                      { value: 3, label: "Upcoming" },
                      { value: 4, label: "Closed" },
                      { value: 5, label: "Approved" },
                    ]}
                    value={values?.status}
                    label="Status"
                    onChange={(v) => {
                      setFieldValue("status", v);
                      setLandingData([]);
                    }}
                    placeholder="Status"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* <div className="col-lg-2">
                  <InputField
                    label="From Date"
                    value={values?.fromDate}
                    name="fromDate"
                    placeholder="From Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                      setLandingData([]);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    label="To Date"
                    value={values?.toDate}
                    name="toDate"
                    placeholder="To Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                      setLandingData([]);
                    }}
                    disabled={false}
                  />
                </div> */}
                <div className="col-lg-4">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      marginTop: "18px",
                    }}
                    onClick={() => {
                      getData(values, pageNo, pageSize);
                    }}
                    disabled={!values?.status}
                  >
                    View
                  </button>
                  {/* <button
                    className="btn btn-primary ml-2"
                    style={{ marginTop: "18px" }}
                    onClick={() => {
                      getExcelData(
                        `/procurement/RequestForQuotation/GetRequestForQuotationPasignation?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&RequestTypeId=${values?.rfqType?.value}&SBUId=${values?.sbu?.value}&PurchaseOrganizationId=${values?.purchaseOrganization?.value}&PlantId=${values?.plant?.value}&WearHouseId=${values?.warehouse?.value}&status=${values?.status?.label}&viewOrder=asc&PageNo=1&PageSize=${landingData?.totalCount}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`,
                        (data) => {
                          rfqReportExcel(data?.data);
                        }
                      );
                    }}
                    disabled={!landingData?.data?.length}
                    type="button"
                  >
                    Export Excel
                  </button> */}
                </div>
              </div>

              <div className="mb-2">
                <PaginationSearch
                  placeholder="Search RFQ No"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                  isDisabledFiled={landingData?.data?.length > 0 ? false : true}
                />
              </div>
              <div>
                {landingData?.data?.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>RFQ No</th>
                          <th>RFQ Title</th>
                          <th>RFQ Date</th>
                          <th>Currency</th>
                          <th>RFQ Start Date-Time</th>
                          <th>RFQ End Date-Time</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {landingData?.data?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              {item?.purchaseOrganizationName ===
                              "Foreign Procurement" ? (
                                <span>
                                  <LocalAirportOutlinedIcon
                                    style={{
                                      color: "#00FF00",
                                      marginRight: "5px",
                                      rotate: "90deg",
                                      fontSize: "15px",
                                    }}
                                  />
                                  {item?.requestForQuotationCode}
                                </span>
                              ) : (
                                <span>
                                  <LocalShippingIcon
                                    style={{
                                      color: "#000000",
                                      marginRight: "5px",
                                      fontSize: "15px",
                                    }}
                                  />

                                  {item?.requestForQuotationCode}
                                </span>
                              )}
                            </td>
                            <td className="text-left">
                              {item?.rfqTitle || ""}
                            </td>
                            <td className="text-center">
                              {_dateFormatter(item?.rfqDate)}
                            </td>
                            <td>{item?.currencyCode}</td>
                            <td className="text-center">
                              {_dateTimeFormatter(item?.quotationEntryStart)}
                            </td>
                            <td className="text-center">
                              {_dateTimeFormatter(item?.validTillDate)}
                            </td>
                            <td className="text-center">
                              {item?.status && item?.status === "Live" ? (
                                <Chips
                                  classes="badge-danger"
                                  status={item?.status}
                                  style={{
                                    backgroundColor: "#A52A2A",
                                    color: "#ffffff",
                                    height: "17px",
                                    width: "50px",
                                  }}
                                />
                              ) : item?.status === "Closed" ? (
                                <Chips
                                  classes="badge-dark"
                                  status={item?.status}
                                  style={{
                                    height: "17px",
                                    width: "50px",
                                  }}
                                />
                              ) : item?.status === "Prepared" ? (
                                <Chips
                                  classes="badge-warning"
                                  status={item?.status}
                                  style={{
                                    height: "17px",
                                    width: "50px",
                                  }}
                                />
                              ) : item?.status === "Upcoming" ? (
                                <Chips
                                  classes="badge-info"
                                  status={item?.status}
                                  style={{
                                    height: "17px",
                                    width: "50px",
                                    backgroundColor: "#2ecc71",
                                  }}
                                />
                              ) : item?.status === "Approved" ? (
                                <Chips
                                  classes="badge-success"
                                  status={item?.status}
                                  style={{
                                    height: "17px",
                                    width: "50px",
                                    backgroundColor: "#2ecc71",
                                  }}
                                />
                              ) : (
                                item?.status || ""
                              )}
                            </td>
                            <td>
                              <span
                                onClick={() => {
                                  setId(item?.requestForQuotationId);
                                  setRfqCode(item?.requestForQuotationCode);
                                  setStatus(item?.status);
                                  setCreatedBy(item?.createdBy);
                                  setShowModal(true);
                                }}
                                className="ml-2 mr-3"
                              >
                                <IView />
                              </span>
                              <span className="ml-1">
                                <IEdit
                                  onClick={(e) => {
                                    history.push(
                                      `/mngProcurement/purchase-management/rfq/edit/${item?.requestForQuotationId}`
                                    );
                                  }}
                                />
                              </span>
                              {item?.status?.trim() === "Upcoming" && (
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">
                                      {"Send To Prepared"}
                                    </Tooltip>
                                  }
                                >
                                  <span
                                    className="ml-2 pointer"
                                    onClick={() => {
                                      handleREQReadyForPrepared(
                                        values,
                                        item?.requestForQuotationId
                                      );
                                    }}
                                  >
                                    <i class="fas fa-paper-plane"></i>
                                  </span>
                                </OverlayTrigger>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
                {landingData?.data?.length > 0 ? (
                  <PaginationTable
                    count={landingData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                ) : null}
              </div>
              <IViewModal
                show={showModal}
                onHide={() => {
                  setShowModal(false);
                  setId(null);
                  setRfqCode(null);
                  setStatus(null);
                }}
              >
                <RfqModalForView
                  rfqId={id}
                  rfqCode={`${rfqCode}`}
                  rfqStatus={status}
                  rfqCreatedBy={createdBy}
                />
              </IViewModal>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
