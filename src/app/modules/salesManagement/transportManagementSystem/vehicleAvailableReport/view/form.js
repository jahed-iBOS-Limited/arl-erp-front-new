import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

// Validation schema
const validationSchema = Yup.object().shape({
  remarks: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Remarks is required"),
  referenceId: Yup.string()
    .max(100, "Maximum 100 symbols")
    .required("Reference Id is required"),
  item: Yup.object().shape({
    label: Yup.string().required("Item is required"),
    value: Yup.string().required("Item is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  resetBtnRef,
  disableHandler,
  singleData,
  id,
  itemDDL,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
                <div className="col-lg-3">
                  <div className="my-1">
                    <span>Request Date</span>
                  </div>
                  <InputField
                    value={_dateFormatter(values?.objHeader.dteRequestDate)}
                    disabled={true}
                    type="date"
                    name="requestDate"
                  />
                </div>
                <div className="col-lg-3">
                  <div className="my-1">
                    <span>Validity</span>
                  </div>
                  <InputField
                    value={_dateFormatter(values?.objHeader.validTill)}
                    disabled={true}
                    type="date"
                    name="validTill"
                  />
                </div>
                <div className="col-lg-3">
                  <div className="my-1">
                    <span>Due Date</span>
                  </div>
                  <InputField
                    value={_dateFormatter(values?.objHeader.dteDueDate)}
                    disabled={true}
                    type="date"
                    name="dueDate"
                  />
                </div>
              </div>

              <div className="form-group row mt-2">
                <div className="col-lg-12">
                  <div className="row px-5">
                    {/* Start Table Part */}
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Ref. No.</th>
                            <th>Request Qty.</th>
                            <th>Purpose</th>
                          </tr>
                        </thead>
                        <tbody>
                          {values?.objRow?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center align-middle">
                                {index + 1}
                              </td>
                              <td className="text-center align-middle">
                                {item.itemCode}
                              </td>

                              <td className="text-center align-middle table-input">
                                {item.itemName}
                              </td>
                              <td className="text-center align-middle table-input">
                                {item.referenceId}
                              </td>
                              <td className="text-center align-middle table-input">
                                {item.requestQuantity}
                              </td>
                              <td className="text-center align-middle table-input">
                                {item.remarks}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* End Table Part */}
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
