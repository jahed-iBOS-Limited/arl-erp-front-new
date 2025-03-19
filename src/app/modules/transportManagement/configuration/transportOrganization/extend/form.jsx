import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import { getBusinessUnitDDL_api } from "../helper";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import NewSelect from "./../../../../_helper/_select";

// Validation schema
const validationSchema = Yup.object().shape({
  businessUnitName: Yup.object().shape({
    value: Yup.string(),
    label: Yup.string(),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  remover,
  setter,
  setRowDto,
  rowDto,
  profileData,
  id,
}) {
  const [businessUnitName, setbusinessUnitName] = useState([]);
  useEffect(() => {
    getBusinessUnitDDL_api(
      profileData?.userId,
      profileData?.accountId,
      setbusinessUnitName
    );
  }, [profileData]);

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
          setValues,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div
                    className="row bank-journal bank-journal-custom bj-left"
                    style={{ paddingBottom: "40px" }}
                  >
                    <div className="col-lg-3 pl pr-1 mb-1">
                      <label>Transport Organization Name</label>
                      <InputField
                        value={values?.transportOrganizationName}
                        name="transportOrganizationName"
                        placeholder="Transport Organization Name"
                        type="text"
                        disabled={true}
                      />
                      <FormikError
                        errors={errors}
                        name="transportOrganizationName"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-1">
                      <NewSelect
                        name="businessUnitName"
                        options={businessUnitName}
                        value={values?.businessUnitName}
                        label="Business Unit Name"
                        onChange={(valueOption) => {
                          setFieldValue("businessUnitName", valueOption);
                        }}
                        placeholder="Business Unit Name"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 bank-journal">
                      <button
                        style={{ marginTop: "10px" }}
                        type="button"
                        disabled={!values?.businessUnitName}
                        className="btn btn-primary"
                        onClick={() => {
                          const payload = {
                            businessUnitName: values?.businessUnitName,
                          };
                          setter(payload);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 pl-0 pr-0">
                <div className="table-responsive">
                <table className={"table mt-1 bj-table"}>
                    <thead className={rowDto?.length < 1 && "d-none"}>
                      <tr>
                        <th style={{ width: "20px" }}>SL</th>
                        <th style={{ width: "50px" }}>Business Unit Name</th>
                        <th style={{ width: "50px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="text-left pl-2">
                              {item?.businessUnitName?.label}
                            </div>
                          </td>
                          <td className="text-center">
                            <IDelete remover={remover} id={index} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
