import React from "react";
import { Formik, Form, Field } from "formik";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import IDelete from "./../../../../_helper/_helperIcons/_delete";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  buDDL,
  isEdit,
  accountId,
  rowDto,
  setter,
  remover,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          generalLedgerName: initData.objHeader?.generalLedgerName,
        }}
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
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
                  <Field
                    value={values.generalLedgerName || ""}
                    name="generalLedgerName"
                    component={Input}
                    disabled
                    placeholder="GL Name"
                    label="GL Name"
                  />
                </div>
                <div className="col-lg-4">
                  <label>Select Business Unit</label>
                  <Field
                    name="businessUnit"
                    placeholder="Select Business Unit"
                    component={() => (
                      <Select
                        options={buDDL}
                        placeholder="Select Business Unit"
                        // isDisabled={isEdit}
                        value={values.businessUnit}
                        onChange={(valueOption) => {
                          setFieldValue("businessUnit", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors && errors.buDDL && touched && touched.buDDL
                      ? errors.buDDL.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-4">
                  <button
                    onClick={() => {
                      const payload = {
                        generalLedgerName: values.generalLedgerName,
                        businessUnitName: values.businessUnit?.label,
                        businessUnitId: values.businessUnit?.value,
                      };
                      setter(payload);
                    }}
                    type="button"
                    className="btn btn-primary addBtn"
                    disabled={!values.generalLedgerName || !values.businessUnit}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  {rowDto.length ? (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>GL Name</th>
                            <th>Business Unit Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto.map((itm, idx) => {
                            return (
                              <tr key={itm.businessUnitId}>
                                <td>{idx + 1}</td>
                                <td>
                                  <div className="pl-2">
                                    {itm.generalLedgerName}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {itm.businessUnitName}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="d-flex justify-content-center">
                                    <span
                                      className="delete"
                                      onClick={() =>
                                        remover(itm.businessUnitId)
                                      }
                                    >
                                      <IDelete />
                                    </span>
                                  </div>
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
