import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";

const initData = {
  plant: "",
  shopFloor: "",
  machineName: "",
  scheduleType: "",
  checkPerson: "",

  //   for row

  checkListCriteriaType: "",
  checkListCriteria: "",
  standardValue: "",
  imageUrl: "",
};

const validationSchema = Yup.object().shape({});

export default function OEEMachineAndChecklistLandingCreateEdit() {
  const [objProps, setObjprops] = useState({});

  const saveHandler = (values, cb) => {
    alert("Working...");
  };
  return (
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
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {false && <Loading />}
          <IForm title={""} getProps={setObjprops}>
            <Form>
              <h4>Machine details</h4>
              <div className="form-group  global-form row">
                <div className="col-lg-3">{/* Header */}</div>
              </div>

              <h4>CheckList</h4>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="checkListCriteriaType"
                    options={[
                      { value: 1, label: "Item-1" },
                      { value: 2, label: "Item-2" },
                    ]}
                    value={values?.checkListCriteriaType}
                    label="CheckList Criteria Type"
                    onChange={(valueOption) => {
                      setFieldValue("checkListCriteriaType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.checkListCriteria}
                    label="CheckList Criteria"
                    name="checkListCriteria"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("checkListCriteria", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.standardValue}
                    label="Standard Value"
                    name="standardValue"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("standardValue", e.target.value);
                    }}
                  />
                </div>
                <div
                  className="col-lg-3"
                  style={{
                    marginTop: "18px",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-primary text-center mr-3"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <table className="table table-striped table-bordered bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>check List Criteria Type</th>
                      <th>Check List Criteria</th>
                      <th>Standard Value</th>
                      <th>Image</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
