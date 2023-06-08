import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import NewSelect from "./../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import FormikError from "../../../../_helper/_formikError";
import { useSelector, shallowEqual } from 'react-redux';

// Validation schema
const validationSchema = Yup.object().shape({
  // taxBranchAddress: Yup.string().required("Tax Branch Address other required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  remover,
  setter,
  rowDto,
}) {
  const shipPointNames = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

    return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            // setRowDto([]);
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
              <div className="row mt-2">
                <div className="col-lg-12 p-0 m-0">
                  <div
                    className="row global-form"
                    style={{ paddingBottom: "40px" }}
                  >
                    <div className="col-lg-3 pl pr-1 mb-1">
                      <label>Branch Name</label>
                      <InputField
                        value={values?.taxBranchName}
                        name="taxBranchName"
                        placeholder="From Address"
                        type="text"
                        disabled={true}
                      />
                      <FormikError
                        errors={errors}
                        name="taxBranchName"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-1">
                      <label>Address</label>
                      <InputField
                        value={values?.taxBranchAddress}
                        name="taxBranchAddress"
                        placeholder="From Address"
                        type="text"
                        disabled={true}
                      />
                      <FormikError
                        errors={errors}
                        name="taxBranchAddress"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-1">
                      <NewSelect
                        name="shipPointNames"
                        options={shipPointNames}
                        value={values?.shipPointNames}
                        label="Shippoint Name"
                        onChange={(valueOption) => {
                          setFieldValue("shipPointNames", valueOption);
                        }}
                        placeholder="Shippoint Name"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <button
                        type="button"
                        disabled={!values?.shipPointNames}
                        className="btn btn-primary mt-5"
                        onClick={() => {
                          setter(values);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 pl-0 pr-0 table-responsive">
                  <table className={"table mt-1 bj-table"}>
                    <thead className={rowDto?.length < 1 && "d-none"}>
                      <tr>
                        <th style={{ width: "20px" }}>SL</th>
                        <th style={{ width: "50px" }}>Shippoint Name</th>
                        <th style={{ width: "50px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="text-left pl-2">
                              {item?.shipPointNames}
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
