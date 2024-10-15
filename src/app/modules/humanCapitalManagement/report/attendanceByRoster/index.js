import React, { useEffect, useState } from "react";
import ICustomCard from "../../../_helper/_customCard";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import { roasterReportDetailsLanding_api, getDepartmentDDL, getWorkplaceGroupDDL } from "./helper";
import NewSelect from "../../../_helper/_select";
import "./leaveMovementHistory.css";
import Loading from "../../../_helper/_loading";
import { currentMonthInitData } from "./../../../_helper/_currentMonth";
import { downloadFile } from "../../../_helper/downloadFile";

let currentYear = new Date().getFullYear();

const initData = {
  month: currentMonthInitData(),
  year: { value: currentYear, label: currentYear },
  department: "",
};

const AttendanceByRosterReport = () => {
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [tableSize, setTableSize] = useState("Small");
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);

  const monthDDL = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const YearDDL = [
    {
      label: "" + new Date().getFullYear() - 1,
      value: "" + new Date().getFullYear() - 1,
    },
    {
      label: "" + new Date().getFullYear(),
      value: "" + new Date().getFullYear(),
    },
    {
      label: "" + (new Date().getFullYear() + 1),
      value: "" + (new Date().getFullYear() + 1),
    },
  ];

  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getDepartmentDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDepartmentDDL,
      true
    );
    getWorkplaceGroupDDL(profileData?.accountId, setWorkplaceGroupDDL)
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      {loader && <Loading />}
      <ICustomCard title="Attendance By Roster Report">
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <>
              
              <Form className={process.env.NODE_ENV === "production" ? "form form-label-right react-select-custom-margin" : "form form-label-right"}>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="global-form">
                      <div className="row">
                        <div className="col-lg-2">
                          <NewSelect
                            name="month"
                            options={monthDDL}
                            value={values?.month}
                            onChange={(valueOption) => {
                              setFieldValue("month", valueOption);
                            }}
                            label="Month"
                            placeholder="month"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="year"
                            options={YearDDL}
                            value={values?.year}
                            label="Year"
                            onChange={(valueOption) => {
                              setFieldValue("year", valueOption);
                            }}
                            placeholder="Year"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="workplaceGroup"
                            options={workplaceGroupDDL}
                            value={values?.workplaceGroup}
                            onChange={(valueOption) => {
                              setFieldValue("workplaceGroup", valueOption);
                            }}
                            label="Workplace Group"
                            placeholder="workplaceGroup"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-8">
                          <NewSelect
                            name="department"
                            options={departmentDDL}
                            value={values?.department}
                            isMulti={true}
                            label="Department"
                            onChange={(valueOption) => {
                              setFieldValue("department", valueOption);
                            }}
                            placeholder="Department"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div style={{ marginTop: "14px" }} className="col-lg">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              roasterReportDetailsLanding_api(
                                values?.month?.value,
                                values?.year?.value,
                                selectedBusinessUnit?.value,
                                values?.department,
                                setLoader,
                                setRowDto,
                                values?.workplaceGroup?.value
                              );
                            }}
                            disabled={
                              !values?.month ||
                              !values?.year ||
                              !values?.department || 
                              !values?.workplaceGroup
                            }
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {rowDto.tableRow?.length > 0 && (
                  <div className="text-right mb-1">
                    <button
                      style={{ lineHeight: "14px", padding: "4px 16px" }}
                      type="button"
                      className="btn btn-primary ml-1"
                      onClick={() =>
                        setTableSize(tableSize === "Small" ? "Large" : "Small")
                      }
                    >
                      {tableSize === "Small" ? "Large" : "Small"} View
                    </button>
                    <button
                      style={{ lineHeight: "14px", padding: "4px 16px" }}
                      className="btn btn-primary ml-1"
                      type="button"
                      onClick={(e) => {
                        let str = "";
                        for (let i = 0; i < values?.department?.length; i++) {
                          str = `${str}${str && ","}${
                            values?.department[i]?.value
                          }`;
                        }
                        downloadFile(
                          `/hcm/HCMRosterReport/GetAttendanceByRosterDownload?monthId=${values?.month?.value}&workplaceGroupId=${values?.workplaceGroup?.value}&yearId=${values?.year?.value}&businessUnitId=${selectedBusinessUnit?.value}&deptList=${str}`,
                          "Attendance By Roster Report",
                          "xlsx"
                        );
                      }}
                    >
                      Export Excel
                    </button>
                  </div>
                )}
                {/* Table Start */}
                {rowDto.tableRow?.length > 0 && (
                  <div className="loan-scrollable-table employee-overall-status">
                    <div
                      style={
                        tableSize === "Small"
                          ? { maxHeight: "400px" }
                          : { maxHeight: "800px" }
                      }
                      className="scroll-table _table"
                    >
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ minWidth: "50px" }}>SL</th>
                            {rowDto?.headingNames?.map((item, index) => (
                              <th
                                style={
                                  index === 0 || index === 1
                                    ? { minWidth: "60px" }
                                    : index > 2
                                    ? { minWidth: "100px" }
                                    : {}
                                }
                              >
                                {index === 0
                                  ? "Employee Id"
                                  : index === 1
                                  ? "ERP Emp. Id"
                                  : index === 2
                                  ? "Employee Name" : index === 3 ? "Cost Center" : index === 4 ? "Job Type" : index === 5 ? "Department" : index === 6 ? "Designation"
                                  : index === 7 ? "Salary Status" : item}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto.tableRow?.length > 0 &&
                            rowDto.tableRow?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                {item?.tableData?.map((item, idx) => (
                                  <td
                                    style={
                                      idx === 0 || idx === 1
                                        ? { minWidth: "50px" }
                                        : idx > 2
                                        ? { minWidth: "100px" }
                                        : {}
                                    }
                                    className={
                                      (idx === 0 || idx === 1) && "text-center"
                                    }
                                  >
                                    {item}
                                  </td>
                                ))}
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
        {/* <AttendaceReportViewModal
          data={attendanceDetails}
          show={modalShow}
          onHide={() => setModalShow(false)}
        /> */}
      </ICustomCard>
    </>
  );
};

export default AttendanceByRosterReport;
