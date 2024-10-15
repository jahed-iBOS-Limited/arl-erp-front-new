import React, { useState, useEffect, useRef } from "react";
import ICustomCard from "../../../_helper/_customCard";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import {
  AttendanceReportLandingAction,
  getAttendanceDetails,
  getWorkplaceDDLAction,
} from "./helper";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
// import "./leaveMovementHistory.css";
import Loading from "../../../_helper/_loading";
import IView from "../../../_helper/_helperIcons/_view";
import AttendaceReportViewModal from "./View/ViewModal";
import { _firstDateofMonth } from "../../../_helper/_firstDateOfCurrentMonth";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactToPrint from "react-to-print";

const initData = {
  startDate: _firstDateofMonth(),
  endDate: _todayDate(),
  workplace: "",
};

const AttendanceReport = () => {
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [attendanceDetails, setAttendanecDetails] = useState([]);
  const [loader, setLoader] = useState(false);
  const printRef = useRef();

  const [tableSize, setTableSize] = useState("Small");

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getWorkplaceDDLAction(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setWorkplaceDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const pageStyle = `
  @page { 
    margin: 200mm
    color: red;
    @top-center {
      content: "Page " counter(page);
    }
  }`;

  return (
    <>
      {loader && <Loading />}
      <ICustomCard title="Attendance Report">
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
              {/*  */}
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="global-form row d-flex justify-content-between">
                      <div className="col-lg-9">
                        <div className="row">
                          <div className="col-lg-2">
                            <div>Start Date</div>
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
                            <div>End Date</div>
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
                          <div className="col-lg-4">
                            <NewSelect
                              name="workplace"
                              options={workplaceDDL || []}
                              value={values?.workplace}
                              label="Workplace"
                              onChange={(valueOption) => {
                                setFieldValue("workplace", valueOption);
                              }}
                              placeholder="Select Workplace"
                              isSearchable={true}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div
                            style={{ marginTop: "15px" }}
                            className="col-lg-4 d-flex"
                          >
                            <button
                              type="button"
                              className="btn btn-primary mr-2"
                              onClick={() => {
                                AttendanceReportLandingAction(
                                  selectedBusinessUnit?.value,
                                  values?.workplace?.value,
                                  values?.startDate,
                                  values?.endDate,
                                  setRowDto,
                                  setLoader
                                );
                              }}
                              disabled={
                                !values?.startDate ||
                                !values?.endDate ||
                                !values?.workplace
                              }
                            >
                              View
                            </button>
                            {rowDto?.length > 0 && (
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() =>
                                  setTableSize(
                                    tableSize === "Small" ? "Large" : "Small"
                                  )
                                }
                              >
                                {tableSize === "Small" ? "Large" : "Small"} View
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="row">
                          {rowDto?.length > 0 && (
                            <>
                              <div className="col-lg-9 mt-4 d-flex justify-content-end">
                                <ReactHTMLTableToExcel
                                  id="test-table-xls-button-att-report"
                                  className="btn btn-primary p-0 m-0 mx-2 py-2 px-2"
                                  table="table-to-xlsx"
                                  filename="tablexls"
                                  sheet="tablexls"
                                  buttonText="Export Excel"
                                />
                              </div>
                              <div className="col-lg-3 mt-4 d-flex justify-content-start px-0">
                                <button
                                  type="button"
                                  className="btn btn-primary p-0 m-0 py-2 px-2"
                                >
                                  <ReactToPrint
                                    pageStyle={pageStyle}
                                    trigger={() => (
                                      <i
                                        style={{ fontSize: "18px" }}
                                        className="fas fa-print"
                                      ></i>
                                    )}
                                    content={() => printRef.current}
                                  />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Table Start */}
                {rowDto?.length > 0 && (
                  <div className="loan-scrollable-table">
                    <div
                      style={
                        tableSize === "Small"
                          ? { maxHeight: "400px" }
                          : { maxHeight: "500px" }
                      }
                      className="scroll-table _table"
                      ref={printRef}
                    >
                      <h3 className="d-none-print text-center">
                        Attendance Report
                      </h3>
                      <table
                        ref={printRef}
                        id="table-to-xlsx"
                        className="table table-striped table-bordered bj-table bj-table-landing"
                      >
                        <thead>
                          <tr>
                            <th style={{ minWidth: "50px" }}>SL</th>
                            <th style={{ minWidth: "30px" }}>Employee Id</th>
                            {/* <th style={{ minWidth: "50px" }}>ERP Emp. Id</th> */}
                            <th style={{ minWidth: "70px" }}>Enroll</th>
                            <th>Employee Name</th>
                            <th style={{ minWidth: "70px" }}>Employee Code</th>
                            <th style={{ minWidth: "150px" }}>Designation</th>
                            <th style={{ minWidth: "150px" }}>Department</th>
                            <th style={{ minWidth: "150px" }}>Email</th>
                            <th style={{ minWidth: "150px" }}>Mobile Number</th>
                            <th style={{ minWidth: "150px" }}>Salary Status</th>
                            <th style={{ minWidth: "60px" }}>Working Days</th>
                            <th style={{ minWidth: "60px" }}>Present</th>
                            <th style={{ minWidth: "60px" }}>Absent</th>
                            <th style={{ minWidth: "60px" }}>Late</th>
                            <th style={{ minWidth: "60px" }}>Movement</th>
                            <th style={{ minWidth: "60px" }}>Medical Leave</th>
                            <th style={{ minWidth: "60px" }}>Earned Leave</th>
                            <th style={{ minWidth: "60px" }}>
                              Leave Without Pay
                            </th>
                            <th style={{ minWidth: "60px" }}>Off Day</th>
                            <th style={{ minWidth: "60px" }}>Holiday</th>
                            <th
                              style={{ minWidth: "60px" }}
                              className="action-att-report-print-disabled"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto.length >= 0 &&
                            rowDto.map((data, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td> {data?.employeeId} </td>
                                {/* <td> {data?.erpemployeeId} </td> */}
                                <td>
                                  <div className="text-center">
                                    {data?.employeeId}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {data?.employeeName}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2 text-center">
                                    {data?.employeeCode}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {data?.designationName}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-left pl-2">
                                    {data?.departmentName}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-left pl-2">
                                    {data?.email}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-left pl-2">
                                    {data?.mobileNumber}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-left pl-2">
                                    {data?.salaryStatus}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.workingDays}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.present}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.absent}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.late}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.movement}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.medicalLeave}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.earnedLeave}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.leaveWithoutPay}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.offDay}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.holiday}
                                  </div>
                                </td>
                                <td className="action-att-report-print-disabled">
                                  <div className="d-flex justify-content-around">
                                    <span className="view">
                                      <IView
                                        clickHandler={() => {
                                          setModalShow(true);
                                          getAttendanceDetails(
                                            data?.employeeId,
                                            values?.startDate,
                                            values?.endDate,
                                            setAttendanecDetails
                                          );
                                        }}
                                        classes="text-primary"
                                      />
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Form>
            </>
          )}
        </Formik>
        <AttendaceReportViewModal
          data={attendanceDetails}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </ICustomCard>
    </>
  );
};

export default AttendanceReport;
