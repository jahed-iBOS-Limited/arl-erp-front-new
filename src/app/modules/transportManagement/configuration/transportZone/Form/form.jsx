import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

// Validation schema
const validationSchema = Yup.object().shape({
  transportZoneName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Zone Name is required"),
  // divisionName: Yup.object().shape({
  //   value: Yup.number().required("Division is required"),
  //   label: Yup.string().required("Division is required"),
  // }),
  // districtName: Yup.object().shape({
  //   value: Yup.number().required("District is required"),
  //   label: Yup.string().required("District is required"),
  // }),
});

export default function FormCmp({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
}) {
  const [districtDDL, getDistrictDDL] = useAxiosGet();
  const [divisionDDL, getDivisionDDL] = useAxiosGet();

  const getDistrict = (divisionId) => {
    getDistrictDDL(
      `/oms/TerritoryInfo/GetDistrictDDL?countryId=18&divisionId=${divisionId}`
    );
  };
  React.useEffect(() => {
    getDivisionDDL("/oms/TerritoryInfo/GetDivisionDDL?countryId=18");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {({ errors, touched, setFieldValue, isValid, values, resetForm, handleSubmit }) => (
          <>
            {/* <h1>
              {
                JSON.stringify(errors)
              }
            </h1> */}
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right global-form">
              <div className="form-group row">
                <div className="col-lg-3">
                  <IInput
                    value={values.transportZoneName}
                    label="Zone Name"
                    name="transportZoneName"
                  />
                </div>
                {/* divisionName */}
                <div className="col-lg-3">
                  <NewSelect
                    label={"Division"}
                    options={divisionDDL || []}
                    value={values?.divisionName}
                    name="divisionName"
                    onChange={(valueOption) => {
                      setFieldValue("divisionName", valueOption || "");
                      setFieldValue("districtName", "");
                      valueOption?.value && getDistrict(valueOption?.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* districtName */}
                <div className="col-lg-3">
                  <NewSelect
                    label={"District"}
                    options={districtDDL || []}
                    value={values?.districtName}
                    name="districtName"
                    onChange={(valueOption) => {
                      setFieldValue("districtName", valueOption || "");
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={values?.divisionName?.value ? false : true}
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
