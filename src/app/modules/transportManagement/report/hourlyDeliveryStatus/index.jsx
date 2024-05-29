/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import { CardHeader } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Card, CardBody, CardHeaderToolbar, ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
const initData = {
//   fromDate: _monthFirstDate(),
  dteDate: _todayDate(),
};

function HourlyDeliveryStatusReport() {
  const [rowData, getRowData, rowLanding] = useAxiosGet();
//   const [channelDDL, getChannelDDL, channelDDLLoading] = useAxiosGet()
  // Get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
   //  getChannelDDL(`/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`)
  }, [buId, accId]);

//   const totalQTY = rowData?.reduce((acc, curr) => acc + curr?.numTotalDeliveryQuantity, 0);

  const printRef = useRef();

  return (
    <>
      {(rowLanding) && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, touched, errors }) => (
          <Card>
            {true && <ModalProgressBar />}
            <CardHeader title={"Hourly Delivery Status Report"}>
              <CardHeaderToolbar>
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <>
                <Form>
                  <div className="row global-form">
                    <div className="col-lg-12 row m-0 p-0">

                    {/* <div className="col-lg-3">
                      <NewSelect
                        label="Dis. Channel"
                        options={[{value:0,label:"All"}] || []}
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
                      </div> */}

                      <div className="col-lg-3">
                        <label>Date</label>
                        <InputField
                          value={values?.dteDate}
                          name="dteDate"
                          placeholder="Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("dteDate", e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-lg-1">
                        <button
                          type="button"
                          style={{ marginTop: "17px" }}
                          disabled={!values?.dteDate}
                          onClick={() => {
                           getRowData(`/tms/TMSReport/GetLoadingStatusReport?businessUnitId=${buId}&fromDate=${values?.fromDate}&toDate=${values?.dteDate}&statusType=${values?.status?.value || ""}&channelId=${values?.channel?.value || 0}`)
                            
                          }}
                          className="btn btn-primary"
                        >
                          Show
                        </button>
                      </div>
                      <div className=" mt-5">
                       {/* {rowData?.length ? (
                          <ReactHtmlTableToExcel
                            id="test-table-xls-button-att-reports"
                            className="btn btn-primary"
                            table={"table-to-xlsx"}
                            filename={"maintenanceReport"}
                            sheet={"maintenanceReport"}
                            buttonText="Export Excel"
                          />
                       ):""} */}
                      </div>
                    </div>
                  </div>

                  {/* Table Start */}
                  {/* {rowData?.length > 0 && ( */}
                    <div ref={printRef}>
                      
                      <div className="loan-scrollable-tafble">
                        <div className="scroll-table _tafble table-responsive">
                          <table id="table-to-xlsx" className="table table-striped table-bordered global-table">
                            <thead>
                              <tr>
                                 <th colSpan="6" className="text-center" style={{fontWeight:"bold",fontSize:"18px"}}>Hourly Delivery Status Report</th>
                              </tr>
                              <tr>
                                <th >SL</th>
                                <th >Hour</th>
                                <th colSpan={2}>Ready To Ship</th>
                                <th >Hourly Delivery</th>
                                <th >Cumulative/Total Delivery</th>
                              </tr>
                              <tr>
                                 <th></th>
                                 <th></th>
                                 <th>Truck/Trailor No</th>
                                 <th>Qty</th>
                                 <th></th>
                                 <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowData?.map((item, index) => (
                                 <>
                                 <tr key={index}>
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
                                  </tr>
                                 </>
                              ))}
                              {/* <tr>
                                 <td colSpan="3" className="text-right" style={{fontWeight:"bold"}}>Total</td>
                                 <td className="text-center bold" style={{fontWeight:"bold"}}>{totalQTY.toFixed(2)}</td>
                                 <td colSpan="7"></td>
                              </tr> */}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  {/* )} */}
                </Form>
              </>
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
}

export default HourlyDeliveryStatusReport;
