import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import ICustomTable from "../../../../_helper/_customTable";
import { getHRPositionDDL } from "../helper";

const validationSchema = Yup.object().shape({
  empPosGroup: Yup.object().shape({
    value: Yup.string().required("Employee position group is required"),
    label: Yup.string().required("Employee position group is required"),
  }),
  hrPos: Yup.object().shape({
    value: Yup.string().required("HR position is required"),
    label: Yup.string().required("HR position is required"),
  })
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  obj,
}) {
  const { positiontDDL, setHrPositionDDL, hrPositionDDL } = obj;

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
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    label="Employee Position Group"
                    name="empPosGroup"
                    value={values?.empPosGroup}
                    placeholder="Employee Position Group"
                    onChange={(valueOption) => {
                      setFieldValue("empPosGroup", valueOption);
                      getHRPositionDDL(valueOption?.value, setHrPositionDDL);
                    }}
                    options={positiontDDL}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Employee HR Position"
                    name="hrPos"
                    value={values?.hrPos}
                    isDisabled={!values?.empPosGroup}
                    placeholder="Employee HR Position"
                    onChange={(valueOption) => {
                      setFieldValue("hrPos", valueOption);
                    }}
                    options={hrPositionDDL}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>

              {/* Section two, row level */}
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <InputField
                    label="Employee Grade"
                    name="empGrade"
                    value={values?.empGrade}
                    placeholder="Employee Grade"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    label="Code"
                    name="code"
                    value={values?.code}
                    placeholder="Code"
                  />
                </div>
                <div style={{ marginTop: "17px" }} className="col-lg-3">
                  <ButtonStyleOne
                    type="button"
                    disabled={!values?.empGrade || !values?.code}
                    label="Add"
                    onClick={() => {
                      alert("Hello");
                    }}
                  />
                </div>
              </div>

              {/* Table */}

              <ICustomTable
                ths={[
                  "SL",
                  "Grade Code",
                  "Employee Grade",
                  "Base Grade",
                  "Action",
                ]}
              ></ICustomTable>

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
