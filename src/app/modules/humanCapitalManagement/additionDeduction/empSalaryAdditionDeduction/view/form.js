import React from "react";
import { Formik, Form } from "formik";
// import InputField from "./../../../../_helper/_inputField";

function _Form({ initData, btnRef, saveHandler, resetBtnRef, singleData }) {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={validationSchema}
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
            <div className="form-group global-form row">
              {/* Total Amount Show */}
              <div className="col-lg-12">
                {/* <div className="row">
                  <div className="col-lg-2 mb-3">
                    <label>Employee Name</label>
                    <InputField
                      value={singleData?.employeeName}
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-2 mb-3">
                    <label>From Month</label>
                    <InputField value={""} type="text" disabled />
                  </div>
                  <div className="col-lg-2 mb-3">
                    <label>From Year</label>
                    <InputField value={""} type="text" disabled />
                  </div>
                  <div className="col-lg-2 mb-3">
                    <div style={{ marginTop: "20px" }} className="mr-2">
                      <Field
                        name="isContinue"
                        component={() => (
                          <input
                            style={{
                              position: "absolute",
                              top: "20px",
                            }}
                            id="isContinue"
                            type="checkbox"
                            value={singleData?.isAutoRenew}
                            checked={singleData?.isAutoRenew}
                            name="isContinue"
                            disabled
                          />
                        )}
                      />
                      <label className="ml-5">Auto Renewal</label>
                    </div>
                  </div>
                  <div className="col-lg-2 mb-3">
                    <label>To Month</label>
                    <InputField value={""} type="text" disabled />
                  </div>
                  <div className="col-lg-2 mb-3">
                    <label>To Year</label>
                    <InputField value={""} type="text" disabled />
                  </div>
                  <div className="col-lg-2 mb-3">
                    <label>Type Name</label>
                    <InputField
                      value={
                        singleData?.deductionType?.isAddition
                          ? "Addition"
                          : "Deduction"
                      }
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-2 mb-3">
                    <label>Addition/Deduction Name</label>
                    <InputField
                      value={singleData?.actionNdeduction}
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-2 mb-3">
                    <label>Amount</label>
                    <InputField
                      value={singleData?.numAmount}
                      type="text"
                      disabled
                    />
                  </div>
                </div> */}
                {/* <div className="col-lg-12 mb-3"> */}
                <div className="text-right">
                  {singleData?.deductionType?.isAddition ? (
                    <p style={{ marginBottom: "0rem" }}>
                      <strong>
                        {" "}
                        Total Addition Amount: {singleData?.numAmount}{" "}
                      </strong>
                    </p>
                  ) : (
                    <p style={{ marginBottom: "0rem" }}>
                      <strong>
                        {" "}
                        Total Deduction Amount: {singleData?.numAmount}{" "}
                      </strong>
                    </p>
                  )}
                </div>
                {/* </div> */}
              </div>
            </div>

            <div className="row px-4">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Employee Name</th>
                    <th>Addition/Deduction Type</th>
                    <th>Type</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ width: "30px" }} className="text-center">
                      {1}
                    </td>
                    <td>
                      <span>{singleData?.employeeName}</span>
                    </td>
                    <td>
                      <span>
                        {singleData?.deductionType?.isAddition
                          ? "Addition"
                          : "Deduction"}
                      </span>
                    </td>
                    <td>
                      <span>{singleData?.actionNdeduction}</span>
                    </td>
                    <td className="pl-2">
                      <span>{singleData?.month}</span>
                    </td>
                    <td className="text-center">
                      <span>{singleData?.year}</span>
                    </td>
                    <td className="text-right pr-2">
                      <span>{singleData?.numAmount}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
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
  );
}

export default _Form;
