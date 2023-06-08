/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Form, Formik } from "formik";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../../_helper/_loading";
import { ISelect } from "../../../../../_helper/_inputDropDown";
import NewSelect from "../../../../../_helper/_select";
import InputField from "../../../../../_helper/_inputField";
import { downloadFile, getPDFAction } from "../../../../../_helper/downloadFile";

export default function _Form({ initData, btnRef, resetBtnRef }) {
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [buDDL, getBuDDL] = useAxiosGet();
  const [loading, setLoading] = useState(false);
  const [rowData, getRowData, loader, setRowData] = useAxiosGet();

  useEffect(() => {
    getBuDDL(
      `/hcm/HCMReport/GetOnboardedBusinessUnitList?accountId=${profileData?.accountId}`
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

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
              {(loader || loading) && <Loading />}
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={[{ value: 0, label: "All" }, ...buDDL]}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("businessUnit", valueOption);
                      } else {
                        setFieldValue("businessUnit", {
                          value: 0,
                          label: "All",
                        });
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    placeholder="From Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    type="date"
                  />
                </div>

                <div style={{ marginTop: "14px" }} className=" col-lg-3">
                  <button
                    className="btn btn-primary mr-4"
                    type="button"
                    onClick={() => {
                      getRowData(
                        `/hcm/Report/GetEmployeeTurnoverReport?fromDate=${values?.fromDate}&toDate=${values?.toDate}&businessUnitId=${values?.businessUnit?.value}`
                      );
                    }}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      getPDFAction(`/hcm/PdfReport/GetEmployeeTurnoverReportPdf?fromDate=${values?.fromDate}&toDate=${values?.toDate}&businessUnitId=${values?.businessUnit?.value}`, setLoading)
                    }}
                  >
                    Export Pdf
                  </button>
                </div>
              </div>

              {/* Table */}
              {rowData?.length > 0 && (
                <>
                  <table className="table table-striped table-bordered global-table turn-over-table">
                    <thead>
                      <tr>
                        <th colSpan="12">Employee Turnover Report</th>
                      </tr>
                      <tr>
                        <th>SL</th>
                        <th>Department</th>
                        <th>Section</th>
                        <th>Enroll No.</th>
                        <th>Name of Employee</th>
                        <th>Designation</th>
                        <th>Work place</th>
                        <th>BU</th>
                        <th>Reason for Leave</th>
                        <th>Department Turnover (%)</th>
                        <th>Total turnover (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.map(
                        (item, index) =>
                          item?.employeeList?.length > 0 &&
                          item?.employeeList?.map((data, i) => (
                            <tr>
                              <td>{data?.serial}</td>
                              {i < 1 && (
                                <td
                                  className="text-center vertical-top"
                                  rowSpan={item?.employeeList?.length}
                                >
                                  <span>{item.departmentName}</span>
                                </td>
                              )}
                              <td>{data?.section}</td>
                              <td className="text-center">
                                {data?.employeeId}
                              </td>
                              <td>{data?.employeeName}</td>
                              <td>{data?.designationName}</td>
                              <td>{data?.workplaceGroupName}</td>
                              <td>{data?.businessUnitName}</td>
                              <td>{data?.reasonForLeave}</td>
                              {i < 1 && (
                                <td
                                  className="text-center vertical-top"
                                  rowSpan={item?.employeeList?.length}
                                >
                                  <span>{item.departmentTurnover}</span>
                                </td>
                              )}
                              {i < 1 && (
                                <td
                                  className="text-center vertical-top"
                                  rowSpan={item?.employeeList?.length}
                                >
                                  <span>{item.totalTurnover}</span>
                                </td>
                              )}
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </>
              )}

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
