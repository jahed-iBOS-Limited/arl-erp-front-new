/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, CardHeaderToolbar, ModalProgressBar } from "../../../../../_metronic/_partials/controls";

import InputField from "../../../_helper/_inputField";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
// import "./style.css";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import Loading from "../../../_helper/_loading";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import NewSelect from "../../../_helper/_select";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
};

function LoadingStatusReport() {
  const [rowData, getRowData, rowLanding, setRowData] = useAxiosGet();
  const [channelDDL, getChannelDDL, channelDDLLoading] = useAxiosGet()
  // Get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getChannelDDL(`/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`)
  }, [buId, accId]);

  const totalQTY = rowData?.reduce((acc, curr) => acc + curr?.numTotalDeliveryQuantity, 0);

  const printRef = useRef();

  return (
    <>
      {(rowLanding || channelDDLLoading) && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, touched, errors }) => (
          <Card>
            {true && <ModalProgressBar />}
            <CardHeader title={"Loading Status Report"}>
              <CardHeaderToolbar>
                {/* {gridData?.length > 0 && (
                  <ReactToPrint
                    trigger={() => (
                      <button
                        type="button"
                        className="btn btn-primary px-4 py-1"
                      >
                        <img
                          style={{
                            width: "25px",
                            paddingRight: "5px",
                          }}
                          src={printIcon}
                          alt="print-icon"
                        />
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                  />
                )} */}
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <>
                <Form>
                  <div className="row global-form">
                    <div className="col-lg-12 row m-0 p-0">

                    <div className="col-lg-3">
                      <NewSelect
                        label="Dis. Channel"
                        options={[{value:0,label:"All"},...channelDDL] || []}
                        value={values?.channel}
                        name="channel"
                        onChange={(valueOption) => {
                          setFieldValue("channel", valueOption);
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
                          {value:"All",label:"All"},
                          {value:"Loading",label:"Loading"},
                          {value:"Completed",label:"Completed"}
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
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="From Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("fromDate", e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>To Date</label>
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="To Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("toDate", e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-lg-1">
                        <button
                          type="button"
                          style={{ marginTop: "17px" }}
                          disabled={
                            !values?.fromDate ||
                            !values?.toDate ||
                            !values?.channel

                          }
                          onClick={() => {
                           getRowData(`/tms/TMSReport/GetLoadingStatusReport?businessUnitId=${buId}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&statusType=${values?.status?.value || ""}&channelId=${values?.channel?.value || 0}`)
                            
                          }}
                          className="btn btn-primary"
                        >
                          Show
                        </button>
                      </div>
                      <div className=" mt-5">
                       {rowData?.length ? (
                          <ReactHtmlTableToExcel
                            id="test-table-xls-button-att-reports"
                            className="btn btn-primary"
                            table={"table-to-xlsx"}
                            filename={"maintenanceReport"}
                            sheet={"maintenanceReport"}
                            buttonText="Export Excel"
                          />
                       ):""}
                      </div>
                    </div>
                  </div>

                  {/* Table Start */}
                  {rowData?.length > 0 && (
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
                                 <tr key={index} style={{backgroundColor: item?.strLoadingStatus === "Loading" ? "#FFFAA0" : "Inherit"}}>
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
                                 <td colSpan="3" className="text-right" style={{fontWeight:"bold"}}>Total</td>
                                 <td className="text-center bold" style={{fontWeight:"bold"}}>{totalQTY.toFixed(2)}</td>
                                 <td colSpan="7"></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </Form>
              </>
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
}

export default LoadingStatusReport;
