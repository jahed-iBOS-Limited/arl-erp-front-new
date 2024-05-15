import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import InputField from "../../../_helper/_inputField";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "./../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "./../../../_helper/_dateFormate";
import IForm from "./../../../_helper/_form";
import IEdit from "./../../../_helper/_helperIcons/_edit";
import Loading from "./../../../_helper/_loading";
import { _timeFormatter } from "./../../../_helper/_timeFormatter";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export default function PhysicalTestLanding() {
  const [landingData, getLandingData, loading] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = (values, cb) => {};
  const history = useHistory();

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(
      `/hcm/QCTest/QCTransactionView?BusinessUnitId=${selectedBusinessUnit?.value}&QcTestType=PhysicalTest&FromDate=${values?.fromDate}&Todate=${values?.toDate}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
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
          {loading && <Loading />}
          <IForm
            title="Physical Test"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary mr-4"
                    onClick={() => {
                      history.push(
                        "/production-management/msil-gate-register/Gate-Item-Entry/physicalTest/report"
                      );
                    }}
                  >
                    Report
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        "/production-management/msil-gate-register/Gate-Item-Entry/physicalTest/create"
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div>
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      name="toDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        getLandingData(
                          `/hcm/QCTest/QCTransactionView?BusinessUnitId=${selectedBusinessUnit?.value}&QcTestType=PhysicalTest&FromDate=${values?.fromDate}&Todate=${values?.toDate}&PageNo=${pageNo}&PageSize=${pageSize}`
                        );
                      }}
                      style={{ marginTop: "17px" }}
                      className="btn btn-primary"
                    >
                      View
                    </button>
                  </div>
                </div>
                {landingData?.data?.data?.length ? (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing mr-1">
                      <thead>
                        <tr>
                          <th rowSpan="2">Sl</th>
                          <th rowSpan="2">Date</th>
                          <th rowSpan="2">Shift</th>
                          <th rowSpan="2">Time</th>
                          <th rowSpan="2">VRM Name</th>
                          <th rowSpan="2">Item Type</th>
                          {landingData?.data?.data[0]?.row.map((item, i) => (
                            <th key={i}>{item?.qcParameterName}</th>
                          ))}
                          <th rowSpan="2">Initial Time</th>
                          <th rowSpan="2">Final Time</th>
                          <th rowSpan="2">Remarks</th>
                          <th rowSpan="2">Action</th>
                        </tr>
                        <tr>
                          {landingData?.data?.data[0]?.row.map((item, i) => (
                            <th key={i}>{item?.uoMname}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {landingData?.data?.data.map((dataItem, dataIndex) => (
                          <tr key={dataIndex}>
                            <td>{dataIndex + 1}</td>
                            <td className="text-center">
                              {_dateFormatter(dataItem?.transactionDate)}
                            </td>
                            <td>{dataItem?.shiftName}</td>
                            <td>{_timeFormatter(dataItem?.startTime || "")}</td>
                            <td>{dataItem?.machineName}</td>
                            <td>{dataItem?.itemTypeName}</td>
                            {dataItem?.row?.map((item, i) => (
                              <td className="text-center" key={i}>
                                {item?.quantity}
                              </td>
                            ))}
                            <td className="text-center">
                              {dataItem?.durationInMinute1}
                            </td>
                            <td className="text-center">
                              {dataItem?.durationInMinute2}
                            </td>
                            <td>{dataItem?.comments}</td>
                            <td
                              style={{ minWidth: "30px" }}
                              className="text-center"
                            >
                              <IEdit
                                onClick={() => {
                                  history.push(
                                    `/production-management/msil-gate-register/Gate-Item-Entry/physicalTest/edit/10`,
                                    dataItem
                                  );
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
                {landingData?.data?.data?.length > 0 && (
                  <PaginationTable
                    count={landingData?.data?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
