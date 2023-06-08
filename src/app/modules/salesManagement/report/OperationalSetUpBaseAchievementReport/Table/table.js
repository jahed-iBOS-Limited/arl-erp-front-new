import React, { useState, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import { Formik, Form } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import NewSelect from "../../../../_helper/_select";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import { GetPartnerAllotmentLanding } from "../helper";
import TargetVsSalesChart from "./targetVsSalesChart";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  certainDate: _todayDate(),
  reportType: { value: 1, label: "Customer Base" },
};

export default function OperationalSetUpBaseAchievementLanding() {
  const printRef = useRef();
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const getGridData = (values) => {
    GetPartnerAllotmentLanding(
      selectedBusinessUnit?.value,
      values?.reportType?.value,
      values?.fromDate,
      values?.toDate,
      values?.certainDate,
      setLoading,
      setRowDto
    );
  };

  // variables for total
  let numTargetQuantityTotal = 0;
  let QntOneDayTotal = 0;
  let QntOneMonthTotal = 0;
  let montsalesTotal = 0;
  let monCollectionAmountTotal = 0;
  let monTotalRevenueTargetTotal = 0;
  let monSeventyPercentTRTtotal = 0;
  let monCreditRealizationTotal = 0;

  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title="Set Up Base Achievement"
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
          isExcelBtn={true}
          excelFileNameWillbe="Set Up Base Achievement"
        >
          <div>
            <div className="mx-auto">
              <Formik enableReinitialize={true} initialValues={initData}>
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        <div className="col-lg-3">
                          <NewSelect
                            name="reportType"
                            options={[
                              { value: 1, label: "Customer Base" },
                              { value: 2, label: "Territory Base" },
                              { value: 3, label: "Area Base" },
                              { value: 4, label: "Region Base" },
                            ]}
                            value={values?.reportType}
                            label="Report Type"
                            onChange={(valueOption) => {
                              setRowDto([]);
                              setFieldValue("reportType", valueOption);
                            }}
                            placeholder="Report Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
                          <InputField
                            value={values?.fromDate}
                            label="From Date"
                            name="fromDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("fromDate", e?.target?.value);
                            }}
                          />
                        </div>
                        <div className="col-lg-2">
                          <InputField
                            value={values?.toDate}
                            label="To Date"
                            name="toDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("toDate", e?.target?.value);
                            }}
                          />
                        </div>
                        <div className="col-lg-2">
                          <InputField
                            value={values?.certaindate}
                            label="Certain Date"
                            name="certaindate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("certaindate", e?.target?.value);
                            }}
                          />
                        </div>
                        <div className="mt-5">
                          <button
                            className="btn btn-primary"
                            disabled={!values?.reportType}
                            onClick={() => {
                              setRowDto([]);
                              getGridData(values);
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </Form>
                    {loading && <Loading />}

                    {rowDto?.length > 0 ? (
                      <div className="sta-scrollable-table scroll-table-auto">
                        <div
                          style={{ maxHeight: "500px" }}
                          className="scroll-table _table scroll-table-auto"
                        >
                          {[2, 3, 4].includes(values?.reportType?.value) ? (
                            <table
                              id="table-to-xlsx"
                              ref={printRef}
                              className="table table-striped table-bordered bj-table bj-table-landing table-font-size-sm"
                            >
                              <thead>
                                <tr>
                                  <th style={{ width: "30px" }}>SL</th>
                                  {[2].includes(values?.reportType?.value) ? (
                                    <th style={{ width: "140px" }}>
                                      Territory
                                    </th>
                                  ) : null}

                                  {/* {[2, 3].includes(
                                    values?.reportType?.value
                                  ) ? (
                                    <th>Area</th>
                                  ) : null} */}

                                  {/* {[2, 3, 4].includes(
                                    values?.reportType?.value
                                  ) ? (
                                    <th>Region</th>
                                  ) : null} */}
                                  <th style={{ width: "80px" }}>Employee</th>
                                  <th style={{ width: "60px" }}>Target Qty</th>
                                  <th style={{ width: "80px" }}>One Day Qty</th>
                                  <th style={{ width: "80px" }}>Monthly Qty</th>
                                  <th style={{ width: "80px" }}>
                                    Revenue (TK.)
                                    {/* Monthly Sales (TK.) */}
                                  </th>
                                  {/* <th style={{ width: "80px" }}>
                                    Mortgage Amount (TK.)
                                  </th> */}
                                  <th style={{ width: "80px" }}>
                                    Monthly Achievement
                                  </th>
                                  <th style={{ width: "80px" }}>
                                    Monthly Collection Amount (TK.)
                                  </th>
                                  <th style={{ width: "80px" }}>
                                    Total Revenue Target (TK.)
                                  </th>
                                  <th style={{ width: "80px" }}>
                                    95% TRT (TK.)
                                  </th>
                                  <th style={{ width: "80px" }}>
                                    Credit Realization
                                  </th>
                                  <th style={{ width: "80px" }}>
                                    Sales Growth
                                  </th>
                                  <th style={{ width: "80px" }}>
                                    Total Visited Customer
                                  </th>
                                  <th style={{ width: "80px" }}>
                                    Total New Customer
                                  </th>
                                  <th style={{ width: "80px" }}>
                                    Salesforce Enroll
                                  </th>

                                  {/* <th style={{ width: "80px" }}>
                                    Total Sold to party
                                  </th> */}
                                  {/* <th style={{ width: "80px" }}>
                                    Total Ship to party
                                  </th> */}
                                  {/* <th style={{ width: "80px" }}>Sales Vs Bg</th> */}
                                </tr>
                              </thead>

                              <tbody>
                                {rowDto?.map((item, index) => {
                                  numTargetQuantityTotal += +item?.numTargetQuantity;
                                  QntOneDayTotal += +item?.QntOneDay;
                                  QntOneMonthTotal += +item?.QntOneMonth;
                                  montsalesTotal += +item?.montsales;
                                  monCollectionAmountTotal += +item?.monCollectionAmount;
                                  monTotalRevenueTargetTotal += +item?.monTotalRevenueTarget;
                                  monSeventyPercentTRTtotal += +item?.monSeventyPercentTRT;
                                  monCreditRealizationTotal += +item?.monCreditRealization;
                                  return (
                                    <tr key={index}>
                                      <td className="text-center">
                                        {index + 1}
                                      </td>

                                      {[2].includes(
                                        values?.reportType?.value
                                      ) ? (
                                        <td style={{ width: "120px" }}>
                                          {item?.nl7}
                                        </td>
                                      ) : null}

                                      {/* {[2, 3].includes(
                                      values?.reportType?.value
                                    ) ? (
                                      <td className="text-start">
                                        {item?.nl6}
                                      </td>
                                    ) : null} */}

                                      {/* {[2, 3, 4].includes(
                                      values?.reportType?.value
                                    ) ? (
                                      <td className="text-start">
                                        {item?.nl5}
                                      </td>
                                    ) : null} */}
                                      <td className="text-left">
                                        {item?.strEmployeeName}
                                      </td>
                                      <td className="text-right">
                                        {item?.numTargetQuantity}
                                      </td>
                                      <td className="text-right">
                                        {item?.QntOneDay}
                                      </td>
                                      <td className="text-right">
                                        {item?.QntOneMonth}
                                      </td>
                                      <td className="text-right">
                                        {item?.montsales}
                                      </td>
                                      {/* <td className="text-right">
                                      {item?.decMortgageAmount || 0}
                                    </td> */}
                                      <td
                                        style={{
                                          backgroundColor:
                                            +item?.monAchv >= 100
                                              ? "#34d399"
                                              : +item?.monAchv >= 80 &&
                                                +item?.monAchv < 100
                                              ? "#facc15"
                                              : "#f87171",
                                        }}
                                        className="text-right"
                                      >
                                        <strong>{item?.monAchv}%</strong>
                                      </td>
                                      <td className="text-right">
                                        {item?.monCollectionAmount}
                                      </td>
                                      <td className="text-right">
                                        {item?.monTotalRevenueTarget}
                                      </td>
                                      <td className="text-right">
                                        {item?.monSeventyPercentTRT}
                                      </td>
                                      <td
                                        className="text-right"
                                        style={{
                                          backgroundColor:
                                            +item?.monAchv >= 100
                                              ? "#34d399"
                                              : +item?.monAchv >= 80 &&
                                                +item?.monAchv < 100
                                              ? "#facc15"
                                              : "#f87171",
                                        }}
                                      >
                                        {item?.monCreditRealization}
                                      </td>
                                      <td className="text-right">
                                        {item?.decSalesGrowth}
                                      </td>
                                      <td className="text-right">
                                        {item?.intTotalVisitedCustomer}
                                      </td>
                                      <td className="text-right">
                                        {item?.intTotalNewCustomer}
                                      </td>
                                      <td className="text-left">
                                        {item?.intSalesForceEnrol}
                                      </td>

                                      {/* <td className="text-right">
                                      {item?.intTotalSoldtoparty}
                                    </td> */}
                                      {/* <td className="text-right">
                                      {item?.intTotalShiptoparty}
                                    </td> */}
                                      {/* <td className="text-right">
                                      {item?.salesvsbg}
                                    </td> */}
                                    </tr>
                                  );
                                })}
                                <tr style={{ fontWeight: "bold" }}>
                                  <td colSpan="3" className="text-right">
                                    <b>Grand Total </b>
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(numTargetQuantityTotal, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(QntOneDayTotal, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(QntOneMonthTotal, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(montsalesTotal, true)}
                                  </td>
                                  <td></td>
                                  <td className="text-right">
                                    {_fixedPoint(
                                      monCollectionAmountTotal,
                                      true
                                    )}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(
                                      monTotalRevenueTargetTotal,
                                      true
                                    )}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(
                                      monSeventyPercentTRTtotal,
                                      true
                                    )}
                                  </td>
                                  <td colSpan={2}></td>
                                </tr>
                              </tbody>
                            </table>
                          ) : (
                            <table
                              id="table-to-xlsx"
                              ref={printRef}
                              className="table table-striped table-bordered bj-table bj-table-landing table-font-size-sm"
                            >
                              <thead>
                                <tr>
                                  <th>SL</th>
                                  <th style={{ width: "230px" }}>
                                    Customer Name
                                  </th>
                                  <th>Region</th>
                                  <th>Area</th>
                                  <th style={{ width: "170px" }}>Territory</th>
                                  <th>Target Qty</th>
                                  <th>One Day Qty</th>
                                  <th>Monthly Qty</th>
                                  <th>Monthly Sales</th>
                                  <th>Monthly Achv</th>
                                  <th>Collection Amount</th>
                                  <th>TRT</th>
                                  <th>70% TRT</th>
                                  <th>Credit Realization</th>
                                </tr>
                              </thead>

                              <tbody>
                                {rowDto?.map((item, index) => {
                                  numTargetQuantityTotal += +item?.numTargetQuantity;
                                  QntOneDayTotal += +item?.QntOneDay;
                                  QntOneMonthTotal += +item?.QntOneMonth;
                                  montsalesTotal += +item?.montsales;
                                  monCollectionAmountTotal += +item?.monCollectionAmount;
                                  monTotalRevenueTargetTotal += +item?.monTotalRevenueTarget;
                                  monSeventyPercentTRTtotal += +item?.monSeventyPercentTRT;
                                  monCreditRealizationTotal += +item?.monCreditRealization;

                                  return (
                                    <tr key={index}>
                                      <td className="text-center">
                                        {index + 1}
                                      </td>
                                      <td>{item?.strBusinessPartnerName}</td>
                                      <td className="text-start">
                                        {item?.nl5}
                                      </td>
                                      <td className="text-start">
                                        {item?.nl6}
                                      </td>
                                      <td className="text-start">
                                        {item?.nl7}
                                      </td>

                                      <td className="text-right">
                                        {item?.numTargetQuantity}
                                      </td>
                                      <td className="text-right">
                                        {item?.QntOneDay}
                                      </td>
                                      <td className="text-right">
                                        {item?.QntOneMonth}
                                      </td>
                                      <td className="text-right">
                                        {item?.montsales}
                                      </td>
                                      <td className="text-right">
                                        {item?.monAchv}%
                                      </td>
                                      <td className="text-right">
                                        {item?.monCollectionAmount}
                                      </td>
                                      <td className="text-right">
                                        {item?.monTotalRevenueTarget}
                                      </td>
                                      <td className="text-right">
                                        {item?.monSeventyPercentTRT}
                                      </td>
                                      <td className="text-right">
                                        {item?.monCreditRealization}
                                      </td>
                                    </tr>
                                  );
                                })}
                                <tr>
                                  <td colSpan="5" className="text-right">
                                    <b>Grand Total </b>
                                  </td>
                                  <td className="text-right">
                                    {numTargetQuantityTotal}
                                  </td>
                                  <td className="text-right">
                                    {QntOneDayTotal}
                                  </td>
                                  <td className="text-right">
                                    {QntOneMonthTotal}
                                  </td>
                                  <td className="text-right">
                                    {montsalesTotal}
                                  </td>
                                  <td className="text-right"></td>
                                  <td className="text-right">
                                    {monCollectionAmountTotal}
                                  </td>
                                  <td className="text-right">
                                    {monTotalRevenueTargetTotal}
                                  </td>
                                  <td className="text-right">
                                    {monSeventyPercentTRTtotal}
                                  </td>
                                  <td className="text-right">
                                    {monCreditRealizationTotal}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    ) : null}

                    {rowDto?.length > 0 &&
                    [2, 3, 4].includes(values?.reportType?.value) ? (
                      <TargetVsSalesChart
                        rowData={rowDto}
                        reportType={values?.reportType?.value}
                      />
                    ) : null}
                  </>
                )}
              </Formik>
            </div>
          </div>
        </ICard>
      </>
    </Formik>
  );
}
