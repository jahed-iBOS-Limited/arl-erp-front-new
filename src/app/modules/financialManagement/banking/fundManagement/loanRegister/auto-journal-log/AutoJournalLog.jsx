import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../../_metronic/_partials/controls";
import { _dateTimeFormatter } from "../../../../../_helper/_dateFormate";
import Loading from "../../../../../_helper/_loading";
import NewSelect from "../../../../../_helper/_select";
import PaginationTable from "../../../../../_helper/_tablePagination";
import { getBusinessUnitDDL, getLoanRegisterLogs } from "../../helper";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../../../_helper/_inputField";

const AutoJournalLog = () => {
  const history = useHistory();

  // Get today's date and the first day of the current month
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Format dates as yyyy-mm-dd to use as default values
  const formatDate = (date) => date.toISOString().split("T")[0];
  const initData = {
    businessUnit: { value: 0, label: "All" },
    fromDate: formatDate(firstDayOfMonth),
    toDate: formatDate(today),
  };

  const [
    historyData,
    getHistory,
    loadingHistory,
    setHistoryData,
  ] = useAxiosGet();

  const [loading, setLoading] = useState(false);
  const [loanRegisterLogData, setLoanRegisterLogData] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const {
    profileData,
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const saveHandler = async (values, cb) => {
    setLoading(true);
  };

  useEffect(() => {
    getBusinessUnitDDL(profileData?.accountId, setBusinessUnitDDL);
  }, []);

  useEffect(() => {
    getLoanRegisterLogs(
      0,
      pageNo,
      pageSize,
      setLoanRegisterLogData,
      setLoading,
      initData.fromDate,
      initData.toDate
    );
  }, []);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLoanRegisterLogs(
      values?.businessUnit?.value >= 0 ? values?.businessUnit?.value : buId,
      pageNo,
      pageSize,
      setLoanRegisterLogData,
      setLoading
    );
  };

  const backHandler = () => {
    history.goBack();
  };

  return (
    <>
      {(loading || loadingHistory) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, (code) => {});
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <div className="">
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Auto Journal Log"}>
                <CardHeaderToolbar>
                  <button
                    type="button"
                    onClick={backHandler}
                    className={"btn btn-light"}
                  >
                    <i className="fa fa-arrow-left"></i>
                    Back
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="form-group row global-form align-items-end">
                    {buId === 136 && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="businessUnit"
                          options={
                            [{ value: 0, label: "All" }, ...businessUnitDDL] ||
                            []
                          }
                          value={values?.businessUnit}
                          label="BusinessUnit"
                          onChange={(valueOption) => {
                            if (valueOption) {
                              setFieldValue("businessUnit", valueOption);
                              setLoanRegisterLogData([]);
                            } else {
                              setLoanRegisterLogData([]);
                              setFieldValue("businessUnit", "");
                            }
                          }}
                          placeholder="BusinessUnit"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    )}
                    <div className="col-lg-2">
                      <label>Opening Date</label>
                      <div className="d-flex">
                        <InputField
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="Opening date"
                          type="date"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <label>Maturity Date</label>
                      <div className="d-flex">
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="Maturity date"
                          type="date"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-1">
                      <button
                        className="btn btn-primary mr-2"
                        type="button"
                        onClick={() => {
                          getLoanRegisterLogs(
                            values?.businessUnit?.value >= 0
                              ? values?.businessUnit?.value
                              : buId,
                            pageNo,
                            pageSize,
                            setLoanRegisterLogData,
                            setLoading,
                            values?.fromDate,
                            values?.toDate
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                  <div></div>
                  <div className="row">
                    <div className="col-12 common-scrollable-table two-column-sticky">
                      <div className="scroll-table _table overflow-auto">
                        <table className="table table-striped table-bordered global-table">
                          <thead className="bg-secondary">
                            <tr>
                              <th>SL</th>
                              <th style={{ minWidth: "100px" }}>
                                Business Unit
                              </th>
                              <th>Bank Name</th>
                              <th style={{ minWidth: "100px" }}>
                                Statement Date
                              </th>
                              <th style={{ minWidth: "50px" }}>
                                Loan AccountName
                              </th>
                              <th style={{ minWidth: "100px" }}>
                                Amount Summary
                              </th>
                              <th style={{ minWidth: "50px" }}>Journal Code</th>
                              <th style={{ minWidth: "50px" }}>Total Amount</th>
                              <th style={{ minWidth: "50px" }}>Log Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loanRegisterLogData?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-">{item?.businessUnit}</td>
                                <td className="text-">{item?.bankName}</td>
                                <td className="text-">
                                  {_dateTimeFormatter(item?.statementDate)}
                                </td>
                                <td className="text-">
                                  {item?.["loan AccountName"]}
                                </td>
                                <td className="text-">{item?.amountSummary}</td>
                                <td className="text-left">
                                  {item?.journalCode}
                                </td>
                                <td className="text-center">
                                  {item?.totalAmount}
                                </td>
                                <td className="text-">
                                  {_dateTimeFormatter(item?.logDate)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Form>
                {loanRegisterLogData?.data?.length > 0 && (
                  <PaginationTable
                    count={loanRegisterLogData?.totalCount}
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
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
};

export default AutoJournalLog;
