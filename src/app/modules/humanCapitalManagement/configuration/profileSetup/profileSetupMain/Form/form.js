import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import InputField from "../../../../../_helper/_inputField";
import NewSelect from "../../../../../_helper/_select";
import IDelete from "../../../../../_helper/_helperIcons/_delete";

// Validation schema
const validationSchema = Yup.object().shape({
  attributeName: Yup.string()
    .required("Attribute Name is required")
    .matches(/^[A-Z a-z][A-Z a-z 0-9]*$/i, "Is not in correct format"),
  isMandatory: Yup.bool(),
  sectionName: Yup.object().shape({
    value: Yup.string().required("Section Name is required"),
    label: Yup.string().required("Section Name is required"),
  }),
  controlName: Yup.object().shape({
    value: Yup.string().required("Control Name is required"),
    label: Yup.string().required("Control Name is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  sectionNameDDL,
  rowDto,
  remover,
  setRowDto,
  setter,
  isEdit,
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
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="sectionName"
                        options={sectionNameDDL}
                        value={values?.sectionName}
                        label="Section Name"
                        onChange={(valueOption) => {
                          setFieldValue("sectionName", valueOption);
                        }}
                        placeholder="Section Name"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Attribute Name</label>
                      <InputField
                        value={values?.attributeName}
                        name="attributeName"
                        placeholder="Attribute Name"
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-2">
                      <div
                        style={{ position: "relative", top: "15px" }}
                        className="mr-5"
                      >
                        <Field
                          name="isMandatory"
                          component={() => (
                            <input
                              id="isMandatory"
                              type="checkbox"
                              style={{
                                position: "relative",
                                top: "2px",
                                marginLeft: "3px",
                              }}
                              label="Is Mandatory"
                              className="mr-3"
                              value={values?.isMandatory || false}
                              checked={values?.isMandatory}
                              name="isMandatory"
                              onChange={(e) => {
                                setFieldValue("isMandatory", e.target.checked);
                              }}
                              // disabled={isEdit}
                            />
                          )}
                        />
                        <label htmlFor="isMandatory">Is Mandatory ? </label>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="controlName"
                        options={[
                          { label: "DDL", value: 1 },
                          { label: "Date", value: 2 },
                          { label: "TextBox", value: 3 },
                          { label: "Number", value: 4 },
                        ]}
                        value={values?.controlName}
                        label="Control Name"
                        onChange={(valueOption) => {
                          setFieldValue("controlName", valueOption);
                        }}
                        placeholder="Control Name"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  {values?.controlName?.value === 1 && (
                    <div className={"row global-form"}>
                      <>
                        <div className="col-lg-3">
                          <label>Value Name</label>
                          <InputField
                            value={values?.valueName}
                            name="valueName"
                            placeholder="value Name"
                            type="text"
                          />
                        </div>

                        <div className="col-lg-1 pl-2 bank-journal">
                          <button
                            style={{ marginTop: "14px", marginLeft: "-5px" }}
                            type="button"
                            className="btn btn-primary"
                            disabled={!values?.valueName}
                            onClick={() => {
                              const obj = {
                                intSectionAttributeid: 0,
                                valueName: values?.valueName
                                  .toLowerCase()
                                  .trim(),
                              };
                              setter(obj);
                              setFieldValue("valueName","");
                            }}
                          >
                            Add
                          </button>
                        </div>
                      </>
                    </div>
                  )}
                  {/* Table Header input end */}
                  <div className="global-table">
                    <div className="">
                      <table className={"table"}>
                        <thead className={rowDto?.length < 1 && "d-none"}>
                          <tr>
                            <th style={{ width: "20px" }}>SL</th>
                            <th style={{ width: "100px" }}>Value Name</th>
                            <th style={{ width: "20px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="text-left ml-2">
                                  {item?.valueName?.charAt(0).toUpperCase() +
                                    item?.valueName?.slice(1)}
                                </div>
                              </td>
                              <td className="text-center">
                                {
                                  item?.intSectionAttributeid === 0 && (
                                    <><IDelete remover={remover} id={index} /></>
                                  )
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* Row Dto Table End */}
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
