import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";

// eslint-disable-next-line no-unused-vars
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { getEmployeeDDL, getEmployeeDetails } from "../helper";
// eslint-disable-next-line no-unused-vars
import { _dateFormatter } from "../../../../_helper/_dateFormate";

// Validation schema

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,

  setRowDto,
  profileData,
  selectedBusinessUnit,
  isEdit,
}) {
  const [employeeDDL, setEmployeeDDL] = useState(false);

  useEffect(() => {
    if ((profileData?.accountId && selectedBusinessUnit?.value)) {
      getEmployeeDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setEmployeeDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
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
          setValues,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              {!isEdit && (
                <div className="row global-form">
                  <div className="col-lg-3 pl pr-1 mb-1">
                    <NewSelect
                      name="employee"
                      options={employeeDDL}
                      value={values?.employee}
                      label="Employee"
                      onChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                      }}
                      placeholder="select Employee"
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3 pl pr-1 mb-1">
                    <button
                      style={{ marginTop: "15px" }}
                      className="btn btn-primary"
                      type="button"
                      disabled={true}
                      onClick={() => {
                        getEmployeeDetails(
                          values?.employee.value,
                          // setSelectedEmpDetails,
                          // success callBack
                          (emp) => {
                            setValues({ ...values, ...emp });
                          }
                        );
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              )}

              <div className="row global-form">
                <div className="col-lg-3 pl pr-1 mb-1">
                  <InputField
                    value={values?.employeeFullName}
                    label="Employee Name"
                    // disabled={id ? true : false}
                    type="text"
                    name="employeeFullName"
                    placeholder=""
                    disabled={true}
                  />
                </div>

                <div className="col-lg-3 pl pr-1 mb-1">
                  <InputField
                    value={values?.designationName}
                    label="Designation"
                    type="text"
                    name="designationName"
                    placeholder=""
                    disabled={true}
                  />
                </div>

                <div className="col-lg-3 pl pr-1 mb-1">
                  <InputField
                    value={values?.departmentName}
                    label="Department"
                    type="text"
                    name="departmentName"
                    placeholder=""
                    disabled={true}
                  />
                </div>

                {/* <div className="col-lg-3 pl pr-1 mb-1">
                  <InputField
                    value={values?.departmentName}
                    label="Work Place"
                    // disabled={id ? true : false}
                    type="text"
                    name="departmentName"
                    placeholder=""
                  />
                </div> */}

                <div className="col-lg-3 pl pr-1 mb-1">
                  <InputField
                    value={values?.monthlyTaAmount}
                    label="Monthly TA Amount"
                    type="number"
                    name="monthlyTaAmount"
                    placeholder=""
                    disabled={true}
                  />
                </div>

                <div className="col-lg-3 pl pr-1 mb-1">
                  <InputField
                    value={values?.monthlyDaAmount}
                    label="Daily DA Amount"
                    type="number"
                    name="monthlyDaAmount"
                    placeholder=""
                    disabled={true}
                  />
                </div>

                {/* <div className="col-lg-3 pl pr-1 mb-1">
                  <InputField
                    value={values?.additionAmount}
                    label="Addition Amount"
                    type="number"
                    name="additionAmount"
                    placeholder=""
                    disabled={true}
                  />
                </div> */}

                {/* <div className="col-lg-3 pl pr-1 mb-1">
                  <InputField
                    value={values?.deductionAmount}
                    label="Deduction Amount"
                    type="number"
                    name="deductionAmount"
                    placeholder=""
                    disabled={true}
                  />
                </div> */}

                <div className="col-lg-3 pl pr-1 mb-1">
                  <InputField
                    value={values?.meetinExpense}
                    label="Meeting Expense"
                    type="number"
                    name="meetinExpense"
                    placeholder=""
                    disabled={true}
                  />
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
