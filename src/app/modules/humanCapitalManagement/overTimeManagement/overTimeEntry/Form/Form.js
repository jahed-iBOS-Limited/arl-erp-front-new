import React, { useCallback } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { ISelect } from "../../../../_helper/_inputDropDown";
import axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { _todayDate } from "../../../../_helper/_todayDate";
// import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _timeFormatter } from "../../../../_helper/_timeFormatter";
import {
  getDifferenceBetweenTime,
  getOvertimeByEmp,
  getEmpInfoById,
} from "../helper";
import { formatTime, timestrToSec } from "./utils";

// Validation schema
const validationSchema = Yup.object().shape({
  // businessUnit: Yup.string()
  //   .min(2, "Minimum 2 symbols")
  //   .max(100, "Last Name 100 symbols")
  //   .required("Comments is required"),
  // partnerDDL: Yup.object().shape({
  //   value: Yup.string().required("Partner DDL is required"),
  //   label: Yup.string().required("Partner DDL is required"),
  // }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  selectedBusinessUnit,
  profileData,
  rowDtoAddHandler,
  rowDto,
  workPlaceDDL,
  remover,
  setRowDto,
  purposeDDL,
}) {
  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  // let date = new Date();
  // let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

  const totalCountableHour = useCallback(
    rowDto.reduce(
      (acc, item) =>
        formatTime(timestrToSec(acc) + timestrToSec(item?.countableHour)),
      "0:00:00"
    ), [rowDto]
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              {console.log("values", values)}
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <label>Employee</label>
                  <SearchAsyncSelect
                    selectedValue={values?.employee}
                    isSearchIcon={true}
                    handleChange={(valueOption) => {
                      getOvertimeByEmp(
                        valueOption?.value,
                        selectedBusinessUnit?.value,
                        setRowDto
                      );
                      getEmpInfoById(valueOption?.value, setFieldValue);
                      setFieldValue("enroll", valueOption?.value || "");
                      setFieldValue("code", valueOption?.code || "");
                      setRowDto([]);
                      setFieldValue("employee", valueOption);
                    }}
                    loadOptions={loadUserList}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    options={workPlaceDDL}
                    label="Work Place"
                    value={values?.workPlace}
                    placeholder="Work Place"
                    onChange={(valueOption) => {
                      setFieldValue("workPlace", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    disabled
                    value={values?.enroll}
                    label="ERP Enroll"
                    name="enroll"
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    disabled
                    value={values?.designation}
                    label="Designation"
                    name="designation"
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    disabled
                    value={values?.code}
                    label="Code"
                    name="code"
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.date}
                    label="Date"
                    type="date"
                    name="date"
                    onChange={(e) => {
                      setFieldValue("date", e.target.value);
                      if (values?.startTime && values?.endTime) {
                        let difference = getDifferenceBetweenTime(
                          e.target.value,
                          values?.startTime,
                          values?.endTime
                        );
                        setFieldValue("overTimeHour", difference);
                      }
                    }}
                    // min={_dateFormatter(firstDay)}
                    max={_todayDate()}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.startTime}
                    label="Start Time"
                    type="time"
                    onChange={(e) => {
                      setFieldValue("startTime", e.target.value);
                      if (values?.date && values?.endTime) {
                        let difference = getDifferenceBetweenTime(
                          values?.date,
                          e.target.value,
                          values?.endTime
                        );
                        setFieldValue("overTimeHour", difference);
                      }
                    }}
                    name="startTime"
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.endTime}
                    label="End Time"
                    onChange={(e) => {
                      setFieldValue("endTime", e.target.value);
                      if (values?.date && values?.startTime) {
                        let difference = getDifferenceBetweenTime(
                          values?.date,
                          values?.startTime,
                          e.target.value
                        );
                        setFieldValue("overTimeHour", difference);
                      }
                    }}
                    type="time"
                    name="endTime"
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    disabled
                    value={values?.overTimeHour}
                    label="Overtime Hour"
                    name="overTimeHour"
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    options={purposeDDL}
                    label="Purpose (optional)"
                    value={values?.purpose}
                    placeholder="Purpose"
                    onChange={(valueOption) => {
                      setFieldValue("purpose", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.remarks}
                    label="Remarks (optional)"
                    name="remarks"
                  />
                </div>
                <div style={{ marginTop: "18px" }} className="col-lg-3">
                  <button
                    onClick={() => rowDtoAddHandler(values)}
                    disabled={
                      !values?.employee ||
                      !values?.workPlace ||
                      !values?.date ||
                      !values?.startTime ||
                      !values?.endTime
                    }
                    type="button"
                    className="btn btn-primary"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Table */}

              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table mr-1">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th style={{ minWidth: "30px" }}>Employee Id</th>
                    <th style={{ minWidth: "40px" }}>ERP Emp. Id</th>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    {/* <th>Difference Time</th> */}
                    <th>Countable Hour</th>
                    <th>Reason</th>
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((item, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td className="text-center">{item?.employee?.value}</td>
                      <td className="text-center">
                        {" "}
                        {item?.employee?.erpemployeeId}{" "}
                      </td>
                      <td className="text-center">{item?.date}</td>
                      <td className="text-center">
                        {_timeFormatter(item?.startTime)}
                      </td>
                      <td className="text-center">
                        {_timeFormatter(item?.endTime)}
                      </td>
                      {/* <td className="text-center">{item?.difference}</td> */}
                      <td className="text-center">{item?.countableHour}</td>
                      <td>{item?.purpose?.label}</td>
                      <td>{item?.remarks}</td>
                      <td className="text-center">
                        <IDelete remover={remover} id={index} />
                      </td>
                    </tr>
                  ))}
                  {rowDto?.length > 0 && (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td><b>Total</b></td>
                      <td className="text-center">{totalCountableHour}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>

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
