import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { ISelect } from "../../../../_helper/_inputDropDown";

// Validation schema
const validationSchema = Yup.object().shape({
  shiptoPartyName: Yup.string().required("Ship to Party Name is required"),
  address: Yup.string().required("Address is required"),
  transportZone: Yup.object().shape({
    value: Yup.string().required("Transport Zone is required"),
    label: Yup.string().required("Transport Zone is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  handleZoneInfo,
  modifiedValues,
  zoneDDL,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, ...modifiedValues }}
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
              {console.log("values", values)}
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <ISelect
                    options={[{ label: "challan base", value: 1 }]}
                    label="Type"
                    value={values?.type}
                    placeholder="Type"
                    onChange={(valueOption) => {
                      setFieldValue("type", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.challanNo}
                    label="Challan No"
                    name="challanNo"
                  />
                </div>

                <div style={{ marginTop: "18px" }} className="col-lg-3">
                  <button
                    onClick={() => handleZoneInfo(values, setFieldValue)}
                    disabled={!values?.type || !values?.challanNo}
                    type="button"
                    className="btn btn-primary"
                  >
                    Show
                  </button>
                </div>
              </div>

              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <IInput
                    disabled
                    value={values?.shiptoPartyName}
                    label="Ship to Party Name"
                    name="shiptoPartyName"
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    disabled
                    value={values?.address}
                    label="Address"
                    name="address"
                  />
                </div>

                <div className="col-lg-3">
                  <ISelect
                    options={zoneDDL}
                    label="Select Transport Zone"
                    value={values?.transportZone}
                    name="transportZone"
                    placeholder="Select Transport Zone"
                    errors={errors}
                    touched={touched}
                    onChange={(valueOption) => {
                      setFieldValue("transportZone", valueOption);
                    }}
                  />
                </div>

                {/* <div style={{ marginTop: "18px" }} className="col-lg-3">
                  <button
                    onClick={() => {}}
                    disabled={
                      !values?.employee ||
                      !values?.workPlace ||
                      !values?.date ||
                      !values?.startTime ||
                      !values?.endTime
                    }
                    type="button"
                    className="btn btn-primary"
                  >
                    Add
                  </button>
                </div> */}
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
