import React from "react";
import { Formik, Form } from "formik";
import InputField from "./../../../../_helper/_inputField";

export default function _Form({ rowDto }) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
        initialValues={rowDto?.head}
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
                    name="warehouseName"
                    placeholder="Outlet Name"
                    type="text"
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <label>Item Group Name</label>
                  <InputField
                    value={values?.itemGroupName}
                    name="itemGroupName"
                    placeholder="Item Group Name"
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
                      <th>Item Name</th>
                      <th>UoM</th>
                      <th>Item Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.row?.length >= 0 &&
                      rowDto?.row?.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{item?.itemName}</td>
                          <td>{item?.uomName}</td>
                          <td>{item?.itemCategoryName}</td>
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
