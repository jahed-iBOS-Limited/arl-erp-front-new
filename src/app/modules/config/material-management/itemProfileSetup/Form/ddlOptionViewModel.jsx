import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "./../../../../_helper/_inputField";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import { useSelector, shallowEqual } from "react-redux";
// Validation schema
const validationSchema = Yup.object().shape({});
const initData = {
  ddlOptionValue: "",
};

function DdlOptionViewModel({
  createFormValues,
  ddlOptionRow,
  createTableRowItm,
  ddlOptionsRemoveFunc,
  addDdlOptionFuc,
}) {
  const saveHandler = (values) => {
    console.log(values, "Model");
  };
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          errors,
          touched,
          setFieldValue,
          isValid,
          values,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-lg-3">
                  <label>Value Name</label>
                  <InputField
                    value={values?.ddlOptionValue}
                    name="ddlOptionValue"
                    placeholder="Value Name"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    type="button"
                    className="btn btn-primary mt-4"
                    disabled={!values?.ddlOptionValue}
                    onClick={() => {
                      const obj = {
                        attributeName: createTableRowItm?.attributeName
                          ? createTableRowItm?.attributeName
                          : createFormValues?.attributeName,
                        attributeValue: values?.ddlOptionValue,
                        attributeValueId: 0,
                        businessUnitId: selectedBusinessUnit?.value,
                        attributeId: 0,
                      };
                      addDdlOptionFuc(obj, createTableRowItm);
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              {/* table */}
             <div className="table-responsive">
             <table className="table table-striped table-bordered mt-3 global-table">
                <thead>
                  <tr>
                    <th style={{ width: "20px" }}>SL</th>
                    <th style={{ width: "220px" }}>Value Name</th>
                    <th style={{ width: "20px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ddlOptionRow?.map((tableData, index) => (
                    <tr key={index}>
                      <td> {index + 1} </td>
                      <td> {tableData?.attributeValue} </td>

                      <td className="text-center">
                        {tableData?.attributeId === 0 && (
                          <IDelete
                            id={index}
                            remover={(id) => {
                              ddlOptionsRemoveFunc(id, createTableRowItm);
                            }}
                          />
                        )}
                      </td>
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

export default DdlOptionViewModel;
