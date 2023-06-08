import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import customStyles from "../../../../selectCustomStyle";
import Select from "react-select";

// Validation schema
const validationSchema = Yup.object().shape({
  organizationName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Organization Name is required"),
});

export default function From({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  businessUnitDDL,
  isEdit,
  rowDtos,
  setter,
  remover,
  objHeader,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          organizationName: objHeader?.organizationName || "",
        }}
        validationSchema={isEdit ? Yup.object().shape({}) : validationSchema}
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
              {!isEdit ? (
                <div className="form-group row">
                  <div className="col-lg-6">
                    <Field
                      value={values.organizationName}
                      name="organizationName"
                      component={Input}
                      placeholder="Organization Name"
                      label="Organization Name"
                    />
                  </div>
                </div>
              ) : (
                <div className="form-group row">
                  <div className="col-lg-4 pl-0">
                    <Field
                      value={objHeader?.purchaseOrganization || ""}
                      name="organizationName"
                      component={Input}
                      placeholder="Organization Name"
                      label="Organization Name"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-4">
                    <label>Select Business Unit</label>
                    <Field
                      name="businessUnit"
                      placeholder="Select Business Unit"
                      component={() => (
                        <Select
                          options={businessUnitDDL}
                          placeholder="Select Business Unit"
                          defaultValue={values.businessUnit}
                          onChange={(valueOption) => {
                            setFieldValue("businessUnit", valueOption);
                          }}
                          isSearchable={true}
                          styles={customStyles}
                        />
                      )}
                    />
                  </div>
                  <div className="col-lg-4">
                    <button
                      onClick={() =>
                        setter({
                          businessUnitId: values.businessUnit.value,
                          businessUnitName: values.businessUnit.label,
                        })
                      }
                      disabled={!values.businessUnit?.value}
                      style={{ marginTop: "28px" }}
                      type="button"
                      className="btn btn-primary ml-2"
                    >
                      Add
                    </button>
                  </div>
                  <div
                    className="react-bootstrap-table table-responsive"
                    style={{ marginTop: "20px" }}
                  >
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th scope="col">SL</th>
                          <th scope="col">Organization Name</th>
                          <th scope="col">Business Unit</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDtos.map((itm, idx) => (
                          <tr key={itm.value}>
                            <td className="text-center">{++idx}</td>
                            <td>
                              {objHeader ? objHeader.purchaseOrganization : ""}
                            </td>
                            <td>{itm.businessUnitName}</td>
                            <td className="text-center">
                              <i
                                className="fa fa-trash "
                                onClick={() => remover(itm.businessUnitId)}
                              ></i>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
