import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import { _monthLastDate } from "../../../_helper/_monthLastDate";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import PaginationSearch from "../../../_helper/_search";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import ICon from "../../../chartering/_chartinghelper/icons/_icon";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import JobOrderView from "./jobOrderView";
import SalesOrderView from "./salesOrderView";

const initData = {
  orderType: "",
  sbu: "",
  plant: "",
  salesOrg: "",
  shipPoint: "",
  distributionChannel: "",
  salesOffice: "",
  fromDate: _todayDate(),
  toDate: _monthLastDate(),
};

export default function SalesOrderLanding() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [rowData, getRowData, rowDataLoader, setRowData] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [orderTypeDDL, getOrderTypeDDL, orderTypeLoading] = useAxiosGet();
  const [sbuDDL, getSbuDDL, sbuLoading] = useAxiosGet();
  const [plantDDL, getPlantDDL, plantLoading] = useAxiosGet();
  const [salesOrgDDL, getSalesOrgDDL, salesOrgLoading] = useAxiosGet();
  const [
    shipPointDDL,
    getShipPointDDL,
    shipPointLoading,
    setShipPointDDL,
  ] = useAxiosGet();
  const [
    distributionChannelDDL,
    getDistributionChannelDDL,
    distributionChannelLoading,
  ] = useAxiosGet();
  const [salesOfficeDDL, getSalesOfficeDDL, salesOfficeLoading] = useAxiosGet();

  const [orderViewModal, setOrderViewModal] = useState(false);
  const [jobOrderViewModal, setJobOrderViewModal] = useState(false);
  const [salesQuotationId, setSalesQuotationId] = useState(null);

  useEffect(() => {
    getOrderTypeDDL(
      `/oms/SalesOrder/GetSalesOrderTypeConfigDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    getSbuDDL(
      `/domain/BusinessUnitDomain/GetBusinessAreaDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
    );
    getSalesOrgDDL(
      `/oms/SalesOrder/GetSODDLbySBUId?AccountId=${
        profileData?.accountId
      }&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=${36}`
    );
    getShipPointDDL(
      `/domain/OrganizationalUnitUserPermission/GetOrganizationalUnitUserPermissionByUnitId?UserId=${profileData?.userId}&ClientId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`,
      (data) => {
        setShipPointDDL(
          data?.map((data) => {
            return {
              value: data?.organizationUnitReffId,
              label: data?.organizationUnitReffName,
              address: data?.address,
            };
          })
        );
      }
    );
    getDistributionChannelDDL(
      `/oms/SalesOrder/GetDistributionChannelDDLBySBUId?AccountId=${
        profileData?.accountId
      }&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=${36}`
    );
    getSalesOfficeDDL(
      `/oms/SalesOffice/GetSalesOfficeDDLbyId?AccountId=${
        profileData?.accountId
      }&BusinessUnitId=${selectedBusinessUnit?.value}&SalesOrgId=${7}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {};

  const modifySalesOrgDDL = salesOrgDDL?.filter((data) => data?.value === 7);
  const modifyDistribuationChannelDDL = distributionChannelDDL?.filter(
    (data) => data?.value === 96
  );

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getRowData(
      `/oms/SalesOrder/GetForeignSalesOrderPagination?searchTerm=${searchValue}
         &accountId=${profileData?.accountId}&businessUnitId=${
        selectedBusinessUnit?.value
      }
         &salesOrgId=${values?.salesOrg?.value || 0}&plantId=${values?.plant
        ?.value || 0}
         &shipPointId=${values?.shipPoint?.value || 0}&channelId=${values
        ?.distributionChannel?.value || 0}
         &salesOfficeId=${values?.salesOffice?.value ||
           0}&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc`,
      (data) => {
        setRowData(data);
      }
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        orderType: orderTypeDDL?.length > 0 ? orderTypeDDL[0] : "",
        sbu: sbuDDL?.length > 0 ? sbuDDL[0] : "",
        salesOrg: modifySalesOrgDDL?.length > 0 ? modifySalesOrgDDL[0] : "",
        shipPoint: shipPointDDL?.length > 0 ? shipPointDDL[0] : "",
        distributionChannel:
          modifyDistribuationChannelDDL?.length > 0
            ? modifyDistribuationChannelDDL[0]
            : "",
        plant: plantDDL?.length > 0 ? plantDDL[1] : "",
        salesOffice: salesOfficeDDL?.length > 0 ? salesOfficeDDL[0] : "",
      }}
      // validationSchema={{}}
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
          {(salesOfficeLoading ||
            distributionChannelLoading ||
            shipPointLoading ||
            salesOrgLoading ||
            plantLoading ||
            sbuLoading ||
            orderTypeLoading ||
            rowDataLoader) && <Loading />}
          <IForm
            title="Sales Order"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={
                      !values?.shipPoint ||
                      !values?.salesOffice ||
                      !values?.distributionChannel ||
                      !values?.salesOrg ||
                      !values?.plant ||
                      !values?.sbu ||
                      !values?.orderType
                    }
                    onClick={() => {
                      history.push(
                        `/managementExport/exptransaction/salesorder/create`,
                        { landingData: values }
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
                <div className="col-lg-3">
                  <NewSelect
                    name="orderType"
                    options={orderTypeDDL}
                    value={values?.orderType}
                    label="Order Type"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("orderType", valueOption);
                      } else {
                        setFieldValue("orderType", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="sbu"
                    options={sbuDDL}
                    value={values?.sbu}
                    label="SBU"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("sbu", valueOption);

                        setFieldValue("salesOrg", "");
                        setFieldValue("distributionChannel", "");
                      } else {
                        setFieldValue("sbu", "");
                        setFieldValue("salesOrg", "");
                        setFieldValue("distributionChannel", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantDDL}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("plant", valueOption);
                        setFieldValue("salesOffice", "");
                      } else {
                        setFieldValue("plant", "");
                        setFieldValue("salesOffice", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="salesOrg"
                    options={modifySalesOrgDDL}
                    value={values?.salesOrg}
                    label="Sales Org"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("salesOrg", valueOption);
                      } else {
                        setFieldValue("salesOrg", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shipPoint"
                    options={shipPointDDL}
                    value={values?.shipPoint}
                    label="ShipPoint"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("shipPoint", valueOption);
                      } else {
                        setFieldValue("shipPoint", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="distributionChannel"
                    options={modifyDistribuationChannelDDL}
                    value={values?.distributionChannel}
                    label="Distribution Channel"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("distributionChannel", valueOption);
                      } else {
                        setFieldValue("distributionChannel", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="salesOffice"
                    options={salesOfficeDDL}
                    value={values?.salesOffice}
                    label="Sales Office"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("salesOffice", valueOption);
                      } else {
                        setFieldValue("salesOffice", "");
                      }
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    placeholder="From Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    placeholder="To Date"
                    type="date"
                  />
                </div>

                <div className="col-lg-3">
                  <button
                    style={{
                      marginTop: "17px",
                    }}
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      getRowData(
                        `/oms/SalesOrder/GetForeignSalesOrderPagination?accountId=${
                          profileData?.accountId
                        }&businessUnitId=${
                          selectedBusinessUnit?.value
                        }&salesOrgId=${values?.salesOrg?.value ||
                          0}&plantId=${values?.plant?.value ||
                          0}&shipPointId=${values?.shipPoint?.value ||
                          0}&channelId=${values?.distributionChannel?.value ||
                          0}&salesOfficeId=${values?.salesOffice?.value ||
                          0}&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc`,
                        (data) => {
                          setRowData(data);
                        }
                      );
                    }}
                    disabled={false}
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="mt-2">
                    <PaginationSearch
                      placeholder="Quotation No. & Party Name & Code"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table sales_order_landing_table">
                    <thead>
                      <tr>
                        <th style={{ width: "35px" }}>SL</th>
                        <th style={{ width: "90px" }}>Order No</th>
                        <th style={{ width: "90px" }}>Order Date</th>
                        <th style={{ width: "90px" }}>Ref. Type</th>
                        <th>Sold To Party</th>
                        <th>ShipPoint</th>
                        <th>Payment Terms</th>
                        <th style={{ width: "75px" }}>Order Total</th>
                        <th style={{ width: "60px" }}>Approval Status</th>
                        <th style={{ width: "100px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.data?.length > 0 &&
                        rowData?.data?.map((td, index) => (
                          <tr key={index}>
                            <td className="text-center"> {td.sl} </td>
                            <td>
                              <div className="pl-2">{td.salesOrderCode}</div>
                            </td>
                            <td className="text-center">
                              {td?.salesOrderDate
                                ? _dateFormatter(td.salesOrderDate)
                                : ""}
                            </td>
                            <td className="text-center">
                              {td?.refferenceTypeName}
                            </td>
                            <td> {td.soldToPartnerName} </td>
                            <td> {td.shippointName} </td>
                            <td> {td.paymentTermsName} </td>
                            <td className="text-right">
                              {" "}
                              {td.totalOrderValue
                                ? _formatMoney(td.totalOrderValue)
                                : ""}
                            </td>
                            <td className="text-right">{""}</td>
                            <td>
                              <div className="d-flex justify-content-around">
                                <span className="view">
                                  <IView
                                    clickHandler={() => {
                                      setSalesQuotationId(td?.quotationId);
                                      setOrderViewModal(true);
                                    }}
                                  />
                                </span>
                                <span className="view">
                                  <ICon
                                    title={"View Attachment"}
                                    onClick={() => {
                                      if (td?.attachmentno) {
                                        dispatch(
                                          getDownlloadFileView_Action(
                                            td?.attachmentno
                                          )
                                        );
                                      } else {
                                        toast.warn("Attachment not uploaded!");
                                      }
                                    }}
                                  >
                                    <i class="fas fa-file-image"></i>{" "}
                                  </ICon>
                                </span>
                                {/* job order */}
                                {/* <span className="Job Order Entry">
                                  <IEdit
                                    title="Job Order Entry"
                                    onClick={() => {
                                      history.push({
                                        pathname: `/managementExport/exptransaction/salesorder/jobOrder/${td?.quotationId}`,
                                        state: td,
                                      });
                                    }}
                                  />
                                </span> */}
                                <span className="view">
                                  <IView
                                    clickHandler={() => {
                                      setSalesQuotationId(td?.quotationId);
                                      setJobOrderViewModal(true);
                                    }}
                                  />
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  </div>
                  {/* Sales Order modal */}
                  <IViewModal
                    title="View Foreign Sales Order"
                    show={orderViewModal}
                    onHide={() => {
                      setOrderViewModal(false);
                      setSalesQuotationId(null);
                    }}
                  >
                    <SalesOrderView salesQuotationId={salesQuotationId} />
                  </IViewModal>
                  {/* Job Order modal */}
                  <IViewModal
                    title="View Job Order"
                    show={jobOrderViewModal}
                    onHide={() => {
                      setJobOrderViewModal(false);
                      setSalesQuotationId(null);
                    }}
                  >
                    <JobOrderView salesQuotationId={salesQuotationId}/>
                  </IViewModal>
                </div>
                {rowData?.data?.length > 0 && (
                  <PaginationTable
                    count={rowData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
