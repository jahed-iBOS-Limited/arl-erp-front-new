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
import { fromDateFromApi } from "../../../../_helper/_formDateFromApi";
import { _firstDateOfCurrentFiscalYear } from "../../../../_helper/_firstDateOfCurrentFiscalYear";

const AssetSchedule = () => {
  const printRef = useRef();
  const [date, setDate] = useState({});
  const [assetScheduleData, setAssetScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initData, setInitData] = useState({
    balanceType: "3",
    fromDate: _firstDateOfCurrentFiscalYear(),
    toDate: _todayDate(),
  });

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [fromDateFApi, setFromDateFApi] = useState("");

  useEffect(() => {
    fromDateFromApi(selectedBusinessUnit?.value, setFromDateFApi);

    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getBusinessUnitYearConfigData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setInitData
      );
    }
  }, [profileData, selectedBusinessUnit]);

  return (
    <ICard title="Asset Schedule" componentRef={printRef}>
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
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate ? values?.fromDate : ""}
                    name="fromDate"
                    placeholder="From Date"
                    type="date"
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
                    type="submit"
                    className="btn btn-primary"
                    onClick={() =>
                      getAssetSchedule(
                        values?.fromDate,
                        values?.toDate,
                        selectedBusinessUnit?.value,
                        setAssetScheduleData,
                        setLoading
                      )
                    }
                  >
                    Show
                  </button>
                </div>
                {assetScheduleData.length > 0 && (
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
                          From <span>{date?.fromDate}</span> To{" "}
                          <span>{date?.toDate}</span>
                        </p>
                      </div>
                    </div>
                    <table
                      id="table-to-xlsx"
                      className="table table-striped table-bordered global-table table-font-size-sm"
                      style={{ width: "100%" }}
                    >
                      {/* <thead>
                        <tr>
                          <th>Asset Name</th>
                          <th>Opening</th>

                          <th>Addition</th>
                          <th>Adjustment</th>
                          <th>Closing</th>
                          <th>Opening Acc Dep</th>
                          <th>Charge During The Period</th>
                          <th>Closing Acc Dep</th>
                          <th>Adj Acc Dep</th>
                          <th>Net Asset Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assetScheduleData?.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div className=" text-left pl-2">
                                  {data?.strGlName}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {numberWithCommas(
                                    Math.round(data?.numOpening)
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {numberWithCommas(
                                    Math.round(data?.numAddition)
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {numberWithCommas(
                                    Math.round(data?.numAdjustment)
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {numberWithCommas(
                                    Math.round(data?.numClosing)
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {numberWithCommas(
                                    Math.round(data?.numOpeningAccDep)
                                  )}
                                </div>
                              </td>
                              <td></td>
                              <td>
                                <div className="text-right pr-2">
                                  {numberWithCommas(
                                    Math.round(data?.numClosingAccDep)
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {numberWithCommas(
                                    Math.round(data?.numAdjAccDep)
                                  )}
                                </div>
                              </td>
                              <td></td>
                            </tr>
                          );
                        })}
                        {assetScheduleData.length > 0 && (
                          <tr>
                            <td
                              style={{ textAlign: "right", fontWeight: "bold" }}
                            >
                              Total
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {assetScheduleData.reduce((total, data) => {
                                  return total + Math.round(data?.numOpening);
                                }, 0)}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {assetScheduleData.reduce((total, data) => {
                                  return total + Math.round(data?.numClosing);
                                }, 0)}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {assetScheduleData.reduce((total, data) => {
                                  return total + Math.round(data?.numAddition);
                                }, 0)}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {assetScheduleData
                                  .reduce((total, data) => {
                                    return (
                                      total + Math.round(data?.numAdjustment)
                                    );
                                  }, 0)
                                  .toFixed(2)}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {assetScheduleData
                                  .reduce((total, data) => {
                                    return (
                                      total + Math.round(data?.numOpeningAccDep)
                                    );
                                  }, 0)
                                  .toFixed(2)}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {assetScheduleData.reduce((total, data) => {
                                  return (
                                    total + Math.round(data?.numClosingAccDep)
                                  );
                                }, 0)}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {assetScheduleData.reduce((total, data) => {
                                  return total + Math.round(data?.numAdjAccDep);
                                }, 0)}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody> */}
                      <thead>
                        <tr style={{ fontSize: "18px" }}>
                          <th>Asset Name</th>
                          <th>Opening</th>
                          <th>Addition</th>
                          <th>Adjustment</th>
                          <th>Closing</th>
                          <th>Opening Acc. Dep.</th>
                          <th>
                            Charge During <br /> The Period
                          </th>
                          <th>Closing Acc. Dep.</th>
                          <th>Net Asset Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assetScheduleData?.map((item, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                fontWeight: "bold",
                                textAlign: "left",
                                paddingLeft: "1px",
                              }}
                            >
                              {item?.strGlName}
                            </td>
                            <td
                              style={{
                                fontWeight: "bold",
                                textAlign: "end",
                                fontSize: "12px",
                                width: "120px",
                              }}
                            >
                              {numberWithCommas(
                                Math.round(item?.numOpening) || 0
                              )}
                            </td>
                            <td
                              style={{
                                textAlign: "end",
                                paddingRight: "3px",
                                fontSize: "12px",
                                width: "140px",
                              }}
                            >
                              {numberWithCommas(
                                Math.round(item?.numAddition) || 0
                              )}
                            </td>
                            <td
                              style={{
                                textAlign: "end",
                                paddingRight: "3px",
                                fontSize: "12px",
                              }}
                            >
                              {numberWithCommas(
                                Math.round(item?.numAdjustment) || 0
                              )}
                            </td>
                            <td
                              style={{
                                fontWeight: "bold",
                                textAlign: "end",
                                paddingRight: "3px",
                                fontSize: "12px",
                                width: "120px",
                              }}
                            >
                              {numberWithCommas(
                                Math.round(item?.numClosing) || 0
                              )}
                            </td>
                            <td
                              style={{
                                textAlign: "end",
                                paddingRight: "3px",
                                fontSize: "12px",
                                width: "140px",
                              }}
                            >
                              {numberWithCommas(
                                Math.round(item?.numOpeningAccDep) || 0
                              )}
                            </td>
                            <td
                              style={{
                                textAlign: "end",
                                paddingRight: "3px",
                                fontSize: "12px",
                                width: "130px",
                              }}
                            >
                              {numberWithCommas(
                                Math.round(item?.numChargedDurAccDep) || 0
                              )}
                            </td>
                            <td
                              style={{
                                textAlign: "end",
                                paddingRight: "3px",
                                fontSize: "12px",
                              }}
                            >
                              {numberWithCommas(
                                Math.round(item?.numClosingAccDep) || 0
                              )}
                            </td>
                            <td
                              style={{
                                fontWeight: "bold",
                                textAlign: "end",
                                paddingRight: "3px",
                                fontSize: "12px",
                              }}
                            >
                              {numberWithCommas(
                                Math.round(item?.numNetAsset) || 0
                              )}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={1} style={{ textAlign: "right" }}>
                            <strong> Total</strong>
                          </td>
                          <td
                            style={{
                              textAlign: "end",
                              paddingRight: "3px",
                              fontSize: "14px",
                              paddingLeft: "4px",
                            }}
                          >
                            <strong>
                              {numberWithCommas(
                                assetScheduleData.reduce(
                                  (total, data) =>
                                    total + Math.round(data?.numOpening),
                                  0
                                ) || 0
                              )}
                            </strong>
                          </td>
                          <td
                            style={{
                              textAlign: "end",
                              paddingRight: "3px",
                              fontSize: "14px",
                              paddingLeft: "4px",
                            }}
                          >
                            <strong>
                              {numberWithCommas(
                                assetScheduleData.reduce(
                                  (total, data) =>
                                    total + Math.round(data?.numAddition),
                                  0
                                ) || 0
                              )}
                            </strong>
                          </td>
                          <td
                            style={{
                              textAlign: "end",
                              paddingRight: "3px",
                              fontSize: "14px",
                              paddingLeft: "4px",
                            }}
                          >
                            <strong>
                              {numberWithCommas(
                                assetScheduleData.reduce(
                                  (total, data) =>
                                    total + Math.round(data?.numAdjustment),
                                  0
                                ) || 0
                              )}
                            </strong>
                          </td>
                          <td
                            style={{
                              textAlign: "end",
                              paddingRight: "3px",
                              fontSize: "14px",
                              paddingLeft: "4px",
                            }}
                          >
                            <strong>
                              {numberWithCommas(
                                assetScheduleData.reduce(
                                  (total, data) =>
                                    total + Math.round(data?.numClosing),
                                  0
                                ) || 0
                              )}
                            </strong>
                          </td>
                          <td
                            style={{
                              textAlign: "end",
                              paddingRight: "3px",
                              fontSize: "14px",
                              paddingLeft: "4px",
                            }}
                          >
                            <strong>
                              {numberWithCommas(
                                assetScheduleData.reduce(
                                  (total, data) =>
                                    total + Math.round(data?.numOpeningAccDep),
                                  0
                                ) || 0
                              )}
                            </strong>
                          </td>
                          <td
                            style={{
                              textAlign: "end",
                              paddingRight: "3px",
                              fontSize: "14px",
                              paddingLeft: "4px",
                            }}
                          >
                            <strong>
                              {numberWithCommas(
                                assetScheduleData.reduce(
                                  (total, data) =>
                                    total +
                                    Math.round(data?.numChargedDurAccDep),
                                  0
                                ) || 0
                              )}
                            </strong>
                          </td>
                          <td
                            style={{
                              textAlign: "end",
                              paddingRight: "3px",
                              fontSize: "14px",
                              paddingLeft: "4px",
                            }}
                          >
                            <strong>
                              {numberWithCommas(
                                assetScheduleData.reduce(
                                  (total, data) =>
                                    total + Math.round(data?.numClosingAccDep),
                                  0
                                ) || 0
                              )}
                            </strong>
                          </td>
                          <td
                            style={{
                              textAlign: "end",
                              paddingRight: "3px",
                              fontSize: "14px",
                              paddingLeft: "4px",
                            }}
                          >
                            <strong>
                              {numberWithCommas(
                                assetScheduleData.reduce(
                                  (total, data) =>
                                    total + Math.round(data?.numNetAsset || 0),
                                  0
                                ) || 0
                              )}
                            </strong>
                          </td>
                        </tr>
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
