import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import InputField from "../../../../_helper/_inputField";
import { ISelect } from "../../../../_helper/_inputDropDown";
import TableRowCreatePage from "../Table/tableRowCreatePage";

// Validation schema
const validationSchema = Yup.object().shape({
  payrollGroupName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Department is required"),
  payrollGroupCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Middle Name 100 symbols")
    .required("Code is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  payrollPeriodDdlData,
  profileData,
  setRowDataCreate,
  rowDataCreate,
  id,
}) {
  const [rowData, setRowData] = useState([]);

  const rowDataAddHandler = (values, setFieldValue) => {
    setRowData([
      ...rowData,
      {
        payrollPeriod: values.payrollPeriod,
        currentPeriodStart: values.currentPeriodStart,
        currentPeriodEnd: values.currentPeriodEnd,
      },
    ]);
    setRowDataCreate([
      ...rowDataCreate,
      {
        payrollGroupCode: values.payrollGroupCode,
        payrollGroupName: values.payrollGroupName,
        payrollPeriodId: values?.payrollPeriod?.value,
        currentPeriodStart: values.currentPeriodStart,
        currentPeriodEnd: values.currentPeriodEnd,
        accountId: profileData?.accountId,
        actionBy: profileData.userId,
      },
    ]);
  };

  const deleteHandler = (id) => {
    const deleteData = rowData.filter((data, index) => id !== index);

    setRowData(deleteData);

    const deleteDataCreate = rowDataCreate.filter(
      (data, index) => id !== index
    );
    setRowDataCreate(deleteDataCreate);
  };
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
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <IInput
                    value={
                      values.payrollGroupName ? values.payrollGroupName : ""
                    }
                    label="Payroll Group"
                    name="payrollGroupName"
                  />
                </div>

                <div className="col-lg-3">
                  <IInput
                    value={
                      values.payrollGroupCode ? values.payrollGroupCode : ""
                    }
                    label="Payroll Group Code"
                    name="payrollGroupCode"
                    disabled={isEdit}
                  />
                </div>
              </div>

              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <ISelect
                    label="Payroll Period"
                    options={payrollPeriodDdlData}
                    // defaultValue={values.businessUnit}
                    value={values.payrollPeriod}
                    name="payrollPeriod"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    // isDisabled={allBusinessUnitChecked === true}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Period Start Date</label>
                  <InputField
                    value={
                      values?.currentPeriodStart
                        ? values?.currentPeriodStart
                        : ""
                    }
                    name="currentPeriodStart"
                    placeholder="Period Start Date"
                    type="date"
                  />
                </div>

                <div className="col-lg-3">
                  <label>Period End Date</label>
                  <InputField
                    value={
                      values?.currentPeriodEnd ? values?.currentPeriodEnd : ""
                    }
                    name="currentPeriodEnd"
                    placeholder="Period End Date"
                    type="date"
                  />
                </div>

                {!id && (
                  <div className="col-lg-3" style={{ marginTop: "18px" }}>
                    <button
                      className={"btn btn-primary"}
                      type="button"
                      onClick={(e) => rowDataAddHandler(values, setFieldValue)}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {/* <div className="row">
                <div className="col-lg">

                </div>
              </div> */}

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

      {isEdit ? (
        ""
      ) : (
        <TableRowCreatePage
          rowData={rowData}
          deleteHandler={deleteHandler}
        ></TableRowCreatePage>
      )}
    </>
  );
}
