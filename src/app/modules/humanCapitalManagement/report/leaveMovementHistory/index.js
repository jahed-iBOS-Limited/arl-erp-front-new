import React, { useEffect, useState } from "react";
import ICustomCard from "../../../_helper/_customCard";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import "./leaveMovementHistory.css";
import Loading from "../../../_helper/_loading";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import axios from "axios";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import ReactHtmlTableToExcel from "react-html-table-to-excel";

const initData = {
  employee: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  leaveType: "",
};

const LeaveMovementHistory = () => {
  const [rowData, getRowData, rowDataLoader, setRowData] = useAxiosGet();
  const [LeaveTypeDDL, getLeaveTypeDDL, leaveTypeDDLloader] = useAxiosGet();
  const [isViewtype, setIsViewtype] = useState(0);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getLeaveTypeDDL(`/hcm/HCMDDL/GetLeaveTypeDDL?check=1&accountId=${profileData?.accountId}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  return (
    <>
      {(leaveTypeDDLloader || rowDataLoader) && <Loading />}
      <ICustomCard title="Leave Movement History">
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <>
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-4 mb-2 mt-5">
                    <label className="mr-3">
                      <input
                        type="radio"
                        name="type"
                        checked={isViewtype === 0}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(valueOption) => {
                          setIsViewtype(0);
                          setFieldValue("leaveType", "");
                          setRowData([]);
                        }}
                      />
                      Movement
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="type"
                        checked={isViewtype === 1}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(e) => {
                          setIsViewtype(1);
                          setFieldValue("leaveType", "");
                          setRowData([]);
                        }}
                      />
                      Leave
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="global-form">
                      <div className="row">
                        <div className="col-lg-2">
                          <label>Employee</label>
                          <SearchAsyncSelect
                            selectedValue={values?.employee}
                            isSearchIcon={true}
                            placeholder="Search employee (min 3 letter)"
                            handleChange={(valueOption) => {
                              if (valueOption) {
                                setFieldValue("employee", valueOption);
                              } else {
                                setFieldValue("employee", "");
                              }
                            }}
                            loadOptions={loadUserList}
                          />
                        </div>
                        <div className="col-lg-2">
                          <div>From Date</div>
                          <input
                            className="trans-date cj-landing-date"
                            value={values?.fromDate}
                            name="fromDate"
                            onChange={(e) => {
                              setFieldValue("fromDate", e.target.value);
                            }}
                            type="date"
                          />
                        </div>
                        <div className="col-lg-2">
                          <div>To Date</div>
                          <input
                            className="trans-date cj-landing-date"
                            value={values?.toDate}
                            name="toDate"
                            onChange={(e) => {
                              setFieldValue("toDate", e.target.value);
                            }}
                            type="date"
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="leaveType"
                            options={LeaveTypeDDL}
                            value={values?.leaveType}
                            label="Leave Type"
                            onChange={(valueOption) => {
                              setFieldValue("leaveType", valueOption);
                            }}
                            placeholder="Leave Type"
                            isSearchable={true}
                            errors={errors}
                            touched={touched}
                            isDisabled={isViewtype === 0}
                          />
                        </div>
                        <div style={{ marginTop: "14px" }} className="col-lg-2">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              let leaveType = values?.leaveType?.value >= 0 ? `Type=${values?.leaveType?.value}&` : "";
                              getRowData(`/hcm/HCMLeaveAndMovementReport/GetLeaveAndMovementHistory?${leaveType}Unit=${selectedBusinessUnit?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&isViewType=${isViewtype}&employeeId=${values?.employee?.value || 0}`
                              );
                            }}
                            disabled={isViewtype === 1 ? !values?.leaveType : false || !values?.fromDate || !values?.toDate}>
                            View
                          </button>
                        </div>
                        <div style={{ marginTop: "12px" }} className="col-lg-2 text-right">
                          <ReactHtmlTableToExcel
                            id="test-table-xls-button-att-reports"
                            className="btn btn-primary px-3 py-2 mr-2"
                            table="table-to-xlsx"
                            filename="Leave Movement History"
                            sheet="Sheet-1"
                            buttonText="Export Excel"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <>
                  <table id="table-to-xlsx" className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Employee Id</th>
                        <th>Employee Name</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Type</th>
                        <th>Consume Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        rowData?.length > 0 ?
                          rowData.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="text-center">{item?.EmployeeID}</td>
                              <td>{item?.EmployeeName}</td>
                              <td>{item?.DepartmentName}</td>
                              <td>{item?.DesignationName}</td>
                              <td>{item?.MoveType}</td>
                              <td className="text-center">{item?.ConsumeDays}</td>
                            </tr>
                          )) : null
                      }
                    </tbody>
                  </table>
                </>
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default LeaveMovementHistory;
