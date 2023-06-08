import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import IDelete from "../../../../_helper/_helperIcons/_delete";

// Validation schema
const validationSchema = Yup.object().shape({
  profileTypeName: Yup.string().required("profile Type Name is required"),
  isMandatory: Yup.bool(),
  controlName: Yup.object().shape({
    value: Yup.string().required("control Name is required"),
    label: Yup.string().required("control Name is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  remover,
  setRowDto,
  disableHandler,
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
            setRowDto([]);
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
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className=" row">
                <div className="col-lg-12">
                  <div
                    className="row bank-journal bank-journal-custom bj-left"
                    style={{ paddingBottom: "10px" }}
                  >
                    <div className="col-lg-3">
                      <label>Attribute Name</label>
                      <InputField
                        value={values?.profileTypeName}
                        name="profileTypeName"
                        placeholder="Attribute Name"
                      />
                    </div>

                    <div className="col-lg-2">
                      <div
                        style={{ position: "relative", top: "15px" }}
                        className="mr-5"
                      >
                        <label htmlFor="isMandatory">Is Mandatory</label>
                        <Field
                          name="isMandatory"
                          component={() => (
                            <input
                              id="isMandatory"
                              type="checkbox"
                              style={{ position: "relative", top: "2px" }}
                              label="Is Mandatory"
                              className="ml-2"
                              value={values?.isMandatory || false}
                              checked={values?.isMandatory}
                              name="isMandatory"
                              onChange={(e) => {
                                setFieldValue("isMandatory", e.target.checked);
                              }}
                            />
                          )}
                        />
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
                        label="Attribute Type"
                        onChange={(valueOption) => {
                          setFieldValue("controlName", valueOption);
                        }}
                        placeholder="Attribute Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  {values?.controlName?.value === 1 ? (
                    <div className={"row bank-journal-custom bj-left"}>
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
                          style={{ marginTop: "6px", marginLeft: "-5px" }}
                          type="button"
                          className="btn btn-primary"
                          disabled={!values?.valueName}
                          onClick={() => {
                            const obj = {
                              valueName: values?.valueName,
                            };
                            setRowDto([...rowDto, obj]);
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Table Header input end */}
                  <div className="row">
                    <div className="col-lg-12 pr-0 pl-0">
                      <table className={"table mt-1 bj-table"}>
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
                                  {item?.valueName}
                                </div>
                              </td>
                              <td className="text-center">
                                <IDelete remover={remover} id={index} />
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
