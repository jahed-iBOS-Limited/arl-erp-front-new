import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";

import IDelete from "../../../../_helper/_helperIcons/_delete";
// Validation schema
const validationSchema = Yup.object().shape({
  orgComponentCode: Yup.string().required("Organization Code is required"),
  orgComponentName: Yup.string().required("Organization Name is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
}) {
  const [rowDto, setRowDto] = useState([]);

  const removeHandler = (index) => {
    let newRowData = rowDto.filter((item, i) => index !== i);
    setRowDto(newRowData);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(isEdit ? values : rowDto, () => {
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
            {console.log("values", values)}
            {console.log("errors", errors)}
            <div className="global-form">
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-4">
                    <label>FS Component</label>
                                          
                    <InputField
                      value={values?.orgComponentName}
                      name="orgComponentName"
                      placeholder="FS Component"
                      disabled={true}
                    />
                                      
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    {rowDto?.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered mt-3 ml-4">
                          <thead>
                            <tr>
                              <th>Accounts Category</th>
                              <th>General Ledger</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((itm, index) => (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                  {itm?.orgComponentName}
                                </td>
                                <td className="text-center">
                                  {itm?.orgComponentCode}
                                </td>

                                <td
                                  className="text-center"
                                  onClick={() => removeHandler(index)}
                                >
                                  <IDelete id={index} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
