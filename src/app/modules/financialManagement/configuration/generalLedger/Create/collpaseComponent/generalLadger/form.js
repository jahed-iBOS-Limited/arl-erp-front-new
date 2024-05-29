import React from "react";
import { Formik, Form } from "formik";
import IDelete from "../../../../../../_helper/_helperIcons/_delete";
import NewSelect from "../../../../../../_helper/_select";
import InputField from "../../../../../../_helper/_inputField";
import IConfirmModal from "../../../../../../_helper/_confirmModal";

export default function _Form({
  initData,
  btnRef,
  saveGeneralLedgerLedger,
  resetBtnRef,
  disableHandler,
  categoryDDL,
  glId,
  isEdit,
  generalLedgerPagination,
  deleteSingleRow,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveGeneralLedgerLedger(values, () => {
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
              <div className="form-group row align-items-center">
                <div className="col-lg-3">
                  <label>General Ledger Name</label>
                  <InputField
                    value={values.generalLedgerName || ""}
                    name="generalLedgerName"
                    placeholder="General Ledger Name"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label>General Ledger Code</label>
                  <InputField
                    value={values?.generalLedgerCode}
                    name="generalLedgerCode"
                    placeholder="General Ledger Code"
                    type="text"
                    // min="0"
                    // step="1"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="accountCategoryName"
                    options={categoryDDL}
                    value={values?.accountCategoryName}
                    label="Account Category"
                    onChange={(valueOption) => {
                      setFieldValue("accountCategoryName", valueOption);
                    }}
                    placeholder="Select Account Category"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                {glId ? (
                  ""
                ) : (
                  <div className="col-lg-3">
                    <button
                      style={{ marginTop: "26px" }}
                      type="submit"
                      className="btn btn-primary prurchaseBtn"
                      disabled={
                        !values.accountCategoryName ||
                        !values.generalLedgerName ||
                        !values.generalLedgerCode
                      }
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group row my-5">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>Sl</th>
                          <th>General Ledger Code</th>
                          <th>General Ledger</th>
                          <th>Account Category</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generalLedgerPagination.map((itm, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="pl-2">
                                {itm.generalLedgerName}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {itm.generalLedgerCode}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {itm.accountCategoryName}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-around">
                                <span
                                  className="delete"
                                  onClick={() => {
                                    let confirmObject = {
                                      title: "Are you sure?",
                                      message:
                                        "If you delete this, it can not be undone",
                                      yesAlertFunc: async () => {
                                        deleteSingleRow(itm?.generalLedgerId);
                                      },
                                      noAlertFunc: () => {
                                        "";
                                      },
                                    };
                                    IConfirmModal(confirmObject);
                                  }}
                                >
                                  <IDelete />
                                </span>
                              </div>
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
