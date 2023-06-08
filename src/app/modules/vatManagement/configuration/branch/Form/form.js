import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import {
  getDistrictDDLAction,
  getDivisionDDLAction,
  getPoliceStationDDLAction,
  getPostCodeDDLAction,
} from "../_redux/Actions";
import { useDispatch } from "react-redux";

// Validation schema
const validationSchema = Yup.object().shape({
  branchName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Branch Name No is required"),
  address: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(1000, "Maximum 1000 symbols")
    .required("Branch Name No is required"),
  country: Yup.object().shape({
    label: Yup.string().required("Country is required"),
    value: Yup.string().required("Country is required"),
  }),
  division: Yup.object().shape({
    label: Yup.string().required("State/Division is required"),
    value: Yup.string().required("State/Division is required"),
  }),
  district: Yup.object().shape({
    label: Yup.string().required("City/District is required"),
    value: Yup.string().required("City/District is required"),
  }),
  policeStation: Yup.object().shape({
    label: Yup.string().required("Police Station is required"),
    value: Yup.string().required("Police Station is required"),
  }),
  postCode: Yup.object().shape({
    label: Yup.string().required("PostCode is required"),
    value: Yup.string().required("PostCode is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  buDDL,
  countryDDL,
  divisionDDL,
  districtDDL,
  policeStationDDL,
  postCodeDDL,
  isEdit,
}) {
  const dispatch = useDispatch();
  let modifyPostCodeDDL = postCodeDDL.map((itm) => {
    return {
      value: itm?.value,
      label: itm?.code,
    };
  });
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
                  <label>Branch Name</label>
                  <InputField
                    value={values?.branchName || ""}
                    name="branchName"
                    placeholder="Branch Name"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Address</label>
                  <InputField
                    value={values?.address || ""}
                    name="address"
                    placeholder="Address"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="country"
                    options={countryDDL}
                    value={values?.country}
                    label="Country"
                    onChange={(valueOption) => {
                      setFieldValue("country", valueOption);
                      setFieldValue("division", "");
                      dispatch(getDivisionDDLAction(valueOption?.value));
                    }}
                    placeholder="Select Country"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="division"
                    options={divisionDDL}
                    value={values?.division}
                    label="State/Division"
                    onChange={(valueOption) => {
                      setFieldValue("division", valueOption);
                      setFieldValue("district", "");
                      dispatch(
                        getDistrictDDLAction(
                          values?.country?.value,
                          valueOption?.value
                        )
                      );
                    }}
                    placeholder="Select State/Division"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="district"
                    options={districtDDL}
                    value={values?.district}
                    label="City/District"
                    onChange={(valueOption) => {
                      setFieldValue("district", valueOption);
                      setFieldValue("policeStation", "");
                      dispatch(
                        getPoliceStationDDLAction(
                          values?.country?.value,
                          values?.division?.value,
                          valueOption?.value
                        )
                      );
                    }}
                    placeholder="Select City/District"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="policeStation"
                    options={policeStationDDL}
                    value={values?.policeStation}
                    label="PoliceStation"
                    onChange={(valueOption) => {
                      setFieldValue("policeStation", valueOption);
                      dispatch(
                        getPostCodeDDLAction(valueOption?.value, setFieldValue)
                      );
                    }}
                    placeholder="Select PoliceStation"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="postCode"
                    options={modifyPostCodeDDL}
                    value={values?.postCode}
                    label="Post Code"
                    onChange={(valueOption) => {
                      setFieldValue("postCode", valueOption);
                    }}
                    placeholder="Select Post Code"
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
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
