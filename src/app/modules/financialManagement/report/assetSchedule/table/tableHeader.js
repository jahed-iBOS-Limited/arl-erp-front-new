import React, { useEffect, useRef, useState } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useSelector, shallowEqual } from "react-redux";
import { getAssetSchedule } from "../helper";
import ICard from "../../../../_helper/_card";
import ILoader from "../../../../_helper/loader/_loader";
import numberWithCommas from "./../../../../_helper/_numberWithCommas";
import ReactToPrint from "react-to-print";
import { getBusinessUnitYearConfigData } from "../helper";

const AssetSchedule = () => {
  const printRef = useRef();
  const [date, setDate] = useState({});
  const [assetScheduleData, setAssetScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initData, setInitData] = useState({
    balanceType: "3",
    fromDate: "2021-01-07",
    toDate: _todayDate(),
  });

  //get profileData from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getBusinessUnitYearConfigData(profileData?.accountId, selectedBusinessUnit?.value, setInitData);
    }
  }, [profileData, selectedBusinessUnit]);
  const costTotal = assetScheduleData.reduce((total, data) => {
    return total + data?.numCostValue;
  }, 0);
  const additionTotal = assetScheduleData.reduce((total, data) => {
    return total + data?.addition;
  }, 0);
  const depValueTotal = assetScheduleData.reduce((total, data) => {
    return total + data?.numDepValue;
  }, 0);
  // const printRef = useRef();
  return (
    <ICard title="Asset Schedule" componentRef={printRef}>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setDate({
            fromDate: values?.fromDate,
            toDate: values?.toDate,
          });
        }}
      >
        {({ handleSubmit, resetForm, values, errors, touched, setFieldValue, isValid }) => (
          <>
            <Form className="form form-label-right ">
              <div className="form-group row align-items-end">
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
                  <InputField value={values?.toDate ? values?.toDate : ""} name="toDate" placeholder="To Date" type="date" />
                </div>
                <div className="col-auto">
                  <button type="submit" className="btn btn-primary" onClick={() => getAssetSchedule(values?.fromDate, values?.toDate,selectedBusinessUnit?.value, setAssetScheduleData, setLoading)}>
                    Show
                  </button>
                </div>
                {assetScheduleData.length > 0 && (
                  <div className="col-lg-auto d-flex" style={{ marginTop: "25px" }}>
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button"
                      className="download-table-xls-button btn btn-primary"
                      table="table-to-xlsx"
                      filename="tablexls"
                      sheet="tablexls"
                      buttonText="Export Excel"
                    />
                    <ReactToPrint
                      pageStyle={"@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"}
                      trigger={() => (
                        <button type="button" className="btn btn-sm btn-primary sales_invoice_btn ml-3">
                          Print
                        </button>
                      )}
                      content={() => printRef.current}
                    />
                  </div>
                )}

                <div className="col-lg-12"></div>
              </div>
              <div>
                {loading && (
                  <span>
                    <ILoader />
                  </span>
                )}
                {assetScheduleData.length > 0 && (
                  <div ref={printRef}>
                    <div className="row mt-4">
                      <div className="col-12 text-center">
                        <h3>{selectedBusinessUnit?.label}</h3>
                        <p>
                          From <span>{date?.fromDate}</span> To <span>{date?.toDate}</span>
                        </p>
                      </div>
                    </div>
                    <table id="table-to-xlsx" className="table table-striped table-bordered global-table table-font-size-sm" style={{ width: "100%" }}>
                      <thead>
                        <tr>
                          <th>Particulars</th>
                          <th>Cost Value</th>
                          <th>Addition Value </th>
                          <th>Total Value </th>
                          <th>Depreciation Value </th>
                          <th>Written Down Value </th>
                        </tr>
                      </thead>
                      <tbody>
                        {assetScheduleData?.map((data, index) => {
                          let totalValue = data?.numCostValue + data?.addition;
                          let wrtnDwnVal = totalValue - data?.numDepValue;
                          return (
                            <tr key={index}>
                              <td>
                                <div className=" text-left pl-2">{data?.strItemCategoryName}</div>
                              </td>
                              <td>
                                <div className="text-right pr-2">{numberWithCommas(Math.round(data?.numCostValue))}</div>
                              </td>
                              <td>
                                <div className="text-right pr-2">{numberWithCommas(Math.round(data?.addition))}</div>
                              </td>
                              <td>
                                <div className="text-right pr-2">{numberWithCommas(totalValue)}</div>
                              </td>
                              <td>
                                <div className="text-right pr-2">{numberWithCommas(data?.numDepValue)}</div>
                              </td>
                              <td>
                                <div className="text-right pr-2">{numberWithCommas(wrtnDwnVal)}</div>
                              </td>
                            </tr>
                          );
                        })}
                        {assetScheduleData.length > 0 && (
                          <tr>
                            <td style={{ textAlign: "right" }}>Total</td>
                            <td>
                              <div className="text-right pr-2">{numberWithCommas(costTotal)}</div>
                            </td>
                            <td>
                              <div className="text-right pr-2">{numberWithCommas(additionTotal)}</div>
                            </td>
                            <td>
                              <div className="text-right pr-2">{numberWithCommas(costTotal + additionTotal)}</div>
                            </td>
                            <td>
                              <div className="text-right pr-2">{numberWithCommas(depValueTotal)}</div>
                            </td>
                            <td>
                              <div className="text-right pr-2">{numberWithCommas(costTotal + additionTotal - depValueTotal)}</div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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

export default AssetSchedule;
