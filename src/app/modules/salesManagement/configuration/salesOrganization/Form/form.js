import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { useDispatch } from "react-redux";
import { getSbuDDLAction } from "../../../../_helper/_redux/Actions";
import InputField from "../../../../_helper/_inputField";

// Validation schema
const validationSchema = Yup.object().shape({
  soName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Name is required"),
  soCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .required("Code is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  sbuDDL,
  buDDL,
  id,
  organizationName,
  organizationId,
  accoundId,
  setter,
  remover,
  rowDto,
}) {
  const dispatch = useDispatch();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={!id ? validationSchema : Yup.object().shape({})}
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
              <div className="form-group">
                {id ? (
                  <>
                    <div className="row global-form">
                      <div className="col-lg-3">
                        <label>Sales Organization</label>
                        <InputField
                          value={organizationName || values.soNameTwo}
                          name="soNameTwo"
                          placeholder="Sales Organization"
                          type="text"
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>Select Business Unit</label>
                        <Field
                          name="bUnit"
                          placeholder="Select Business Unit"
                          component={() => (
                            <Select
                              options={buDDL}
                              placeholder="Select Business Unit"
                              defaultValue={values?.bUnit}
                              onChange={(valueOption) => {
                                dispatch(
                                  getSbuDDLAction(accoundId, valueOption?.value)
                                );
                                setFieldValue("bUnit", valueOption);
                              }}
                              isSearchable={true}
                              styles={customStyles}
                            />
                          )}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>Select SBU</label>
                        <Field
                          name="bUnit"
                          placeholder="Select SBU"
                          component={() => (
                            <Select
                              options={sbuDDL}
                              placeholder="Select SBU"
                              defaultValue={values.sbu}
                              onChange={(valueOption) => {
                                setFieldValue("sbu", valueOption);
                              }}
                              isSearchable={true}
                              styles={customStyles}
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3">
                        <button
                          onClick={() => {
                            const payload = {
                              configId: 0,
                              accountId: +accoundId,
                              salesOrganizationId: organizationId,
                              salesOrganizationName: organizationName,
                              businessUnitId: values.bUnit?.value,
                              businessUnitName: values.bUnit?.label,
                              sbuname: values.sbu?.label,
                              sbuid: values.sbu?.value,
                            };
                            setter(payload);
                            setFieldValue("bUnit", "");
                            setFieldValue("sbu", "");
                          }}
                          type="button"
                          className="btn btn-primary mt-5"
                          disabled={!values?.bUnit || !values?.sbu}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* table for add rowDto */}
                    {rowDto?.length ? (
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered global-table">
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Organization Name</th>
                              <th>Business Unit</th>
                              <th>SBU</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto.map((itm, idx) => {
                              return (
                                <tr key={itm?.businessUnitId}>
                                  <td>{idx + 1}</td>
                                  <td>{itm?.salesOrganizationName}</td>
                                  <td>{itm?.businessUnitName}</td>
                                  <td>{itm?.sbuname}</td>
                                  <td className="text-center">
                                    <span
                                      onClick={() =>
                                        remover(itm?.businessUnitId)
                                      }
                                    >
                                      <i
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  <>
                    <div className="row global-form">
                      <div className="col-lg-6">
                        <label>Sales Organization</label>
                        <InputField
                          value={values.soName || ""}
                          name="soName"
                          placeholder="Sales Organization"
                          type="text"
                        />
                      </div>
                      <div className="col-lg-6">
                        <label>Sales Organization code</label>
                        <InputField
                          value={values.soCode || ""}
                          name="soCode"
                          placeholder="Sales Organization code"
                          type="text"
                        />
                      </div>
                    </div>
                  </>
                )}
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
