/* eslint-disable no-useless-concat */
import React, { useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Dropdown } from "react-bootstrap";
import { useSelector, shallowEqual } from "react-redux";
import NewSelect from "../../../../_helper/_select";
import IView from "../../../../_helper/_helperIcons/_view";
import CalendarHeader from "../Calendar/CalendarHeader";
import moment from "moment";
import "../Calendar/style.css";
import {
  getEmployeeAttendenceDetailsInOutReport,
  getEmployeeDDL,
  getEmpInfoById,
} from "../helper";
import Loading from "../../../../_helper/_loading";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";

import axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import IViewModal from "../../../../_helper/_viewModal";
import ViewModal from "./ViewModal";
import { downloadFile, getPDFAction } from "../../../../_helper/downloadFile";
import InputField from "../../../../_helper/_inputField";
import { toast } from "react-toastify";

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
  const [rowDto, setRowDto] = useState([]);
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [newEmployeeDDL, setNewEmployeeDDL] = useState([0]);
  const [value, setValue] = useState(moment());

  const [currentRow, setCurrentRow] = useState({});
  const [isShowModal, setIsShowModal] = useState(false);
  const [isMonthly, setIsMonthly] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  //  date calculation from Moment
  let takeCurrentDateMonth = value.format("YYYY-MM");
  let takeCurrentDateMonthString = value.format("MMMM-YYYY");
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

  const userReferenceId = useSelector((state) => {
    return state.authData.profileData.userReferenceId;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //userRole Permisssion start
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const attendanceDetailsPublic = userRole.filter(
    (item) => item?.strFeatureName === "Attendance Details(Public)"
  );
  //userRole Permisssion End

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
    if (employeeDDL) {
      const info = employeeDDL?.filter(
        (data) => data?.value === userReferenceId
      );
      setNewEmployeeDDL(info);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeDDL]);

  useEffect(() => {
    getEmployeeAttendenceDetailsInOutReport(
      0,
      emp?.value || profileData?.userReferenceId,
      takeCurrentDateMonth,
      endDateResult,
      setRowDto,
      setLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]); // This dependancy must need for change the date and fetch next or prev month data

  const loadEmp = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employee: {
            value: profileData?.userReferenceId,
            label: profileData?.userReferenceNo,
            code: newEmployeeDDL[0]?.code,
          },
          employeeInfo: {
            hrPosition: newEmployeeDDL[0]?.hrPosition,
            designation: newEmployeeDDL[0]?.employeeInfoDesignation,
            employeementType: newEmployeeDDL[0]?.employeementType,
            workPlaceGroup: newEmployeeDDL[0]?.workplaceGroup,
            lineManager: newEmployeeDDL[0]?.lineManager,
            supervisor: newEmployeeDDL[0]?.supervisor,
          },
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
                      <div
                        style={{ marginTop: "20px" }}
                        className="col-lg-2 mb-2"
                      >
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

                              setEmp({
                                value: profileData?.userId,
                                label: profileData?.userName,
                              });
                            }}
                          />
                          Private
                        </label>
                        {attendanceDetailsPublic[0]?.isView === true ? (
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
                        ) : (
                          ""
                        )}
                      </div>

                      <div
                        className="col-lg-2"
                        style={{
                          marginTop: "3px",
                        }}
                      >
                        {values?.privacyType === "2" ? (
                          // <NewSelect
                          //   name="employee"
                          //   options={employeeDDL || []}
                          //   value={values?.employee}
                          //   onChange={(valueOption) => {
                          //     setFieldValue(
                          //       "employeeInfo",
                          //       `${valueOption?.employeeInfoDesignation},${valueOption?.employeeInfoDepartment},${valueOption?.employeeBusinessUnit}`
                          //     );
                          //     setFieldValue("employee", valueOption);
                          //     setEmp(valueOption);
                          //   }}
                          //   isSearchable={true}
                          //   errors={errors}
                          //   touched={touched}
                          // />
                          <>
                            <label>Employee</label>
                            <SearchAsyncSelect
                              selectedValue={values?.employee}
                              isSearchIcon={true}
                              handleChange={(valueOption) => {
                                setFieldValue("employee", valueOption);
                                getEmpInfoById(valueOption, setFieldValue);
                                setEmp(valueOption);
                              }}
                              loadOptions={loadEmp}
                            />
                          </>
                        ) : (
                          <NewSelect
                            name="employee"
                            options={employeeDDL || []}
                            value={values?.employee}
                            label="Employee"
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
                      <div style={{ marginTop: "22px" }}>
                        <input
                          type="checkbox"
                          name="privacyType"
                          checked={isMonthly}
                          className="mr-1 pointer"
                          style={{ position: "relative", top: "2px" }}
                          onChange={(e) => {
                            setIsMonthly(!isMonthly);
                            setFromDate("");
                            setToDate("");
                            setRowDto([]);
                          }}
                        />
                        <lable>Monthly</lable>
                      </div>
                      {!isMonthly && (
                        <>
                          <div className="col-lg-2 mt-1">
                            <label>From Date</label>
                            <InputField
                              value={fromDate}
                              name="formDate"
                              type="date"
                              onChange={(e) => {
                                setFromDate(e.target.value);
                              }}
                            />
                          </div>
                          <div className="col-lg-2 mt-1">
                            <label>To Date</label>
                            <InputField
                              value={toDate}
                              name="formDate"
                              type="date"
                              min={fromDate}
                              onChange={(e) => {
                                setToDate(e.target.value);
                              }}
                            />
                          </div>
                        </>
                      )}
                      <div className="col-lg-2" style={{ marginTop: "19px" }}>
                        <ButtonStyleOne
                          type="button"
                          className="btn btn-primary mr-2"
                          onClick={() => {
                            if (!isMonthly && (!fromDate || !toDate))
                              return toast.warn(
                                "Please select FromDate and ToDate "
                              );
                            getEmployeeAttendenceDetailsInOutReport(
                              0,
                              values?.employee?.value,
                              isMonthly ? takeCurrentDateMonth : fromDate,
                              isMonthly ? endDateResult : toDate,
                              setRowDto,
                              setLoading
                            );
                          }}
                          label="View"
                        />
                      </div>
                    </>
                  </div>
                  {/* calender header starts */}
                  <div className="py-2 d-flex justify-content-between align-items-center">
                    {isMonthly ? (
                      <div className="py-2 d-flex align-items-center">
                        <div className="container-fluid dynamic-calender-css mainBody">
                          <CalendarHeader value={value} setValue={setValue} employeeId={values?.employee?.value} />
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {/* Print & Export Button Dropdown */}
                    <div className="d-flex align-items-center">
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          &nbsp;<i className="fas fa-save"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              if (!isMonthly && (!fromDate || !toDate))
                                return toast.warn(
                                  "Please select FromDate and ToDate "
                                );
                              downloadFile(
                                `/hcm/HCMRosterReport/GetEmployeeAttendenceDetailsInOutExcel?Type=0&EmployeeId=${
                                  values?.employee?.value
                                }&FromDate=${
                                  isMonthly ? takeCurrentDateMonth : fromDate
                                }&ToDate=${isMonthly ? endDateResult : toDate}`,
                                "Attendance Details",
                                "xlsx",
                                setLoading
                              );
                            }}
                          >
                            {/* <ReactHTMLTableToExcel
                              id="test-table-xls-button"
                              className="download-table-xls-button btn btn-light"
                              table="table-to-xlsx"
                              filename="tablexls"
                              sheet="tablexls"
                              buttonText="Export Excel"
                            /> */}
                            <button className="btn btn-light">
                              Export Excel
                            </button>
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              if (!isMonthly && (!fromDate || !toDate))
                                return toast.warn(
                                  "Please select FromDate and ToDate "
                                );
                              getPDFAction(
                                `/hcm/PdfReport/GetEmployeeAttendenceDetailsInOutReportPdf?Type=0&EmployeeId=${
                                  values?.employee?.value
                                }&FromDate=${
                                  isMonthly ? takeCurrentDateMonth : fromDate
                                }&ToDate=${isMonthly ? endDateResult : toDate}`,
                                setLoading
                              );
                            }}
                          >
                            <button className="btn btn-light">
                              Export PDF
                            </button>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>

                      {/* <button type="button" className="btn btn-primary ml-2">
                        <ReactToPrint
                          trigger={() => (
                            <i
                              style={{ fontSize: "18px" }}
                              className="fas fa-print"
                            ></i>
                          )}
                          content={() => printRef.current}
                        />
                      </button> */}
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
                      HR Position:{" "}
                      <b>
                        {values?.employee?.hrPosition ||
                          values?.employeeInfo?.hrPosition}
                      </b>
                    </p>
                  </div>
                  <div className="col-md-3">
                    <p>
                      Designation:
                      <b>
                        {values?.employee?.employeeInfoDesignation ||
                          values?.employeeInfo?.designation}
                      </b>
                    </p>
                  </div>
                  <div className="col-md-3">
                    <p>
                      Employment Type:{" "}
                      <b>
                        {values?.employee?.employeementType ||
                          values?.employeeInfo?.employeementType}
                      </b>
                    </p>
                  </div>
                  <div className="col-md-3" style={{ marginTop: "-5px" }}>
                    <p>
                      Workplace Group:{" "}
                      <b>
                        {values?.employee?.workplaceGroup ||
                          values?.employeeInfo?.workPlaceGroup}
                      </b>
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
                      Supervisor:{" "}
                      <b>
                        {values?.employee?.supervisor ||
                          values?.employeeInfo?.supervisor ||
                          " "}
                      </b>
                    </p>
                  </div>
                </div>
              </div>
            </Form>
            {/* Table Start */}
            <div className="row" ref={printRef}>
              <div className="col-lg-12 pr-0 pl-0">
                <>
                  <table
                    id="table-to-xlsx"
                    className="table table-striped table-bordered global-table"
                  >
                    <thead>
                      <tr>
                        <td
                          colSpan="8"
                          // style={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
                          className="text-center"
                        >
                          {isMonthly ? (
                            <h1>
                              {takeCurrentDateMonthString} Attendance Details
                            </h1>
                          ) : fromDate && toDate ? (
                            <h1>
                              {`${_dateFormatter(fromDate)} to ${_dateFormatter(
                                toDate
                              )}`}{" "}
                              Attendance Details
                            </h1>
                          ) : (
                            <h1>Attendance Details</h1>
                          )}
                          <hr />
                        </td>
                      </tr>
                      <tr>
                        <th>Attendance Date</th>
                        <th>In-Time</th>
                        <th>Out-Time</th>
                        <th>Attendance Status</th>
                        <th>Reason</th>
                        {/* <th>Address</th> */}
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
                            <div className="text-center">{td?.InTime}</div>
                          </td>
                          <td>
                            <div className="text-center">{td?.OutTime}</div>
                          </td>
                          <td>
                            <div className="text-center">
                              {td?.AttStatus === "-" ? "Absent" : td?.AttStatus}
                              {/* Assign By Mim Apu (BA) */}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">{td?.MReason}</div>
                          </td>
                          {/* <td>
                            <div className="pl-2">{td?.MAddress}</div>
                          </td> */}
                          <td>
                            <div className="text-center">{td?.Remarks}</div>
                          </td>
                          <td style={{ width: "60px", textAlign: "center" }}>
                            <IView
                              clickHandler={() => {
                                setCurrentRow(td);
                                setIsShowModal(true);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
                <IViewModal
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                  title="Punch Details"
                  modelSize="sm"
                >
                  <ViewModal values={values} currentRow={currentRow} />
                </IViewModal>
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
