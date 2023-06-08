import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../controls";
import Axios from "axios";
import Select from "react-select";
import customStyles from "../../../app/modules/selectCustomStyle";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  businessUnitName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Business Unit is required"),
  businessUnitCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Code is required"),
  businessUnitAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(300, "Maximum 300 symbols")
    .required("Address is required"),
  languageName: Yup.object().shape({
    label: Yup.string().required("Language is required"),
    value: Yup.string().required("Language is required"),
  }),
  currencyName: Yup.object().shape({
    label: Yup.string().required("Base currency is required"),
    value: Yup.string().required("Base currency is required"),
  }),
});

export default function _Form({
  product,
  btnRef,
  saveBusinessUnit,
  resetBtnRef,
  disableHandler,
  businessUnitCode,
  businessUnitName,
  isEdit,
}) {
  // console.log(product)
  const Language_URL =
    "/domain/Purchase/GetLanguageList";
  const BaseCurrency_URL =
    "/domain/Purchase/GetBaseCurrencyList";
  const [lngList, setLng] = useState("");
  const [currencyList, setCurrency] = useState("");

  useEffect(() => {
    getInfoData();
  }, []);

  const getInfoData = async () => {
    try {
      const [lng, crnc] = await Promise.all([
        Axios.get(Language_URL),
        Axios.get(BaseCurrency_URL),
      ]);
      const { status, data } = lng;
      if (status === 200 && data.length) {
        let languageList = [];
        data &&
          data.forEach((item) => {
            let items = {
              value: item.languageId,
              label: item.languageName,
            };
            languageList.push(items);
          });
        setLng(languageList);
      }
      const { status: st, data: cr } = crnc;
      if (st === 200 && cr.length) {
        let currencyListTemp = [];
        cr &&
          cr.forEach((item) => {
            let items = {
              value: item.currencyId,
              label: item.currencyName,
            };
            currencyListTemp.push(items);
          });
        setCurrency(currencyListTemp);
      }
    } catch (error) {
     
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveBusinessUnit(values, () => {
            resetForm(product);
          });
          // setSubmitting(false)
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
           
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
                  <Field
                    value={values.businessUnitName || ""}
                    name="businessUnitName"
                    component={Input}
                    placeholder="Business Unit"
                    label="Business Unit"
                    // errors={errors}
                    disabled={businessUnitName}
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.businessUnitCode || ""}
                    name="businessUnitCode"
                    component={Input}
                    placeholder="Code"
                    label="Code"
                    disabled={businessUnitCode}
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.businessUnitAddress || ""}
                    name="businessUnitAddress"
                    component={Input}
                    placeholder="Address"
                    label="Address"
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-4">
                  <label>Language</label>
                  <Select
                    options={lngList}
                    placeholder="Select Language"
                    defaultValue={values.languageName}
                    // value={values.languageName}
                    onChange={(valueOption) => {
                      setFieldValue("languageName", valueOption);
                    }}
                    isSearchable={true}
                    styles={customStyles}
                    // name="languageName"
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
                    errors.languageName &&
                    touched && touched.languageName
                      ? errors.languageName.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-4">
                  <label>Base Currency</label>
                  <Field
                    name="currencyName"
                    component={() => (
                      <Select
                        defaultValue={values.currencyName}
                        options={currencyList}
                        placeholder="Select base Currency"
                        onChange={(valueOption) => {
                          setFieldValue("currencyName", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        name="currencyName"
                      />
                    )}
                    placeholder="Base Currency"
                    label="Base Currency"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      marginTop: "0.25rem",
                      width: "100%",
                    }}
                    className="text-danger"
                  >
                    {touched &&
                    touched.currencyName &&
                    errors && errors.currencyName
                      ? errors.currencyName.value
                      : ""}
                  </p>
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
                onSubmit={() => resetForm(product)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
      {/* <ConfirmationModal title="Confirmation" body="Do you want to proceed" handleClose={handleClose} show={show} /> */}
    </>
  );
}
