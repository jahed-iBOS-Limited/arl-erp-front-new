import React from "react";
import { Formik, Form } from "formik";
import NewSelect from "./../../../../_helper/_select";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import { downloadFile } from "../../../../_helper/downloadFile";
import { getEmployeeExpenseReport } from "./helper";
import { monthDDL, yearDDL } from "./addEditForm";

export default function _Form({
  initData,
  btnRef,
  resetBtnRef,
  setLoading,
  selectedBusinessUnit,
  rowDto,
  setRowDto,
  year,
  month,
  setYear,
  setMonth,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="fromYear"
                    options={yearDDL}
                    value={values?.fromYear}
                    onChange={(valueOption) => {
                      setFieldValue("fromYear", valueOption);
                    }}
                    label="Year"
                    placeholder="Year"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="fromMonth"
                    options={monthDDL}
                    value={values?.fromMonth}
                    onChange={(valueOption) => {
                      setFieldValue("fromMonth", valueOption);
                    }}
                    label="Month"
                    placeholder="Month"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div>
                  <ButtonStyleOne
                    label="View"
                    onClick={() => {
                      getEmployeeExpenseReport(
                        selectedBusinessUnit?.value,
                        values?.fromYear?.value,
                        values?.fromMonth?.value,
                        setRowDto,
                        setLoading
                      );
                      setYear(values?.fromYear?.label);
                      setMonth(values?.fromMonth?.label);
                    }}
                    style={{ marginTop: "14px" }}
                  />
                </div>

                <div className="col-lg-3">
                  <ButtonStyleOne
                    label="Export Excel"
                    onClick={() => {
                      downloadFile(
                        `/hcm/Report/GetEmployeeExpenseReport?businessUnitId=${selectedBusinessUnit?.value}&year=${values?.fromYear?.value}&month=${values?.fromMonth?.value}&isDownload=true`,
                        "Employee Expense Report",
                        "xlsx",
                        setLoading
                      );
                    }}
                    style={{ marginTop: "14px" }}
                  />
                </div>
              </div>

              <div
                className="text-center"
                style={{ marginTop: "8px", marginBottom: "-10px" }}
              >
                <h4>Business Unit: {selectedBusinessUnit?.label} </h4>
                <h4>
                  Employee Excpense for the Month of {month && month + ", "}
                  {year && year}
                </h4>
              </div>

              <div className="loan-scrollable-table">
                <div
                  style={{ maxHeight: "400px" }}
                  className="scroll-table _table scroll-table-auto"
                >
                  <table className="table table-striped table-bordered global-table table-font-size-sm">
                    <thead>
                      <tr>
                        <th style={{ minWidth: "30px" }}>SL</th>
                        <th style={{ minWidth: "70px" }}>Employee Id</th>
                        {/* <th style={{ minWidth: "70px" }}>ERP Emp. Id</th> */}
                        <th style={{ minWidth: "100px" }}>Employee Code</th>
                        <th style={{ minWidth: "180px" }}>Employee Name</th>
                        <th style={{ minWidth: "140px" }}>Supervisor</th>
                        <th style={{ minWidth: "130px" }}>
                          Total Submitted Amount
                        </th>
                        <th style={{ minWidth: "150px" }}>
                          Supervisor Approved Amount
                        </th>
                        <th style={{ minWidth: "130px" }}>
                          HR Approved Amount
                        </th>
                        <th style={{ minWidth: "130px" }}>
                          Audit Approved Amount
                        </th>
                        <th style={{ minWidth: "150px" }}>
                          Unadjusted Amount (Advance)
                        </th>
                        <th style={{ minWidth: "100px" }}>Payable Amount</th>
                        <th style={{ minWidth: "120px" }}>
                          Receiveable Amount
                        </th>
                        <th style={{ minWidth: "100px" }}>Account No.</th>
                        <th style={{ minWidth: "150px" }}>Bank Name</th>
                        <th style={{ minWidth: "100px" }}>Branch Name</th>
                        <th style={{ minWidth: "100px" }}>Routing No.</th>
                        <th style={{ minWidth: "90px" }}>Workplace</th>
                      </tr>
                    </thead>

                    <tbody>
                      {rowDto?.length > 0 &&
                        rowDto.map((data) => (
                          <tr key={""}>
                            <td style={{ fontSize: "10px" }}>{data?.sl}</td>
                            <td
                              className="text-center"
                              style={{ fontSize: "10px" }}
                            >
                              {data?.employeeId}
                            </td>
                            {/* <td
                              className="text-center"
                              style={{ fontSize: "10px" }}
                            >
                              {data?.erpEmployeeId}
                            </td> */}
                            <td
                              className="text-center"
                              style={{ fontSize: "10px" }}
                            >
                              {data?.employeeCode}
                            </td>
                            <td style={{ fontSize: "10px" }}>
                              {data?.employeeName}
                            </td>
                            <td style={{ fontSize: "10px" }}>
                              {data?.supervisorName}
                            </td>
                            <td
                              className="text-right"
                              style={{ fontSize: "10px" }}
                            >
                              {data?.totalSubmittedAmount}
                            </td>
                            <td
                              className="text-right"
                              style={{ fontSize: "10px" }}
                            >
                              {data?.supervisorApproveAmount}
                            </td>
                            <td
                              className="text-right"
                              style={{ fontSize: "10px" }}
                            >
                              {data?.hrApprovedAmount}
                            </td>
                            <td
                              className="text-right"
                              style={{ fontSize: "10px" }}
                            >
                              {data?.auditApprovedAmount}
                            </td>
                            <td
                              className="text-right"
                              style={{ fontSize: "10px" }}
                            >
                              {data?.unadjustedAmount}
                            </td>
                            <td
                              className="text-right"
                              style={{ fontSize: "10px" }}
                            >
                              {data?.payableAmount}
                            </td>
                            <td
                              className="text-right"
                              style={{ fontSize: "10px" }}
                            >
                              {data?.receiveableAmount}
                            </td>
                            <td
                              className="text-center"
                              style={{ fontSize: "10px" }}
                            >
                              {data?.accountNo}
                            </td>
                            <td style={{ fontSize: "10px" }}>
                              {data?.bankName}
                            </td>
                            <td style={{ fontSize: "10px" }}>
                              {data?.bankBranchName}
                            </td>
                            <td
                              className="text-center"
                              style={{ fontSize: "10px" }}
                            >
                              {data?.routingNumber}
                            </td>
                            <td style={{ fontSize: "10px" }}>
                              {data?.jobStation}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
