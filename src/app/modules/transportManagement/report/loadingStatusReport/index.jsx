/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, CardHeaderToolbar, ModalProgressBar } from "../../../../../_metronic/_partials/controls";

import InputField from "../../../_helper/_inputField";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
// import "./style.css";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import Loading from "../../../_helper/_loading";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import NewSelect from "../../../_helper/_select";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import { _todayDate } from "../../../_helper/_todayDate";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import RATForm from "../../../_helper/commonInputFieldsGroups/ratForm";
import { getCustomerNameDDL } from "../../../salesManagement/report/customerStatementModified/helper";
import { GetSalesOrganizationDDL_api } from "../../../salesManagement/report/shipToPartyDelivery/helper";

const initData = {
  disChannelLoadingStatusReport: "",
  status: "",
  fromDateLoadingR: _monthFirstDate(),
  toDateLoadingR: _todayDate(),
  fromDate: "",
  toDate: "",
};

function LoadingStatusReport() {
  const [rowData, getRowData, rowLanding, setRowData] = useAxiosGet();
  const [showReport, setShowReport] = useState()
  const [salesOrgDDL, setSalesOrgDDl] = useState()
  const [customerNameDDL, setCustomerNameDDL] = useState([]);
  const [channelDDL, getChannelDDL, channelDDLLoading] = useAxiosGet()
  // Get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      getChannelDDL(`/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`)
      GetSalesOrganizationDDL_api(accId, buId, setSalesOrgDDl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const totalQTY = rowData?.reduce((acc, curr) => acc + curr?.numTotalDeliveryQuantity, 0);

  const printRef = useRef();

  return (
    <>
      {(rowLanding || channelDDLLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          reportType: {
            value: 1,
            label: "Loading Status"
          },
          ...initData
        }}
      >
        {({ values, setFieldValue, touched, errors }) => (
          <Card>
            {true && <ModalProgressBar />}
            <CardHeader title={"Loading Status Report"}>
              <CardHeaderToolbar>
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <>
                <Form>
                  <div className="row global-form">
                    <div className="col-lg-12 row m-0 p-0">
                      <div className="col-lg-3">
                        <NewSelect
                          name="reportType"
                          options={[{ value: 1, label: "Loading Status" }, { value: 2, label: "Vehicle Summary Report" }]}
                          value={values?.reportType}
                          label="Report Type"
                          onChange={(valueOption) => {
                            setFieldValue("reportType", valueOption);
                            setShowReport(false)
                            setRowData([])
                            setFieldValue("disChannelLoadingStatusReport", "");
                            setFieldValue("status", "");
                            setFieldValue("shipPoint", "")
                            setFieldValue("salesOrg", "")
                          }}
                          placeholder="Report Type"
                        />
                      </div>
                      {values?.reportType?.value === 2 ?
                        (
                          <>
                            <div className="col-lg-3">
                              <NewSelect
                                name="shipPoint"
                                options={shipPointDDL}
                                value={values?.shipPoint}
                                label="ShipPoint"
                                onChange={(valueOption) => {
                                  setFieldValue("shipPoint", valueOption);
                                  setShowReport(false)
                                }}
                                placeholder="ShipPoint"
                              />
                            </div>
                            <div className="col-lg-3">
                              <NewSelect
                                name="salesOrg"
                                options={salesOrgDDL || []}
                                value={values?.salesOrg}
                                label="Sales Org"
                                onChange={(valueOption) => {
                                  setFieldValue("customerName", "");
                                  setFieldValue("channel", "");
                                  setFieldValue("salesOrg", valueOption);
                                  setShowReport(false)
                                }}
                                placeholder="Sales Org"
                                errors={errors}
                                touched={touched}
                              />
                            </div>

                            <RATForm
                              obj={{
                                values,
                                setFieldValue,
                                channel: true,
                                region: true,
                                area: true,
                                territory: true,
                                columnSize: "col-lg-2",
                                onChange: (allValue, fieldName) => {
                                  setShowReport(false);
                                  if (fieldName === 'channel') {
                                    getCustomerNameDDL(
                                      accId,
                                      buId,
                                      values?.salesOrg?.value,
                                      allValue?.channel?.value,
                                      setCustomerNameDDL
                                    );
                                  }
                                },
                              }}
                            />
                            <div className="col-lg-3">
                              <NewSelect
                                name="customerName"
                                options={customerNameDDL}
                                value={values?.customerName}
                                label="Customer Name"
                                onChange={(valueOption) => {
                                  setFieldValue("customerName", valueOption);
                                  setShowReport(false)
                                  console.log("dd", values)
                                }}
                                placeholder="Customer name"
                                errors={errors}
                                touched={touched}
                                isDisabled={!values?.channel}
                              />
                            </div>
                            <FromDateToDateForm
                              obj={{
                                values,
                                setFieldValue,
                                type: "datetime-local",
                                step: true,
                                onChange: () => {
                                  setShowReport(false);
                                },
                              }}
                            />
                            <div className="col-lg-1">
                              <button
                                type="button"
                                style={{ marginTop: "17px" }}
                                disabled={
                                  !values?.shipPoint ||
                                  !values?.salesOrg ||
                                  !values?.channel ||
                                  !values?.region ||
                                  !values?.area ||
                                  !values?.territory ||
                                  !values?.customerName ||
                                  !values?.fromDate ||
                                  !values?.toDate
                                }
                                onClick={() => {
                                  setShowReport(true);
                                }}
                                className="btn btn-primary"
                              >
                                Show
                              </button>
                            </div>

                          </>
                        )
                        : (
                          <>
                            <div className="col-lg-3">
                              <NewSelect
                                label="Dis. Channel"
                                options={[{ value: 0, label: "All" }, ...channelDDL] || []}
                                value={values?.disChannelLoadingStatusReport}
                                name="disChannelLoadingStatusReport"
                                onChange={(valueOption) => {
                                  setFieldValue("disChannelLoadingStatusReport", valueOption);
                                  setRowData([])
                                }}
                                placeholder="Channel"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-3">
                              <NewSelect
                                label="Status"
                                options={[
                                  { value: "All", label: "All" },
                                  { value: "Loading", label: "Loading" },
                                  { value: "Completed", label: "Completed" }
                                ] || []}
                                value={values?.status}
                                name="status"
                                onChange={(valueOption) => {
                                  setFieldValue("status", valueOption);
                                  setRowData([])
                                }}
                                placeholder="Status"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-3">
                              <label>From Date</label>
                              <InputField
                                value={values?.fromDateLoadingR}
                                name="fromDateLoadingR"
                                placeholder="From Date"
                                type="date"
                                onChange={(e) => {
                                  setFieldValue("fromDateLoadingR", e.target.value);
                                }}
                              />
                            </div>

                            <div className="col-lg-3">
                              <label>To Date</label>
                              <InputField
                                value={values?.toDateLoadingR}
                                name="toDateLoadingR"
                                placeholder="To Date"
                                type="date"
                                onChange={(e) => {
                                  setFieldValue("toDateLoadingR", e.target.value);
                                }}
                              />
                            </div>

                            <div className="col-lg-1">
                              <button
                                type="button"
                                style={{ marginTop: "17px" }}
                                disabled={
                                  !values?.reportType ||
                                  !values?.disChannelLoadingStatusReport ||
                                  !values?.status ||
                                  !values?.fromDateLoadingR ||
                                  !values?.toDateLoadingR
                                }
                                onClick={() => {
                                  getRowData(`/tms/TMSReport/GetLoadingStatusReport?businessUnitId=${buId}&fromDate=${values?.fromDateLoadingR}&toDate=${values?.toDateLoadingR}&statusType=${values?.status?.value || ""}&channelId=${values?.disChannelLoadingStatusReport?.value || 0}`)

                                }}
                                className="btn btn-primary"
                              >
                                Show
                              </button>
                            </div>
                          </>
                        )}
                    </div>
                  </div>
                </Form>
                {/* Table Start */}
                {rowData?.length > 0 && values?.reportType?.value === 1 && (
                  <div ref={printRef}>
                    {/* <div className="text-center my-2">
                        <h3>
                          <b> {selectedBusinessUnit?.label} </b>
                        </h3>
                        <h5>
                      <b> {selectedBusinessUnit?.address} </b>
                    </h5>
                        <h4>Summary Report For Vehicle Trip Cost</h4>
                        <div className="d-flex justify-content-center">
                          <h5>
                            For The Month:
                            {dateFormatWithMonthName(values?.fromDate)}
                          </h5>
                          <h5 className="ml-5">
                            To: {dateFormatWithMonthName(values?.toDate)}
                          </h5>
                        </div>
                      </div> */}
                    <div className="loan-scrollable-tafble">
                      <div className="scroll-table _tafble table-responsive">
                        <table id="table-to-xlsx" className="table table-striped table-bordered global-table">
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Customer Name / Ship To</th>
                              <th>SD NO</th>
                              <th>QTY (MT)</th>
                              <th>Truck No</th>
                              <th>Entry Date</th>
                              <th>Entry Time</th>
                              <th>Loading Status</th>
                              <th>Exit Date</th>
                              <th>Exit Time</th>
                              <th>Actual Time of Delivery</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowData?.map((item, index) => (
                              <>
                                <tr key={index} style={{ backgroundColor: item?.strLoadingStatus === "Loading" ? "#FFFAA0" : "Inherit" }}>
                                  <td className="text-center">
                                    {index + 1}
                                  </td>
                                  <td className="text-left">
                                    {item?.strShipToPartnerName}
                                  </td>
                                  <td className="text-center">
                                    {item?.strDeliveryCode}
                                  </td>
                                  <td className="text-center">
                                    {item?.numTotalDeliveryQuantity}
                                  </td>
                                  <td className="text-center">
                                    {item?.strVehicleNumber}
                                  </td>
                                  <td className="text-center">
                                    {item?.dteDate ? _dateFormatter(item?.dteDate) : ""}
                                  </td>
                                  <td className="text-center">
                                    {item?.tmInTime ? _timeFormatter(item?.tmInTime) : ""}
                                  </td>
                                  <td className="text-center">
                                    {item?.strLoadingStatus}
                                  </td>
                                  <td className="text-center">
                                    {item?.dteOutDate ? _dateFormatter(item?.dteOutDate) : ""}
                                  </td>
                                  <td className="text-center">
                                    {item?.tmOutTime ? _timeFormatter(item?.tmOutTime) : ""}
                                  </td>
                                  <td className="text-center">
                                    {item?.strActualDeliveryTime}
                                  </td>
                                </tr>
                              </>
                            ))}
                            <tr>
                              <td colSpan="3" className="text-right" style={{ fontWeight: "bold" }}>Total</td>
                              <td className="text-center bold" style={{ fontWeight: "bold" }}>{totalQTY.toFixed(2)}</td>
                              <td colSpan="7"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {showReport && values?.reportType?.value === 2 ?
                  <PowerBIReport
                    reportId={`50f8a5a5-5638-408d-aee8-cb31769e1192`}
                    groupId={`e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`}
                    parameterValues={[
                      {
                        name: "ShipPoint",
                        value: `${values?.shipPoint?.value || 0}`,
                      },
                      { name: "intUnit", value: `${buId || 0}` },
                      {
                        name: "intChannel",
                        value: `${values?.channel?.value || 0}`,
                      },
                      {
                        name: "Region",
                        value: `${values?.region?.value || 0}`,
                      },
                      {
                        name: "Area",
                        value: `${values?.area?.value || 0}`,
                      },
                      {
                        name: "Territory",
                        value: `${values?.territory?.value || 0}`,
                      },
                      {
                        name: "intSalesOrganization",
                        value: `${values?.salesOrg?.value || 0}`,
                      },
                      {
                        name: "intCustomerid",
                        value: `${values?.customerName?.value || 0}`,
                      },
                      {
                        name: "FromDate",
                        value: values?.fromDate
                      },
                      {
                        name: "ToDate",
                        value: values?.toDate
                      },
                    ]}
                    parameterPanel={false}
                  />
                  : null}
              </>
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
}

export default LoadingStatusReport;
