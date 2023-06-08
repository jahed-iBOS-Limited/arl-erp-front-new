import React from "react";
import { Formik, Form, Field } from "formik";
import InputField from "../../../../_helper/_inputField";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import Loading from "../../../../_helper/_loading";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  loading,
  rowDtoAddHandler,
  rowDto,
  remover,
  id,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
          setFieldValue,
          isValid,
          errors,
          touched,
        }) => (
          <>
            <Form className="form form-label-right">
              {loading && <Loading />}
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <InputField
                    value={values?.leaveTypeCode}
                    label="Leave Type Code"
                    name="leaveTypeCode"
                    placeholder="Leave Type Code"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.leaveType}
                    label="Leave Type"
                    name="leaveType"
                    placeholder="Leave Type"
                  />
                </div>
                <div className="col-lg-2" style={{ marginTop: "17px" }}>
                  <label>Is Payable</label>
                  <Field
                    name="isPayable"
                    component={() => (
                      <input
                        id="isPayable"
                        type="checkbox"
                        style={{
                          position: "relative",
                          top: "2px",
                          marginLeft: "10px",
                        }}
                        label="Is Payable"
                        className="mr-3"
                        value={values?.isPayable}
                        checked={values?.isPayable}
                        name="isPayable"
                        onChange={(e) => {
                          setFieldValue("isPayable", e.target.checked);
                        }}
                      />
                    )}
                  />
                </div>
                {!id && (
                  <div style={{ marginTop: "17px" }} className="col-lg-2">
                    <button
                      className="btn btn-primary"
                      disabled={
                        !values?.leaveTypeCode ||
                        !values?.leaveType 
                      }
                      type="button"
                      onClick={() => {
                        rowDtoAddHandler(values);
                      }}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {!id && (
                <div className="row cash_journal">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th style={{ width: "50px" }}>Leave Type Code</th>
                          <th style={{ width: "50px" }}>Leave Type</th>
                          <th style={{ width: "50px" }}>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.leaveTypeCode}</td>
                            <td>{item?.leaveType}</td>
                            <td>
                              <div style={{ textAlign: "center" }}>
                                <IDelete remover={remover} id={index} />
                              </div>
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
