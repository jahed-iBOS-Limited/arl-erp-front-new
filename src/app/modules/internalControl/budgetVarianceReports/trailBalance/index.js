import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { _todayDate } from "../../../_helper/_todayDate";
import { getBusinessUnitYearConfigData, getTrailBalanceReport } from "./helper";
import { fromDateFromApi } from "../../../_helper/_formDateFromApi";
import ICard from "../../../_helper/_card";
import InputField from "../../../_helper/_inputField";
import ILoader from "../../../_helper/loader/_loader";
import numberWithCommas from "../../../_helper/_numberWithCommas";
import NewSelect from "../../../_helper/_select";

const TrailBalanceReport = () => {
  const printRef = useRef();
  const [trailBalanceReportData, setTrailBalanceReportData] = useState([]);
  const [date, setDate] = useState({});
  const [fromDateFApi, setFromDateFApi] = useState("");
  const [loading, setLoading] = useState(false);
  const [initData, setInitData] = useState({
    balanceType: "3",
    fromDate: "",
    toDate: _todayDate(),
  });

  const { profileData, selectedBusinessUnit, businessUnitList } = useSelector(
    (state) => {
      return state.authData;
    },
    shallowEqual
  );

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getBusinessUnitYearConfigData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setInitData
      );

      fromDateFromApi(selectedBusinessUnit?.value, setFromDateFApi);
    }
  }, [profileData, selectedBusinessUnit]);
  const debitTotal = trailBalanceReportData.reduce((total, data) => {
    return total + data?.debit;
  }, 0);
  const creditTotal = trailBalanceReportData.reduce((total, data) => {
    return total + data?.credit;
  }, 0);

  return (
    <ICard title="Trial Balance" componentRef={printRef}>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, fromDate: fromDateFApi }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setDate({
            fromDate: values?.fromDate,
            toDate: values?.toDate,
          });
        }}
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
            <Form className="form form-label-right ">
              <div className="form-group row align-items-end">
                <div className="col-lg-3">
                  <NewSelect
                    name="currentBusinessUnit"
                    options={businessUnitList}
                    value={values?.currentBusinessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("currentBusinessUnit", valueOption || "");
                    }}
                    placeholder="Business Unit"
                    errors={errors}
                    touched={touched}
                    required={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate ? values?.fromDate : ""}
                    name="fromDate"
                    placeholder="From Date"
                    type="date"
                    // label="From Date"
                  />
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate ? values?.toDate : ""}
                    name="toDate"
                    placeholder="To Date"
                    type="date"
                  />
                </div>
                <div className="col-auto">
                  <button
                    disabled={!values?.currentBusinessUnit}
                    type="submit"
                    className="btn btn-primary"
                    onClick={() =>
                      getTrailBalanceReport(
                        profileData?.accountId,
                        values?.currentBusinessUnit?.value,
                        values?.fromDate,
                        values?.toDate,
                        values?.balanceType,
                        setTrailBalanceReportData,
                        setLoading
                      )
                    }
                  >
                    Show
                  </button>
                </div>
                {trailBalanceReportData.length > 0 && (
                  <div
                    className="col-lg-auto d-flex"
                    style={{ marginTop: "25px" }}
                  >
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button"
                      className="download-table-xls-button btn btn-primary"
                      table="table-to-xlsx"
                      filename="tablexls"
                      sheet="tablexls"
                      buttonText="Export Excel"
                    />
                    <ReactToPrint
                      pageStyle={
                        "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                      }
                      trigger={() => (
                        <button
                          type="button"
                          className="btn btn-sm btn-primary sales_invoice_btn ml-3"
                        >
                          Print
                        </button>
                      )}
                      content={() => printRef.current}
                    />
                  </div>
                )}

                <div className="col-lg-12"></div>
                <div className="col-lg-5 mt-2">
                  <label className="mr-3">
                    <input
                      type="radio"
                      name="balanceType"
                      checked={values?.balanceType === "1"}
                      className="mr-1 pointer"
                      style={{ position: "relative", top: "2px" }}
                      onChange={(valueOption) => {
                        getTrailBalanceReport(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.fromDate,
                          values?.toDate,
                          1,
                          setTrailBalanceReportData,
                          setLoading
                        );
                        setFieldValue("balanceType", "1");
                      }}
                    />
                    Account Class
                  </label>
                  <label className="mr-3">
                    <input
                      type="radio"
                      name="balanceType"
                      checked={values?.balanceType === "2"}
                      className="mr-1 pointer"
                      style={{ position: "relative", top: "2px" }}
                      onChange={(e) => {
                        getTrailBalanceReport(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.fromDate,
                          values?.toDate,
                          2,
                          setTrailBalanceReportData,
                          setLoading
                        );
                        setFieldValue("balanceType", "2");
                      }}
                    />
                    Account Category
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="balanceType"
                      checked={values?.balanceType === "3"}
                      className="mr-1 pointer"
                      style={{ position: "relative", top: "2px" }}
                      onChange={(e) => {
                        getTrailBalanceReport(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.fromDate,
                          values?.toDate,
                          3,
                          setTrailBalanceReportData,
                          setLoading
                        );
                        setFieldValue("balanceType", "3");
                      }}
                    />
                    General Ledger
                  </label>
                </div>
              </div>
              <div>
                {loading && (
                  <span>
                    <ILoader />
                  </span>
                )}
                {trailBalanceReportData.length > 0 && (
                  <div ref={printRef}>
                    <div className="row mt-4">
                      <div className="col-12 text-center">
                        <h3>{selectedBusinessUnit?.label}</h3>
                        <p>
                          From <span>{date?.fromDate}</span> To{" "}
                          <span>{date?.toDate}</span>
                        </p>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table
                        id="table-to-xlsx"
                        className="table table-striped table-bordered global-table table-font-size-sm"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th>Account Code</th>
                            <th>Account Name</th>
                            <th>Debit</th>
                            <th>Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trailBalanceReportData?.map((data, index) => (
                            <tr key={index}>
                              <td>
                                <div className="text-right pr-2">
                                  {data?.generalLedgerCode}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {data?.generalLedgerName}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {data?.debit !== 0
                                    ? numberWithCommas(
                                        Math.round(data?.debit) || 0
                                      )
                                    : " "}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {data?.credit !== 0
                                    ? numberWithCommas(
                                        Math.round(data?.credit) || 0
                                      )
                                    : " "}
                                </div>
                              </td>
                            </tr>
                          ))}
                          {trailBalanceReportData.length > 0 && (
                            <>
                              <tr>
                                <td></td>
                                <td style={{ textAlign: "right" }}>Total</td>
                                <td>
                                  <div className="text-right pr-2">
                                    {numberWithCommas(
                                      Math.round(debitTotal) || 0
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-right pr-2">
                                    {numberWithCommas(
                                      Math.round(creditTotal || 0)
                                    )}
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  className="text-center d-none"
                                  colSpan={4}
                                >{`System Generated Report - ${moment().format(
                                  "LLLL"
                                )}`}</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </ICard>
  );
};

export default TrailBalanceReport;
