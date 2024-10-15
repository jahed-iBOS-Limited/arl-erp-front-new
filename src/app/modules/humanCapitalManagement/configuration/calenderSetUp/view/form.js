/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { IInput } from "../../../../_helper/_input";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { useEffect } from "react";
import {
  GetBranchDDL,
  GetItemNameDDL,
  GetTransactionTypeDDL,
  GetUomDDL,
  GetTransferToDDL,
  GetItemTypeDDL,
  GetToBusinessUnitDDL,
} from "../helper";
import FormikError from "../../../../_helper/_formikError";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import InputField from "../../../../_helper/_inputField";
import Axios from "axios";
import NewSelect from "../../../../_helper/_select";
import "./customCheckbox.css";

// Validation schema for bank transfer
const validationSchema = Yup.object().shape({
  calenderName: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(100, "Maximum 100 symbols")
    .required("CalenderName is required"),
  endTime: Yup.string().required("End Time is required"),
  minworkHour: Yup.number()
    .min(1, "Minimum 1 Symbol")
    .max(100, "Maximum 100 symbol")
    .required("Minimum start Time is required"),
  latestStartTime: Yup.string().required("Last Start Time is required"),
  fromDate: Yup.date().required("From Date is Required"),
  toDate: Yup.date().required("From Date is Required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  rowDto,
  setter,
  setRowDto,
}) {
  const [valid, setValid] = useState(true);

  const numOfWeekDDL = [
    { value: 1, label: "1st" },
    { value: 2, label: "2nd" },
    { value: 3, label: "3rd" },
    { value: 4, label: "4th" },
    { value: 5, label: "5th" },
    { value: 6, label: "6th" },
    { value: 7, label: "7th" },
  ];

  const dayOfWeekDDL = [
    { value: 1, label: "Saturday" },
    { value: 2, label: "Sunday" },
    { value: 3, label: "Monday" },
    { value: 4, label: "Tuesday" },
    { value: 5, label: "WednessDay" },
    { value: 6, label: "Thursday" },
    { value: 7, label: "Friday" },
  ];

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setValid(false);
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
          setValid(true);
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
          handleBlur,
          handleChange,
        }) => (
          <>
            {disableHandler(!isValid || !valid)}
            
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-4">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-6 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Calender Name</label>
                      <InputField
                        value={values?.calenderName || ""}
                        name="calenderName"
                        placeholder="Calender Name"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-6 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Start Time</label>
                      <input
                        className="trans-date cj-landing-date"
                        style={{ minHeight: "20px", width: "100%" }}
                        value={values?.startTime}
                        name="startTime"
                        onChange={(e) => {
                          setFieldValue("startTime", e.target.value);
                        }}
                        type="time"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-6 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>End Time</label>
                      <input
                        className="trans-date cj-landing-date"
                        style={{ minHeight: "20px", width: "100%" }}
                        value={values?.endTime}
                        name="endTime"
                        onChange={(e) => {
                          setFieldValue("endTime", e.target.value);
                        }}
                        type="time"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-6 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Minimum Work Hour</label>
                      <InputField
                        value={values?.minworkHour || ""}
                        name="minworkHour"
                        placeholder="Minimum work Hour"
                        type="number"
                        disabled={true}
                        min="0"
                      />
                    </div>

                    <div className="col-lg-6 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Allowed Start Time</label>
                      <input
                        className="trans-date cj-landing-date"
                        style={{ minHeight: "20px", width: "100%" }}
                        value={values?.allowedStartTime}
                        name="allowedStartTime"
                        onChange={(e) => {
                          setFieldValue("allowedStartTime", e.target.value);
                        }}
                        type="time"
                        disabled={true}
                      />
                    </div>

                    <div className="col-lg-6 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Last Start Time</label>
                      <input
                        className="trans-date cj-landing-date"
                        style={{ minHeight: "20px", width: "100%" }}
                        value={values?.latestStartTime}
                        name="latestStartTime"
                        onChange={(e) => {
                          setFieldValue("latestStartTime", e.target.value);
                        }}
                        type="time"
                        disabled={true}
                      />
                    </div>

                    <div className="col-lg-12">
                    <label>Working Days</label>
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>S</th>
                            <th>S</th>
                            <th>M</th>
                            <th>T</th>
                            <th>W</th>
                            <th>T</th>
                            <th>F</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className="text-center">
                                <Field
                                  name="saturday"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className=" my-checkbox mb-3"
                                      value={values?.saturday}
                                      checked={values?.saturday}
                                      name="saturday"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "saturday",
                                          e.target.checked
                                        );
                                      }}
                                      disabled={true}
                                    />
                                  )}
                                />
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                <Field
                                  name="sunday"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className=" my-checkbox mb-3"
                                      value={values?.sunday}
                                      checked={values?.sunday}
                                      name="sunday"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "sunday",
                                          e.target.checked
                                        );
                                      }}
                                      disabled={true}
                                    />
                                  )}
                                />
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                <Field
                                  name="monday"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className=" my-checkbox mb-3"
                                      value={values?.monday}
                                      checked={values?.monday}
                                      name="monday"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "monday",
                                          e.target.checked
                                        );
                                      }}
                                      disabled={true}
                                    />
                                  )}
                                />
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                <Field
                                  name="tuesday"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className=" my-checkbox mb-3"
                                      value={values?.tuesday}
                                      checked={values?.tuesday}
                                      name="tuesday"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "tuesday",
                                          e.target.checked
                                        );
                                      }}
                                      disabled={true}
                                    />
                                  )}
                                />
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                <Field
                                  name="wednessday"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className=" my-checkbox mb-3"
                                      value={values?.wednessday}
                                      checked={values?.wednessday}
                                      name="wednessday"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "wednessday",
                                          e.target.checked
                                        );
                                      }}
                                      disabled={true}
                                    />
                                  )}
                                />
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                <Field
                                  name="thursday"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className=" my-checkbox mb-3"
                                      value={values?.thursday}
                                      checked={values?.thursday}
                                      name="thursday"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "thursday",
                                          e.target.checked
                                        );
                                      }}
                                      disabled={true}
                                    />
                                  )}
                                />
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                <Field
                                  name="friday"
                                  component={() => (
                                    <input
                                      type="checkbox"
                                      className=" my-checkbox mb-3"
                                      value={values?.friday}
                                      checked={values?.friday}
                                      name="friday"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "friday",
                                          e.target.checked
                                        );
                                      }}
                                      disabled={true}
                                    />
                                  )}
                                />
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  {/* Table Header input */}
                  <div className={"row bank-journal-custom bj-right"}>
                    <div className="d-flex">
                      <div className="col-lg-2 pl-4 pr mb-0 mt-0  h-narration border-gray">
                        <h6 className="exception">Holiday :</h6>
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-0">
                        <IInput
                          value={values?.fromDate || ""}
                          label="From Date"
                          name="fromDate"
                          type="date"
                          disabled={true}
                        />
                                   
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-0">
                        <IInput
                          value={values?.toDate || ""}
                          label="To Date"
                          name="toDate"
                          type="date"
                          disabled={true}
                        />
                                   
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-0">
                        <IInput
                          value={values?.description || ""}
                          label="Description"
                          name="description"
                          type="text"
                          disabled={true}
                        />
                                   
                      </div>

                      <div className="col-lg-1 pl-2 bank-journal">
                        <button
                          style={{ marginTop: "10px" }}
                          type="button"
                          disabled={!values?.fromDate || !values?.toDate}
                          className="btn btn-primary"
                          onClick={() => {
                            setter(values);
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Table Header input end */}
                  {/* It will be hidden when user select bank tranfer from previous page */}
                  <div className="row">
                    <div className="col-lg-12 pr-0">
                      <table className={"table mt-1 bj-table"}>
                        <thead className={rowDto?.length < 1 && "d-none"}>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th style={{ width: "120px" }}>From Date</th>
                            <th style={{ width: "100px" }}>To Date</th>
                            <th style={{ width: "100px" }}>Number of Days</th>
                            <th style={{ width: "100px" }}>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="text-center">
                                  {item?.fromDate}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {item?.toDate}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {item?.totalDays}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {item?.description}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* offDay row start */}
                  <div className={"row bank-journal-custom bj-right "}>
                    <div className="d-flex">
                      <div className="col-lg-3 pl-4 mb-0 mt-0 mr-n3  h-narration border-gray">
                        <h6 className="exception">OffDay :</h6>
                      </div>

                      <div className="col-lg-4 pl pr-1 mb-0">
                        <NewSelect
                          name="numOfWeekDDL"
                          options={numOfWeekDDL}
                          value={values?.numOfWeekDDL}
                          label="Select Number of Week"
                          onChange={(valueOption) => {
                            setFieldValue("numOfWeekDDL", valueOption);
                          }}
                          placeholder="Select"
                          errors={errors}
                          touched={touched}
                          isDisabled={true}
                        />
                                   
                      </div>

                      <div className="col-lg-4 pl pr-1 mb-0">
                        <NewSelect
                          name="dayOfWeekDDL"
                          options={dayOfWeekDDL}
                          value={values?.dayOfWeekDDL}
                          label="Select Days of Week"
                          onChange={(valueOption) => {
                            setFieldValue("dayOfWeekDDL", valueOption);
                          }}
                          placeholder="Select"
                          errors={errors}
                          touched={touched}
                          isDisabled={true}
                        />
                                   
                      </div>

                      <div className="col-lg-4 pl pr-1 mb-0">
                        <IInput
                          value={values?.remarks || ""}
                          label="Off Day Remarks"
                          name="remarks"
                          type="text"
                          disabled={true}
                        />
                                   
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Row Dto Table End */}
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
