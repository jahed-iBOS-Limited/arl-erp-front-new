/* eslint-disable no-useless-concat */
import React, { useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Dropdown } from "react-bootstrap";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import NewSelect from "../../../../_helper/_select";
import CalendarHeader from "../Calendar/CalendarHeader";
import moment from "moment";
import ReactToPrint from "react-to-print";
import "../Calendar/style.css";
import {
  getEmployeeAttendenceDetailsInOutReport,
  getEmployeeDDL,
} from "../helper";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Validation schema
const validationSchema = Yup.object().shape({
  privacyType: Yup.string().required("Privacy Type is required"),
  employee: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string(),
  }),
});

const initData = {
  privacyType: "1",
  employee: "",
  employeeInfo: "",
};

export function TableRow({ saveHandler }) {
  const [isLoading, setLoading] = useState(false);
  const [emp, setEmp] = useState("");
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const [rowDto, setRowDto] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [employeeDDL, setEmployeeDDL] = useState([]);
  // const [employeeValue, setEmployeeValue] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [newEmployeeDDL, setNewEmployeeDDL] = useState([]);
  const [value, setValue] = useState(moment());
  //  date calculation from Moment
  let takeCurrentDateMonth = value.format("YYYY-MM");
  let takeCurrentDateMonthString = value.format("MMMM-YYYY");
  // console.log("takeCurrentDateMonth", takeCurrentDateMonth);
  let endDay = Number(
    moment(value)
      .endOf("month")
      .format("D")
  );
  let endDateResult = takeCurrentDateMonth + "-" + "" + endDay;
  //
  const printRef = useRef();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //Dispatch Get getEmpDDLAction
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getEmployeeDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setEmployeeDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    getEmployeeAttendenceDetailsInOutReport(
      0,
      emp?.value,
      takeCurrentDateMonth,
      endDateResult,
      setRowDto,
      setLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]); // This dependancy must need for change the date and fetch next or prev month data

  const printDocument = () => {
    const input = printRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [600, 400],
      });
      pdf.addImage(imgData, "JPEG", 0, 0);
      // pdf.output("dataurlnewwindow");
      pdf.save("Up4-receipt.pdf");
    });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employee: {
            value: profileData?.userId,
            label: profileData?.userName,
            code:
              newEmployeeDDL[0]?.value === profileData?.userId
                ? newEmployeeDDL[0]?.code
                : "",
          },
          employeeInfo:
            newEmployeeDDL[0]?.value === profileData?.userId
              ? `${newEmployeeDDL[0]?.employeeInfoDesignation},${newEmployeeDDL[0]?.employeeInfoDepartment},${newEmployeeDDL[0]?.employeeBusinessUnit}`
              : "",
        }}
        validationSchema={validationSchema}
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
          errors,
          touched,
          setFieldValue,
          setValues,
          isValid,
        }) => (
          <>
            {isLoading && <Loading />}
            <Form className="form form-label-right attendance-details">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row bank-journal bank-journal-custom bj-left pb-3">
                    <>
                      <div className="col-lg-2 mb-2">
                        <label className="mr-3">
                          <input
                            type="radio"
                            name="privacyType"
                            checked={values?.privacyType === "1"}
                            className="mr-1 pointer"
                            style={{ position: "relative", top: "2px" }}
                            onChange={(valueOption) => {
                              setFieldValue("privacyType", "1");
                              setFieldValue("employee", {
                                value: profileData?.userId,
                                label: profileData?.userName,
                              });
                              setEmp(valueOption);
                            }}
                          />
                          Private
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="privacyType"
                            checked={values?.privacyType === "2"}
                            className="mr-1 pointer"
                            style={{ position: "relative", top: "2px" }}
                            onChange={(e) => {
                              setFieldValue("privacyType", "2");
                            }}
                          />
                          Public
                        </label>
                      </div>

                      <div
                        className="col-lg-2"
                        style={{
                          marginTop: "3px",
                        }}
                      >
                        {values?.privacyType === "2" ? (
                          <NewSelect
                            name="employee"
                            options={employeeDDL || []}
                            value={values?.employee}
                            onChange={(valueOption) => {
                              setFieldValue(
                                "employeeInfo",
                                `${valueOption?.employeeInfoDesignation},${valueOption?.employeeInfoDepartment},${valueOption?.employeeBusinessUnit}`
                              );
                              setFieldValue("employee", valueOption);
                              setEmp(valueOption);
                            }}
                            isSearchable={true}
                            errors={errors}
                            touched={touched}
                          />
                        ) : (
                          <NewSelect
                            name="employee"
                            options={newEmployeeDDL || []}
                            value={values?.employee}
                            onChange={(valueOption) => {
                              setFieldValue(
                                "employeeInfo",
                                `${valueOption?.employeeInfoDesignation},${valueOption?.employeeInfoDepartment},${valueOption?.employeeBusinessUnit}`
                              );
                              setFieldValue("employee", valueOption);
                            }}
                            isSearchable={true}
                            errors={errors}
                            touched={touched}
                            isDisabled={true}
                          />
                        )}
                      </div>

                      <div className="col-lg-2" style={{ marginTop: "-2px" }}>
                        <button
                          type="button"
                          className="btn btn-primary mr-2"
                          onClick={() => {
                            getEmployeeAttendenceDetailsInOutReport(
                              0,
                              values?.employee?.value,
                              takeCurrentDateMonth,
                              endDateResult,
                              setRowDto,
                              setLoading
                            );
                          }}
                        >
                          View
                        </button>
                      </div>
                    </>
                  </div>
                  {/* calender header starts */}
                  <div className="py-2 d-flex justify-content-between align-items-center">
                    <div className="py-2 d-flex align-items-center">
                      <div className="container-fluid dynamic-calender-css mainBody">
                        <CalendarHeader value={value} setValue={setValue} />
                      </div>
                    </div>
                    {/* Print & Export Button Dropdown */}
                    <div className="d-flex align-items-center">
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          &nbsp;<i className="fas fa-save"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item>
                            <ReactHTMLTableToExcel
                              id="test-table-xls-button"
                              className="download-table-xls-button btn btn-light"
                              table="table-to-xlsx"
                              filename="tablexls"
                              sheet="tablexls"
                              buttonText="Export Excel"
                            />
                          </Dropdown.Item>
                          <Dropdown.Item onClick={printDocument}>
                            <button className="btn btn-light">
                              Export PDF
                            </button>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>

                      <button type="button" className="btn btn-primary ml-2">
                        <ReactToPrint
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
                  </div>
                  {/* calender header ends */}
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <p>
                      Employee: <b>{values?.employee?.label}</b>
                    </p>
                  </div>
                  <div className="col-md-3">
                    <p>
                      HR Position: <b>{values?.employee?.hrPosition}</b>
                    </p>
                  </div>
                  <div className="col-md-3">
                    <p>
                      Designation:
                      <b>{values?.employee?.employeeInfoDesignation}</b>
                    </p>
                  </div>
                  <div className="col-md-3">
                    <p>
                      Employment Type:{" "}
                      <b>{values?.employee?.employeementType}</b>
                    </p>
                  </div>
                  <div className="col-md-3" style={{ marginTop: "-5px" }}>
                    <p>
                      Workpalace Group:{" "}
                      <b>{values?.employee?.workplaceGroup}</b>
                    </p>
                  </div>
                  <div className="col-md-3" style={{ marginTop: "-5px" }}>
                    <p>
                      Business Unit:{" "}
                      <b>
                        {values?.employee?.employeeBusinessUnit ||
                          profileData?.businessUnitName}
                      </b>
                    </p>
                  </div>
                  <div className="col-md-3" style={{ marginTop: "-5px" }}>
                    <p>
                      Department:{" "}
                      <b>
                        {values?.employee?.employeeInfoDepartment ||
                          profileData?.accountName}
                      </b>
                    </p>
                  </div>
                  <div className="col-md-3" style={{ marginTop: "-5px" }}>
                    <p>
                      Line Manager: <b>{values?.employee?.lineManager}</b>
                    </p>
                  </div>
                </div>
              </div>
            </Form>
            {/* Table Start */}
            <div className="row cash_journal" ref={printRef}>
              <div className="col-lg-12 pr-0 pl-0">
                <>
                  <table
                    id="table-to-xlsx"
                    className="table mt-3 bj-table bj-table-landing sales_order_landing_table mr-1"
                  >
                    <thead>
                      <tr>
                        <td
                          colSpan="8"
                          // style={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
                          className="text-center"
                        >
                          <h1>
                            {takeCurrentDateMonthString} Attendance Details
                          </h1>
                          <hr />
                        </td>
                      </tr>
                      <tr>
                        <th>Attendance Date</th>
                        <th>In-Time</th>
                        <th>Out-Time</th>
                        <th>Attendance Status</th>
                        <th>Reason</th>
                        <th>Address</th>
                        <th>Remarks</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((td, index) => (
                        <tr>
                          <td>
                            <div className="pl-2">
                              {_dateFormatter(td?.Attendance)}
                            </div>
                          </td>
                          <td>
                            <div className="text-right pr-2">{td?.InTime}</div>
                          </td>
                          <td>
                            <div className="text-right pr-2">{td?.OutTime}</div>
                          </td>
                          <td>
                            <div className="text-right pr-2">
                              {td?.AttStatus}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{td?.MReason}</div>
                          </td>
                          <td>
                            <div className="pl-2">{td?.MAddress}</div>
                          </td>
                          <td>
                            <div className="pl-2">{""}</div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <span className="view">
                                <IView
                                  clickHandler={() => {
                                    history.push({
                                      pathname: `/human-capital-management/attendancemgt/attendanceDetails/${td?.Attendance}`,
                                      state: { td, values },
                                    });
                                  }}
                                />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
