import React from "react";
import { Formik, Form, Field } from "formik";
import { Input } from "../../../../../../_metronic/_partials/controls";
import NewSelect from "../../../../_helper/_select";
import CreatePageEmpGradeTable from "./createPageEmpGradeTable";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  empPosGrpDDL,
  empHrPosDDL,
  rowData,
  setRowData,
  rowDataAddHandler,
  getEmployeePositionFetch,
}) {
  const changeDDL = (e, index) => {
    let newState = rowData;
    newState[index].baseGrade = e.target.value;
    setRowData(newState);
  };

  const removeHandler = (index) => {
    let newRowData = rowData.filter((item, i) => index !== i);
    setRowData(newRowData);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(rowData, () => {
            resetForm(initData);
            setRowData([]);
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
              <div className="form-group row mb-4 global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="employeePositionGroup"
                    options={empPosGrpDDL}
                    value={values?.employeePositionGroup}
                    label="Employee Position Group"
                    isDisabled={isEdit || rowData.length > 0}
                    onChange={(valueOption) => {
                      setFieldValue("employeePositionGroup", valueOption);
                      getEmployeePositionFetch(valueOption?.value);
                    }}
                    placeholder="Select Employee Position Group"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="employeeHrPosition"
                    options={empHrPosDDL}
                    value={values?.employeeHrPosition}
                    label="Employee HR Position"
                    onChange={(valueOption) => {
                      setFieldValue("employeeHrPosition", valueOption);
                    }}
                    placeholder="Select Employee HR Position"
                    errors={errors}
                    isDisabled={isEdit || rowData.length > 0}
                    touched={touched}
                  />
                </div>
              </div>
              <hr />
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <Field
                    value={values?.employeeGrade}
                    name="employeeGrade"
                    component={Input}
                    placeholder="Employee Grade"
                    label="Employee Grade"
                  />
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values?.code}
                    name="code"
                    component={Input}
                    placeholder="Code"
                    label="Code"
                  />
                </div>
                <div className="col-lg-3 d-flex align-items-end">
                  <button
                    onClick={(e) => {
                      let baseGrade;
                      if (rowData?.length === 0) {
                        baseGrade = {
                          value: values?.employeeGrade,
                          label: values?.employeeGrade,
                        };
                      } else if (rowData?.length === 1) {
                        baseGrade = {
                          value: rowData[0].employeeGrade,
                          label: rowData[0].employeeGrade,
                        };
                      }
                      rowDataAddHandler(values, setFieldValue, baseGrade);
                    }}
                    type="button"
                    disabled={
                      !values.employeePositionGroup ||
                      !values.employeeHrPosition ||
                      !values.employeeGrade ||
                      !values.code
                        ? true
                        : false
                    }
                    className="btn btn-primary"
                  >
                    Add
                  </button>
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
            {/* Table */}
            <CreatePageEmpGradeTable
              rowData={rowData}
              setRowData={setRowData}
              removeHandler={removeHandler}
              changeDDL={changeDDL}
              isEdit={isEdit}
            />
          </>
        )}
      </Formik>
    </>
  );
}
