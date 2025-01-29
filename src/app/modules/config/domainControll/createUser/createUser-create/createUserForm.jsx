/* eslint-disable no-redeclare */
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/createUserActions";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";

import Loading from "./../../../../_helper/_loading";
import {
  getCountryDropdown,
  getUserTypeDropdown,
  getReferenceDropdown,
} from "../DroupDownList";
// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Minimum 2 symbols")
    // .max(50, "Maximum 50 symbols")
    .required("Code is required"),
  email: Yup.string().required("Email/Code is required"),
  country: Yup.object().shape({
    label: Yup.string().required("country is required"),
    value: Yup.string().required("country is required"),
  }),
  type: Yup.object().shape({
    label: Yup.string().required("type is required"),
    value: Yup.string().required("type is required"),
  }),
  contactnumber: Yup.string()
    .min(11, "Invalid Phone Number")
    .max(11, "Invalid Phone Number")
    .required("Contact Number is required"),
  reference: Yup.object().shape({
    label: Yup.string().required("reference is required"),
    value: Yup.string().required("reference is required"),
  }),
});
export default function _Form({
  users,
  btnRef,
  SaveUserData,
  resetBtnRef,
  statusCode,
  goBack,
  profileData,
  selectedBusinessUnit,
  v,
  loading,
}) {
  // Getting curret state of user list from store (Redux)

  const { currentState } = useSelector(
    (state) => ({ currentState: state.user }),
    shallowEqual
  );
  const { countryList, userTypeList, referenceList } = currentState;

  const dispatch = useDispatch();
  const onHandleUserChange = (selectvalues, values) => {
    if (selectvalues.label === "Employee") {
      dispatch(
        actions.EmployeeList(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
    } else if (selectvalues.label === "Customer") {
      dispatch(
        actions.CustomerList(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
    } else if (selectvalues.label === "Supplier") {
      dispatch(
        actions.SupplierList(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
    } else if (selectvalues.label === "Others") {
      dispatch(actions.OthersList());
    }
  };

  // let unitdata = getUnitDropdown(unitList);
  let countrydata = getCountryDropdown(countryList);
  let usertypedata = getUserTypeDropdown(userTypeList);
  let referencedata = getReferenceDropdown(referenceList);

  // useEffect(() => {
  //   statusCode === 200 && goBack()
  // }, [statusCode])

  console.log(loading);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={users}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          SaveUserData(values, () => {});
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {loading && <Loading />}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-4">
                  <Field
                    value={selectedBusinessUnit.label}
                    name="businessUnitName"
                    component={Input}
                    placeholder="Business Unit"
                    label="Business Unit"
                    disabled="true"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.businessunit &&
                    touched &&
                    touched.businessunit
                      ? errors.businessunit.value
                      : ""}
                  </p>
                </div>

                <div className="col-lg-4">
                  <label>User Type</label>
                  <Field
                    name="type"
                    component={() => (
                      <Select
                        options={usertypedata}
                        placeholder="Select User Type"
                        value={values.type}
                        isDisabled={v}
                        onChange={(selectedOption) => {
                          setFieldValue("type", selectedOption);
                          setFieldValue("reference", "");
                          onHandleUserChange(selectedOption, values);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                    placeholder="User Type"
                    label="User Type"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors && errors.type && touched && touched.type
                      ? errors.type.value
                      : ""}
                  </p>
                </div>

                <div className="col-lg-4">
                  <label>User Reference (Employee)</label>
                  <Field
                    name="reference"
                    component={() => (
                      <Select
                        options={referencedata}
                        placeholder="Select User reference"
                        value={values.reference}
                        isDisabled={v}
                        onChange={(selectedOption) => {
                          let name;
                          name =
                            selectedOption?.label?.split("[")[0] ||
                            selectedOption?.name;

                          setFieldValue(
                            "contactnumber",
                            selectedOption?.contactNumber
                          );
                          setFieldValue("name", name);
                          setFieldValue("reference", selectedOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                    label="Reference"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors && errors.reference && touched && touched.reference
                      ? errors.reference.value
                      : ""}
                  </p>
                </div>

                <div className="col-lg-4">
                  <Field
                    name="name"
                    component={Input}
                    placeholder="Name"
                    disabled={values?.type?.label === "Employee" || v}
                    label="Name"
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    name="email"
                    component={Input}
                    placeholder="Email"
                    disabled={v}
                    label="Login Email/Code"
                  />
                </div>
                <div className="col-lg-4">
                  <label>Country</label>
                  <Field
                    name="country"
                    component={() => (
                      <Select
                        options={countrydata}
                        placeholder="Select Country"
                        value={values?.country}
                        isDisabled={v}
                        onChange={(selectedOption) => {
                          setFieldValue("country", selectedOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                    placeholder="country"
                    label="country"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors && errors.country && touched && touched.country
                      ? errors.country.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-4">
                  <Field
                    name="contactnumber"
                    component={Input}
                    placeholder="Contact Number"
                    disabled={v}
                    label="Contact Number"
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
                // disabled={true}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(users)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
