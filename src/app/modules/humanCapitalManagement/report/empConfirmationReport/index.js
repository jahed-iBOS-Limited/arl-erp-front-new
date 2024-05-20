/* eslint-disable no-unused-vars */
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import ICard from "../../../_helper/_card";
import { _firstDateofMonth } from "../../../_helper/_firstDateOfCurrentMonth";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import { getEmployeeJoiningConfirmationReport } from "./helper";

const initData = {
  startDate: _firstDateofMonth(),
  endDate: _todayDate(),
};

const EmpConfirmationReport = () => {
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState();
  const printRef = useRef();
  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
        }}
        //   validationSchema={LoanApproveSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          resetForm(initData);
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <ICard printTitle="Print" title="Employee Confirmation Report" isPrint={true} isShowPrintBtn={true} componentRef={printRef}>
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="global-form row d-flex justify-content-between">
                      <div className="col-lg-9">
                        <div className="row">
                          <div className="col-lg-2">
                            <div>From Date</div>
                            <input
                              className="trans-date cj-landing-date"
                              value={values?.startDate}
                              name="startDate"
                              onChange={(e) => {
                                setFieldValue("startDate", e.target.value);
                              }}
                              type="date"
                            />
                          </div>
                          <div className="col-lg-2">
                            <div>To Date</div>
                            <input
                              className="trans-date cj-landing-date"
                              value={values?.endDate}
                              name="endDate"
                              onChange={(e) => {
                                setFieldValue("endDate", e.target.value);
                              }}
                              type="date"
                            />
                          </div>
                          <div style={{ marginTop: "15px" }} className="col-lg-4 d-flex">
                            <button
                              type="button"
                              className="btn btn-primary mr-2"
                              onClick={() => {
                                getEmployeeJoiningConfirmationReport(2, values?.startDate, values?.endDate, setRowDto, setLoading);
                              }}
                              disabled={!values?.startDate || !values?.endDate}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-1" ref={printRef}>
                  <div className="text-center" style={{ margin: "10px 0" }}>
                    <h6 style={{ marginBottom: "0", fontSize: "16px" }}>AKIJ RESOURCE LIMITED</h6>
                    <p style={{ fontSize: "14px" }}>198, Bir Uttam Mir Showkat Sarak, Tejgaon I/A, Dhaka, Bangladesh</p>
                  </div>
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Enroll No.</th>
                        <th>Name of Employee</th>
                        <th>Designation</th>
                        <th>Department</th>
                        <th>Work place (Geographic Location)</th>
                        <th>SBUs Name</th>
                        <th>Joining Date</th>
                        <th>Service Length</th>
                        <th>Confirmation Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.length > 0 &&
                        rowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.intEmployeeId}</td>
                            <td>{item?.strEmployeeFullName}</td>
                            <td>{item?.strDesignationName}</td>
                            <td>{item?.strDepartmentName}</td>
                            <td>{item?.strWorkplaceName}</td>
                            <td>{item?.strSBUName}</td>
                            <td className="text-center">{item?.JoiningDate}</td>
                            <td>{item?.strServiceLength}</td>
                            <td className="text-center">{item?.dteConfirmationDate}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {rowDto?.length > 0 && <p className="text-center mt-2">N.B: This is an auto-generated report by ERP System.</p>}
                </div>
              </Form>
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
};

export default EmpConfirmationReport;
