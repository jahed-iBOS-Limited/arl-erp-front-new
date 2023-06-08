import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { getRowDto } from "../helper";
import InputField from "./../../../../_helper/_inputField";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { _todayDate } from './../../../../_helper/_todayDate';

// Validation schema
const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  setDisabled,
  rowDtoHandler,
  superVisorDDL,
  setRowDto,
  allGridCheck,
  isChecked,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            // resetForm(initData);
            setRowDto([]);
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
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <ISelect
                    label="Select Supervisor"
                    placeholder="Supervisor"
                    options={superVisorDDL}
                    value={values?.supervisorList}
                    name="supervisorList"
                    onChange={(valueOption) => {
                      setFieldValue("supervisorList", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Attendance Date</label>
                  <InputField
                    value={values?.attendancedate}
                    name="attendancedate"
                    placeholder="Attendance Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-3" style={{marginTop: "17px"}}>
                  <button
                    type="button"
                    disabled={
                      values?.attendancedate > _todayDate() || !values?.supervisorList
                    }
                    onClick={() => {
                      let newDate = new Date(values?.attendancedate);
                      let formatNewDate = _dateFormatter(newDate);
                      getRowDto(
                        values?.supervisorList?.value,
                        +formatNewDate.split("-")[2],
                        +formatNewDate.split("-")[1],
                        +formatNewDate.split("-")[0],
                        setRowDto,
                        values?.attendancedate,
                        setDisabled
                      );
                    }}
                    className="btn btn-primary"
                  >
                    View
                  </button>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-12">
                  {/* Start Table Part */}
                  {rowDto.length > 0 && (
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th style={{verticalAlign: "middle" }}>Employee Name</th>
                          <th style={{verticalAlign: "middle" }}>Designation</th>
                          <th style={{verticalAlign: "middle" }}>
                            <input
                              type="checkbox"
                              style={{ marginRight:"4px"}}
                              onChange={(event) => {
                                allGridCheck(event.target.checked);

                              }}
                            />
                            Attendance Status
                          </th>
                          <th style={{verticalAlign: "middle" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody className="empAttendanceCSS">
                        {rowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="text-left pl-4">
                                {item.employeeName}
                              </div>
                            </td>
                            <td className="text-center align-middle">
                              {item.designationName}
                            </td>
                            <td className="text-center align-middle">
                              <Field
                                type="checkbox"
                                name="presentStatus"
                                checked={rowDto[index]?.presentStatus}
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "presentStatus",
                                    !rowDto[index]?.presentStatus,
                                    index
                                  );
                                }}
                              />
                            </td>
                            <td className="text-center align-middle">
                              {item.currentStatus}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {/* End Table Part */}
                </div>
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
