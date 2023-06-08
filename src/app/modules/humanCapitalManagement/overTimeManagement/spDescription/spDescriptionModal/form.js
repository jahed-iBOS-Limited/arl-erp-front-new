import React from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import ICustomTable from "../../../../_helper/_customTable";
import IDelete from "../../../../_helper/_helperIcons/_delete";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  documentType,
  setDocumentType,
  addHandler,
  removeHandler,
}) {
  let ths = ["Document Type", "Action"];
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler();
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
              <div className="form-group row global-form">
                <div className="col-lg-6">
                  <InputField
                    label="Document Type"
                    placeholder="Document Type"
                    name="documentType"
                    value={values?.documentType}
                    onChange={(e) => {
                      setFieldValue("documentType", e.target.value);
                    }}
                  />
                </div>
                <div style={{ marginTop: "14px" }} className="col-lg-2">
                  <ButtonStyleOne
                    style={{ fontSize: "12px" }}
                    disabled={!values?.documentType}
                    label="Add"
                    type="button"
                    onClick={() => {
                      addHandler(values?.documentType);
                      resetForm(initData);
                    }}
                  />
                </div>
              </div>

              <ICustomTable ths={ths} className="table-font-size-sm">
                {documentType.map((item, index) => (
                  <tr>
                    <td>{item?.name}</td>
                    <td className="text-center">
                      <IDelete
                        id={index}
                        remover={(id) => {
                          removeHandler(id);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </ICustomTable>

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
