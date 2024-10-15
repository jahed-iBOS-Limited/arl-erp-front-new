/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import "./customCheckbox.css";
import { GetHolidaySetupDDLRowData } from "../helper";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import FormikError from "../../../../_helper/_formikError";

// Validation schema for bank transfer
const validationSchema = Yup.object().shape({
  calenderName: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Calendar name is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string().required("End time is required"),
  allowedStartTime: Yup.string().required("Allowed time is required"),
  minworkHour: Yup.number()
    .min(1, "Minimum 1 Symbol")
    .max(100, "Maximum 100 symbol")
    .required("Minimum work hour is required"),
  latestStartTime: Yup.string().required("Last start time is required"),
  /* fromDate: Yup.date().required("From Date is Required"),
  toDate: Yup.date().required("From Date is Required"), */
});

// This method for find number of days between two date
export const countTotalDays = (f, t) => {
  if (f === t) return 1;
  let fromDate = new Date(f);
  let toDate = new Date(t);

  let one_day = 1000 * 60 * 60 * 24;
  // To Calculate next year's Christmas if passed already.
  if (fromDate.getMonth() === 11 && fromDate.getDate() > 25)
    toDate.setFullYear(toDate.getFullYear() + 1);

  // To Calculate the result in milliseconds and then converting into days
  let Result = Math.round(toDate.getTime() - fromDate.getTime()) / one_day;

  // To remove the decimals from the (Result) resulting days value
  let Final_Result = Result.toFixed(0);
  return Final_Result;
};

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  remover,
  setter,
  setRowDto,
  holidayGroupNameDDL,
}) {
  const [valid, setValid] = useState(true);

  const numOfWeekDDL = [
    { value: 1, label: "1st week" },
    { value: 2, label: "2nd week" },
    { value: 3, label: "3rd week" },
    { value: 4, label: "4th week" },
    { value: 5, label: "Last week" },
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
        }) => (
          <>
            
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-4">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-6 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Calendar Name</label>
                      <InputField
                        value={values?.calenderName || ""}
                        name="calenderName"
                        placeholder="Calendar Name"
                        type="text"
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
                      />
                      {errors && touched && (
                        <FormikError
                          errors={errors}
                          touched={touched}
                          name="startTime"
                        />
                      )}
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
                      />
                      {errors && touched && (
                        <FormikError
                          errors={errors}
                          touched={touched}
                          name="endTime"
                        />
                      )}
                    </div>
                    <div className="col-lg-6 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Minimum Work Hour</label>
                      <InputField
                        value={values?.minworkHour || ""}
                        name="minworkHour"
                        placeholder="Minimum work Hour"
                        type="number"
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
                      />
                      {errors && touched && (
                        <FormikError
                          errors={errors}
                          touched={touched}
                          name="allowedStartTime"
                        />
                      )}
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
                      />
                      {errors && touched && (
                        <FormikError
                          errors={errors}
                          touched={touched}
                          name="latestStartTime"
                        />
                      )}
                    </div>

                    <div
                      style={{ paddingBottom: "24px" }}
                      className="col-lg-12"
                    >
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
                  <div className={"row bank-journal-custom bj-right  px-4"}>
                    {/* <div> */}
                    <div className="col-lg-12">
                      <h6 className="exception mr-3">Holiday :</h6>
                    </div>
                    <div className="col-lg-3 pb-2">
                      <NewSelect
                        name="holidayGrpName"
                        options={holidayGroupNameDDL}
                        value={values?.holidayGrpName}
                        label="Holiday Group Name"
                        onChange={(valueOption) => {
                          setFieldValue("holidayGrpName", valueOption);
                          GetHolidaySetupDDLRowData(
                            valueOption?.value,
                            setRowDto
                          );
                        }}
                        placeholder="Holiday Group"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-9"></div>

                    <div className="col-lg-3 pl-3 pr-1 mb-0">
                      <IInput
                        value={values?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                      />
                                 
                    </div>

                    <div className="col-lg-3 pl pr-1 mb-0">
                      <IInput
                        value={values?.toDate}
                        label="To Date"
                        name="toDate"
                        type="date"
                      />
                                 
                    </div>

                    <div className="col-lg-3 pl mb-0">
                      <IInput
                        value={values?.description || ""}
                        label="Description"
                        name="description"
                        type="text"
                      />
                                 
                    </div>

                    <div
                      style={{ marginTop: "16px" }}
                      className="col-lg-1 pl-1 bank-journal"
                    >
                      <ButtonStyleOne
                        type="button"
                        disabled={
                          !values?.fromDate ||
                          !values?.toDate ||
                          !values?.description
                        }
                        className="btn btn-primary"
                        onClick={() => {
                          const uniq = {
                            ...values,
                            fromDate: values?.fromDate,
                            toDate: values?.toDate,
                            totalDays: countTotalDays(
                              _dateFormatter(values?.fromDate),
                              _dateFormatter(values?.toDate)
                            ),
                          };
                          setter(uniq, setRowDto);
                          setFieldValue("description", "")
                        }}
                        label="Add"
                      />
                    </div>
                    {/* </div> */}
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
                            <th style={{ width: "100px" }}>Description</th>
                            {/* <th style={{ width: "100px" }}>Number of Days</th> */}
                            <th style={{ width: "50px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="text-center">
                                  {_dateFormatter(item?.fromDate)}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {_dateFormatter(item?.toDate)}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {item?.description}
                                </div>
                              </td>
                              {/* <td>
                                <div className="text-center">
                                  {item?.totalDays}
                                </div>
                              </td> */}

                              <td className="text-center">
                                <IDelete remover={remover} id={index} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* offDay row start */}
                  <div className={"row bank-journal-custom bj-right  px-4"}>
                    <div>
                      <h6 className="exception">Off-Day :</h6>
                    </div>
                    <div className="col-lg-9"></div>
                    <div className="col-lg-3 pl-1 pr-1 mb-0">
                      <NewSelect
                        name="numOfWeekDDL"
                        options={numOfWeekDDL}
                        value={values?.numOfWeekDDL}
                        label="Select Week of Month"
                        onChange={(valueOption) => {
                          setFieldValue("numOfWeekDDL", valueOption);
                        }}
                        placeholder="Select"
                        errors={errors}
                        touched={touched}
                      />
                                
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-0">
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
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-0">
                      <IInput
                        value={values?.remarks || ""}
                        label="Off Day Remarks"
                        name="remarks"
                        type="text"
                      />
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
