import React from "react";
import { Formik, Form } from "formik";
import IDelete from "../../../../../../_helper/_helperIcons/_delete";
import NewSelect from "../../../../../../_helper/_select";
import InputField from "../../../../../../_helper/_inputField";
import IConfirmModal from "../../../../../../_helper/_confirmModal";

export default function _Form({
  initData,
  btnRef,
  saveAccountClassLedger,
  resetBtnRef,
  disableHandler,
  groupDDL,
  accountClassPagination,
  deleteSingleRow,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveAccountClassLedger(values, () => {
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
                  <label>Account Class Name</label>
                  <InputField
                    value={values?.accountClassName || ""}
                    name="accountClassName"
                    placeholder="Account Class Name"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Account Class Code</label>
                  <InputField
                    value={values?.accountClassCode || ""}
                    name="accountClassCode"
                    placeholder="Account Class Code"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="accountGroupName"
                    options={groupDDL}
                    value={values?.accountGroupName}
                    label="Account Group"
                    onChange={(valueOption) => {
                      setFieldValue("accountGroupName", valueOption);
                    }}
                    placeholder="Select Account Group"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    style={{ marginTop: "26px" }}
                    type="submit"
                    className="btn btn-primary prurchaseBtn"
                    disabled={
                      !values.accountGroupName ||
                      !values.accountClassName ||
                      !values.accountClassCode
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
                      <table className="table table-striped table-bordered global-table">
                        <thead>
                          <tr>
                            <th>Sl</th>
                            <th>Account Class Code</th>
                            <th>Account Class</th>
                            <th>Account Group</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {accountClassPagination?.map((itm, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>

                              <td>
                                <div className="pl-2">
                                  {itm.accountClassCode}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {itm.accountClassName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {itm.accountGroupName}
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
                                          deleteSingleRow(itm?.accountClassId);
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
