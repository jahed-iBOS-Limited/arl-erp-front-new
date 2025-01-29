/* eslint-disable no-unused-vars */
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { loadUserListAction } from "../helper";
import NewSelect from "../../../../_helper/_select";

// Validation schema
const validationSchema = Yup.object().shape({
  reqDate: Yup.string().required("Requested date is required"),
  // reqDepartment: Yup.object().shape({
  //   value: Yup.string().required("Requested department is required"),
  //   label: Yup.string().required("Requested department is required"),
  // }),
  // costCenter: Yup.object().shape({
  //   value: Yup.string().required("Cost center is required"),
  //   label: Yup.string().required("Cost center is required"),
  // }),
  // workplace: Yup.object().shape({
  //   value: Yup.string().required("Workplace is required"),
  //   label: Yup.string().required("Workplace is required"),
  // }),
});

export default function _Form({ btnRef, resetBtnRef, obj }) {
  const {
    profileData,
    selectedBusinessUnit,
    initData,
    saveHandler,
    remover,
    departmentDDL,
    workplaceDDL,
    otShiftDDL,
    costCenterDDL,
    rowDtoAddHandler,
    rowDto,
  } = obj;

  const loadUser = (searchValue) =>
    loadUserListAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      searchValue
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
              {/* Section One Start */}
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    options={departmentDDL}
                    label="Requested Department"
                    value={values?.reqDepartment}
                    name="reqDepartment"
                    placeholder="Requested Department"
                    onChange={(valueOption) => {
                      setFieldValue("reqDepartment", valueOption || "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.reqDate}
                    label="Requested Date"
                    name="reqDate"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    options={costCenterDDL}
                    label="Cost Center (Optional)"
                    placeholder="Cost Center"
                    value={values?.costCenter}
                    name="costCenter"
                    onChange={(valueOption) => {
                      setFieldValue("costCenter", valueOption || "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    options={workplaceDDL}
                    label="Requested Workplace"
                    name="workplace"
                    placeholder="Requested Workplace"
                    value={values?.workplace}
                    onChange={(valueOption) => {
                      setFieldValue("workplace", valueOption || "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              
              {/* Section One End */}

              
                <div className="col-lg-3">
                  <label>Employee/Enroll</label>
                  <SearchAsyncSelect
                    selectedValue={values?.employee}
                    isSearchIcon={true}
                    handleChange={(valueOption) => {
                      setFieldValue("employee", valueOption || "");
                    }}
                    loadOptions={loadUser}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.reason}
                    label="Reason for Overtime"
                    name="reason"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    options={otShiftDDL}
                    label="Requested OT Shift"
                    placeholder="Requested OT Shift"
                    value={values?.reqOtShift}
                    onChange={(valueOption) => {
                      setFieldValue("reqOtShift", valueOption || "");
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Hour and Minutes</label>
                  <div className="d-flex">
                    <div className="mr-1">
                      <IInput
                        placeholder="Hour"
                        value={values?.hour}
                        name="hour"
                        type="number"
                      />
                    </div>
                    <div className="mr-1">
                      <IInput
                        placeholder="Minutes"
                        value={values?.minutes}
                        name="minutes"
                        type="number"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => rowDtoAddHandler(values)}
                        disabled={
                          values?.minutes < 0 ||
                          values?.hour < 1 ||
                          !values?.reqOtShift ||
                          !values?.reason ||
                          !values?.workplace ||
                          !values?.reqDepartment ||
                          !values?.employee
                        }
                        className="btn btn-primary"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                </div>
       
            

              {/* Table Start */}
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table mr-1">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Employee Id</th>
                    <th>ERP Emp. Id</th>
                    <th>Employee Code</th>
                    <th>Employee Name</th>
                    <th>Requested Department</th>
                    <th>Requested Workplace</th>
                    <th>Requested Date</th>
                    <th>Reason for Overtime</th>
                    <th>Current Shift</th>
                    <th>Requested OT Shift</th>
                    <th>OT Hours</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td style={{minWidth:"100px"}} className="text-center">{item?.employee?.value}</td>
                      <td style={{minWidth:"100px"}} className="text-center">{item?.employee?.erpemployeeId}</td>
                      <td style={{minWidth:"100px"}} className="text-center">{item?.employee?.code}</td>
                      <td>{item?.employee?.label}</td>
                      <td>{item?.reqDepartment?.label}</td>
                      <td>{item?.workplace?.label}</td>
                      <td className="text-center">{item?.reqDate}</td>
                      <td>{item?.reason}</td>
                      <td>{item?.employee?.employeeCalenderName}</td>
                      <td>{item?.reqOtShift?.label}</td>
                      <td className="text-center">{`${item?.hour}:${
                        item?.minutes.toString().length === 1 ? "0" : ""
                      }${item?.minutes || "0"}`}</td>
                      <td className="text-center">
                        <IDelete remover={remover} id={index} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Table End */}

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
