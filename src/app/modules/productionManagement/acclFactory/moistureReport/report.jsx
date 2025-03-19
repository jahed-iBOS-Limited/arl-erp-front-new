/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React from "react";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import InputField from "../../../_helper/_inputField";
import { _todayDate } from "../../../_helper/_todayDate";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

export default function MoistureReport() {
  const saveHandler = (values, cb) => {};
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [
    reportData,
    getReportData,
    reportDataLoader,
    setReportData,
  ] = useAxiosGet();
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          {reportDataLoader && <Loading />}
          <IForm title="Moisture Test Report" isHiddenReset isHiddenSave>
            <Form>
              <div>
                <div className="form-group row global-form">
                  <div className="col-lg-2">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      type="date"
                      name="fromDate"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                        setReportData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      type="date"
                      name="toDate"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                        setReportData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <button
                      type="button"
                      disabled={!values?.fromDate || !values?.toDate}
                      style={{ marginTop: "17px" }}
                      className="btn btn-primary"
                      onClick={() => {
                        getReportData(
                          `/hcm/QCTest/MoistureQcTransactionReport?BusinessUnitId=${selectedBusinessUnit?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                  <div className="col-lg-2"></div>
                  <div className="col-lg-2"></div>
                  <div className="col-lg-2 text-right mt-5">
                    <ReactHtmlTableToExcel
                      id="test-table-xls-button-att-reports"
                      className="btn btn-primary"
                      table={"moisture-report-table"}
                      filename={"moisture-report-table"}
                      sheet={"moisture-report-table"}
                      buttonText="Export Excel"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 mt-3 text-center">
                    <h1>{selectedBusinessUnit?.label}</h1>
                    <h4>{selectedBusinessUnit?.businessUnitAddress}</h4>
                    <h5>Quality Control Department</h5>
                  </div>
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table
                        id="moisture-report-table"
                        className="table table-striped table-bordered mt-3 bj-table bj-table-landing"
                      >
                        <thead>
                          <tr>
                            <th rowspan={3}>Sl</th>
                            <th rowspan={3}>Date</th>
                            <th colspan={4}>Raw Materials Name</th>
                            <th colspan={3}>Finished Products Name</th>
                            <th rowspan={3}>Remarks</th>
                          </tr>
                          <tr>
                            <th colspan={4}>Moisture(%)</th>
                            <th colspan={3}>Moisture(%)</th>
                          </tr>
                          <tr>
                            {reportData?.data?.length > 0 &&
                              reportData?.data[0]?.rawMaterials?.map(
                                (item, index) => {
                                  return <th>{item?.itemName}</th>;
                                }
                              )}
                            {reportData?.data?.length > 0 &&
                              reportData?.data[0]?.finishedProducts?.map(
                                (item, index) => {
                                  return (
                                    <th>
                                      {item?.machineName} ({item?.itemName})
                                    </th>
                                  );
                                }
                              )}
                          </tr>
                        </thead>
                        <tbody>
                          {reportData?.data?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.date)}
                                </td>
                                {item?.rawMaterials?.map((itm, idx) => {
                                  return (
                                    <td className="text-center">
                                      {itm?.quantity}
                                    </td>
                                  );
                                })}
                                {item?.finishedProducts?.map((itm, idx) => {
                                  return (
                                    <td className="text-center">
                                      {itm?.quantity}
                                    </td>
                                  );
                                })}
                                <td>{item?.comments || "iuygfd"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
