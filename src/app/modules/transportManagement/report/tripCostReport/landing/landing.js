/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { Formik, Form } from "formik";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import { GetTripCostReport_api } from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "../../../../../../_metronic/_partials/controls/Card";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import "./style.css";
import { dateFormatWithMonthName } from "./../../../../_helper/_dateFormate";
import NewSelect from "./../../../../_helper/_select";
import InfoCircle from "../../../../_helper/_helperIcons/_infoCircle";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  shipPoint: { value: 0, label: "All" },
};

function TripCostReportReport() {
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [, getDetails] = useAxiosGet();
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

  let F_totalMillage = 0;
  let F_otalAdditionalMillage = 0;
  let F_T_totalMillage = 0;
  let F_totalStandardFuelCost = 0;
  let F_totalAdministrativeCost = 0;
  let F_totalDriverExpense = 0;
  let F_T_totalRouteExpense = 0;
  let F_totalTripFare = 0;
  let F_totalDownTripFareCash = 0;
  let F_totalDownTripFareCredit = 0;
  let F_T_totalTripFare = 0;
  let F_totalNetIncome = 0;
  let F_totalFuelCredit = 0;
  let F_totalNetPayable = 0;
  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, touched, errors }) => (
          <Card>
            {true && <ModalProgressBar />}
            <CardHeader title={"Trip Cost Report"}>
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
                          onChange={(e) => {
                            setGridData([]);
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
                            setGridData([]);
                          }}
                        />
                      </div>

                      <div className="col-lg-3">
                        <button
                          type="button"
                          style={{ marginTop: "17px" }}
                          disabled={
                            !values?.fromDate ||
                            !values?.toDate ||
                            !values?.shipPoint
                          }
                          onClick={() => {
                            setGridData([]);
                            GetTripCostReport_api(
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
                  {gridData?.length > 0 && (
                    <div ref={printRef}>
                      <div className="text-center my-2">
                        <h3>
                          <b> {selectedBusinessUnit?.label} </b>
                        </h3>
                        {/* <h5>
                      <b> {selectedBusinessUnit?.address} </b>
                    </h5> */}
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
                      </div>
                      <div className="loan-scrollable-tafble">
                        <div className="scroll-table _tafble">
                          <table className="table table-striped table-bordered global-table">
                            <thead>
                              <tr>
                                <th>SL</th>
                                <th style={{ width: "143px" }}>Vehicle No.</th>
                                <th style={{ width: "143px" }}>Vehicle Type</th>
                                <th>Millage (KM)</th>
                                <th>Addition Millage (Km)</th>
                                <th>Total Millage (KM)</th>
                                <th>Standard Fuel Cost</th>
                                <th>Administrative Cost</th>
                                <th>Driver Exp</th>
                                <th>Total Route Exp.</th>
                                <th>Trip Fare</th>
                                <th>Total Down Trip Fare Cash</th>
                                <th>Total Down Trip Fare Credit</th>
                                <th>Total Trip Fare</th>
                                <th>Net Income</th>
                                <th>Total Fuel Credit</th>
                                <th>Net Payable</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {gridData?.map((item, index) => {
                                //totalMillage
                                const totalMillage =
                                  item?.millage + item?.additionalMillage;
                                //totalRouteExpense
                                const totalRouteExpense =
                                  item?.standardFuelCost +
                                  item?.administrativeCost +
                                  item?.driverExpense;
                                //totalTripFare
                                const totalTripFare =
                                  item?.tripFare +
                                  item?.downTripFareCash +
                                  item?.downTripFareCredit;
                                ///netIncome
                                const netIncome =
                                  totalRouteExpense - totalTripFare;

                                //==========row CalCulation============//
                                F_totalMillage += item?.millage;

                                F_otalAdditionalMillage +=
                                  item?.additionalMillage;

                                F_T_totalMillage += totalMillage;

                                F_totalStandardFuelCost +=
                                  item?.standardFuelCost;

                                F_totalAdministrativeCost +=
                                  item?.administrativeCost;

                                F_totalDriverExpense += item?.driverExpense;

                                F_T_totalRouteExpense += totalRouteExpense;

                                F_totalTripFare += item?.tripFare;

                                F_totalDownTripFareCash +=
                                  item?.downTripFareCash;

                                F_totalDownTripFareCredit +=
                                  item?.downTripFareCredit;

                                F_T_totalTripFare += totalTripFare;

                                F_totalNetIncome += netIncome;

                                F_totalFuelCredit += item?.fuelCredit;

                                F_totalNetPayable += item?.netPayable;

                                return (
                                  <tr key={index}>
                                    <td className="text-center">
                                      {" "}
                                      {index + 1}
                                    </td>
                                    <td className="text-center">
                                      {item?.vehicleNo}
                                    </td>
                                    <td className="text-center">
                                      {item?.vehicleType}
                                    </td>
                                    <td className="text-center">
                                      {item?.millage}
                                    </td>
                                    <td className="text-center">
                                      {item?.additionalMillage}
                                    </td>
                                    <td className="text-center">
                                      {totalMillage}
                                    </td>
                                    <td className="text-center">
                                      {item?.standardFuelCost}
                                    </td>
                                    <td className="text-center">
                                      {item?.administrativeCost}
                                    </td>
                                    <td className="text-center">
                                      {item?.driverExpense}
                                    </td>
                                    <td className="text-center">
                                      {totalRouteExpense}
                                    </td>
                                    <td className="text-center">
                                      {item?.tripFare}
                                    </td>
                                    <td className="text-center">
                                      {item?.downTripFareCash}
                                    </td>
                                    <td className="text-center">
                                      {item?.downTripFareCredit}
                                    </td>
                                    <td className="text-center">
                                      {totalTripFare}
                                    </td>
                                    <td className="text-center">{netIncome}</td>
                                    <td className="text-center">
                                      {item?.fuelCredit}
                                    </td>
                                    <td className="text-center">
                                      {item?.netPayable}
                                    </td>
                                    <td className="text-center">
                                      <InfoCircle
                                        title={"View Details"}
                                        clickHandler={() => {
                                          getDetails(
                                            `/tms/ShipmentExpReport/GetTripCostReportByVehicleId?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&shipPointId=${values?.shipPoint?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&vehicleid=${item?.vehicelId}`
                                          );
                                        }}
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                              <tr>
                                <td className="text-right" colSpan="3">
                                  <b>Total:</b>
                                </td>

                                <td className="text-center">
                                  <b>{F_totalMillage}</b>
                                </td>
                                <td className="text-center">
                                  <b>{F_otalAdditionalMillage}</b>
                                </td>
                                <td className="text-center">
                                  <b>{F_T_totalMillage}</b>
                                </td>
                                <td className="text-center">
                                  <b>{F_totalStandardFuelCost}</b>
                                </td>
                                <td className="text-center">
                                  <b>{F_totalAdministrativeCost}</b>
                                </td>
                                <td className="text-center">
                                  <b>{F_totalDriverExpense}</b>
                                </td>
                                <td className="text-center">
                                  <b>{F_T_totalRouteExpense}</b>
                                </td>
                                <td className="text-center">
                                  <b>{F_totalTripFare}</b>
                                </td>
                                <td className="text-center">
                                  <b>{F_totalDownTripFareCash}</b>
                                </td>
                                <td className="text-center">
                                  <b>{F_totalDownTripFareCredit}</b>
                                </td>
                                <td className="text-center">
                                  <b>{F_T_totalTripFare}</b>
                                </td>
                                <td className="text-center">
                                  <b>{F_totalNetIncome}</b>
                                </td>
                                <td className="text-center">
                                  <b>{F_totalFuelCredit}</b>
                                </td>
                                <td className="text-center">
                                  <b>{F_totalNetPayable}</b>
                                </td>
                                <td className="text-center"></td>
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

export default TripCostReportReport;
