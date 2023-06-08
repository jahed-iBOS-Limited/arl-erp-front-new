import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import {
  getDepartmentWithCorporateDDLAction,
  getEmploymentTypeDDLAction,
  getWorkplaceGroupDDL,
} from "../helper";
import axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { getEmployeeAttendanceAction } from "../helper";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  setRowDto,
  selectedBusinessUnit,
  accountId,
  setDisabled,
}) {
  const [corpOrOther, setCorpOrOther] = useState([]);
  const [workPlaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [jobTypeDDL, setJobTypeDDL] = useState([]);

  useEffect(() => {
    getDepartmentWithCorporateDDLAction(
      accountId,
      selectedBusinessUnit?.value,
      setCorpOrOther
    );
    getEmploymentTypeDDLAction(
      accountId,
      selectedBusinessUnit?.value,
      setJobTypeDDL
    );
    getWorkplaceGroupDDL(accountId, setWorkplaceGroupDDL);
  }, [accountId, selectedBusinessUnit]);

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          businessUnit: selectedBusinessUnit?.label,
        }}
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
          isValid,
        }) => (
          <>
            {console.log(errors, "errors")}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col">
                  <label>Employee</label>
                  <SearchAsyncSelect
                    selectedValue={values?.employeeName}
                    isSearchIcon={true}
                    handleChange={(valueOption) => {
                      setFieldValue("employeeName", valueOption);
                    }}
                    loadOptions={loadUserList}
                  />
                </div>
                <div className="col">
                  <NewSelect
                    options={workPlaceGroupDDL}
                    label="Work Place Group"
                    placeholder="Work Place Group"
                    value={values?.workplaceGroup}
                    onChange={(valueOption) => {
                      setFieldValue("workplaceGroup", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col">
                  <NewSelect
                    name="department"
                    options={corpOrOther}
                    value={values?.department}
                    onChange={(valueOption) => {
                      setFieldValue("department", valueOption);
                      setRowDto([]);
                    }}
                    placeholder="Department"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col">
                  <label>Attendance Date</label>
                  <InputField
                    value={values?.attendancedate}
                    name="attendancedate"
                    placeholder="Attendance date"
                    onChange={(e) => {
                      setFieldValue("attendancedate", e.target.value);
                      setRowDto([]);
                    }}
                    type="date"
                  />
                </div>
                <div className="col">
                  <NewSelect
                    name="status"
                    options={[
                      { value: 0, label: "All" },
                      { value: 1, label: "Present" },
                      { value: 2, label: "Absent" },
                      { value: 3, label: "Late" },
                    ]}
                    value={values?.status}
                    onChange={(valueOption) => {
                      setFieldValue("status", valueOption);
                      setRowDto([]);
                    }}
                    placeholder="Attendance status"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col">
                  <NewSelect
                    name="punch"
                    options={[
                      { value: 0, label: "All" },
                      { value: 1, label: "Punch" },
                      { value: 2, label: "Without Punch" },
                    ]}
                    value={values?.punch}
                    onChange={(valueOption) => {
                      setFieldValue("punch", valueOption);
                      setRowDto([]);
                    }}
                    placeholder="Punch Status"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col">
                  <NewSelect
                    name="jobType"
                    options={jobTypeDDL}
                    value={values?.jobType}
                    onChange={(valueOption) => {
                      setFieldValue("jobType", valueOption);
                      setRowDto([]);
                    }}
                    placeholder="Job Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col" style={{ marginTop: "14px" }}>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      getEmployeeAttendanceAction(
                        selectedBusinessUnit?.value,
                        values?.department?.value,
                        values?.attendancedate,
                        values?.status?.value,
                        values?.punch?.value,
                        values?.employeeName?.value || 0,
                        values?.workplaceGroup?.value || 0,
                        setRowDto,
                        setDisabled,
                        values?.jobType?.value
                      );
                    }}
                    disabled={
                      !values?.department ||
                      !values?.attendancedate ||
                      !values?.status ||
                      !values?.punch ||
                      !values?.jobType ||
                      !values?.workplaceGroup
                    }
                  >
                    View
                  </button>
                </div>
              </div>

              <div className="form-group row ">
                <div
                  className="col-lg-3 p-2 ml-3  global-form"
                  style={{ marginTop: "25px" }}
                >
                  <div className="row">
                    <div className="col-lg-6">
                      <NewSelect
                        name="attendanceWill"
                        options={[
                          { value: 1, label: "Present" },
                          { value: 2, label: "Absent" },
                          { value: 3, label: "Late" },
                        ]}
                        value={values?.attendanceWill}
                        onChange={(valueOption) => {
                          setFieldValue("attendanceWill", valueOption);
                        }}
                        placeholder="Attendance  Will"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-6 mt-3 d-flex align-items-center">
                      <div
                        style={{
                          marginTop: "4px",
                          display: "inline-block",
                          marginRight: "4px",
                        }}
                      >
                        <Field
                          type="checkbox"
                          name="isConsidered"
                          checked={values?.isConsidered}
                          onChange={(e) => {
                            setFieldValue("isConsidered", e.target.checked);
                          }}
                        />
                      </div>
                      <div style={{ display: "inline-block" }}>
                        <label>Is Considered</label>
                      </div>
                    </div>
                  </div>
                </div>

                {rowDto.length > 0 && (
                  <table className="table table-striped table-bordered global-table ml-3 mr-3">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            name="allCheckobx"
                            checked={
                              rowDto?.length > 0 &&
                              rowDto?.every((item) => item?.isSelect)
                            }
                            onChange={(e) => {
                              setRowDto(
                                rowDto?.length > 0 &&
                                  rowDto?.map((item) => ({
                                    ...item,
                                    isSelect: e.target.checked,
                                  }))
                              );
                            }}
                          />
                        </th>
                        <th>SL</th>
                        <th style={{ width: "30px" }}>Employee Id</th>
                        <th style={{ width: "40px", minWidth: "30px" }}>
                          ERP Emp. Id
                        </th>
                        <th>Employee Code</th>
                        <th>Employee Name</th>
                        <th>Line Manager</th>
                        <th>Employment Type</th>
                        <th>HR Position</th>
                        <th>Designation</th>
                        <th>Attendance In-Time</th>
                        <th>Attendance Out-Time</th>
                        <th>Actual Status</th>
                        <th>Modified Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => (
                        <tr>
                          <td className="text-center align-middle">
                            <Field
                              type="checkbox"
                              name="presentStatus"
                              checked={item?.isSelect}
                              onChange={(e) => {
                                let data = [...rowDto];
                                data[index].isSelect = e.target.checked;
                                setRowDto([...data]);
                              }}
                            />
                          </td>
                          <td className="text-center align-middle">
                            {index + 1}
                          </td>

                          <td> {item?.employeeId} </td>
                          <td> {item?.erpemployeeId} </td>

                          <td className="text-center align-middle">
                            {item?.employeeCode}
                          </td>
                          <td className="align-middle">{item?.employeeName}</td>
                          <td className="align-middle">
                            {item?.lineManagerName}
                          </td>
                          <td className="align-middle">
                            {item?.employmentTypeName}
                          </td>
                          <td className="align-middle">
                            {item?.hrPositionName}
                          </td>
                          <td className="align-middle">
                            {item?.designationName}
                          </td>
                          <td className="text-center align-middle">
                            {item?.inTime}
                          </td>
                          <td className="text-center align-middle">
                            {item?.outTime}
                          </td>
                          <td className="text-center align-middle">
                            {item?.actualAttendenceStatus}
                          </td>
                          <td className="text-center align-middle">
                            {item?.attendenceStatus}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
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
