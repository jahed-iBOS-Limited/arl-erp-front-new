/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls/Card";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import printIcon from "../../../../_helper/images/print-icon.png";
import { getShipmentStandardCostByDate, } from "../helper";
import NewSelect from "./../../../../_helper/_select";
import "./style.css";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  shipPoint: { value: 0, label: "All" }
};

function DateWiseShipmentCostReport() {
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);

  // Get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
  const printRef = useRef();
  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, touched, errors }) => (
          <Card>
            {true && <ModalProgressBar />}
            <CardHeader title={"Date Wise Shipment Cost Report"}>
              <CardHeaderToolbar>
                {gridData?.length > 0 && (
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
                )}
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <>
                <Form>
                  <div className="row global-form">
                    <div className="col-lg-12 row m-0 p-0">
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipPoint"
                          options={[
                            { value: 0, label: "All" },
                            ...shipPointDDL,
                          ]}
                          value={values?.shipPoint}
                          label="Shippoint"
                          onChange={(valueOption) => {
                            setFieldValue("shipPoint", valueOption);
                            setGridData([]);
                          }}
                          placeholder="Shippoint"
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
                          type="button"
                          style={{ marginTop: "17px" }}
                          disabled={!values?.fromDate || !values?.toDate}
                          onClick={() => {
                            getShipmentStandardCostByDate(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              values?.fromDate,
                              values?.toDate,
                              values?.shipPoint?.value,
                              setGridData,
                              setLoading
                            );
                          }}
                          className="btn btn-primary"
                        >
                          Show
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Table Start */}
                  {gridData?.objRowList?.length > 0 && (
                    <div className="common-scrollable-table two-column-sticky">
                      <div className="scroll-table _table table-responsive" >
                        <table
                          ref={printRef}
                          className="table table-striped table-bordered global-table"
                        >
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>
                                Shipment Code
                              </th>
                              <th>Vehicle No</th>
                              <th>Customer Name</th>
                              {gridData?.objHeaderData?.map((item, index) => (
                                <>
                                  <th key={index} style={{ minWidth: "130px" }}>
                                    {item?.trCostComponentName}
                                  </th>
                                </>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {gridData?.objRowList?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center"> {index + 1}</td>
                                <td>
                                  <div className="pl-2">
                                    {item?.shipmentCode}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">{item?.vehicleNo}</div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {item?.customerName}
                                  </div>
                                </td>

                                {item?.objCompDetail?.map((itm, index) => (
                                  <>
                                    <td key={index}>
                                      <div className="text-right pr-2">
                                        {itm?.actualCost}
                                      </div>
                                    </td>
                                  </>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
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

export default DateWiseShipmentCostReport;
