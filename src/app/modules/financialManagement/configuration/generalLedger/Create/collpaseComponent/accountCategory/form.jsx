import React from "react";
import { Formik, Form } from "formik";
import IDelete from "../../../../../../_helper/_helperIcons/_delete";
import NewSelect from "../../../../../../_helper/_select";
import InputField from "../../../../../../_helper/_inputField";
import IConfirmModal from "../../../../../../_helper/_confirmModal";

export default function _Form({
  initData,
  btnRef,
  resetBtnRef,
  disableHandler,
  saveAccountCategoryJournal,
  classDDL,
  accountCategoryPagination,
  deleteSingleRow,
  isDisabled,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveAccountCategoryJournal(values, () => {
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
              <div className="form-group row align-items-center">
                <div className="col-lg-3">
                  <label>Account Category Name</label>
                  <InputField
                    value={values.accountCategoryName || ""}
                    name="accountCategoryName"
                    placeholder="Account Category Name"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Account Category Code</label>
                  <InputField
                    value={values?.accountCategoryCode}
                    name="accountCategoryCode"
                    placeholder="Account Category Code"
                    type="text"
                    // min="0"
                    // step="1"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="accountClassName"
                    options={classDDL}
                    value={values?.accountClassName}
                    label="Account Class"
                    onChange={(valueOption) => {
                      setFieldValue("accountClassName", valueOption);
                    }}
                    placeholder="Select Account Class"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    style={{ marginTop: "27px" }}
                    type="submit"
                    className="btn btn-primary prurchaseBtn"
                    disabled={
                      !values.accountCategoryName ||
                      !values.accountClassName ||
                      !values.accountCategoryCode ||
                      isDisabled
                    }
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="form-group row my-5">
                <div className="col-lg-12">
                  <div>
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>Sl</th>
                            <th>Account Category Code</th>
                            <th>Account Category</th>
                            <th>Account Class</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {accountCategoryPagination.map((itm, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="pl-2">
                                  {itm.accountCategoryCode}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {itm.accountCategoryName}
                                </div>
                              </td>

                              <td>
                                <div className="pl-2">
                                  {itm.accountClassName}
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
                                          deleteSingleRow(
                                            itm?.accountCategoryId
                                          );
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
