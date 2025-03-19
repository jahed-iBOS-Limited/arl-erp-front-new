import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../_helper/_inputDropDown";
import { IInput } from "../../../_helper/_input";
import IDelete from "../../../_helper/_helperIcons/_delete";
import ICustomTable from "../../../_helper/_customTable";

// Validation schema
const validationSchema = Yup.object().shape({
  scaleFor: Yup.object().shape({
    label: Yup.string().required("Scale for is required"),
    value: Yup.string().required("Scale for is required"),
  }),
});

const headers = ["SL", "Scale Name", "Value", "Action"];

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  remover,
  setter,
  rowDto,
  scaleForDDL
}) {
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
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {console.log(values)}
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <ISelect
                    label="Scale For"
                    options={scaleForDDL || []}
                    defaultValue={values.scaleFor}
                    name="scaleFor"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-lg-3 disable-border disabled-feedback">
                  <IInput
                    value={values.scaleName}
                    label="Scale Name"
                    name="scaleName"
                  />
                </div>
                <div className="col-lg-3 disable-border disabled-feedback">
                  <IInput type="number" min="0" value={values.value} label="Value" name="value" />
                </div>
                <div className="col-lg-2">
                  <button
                    type="button"
                    style={{ marginTop: "17px" }}
                    className="btn btn-primary ml-2"
                    onClick={() => {
                      setter(values)
                      setFieldValue("scaleName", "")
                      setFieldValue("value", "")
                    }}
                    disabled={!values?.scaleName || !values?.value}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Row d tos one */}
              {rowDto.length > 0 && (
                <ICustomTable ths={headers}>
                  {rowDto?.map((td, index) => {
                    return (
                      <tr key={index}>
                        <td className="align-middle"> {index + 1} </td>
                        <td className="align-middle"> {td.scaleName} </td>
                        <td className="align-middle text-center"> {td.value} </td>
                        <td className="align-middle text-center">
                          <IDelete remover={remover} id={td?.scaleName} />
                        </td>
                      </tr>
                    );
                  })}
                </ICustomTable>
              )}

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
