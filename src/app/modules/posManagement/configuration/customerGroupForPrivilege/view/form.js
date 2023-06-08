import React from "react";
import { Formik, Form } from "formik";
import InputField from "./../../../../_helper/_inputField";

export default function _Form({ rowDto }) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
        initialValues={rowDto?.objHeader}
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
            <Form className="form form-label-right mt-2">
              <div className="row global-form">
                <div className="col-lg-3">
                  <label>Outlet Name</label>
                  <InputField
                    value={values?.warehouseName}
                    name="outletName"
                    placeholder="Outlet Name"
                    type="text"
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <label>Customer Group Name</label>
                  <InputField
                    value={values?.customerGroupName}
                    name="customerGroupName"
                    placeholder="Customer Group Name"
                    type="text"
                    disabled
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Customer Name</th>
                      <th>Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.objRow?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item?.customerName}</td>
                        <td>{item?.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
