import { Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../../_helper/_form";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { BankStatementSummaryExcel } from "./bankStatementSummaryHelper";

const initData = {
  fromDate: "",
  toDate: "",
};

export default function BankStateMentSummary() {
  const [
    bankStatementData,
    getBankStatementData,
    bankStatementDataLoader,
    setBankStatementData,
  ] = useAxiosGet();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          {bankStatementDataLoader && <Loading />}
          <IForm
            title="Bank Statement Summary"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
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
                      setBankStatementData([]);
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
                      setBankStatementData([]);
                    }}
                  />
                </div>
                <div className="col-lg-4 d-flex">
                  <button
                    type="button"
                    disabled={!values?.fromDate || !values?.toDate}
                    style={{ marginTop: "17px" }}
                    className="btn btn-primary"
                    onClick={() => {
                      getBankStatementData(
                        `/fino/BusinessTransaction/GetBankAccountStatementSummaryReport?businessUnitId=${selectedBusinessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
                      );
                    }}
                  >
                    Show
                  </button>
                  <button
                    type="button"
                    disabled={bankStatementData?.length < 1}
                    style={{ marginTop: "17px" }}
                    className="btn btn-primary ml-3"
                    onClick={() => {
                      //

                      BankStatementSummaryExcel(bankStatementData);
                    }}
                  >
                    Export Excel
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table
                      id="table-to-xlsx"
                      className="table table-striped table-bordered mt-3 bj-table bj-table-landing"
                    >
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Bank Account Name</th>
                          <th>Credit Amount</th>
                          <th>Debit Amount</th>
                          <th>Current Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bankStatementData?.length > 0 &&
                          bankStatementData?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.bankAccount}</td>
                              <td className="text-right">
                                {item?.debitAmount}
                              </td>
                              <td className="text-right">
                                {// abs
                                Math.abs(item?.creditAmount)}
                              </td>
                              <td className="text-right">
                                {item?.currentBalance}
                              </td>
                            </tr>
                          ))}
                        <tr>
                          <td
                            style={{
                              fontWeight: "bold",
                            }}
                            colSpan="2"
                            className="text-right"
                          >
                            Total
                          </td>
                          <td className="text-right">
                            {Math.abs(
                              bankStatementData
                                ?.reduce(
                                  (acc, curr) => acc + curr?.debitAmount,
                                  0
                                )
                                .toFixed(2)
                            )}
                          </td>
                          <td className="text-right">
                            {Math.abs(
                              bankStatementData
                                ?.reduce(
                                  (acc, curr) => acc + curr?.creditAmount,
                                  0
                                )
                                .toFixed(2)
                            )}
                          </td>
                          <td className="text-right">
                            {Math.abs(
                              bankStatementData
                                ?.reduce(
                                  (acc, curr) => acc + curr?.currentBalance,
                                  0
                                )
                                .toFixed(2)
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </IForm>
        </>
      )}
    </Formik>
  );
}
