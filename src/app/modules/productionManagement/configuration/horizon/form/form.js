import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import NewSelect from "./../../../../_helper/_select";

const validationSchema = Yup.object().shape({
  plant: Yup.string().required("Plant Name is required"),
  horizon: Yup.string().required("Horizon Type is required"),
  year: Yup.string().required("Year is required"),
});

function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  plantNameDDL,
  horizonYearDDL,
  horizonTypeDDL,
  setHorizonType,
  setHorizonYear,
  dataVisible,
  setDataVisible,
  gridData,
  gridWeekData,
}) {
  const visibleDataHandle = (year, horizon) => {
    // setDataVisible(dataVisible);
    setHorizonYear(year);
    setHorizonType(horizon);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
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
          <Form className="global-form form form-label-right">
            <div className="form-group row">
              <div className="col-lg-4">
                <NewSelect
                  name="plant"
                  options={plantNameDDL}
                  value={values?.plant}
                  label="Plant"
                  onChange={(valueOption) => {
                    setFieldValue("plant", valueOption);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-4">
                <NewSelect
                  name="year"
                  options={horizonYearDDL}
                  value={values?.year}
                  label="Year"
                  onChange={(valueOption) => {
                      setFieldValue("year", valueOption);
                    
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-4">
                <NewSelect
                  name="horizon"
                  options={horizonTypeDDL}
                  value={values?.horizon}
                  label="Horizon Type"
                  onChange={(valueOption) => {
                    setFieldValue("horizon", valueOption);
                  }}
                  placeholder="Horizon Type"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-4"></div>
              <div className="col-lg-6"></div>
              <div className="col-lg-2 mt-2">
                {values?.horizon ? (
                  <button
                    onClick={()=> visibleDataHandle(values?.year, values?.horizon)}
                    className="btn btn-primary"
                    style={{ float: "right" }}
                    type="button"
                  >
                    View Data
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="row"></div>

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
  );
}

export default _Form;
