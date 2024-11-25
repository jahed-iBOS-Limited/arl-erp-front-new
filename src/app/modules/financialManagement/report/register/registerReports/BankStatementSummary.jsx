import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../../_helper/_form";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { BankStatementSummaryExcel } from "./bankStatementSummaryHelper";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import NewSelect from "../../../../_helper/_select";

const initData = {
  intUnitId: { value: 0, label: "All" },
  reportType: "",
  conversionRate: "",
  fromDate: "",
  toDate: "",
  viewType: "",
};

export default function BankStateMentSummary() {
  const [show, setShow] = useState(false);

  const [
    bankStatementData,
    getBankStatementData,
    bankStatementDataLoader,
    setBankStatementData,
  ] = useAxiosGet();

  const { selectedBusinessUnit, businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const getReportId = (values) => {
    if (values?.reportType?.value === 2) {
      return "16996985-deeb-4bef-b8af-fdb2b9377cbf";
    }
    return "";
  };

  const getGroupId = (values) => {
    return "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";
  };
  const parameterValues = (values) => {
    const commonParam = [
      { name: "intUnit", value: values?.intUnitId?.value?.toString() },
      { name: "ConversionRate", value: values?.conversionRate },
      { name: "ViewType", value: `${values?.viewType?.value}` },
      { name: "dteFromDate", value: values?.fromDate },
      { name: "dteToDate", value: values?.toDate },
    ];
    if ([2].includes(values?.reportType?.value)) {
      return commonParam;
    }
    return [];
  };

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
                  <NewSelect
                    name="reportType"
                    options={[
                      { value: 1, label: "Bank Statement Summary" },
                      { value: 2, label: "Sales Vs Collection" },
                    ]}
                    value={values?.reportType}
                    label="Report Type"
                    onChange={(valueOption) => {
                      setFieldValue("reportType", valueOption || "");
                      setShow(false);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {values?.reportType?.value == 2 && (
                  <>
                    <div className="col-lg-2">
                      <NewSelect
                        name="intUnitId"
                        options={[
                          { value: 0, label: "All" },
                          ...businessUnitList,
                        ]}
                        value={values?.intUnitId}
                        label="Business Unit List"
                        onChange={(valueOption) => {
                          setFieldValue("intUnitId", valueOption || "");
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.conversionRate}
                        label="Conversion Rate"
                        type="number"
                        name="conversionRate"
                        placeholder="Conversion Rate"
                        onChange={(e) => {
                          setFieldValue("conversionRate", e.target.value);
                        }}
                      />
                    </div>
                  </>
                )}
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
                {values?.reportType?.value == 2 && (
                  <div className="col-lg-2">
                    <NewSelect
                      name="viewType"
                      options={[
                        { value: 1, label: "Daily" },
                        { value: 2, label: "Monthly" },
                        { value: 3, label: "Yearly" },
                      ]}
                      value={values?.viewType}
                      label="View Type"
                      onChange={(valueOption) => {
                        setFieldValue("viewType", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                <div className="col-lg-2 d-flex">
                  <button
                    type="button"
                    disabled={!values?.fromDate || !values?.toDate}
                    style={{ marginTop: "17px" }}
                    className="btn btn-primary"
                    onClick={() => {
                      if (values?.reportType?.value == 2) {
                        setShow(true);
                      } else {
                        getBankStatementData(
                          `/fino/BusinessTransaction/GetBankAccountStatementSummaryReport?businessUnitId=${selectedBusinessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
                        );
                      }
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

              {values?.reportType?.value == 1 && (
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
              )}
              {show && (
                <div className="mt-5">
                  <PowerBIReport
                    reportId={getReportId(values)}
                    groupId={getGroupId(values)}
                    parameterValues={parameterValues(values)}
                    parameterPanel={false}
                  />
                </div>
              )}
            </div>
          </IForm>
        </>
      )}
    </Formik>
  );
}
