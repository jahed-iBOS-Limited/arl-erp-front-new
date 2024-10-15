import React, { useState, useEffect, useRef } from "react";
import ICustomCard from "../../../_helper/_customCard";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import {
  roasterDetailsLanding_api,
  getCalenderDDL_api,
  getCalenderRoasterDDL_api,
  getWorkplaceDDL_api,
} from "./helper";
import NewSelect from "../../../_helper/_select";
import "./rosterReport.css";
import Loading from "../../../_helper/_loading";
import InputField from "./../../../_helper/_inputField";
import { _todayDate } from "./../../../_helper/_todayDate";
import ReactToPrint from "react-to-print";
import { dateFormatWithMonthName } from "../../../_helper/_dateFormate";
import { downloadFile } from "../../../_helper/downloadFile";

const initData = {
  workplace: "",
  calender: "",
  calenderType: "",
  attendanceDate: _todayDate(),
};

const RoasterReport = () => {
  const [calenderDDL, setCalenderDDL] = useState([]);
  const [calenderRoasterDDL, setCalenderRoasterDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [tableSize, setTableSize] = useState("Small");
  const printRef = useRef();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getCalenderDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCalenderDDL
      );
      setCalenderRoasterDDL([]);
      getWorkplaceDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setWorkplaceDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getCalenderRoasterDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCalenderRoasterDDL
      );
      setCalenderDDL([]);
    }
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
      <ICustomCard title="Roster Report">
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
              
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="global-form">
                      <div className="row">
                        <div className="col-lg-2">
                          <NewSelect
                            name="workplace"
                            options={workplaceDDL}
                            value={values?.workplace}
                            onChange={(valueOption) => {
                              setFieldValue("workplace", valueOption);
                            }}
                            label="Workplace"
                            placeholder="Workplace"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="calenderType"
                            options={[
                              {
                                value: 1,
                                label: "Calendar General",
                              },
                              { value: 2, label: "Roster Group Name" },
                            ]}
                            value={values?.calenderType}
                            label="Calendar Type"
                            onChange={(valueOption) => {
                              setRowDto([]);
                              setFieldValue("calender", "");
                              setFieldValue("calenderType", valueOption);
                            }}
                            placeholder="Calendar Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="calender"
                            options={
                              values?.calenderType?.value === 2
                                ? calenderRoasterDDL
                                : calenderDDL
                            }
                            value={values?.calender}
                            label={values?.calenderType?.label}
                            onChange={(valueOption) => {
                              setFieldValue("calender", valueOption);
                            }}
                            placeholder="Calendar"
                            errors={errors}
                            touched={touched}
                            isDisabled={!values?.calenderType}
                          />
                        </div>
                        <div className="roster-report-date">
                          <label>Date</label>
                          <InputField
                            value={values?.attendanceDate}
                            name="attendanceDate"
                            placeholder="Date"
                            type="date"
                          />
                        </div>

                        <div style={{ marginTop: "14px" }} className="col-lg">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              roasterDetailsLanding_api(
                                values?.attendanceDate,
                                values?.calender?.value,
                                setRowDto,
                                setLoader,
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                values?.workplace?.value,
                                values?.calenderType?.value
                              );
                            }}
                            disabled={
                              !values?.workplace ||
                              !values?.calenderType ||
                              !values?.calender ||
                              !values?.attendanceDate
                            }
                          >
                            View
                          </button>
                          {rowDto?.length > 0 && (
                            <>
                              <button
                                type="button"
                                className="btn btn-primary ml-1 mr-1"
                                onClick={() =>
                                  setTableSize(
                                    tableSize === "Small" ? "Large" : "Small"
                                  )
                                }
                              >
                                {tableSize === "Small" ? "Large" : "Small"} View
                              </button>
                              <button type="button" className="btn btn-primary">
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
                              <button
                                className="btn btn-primary ml-1"
                                type="button"
                                onClick={(e) =>
                                  downloadFile(
                                    `/hcm/HCMRosterReport/GetRosterReportDownload?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&workPlaceId=${values?.workplace?.value}&calendarId=${values?.calender?.value}&userDate=${values?.attendanceDate}&CalenderTypeId=${values?.calenderType?.value}`,
                                    "Roster Report",
                                    "xlsx"
                                  )
                                }
                              >
                                Export Excel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table Start */}
                {rowDto.length > 0 && (
                  <div className="loan-scrollable-table employee-overall-status">
                    <div
                      style={
                        tableSize === "Small"
                          ? { maxHeight: "400px" }
                          : { maxHeight: "800px" }
                      }
                      className="scroll-table _table"
                      ref={printRef}
                    >
                      <div className="d-none-print">
                        <div className="text-center">
                          <h3>{selectedBusinessUnit?.label}</h3>
                          <h4>{values?.workplace?.label}</h4>
                          <h4>
                            Roster Report on{" "}
                            {dateFormatWithMonthName(values?.attendanceDate)}
                          </h4>
                        </div>
                      </div>

                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ minWidth: "50px" }}>SL</th>
                            <th style={{ minWidth: "60px" }}>Employee Id</th>
                            {/* <th style={{ minWidth: "60px" }}>ERP Emp. Id</th> */}
                            <th>Employee Name</th>
                            <th style={{ minWidth: "100px" }}>Designation</th>
                            <th style={{ minWidth: "100px" }}>Department</th>
                            {values?.calenderType?.value === 2 && (
                              <th>Roster Group Name</th>
                            )}
                            <th>Calendar Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto.length >= 0 &&
                            rowDto.map((data, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                {/* <td>
                                  <div className="text-center">
                                    {data?.iBOSEnroll}
                                  </div>
                                </td> */}
                                <td>
                                  <div className="text-center">
                                    {data?.ERPEnroll}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-left pl-2">
                                    {data?.strEmployeeFullName}
                                  </div>
                                </td>
                                <td style={{ minWidth: "100px" }}>
                                  <div className="text-left pl-2">
                                    {data?.strDesignationName}
                                  </div>
                                </td>
                                <td style={{ minWidth: "100px" }}>
                                  <div className="text-left pl-2">
                                    {data?.strDepartmentName}
                                  </div>
                                </td>
                                {values?.calenderType?.value === 2 && (
                                  <td>
                                    <div className="pl-2">
                                      {data?.strRosterGroupHeaderName}
                                    </div>
                                  </td>
                                )}
                                <td>
                                  <div className="pl-2">
                                    {data?.strCalendarName || "-"}
                                  </div>
                                </td>
                                {/* <td>
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
                                </td> */}
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

export default RoasterReport;
