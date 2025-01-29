import React from "react";
import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import NewSelect from "../../../../_helper/_select";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import "./extra.css";
import IDelete from "../../../../_helper/_helperIcons/_delete";
const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  businessDDLData,
  setRowData,
  rowDto,
  rowDtoHandler,
  location,
  businessUnitDDL,
  remover,
}) {
  // eslint-disable-next-line no-unused-vars
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employeeGroupName: location?.state?.employeeGroupName,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
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
          location,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-3">
                  <IInput
                    value={values?.employeeGroupName}
                    label="Group Name"
                    name="employeeGroupName"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3 pt-5" style={{ marginTop: "7px" }}>
                  <label>All Business Unit</label>
                  <Field
                    name="allBusinessUnitCheck"
                    type="checkbox"
                    className="checkbox ml-3 mb-3"
                    checked={values?.allBusinessUnitCheck}
                    onChange={(e) => {
                      setFieldValue("allBusinessUnitCheck", e.target.checked);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Business Unit Name</label>
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitDDL}
                    value={values?.businessUnit}
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={values?.allBusinessUnitCheck === true}
                  />
                </div>
                <div className="col-lg-3 pt-5">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => rowDtoHandler(values)}
                  >
                    Add
                  </button>
                </div>
                <table className="table table-striped table-bordered mt-3">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Group Name</th>
                      <th>Business Unit</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((item, index) => (
                      <tr>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-center">
                          {item?.employeeGroupName}
                        </td>
                        <td className="text-center">
                          {item?.businessUnit || item?.businessUnitName}
                        </td>
                        <td className="text-center">
                          <IDelete id={index} remover={remover} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onClick={() => handleSubmit}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
            <br />
          </>
        )}
      </Formik>
    </>
  );
}
