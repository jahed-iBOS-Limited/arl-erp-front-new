import { Form, Formik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getDifferenceBetweenTime } from "../../../msilProduction/meltingProduction/helper";

export default function RebShutdownForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  productDDL,
  validationSchema,
  id,
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
          setFieldValue,
          isValid,
          errors,
          touched,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    label="Date"
                    name="date"
                    type="date"
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shift"
                    options={[
                      { value: "A", label: "A" },
                      { value: "B", label: "B" },
                      { value: "C", label: "C" },
                      { value: "General", label: "General" },
                    ]}
                    value={values?.shift}
                    label="Shift"
                    onChange={(valueOption) => {
                      setFieldValue("shift", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.startTime}
                    label="Start Time"
                    name="startTime"
                    type="time"
                    onChange={(e) => {
                      if (!values?.date)
                        return toast.warn("Please select date");
                      setFieldValue("startTime", e.target.value);
                      if (values?.date && values?.endTime) {
                        let difference = getDifferenceBetweenTime(
                          values?.date,
                          e.target.value,
                          values?.endTime
                        );
                        setFieldValue("totalHour", difference);
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.endTime}
                    label="End Time"
                    name="endTime"
                    type="time"
                    onChange={(e) => {
                      if (!values?.date)
                        return toast.warn("Please select date");
                      setFieldValue("endTime", e.target.value);
                      if (values?.date && values?.startTime) {
                        let difference = getDifferenceBetweenTime(
                          values?.date,
                          values?.startTime,
                          e.target.value
                        );
                        setFieldValue("totalHour", difference);
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    disabled={true}
                    value={values?.totalHour}
                    label="Total Hour"
                    name="totalHour"
                    type="text"
                  />
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
          </>
        )}
      </Formik>
    </>
  );
}
