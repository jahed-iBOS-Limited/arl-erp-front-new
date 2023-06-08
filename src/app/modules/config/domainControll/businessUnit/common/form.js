import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import Select from "react-select";
import { DropzoneDialogBase } from "material-ui-dropzone";
import customStyles from "../../../../selectCustomStyle";
// import IView from "../../../../_helper/_helperIcons/_view";
import { attachmentUpload } from "../helper";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
// import imageCompression from 'browser-image-compression';
import {compressfile} from "../../../../_helper/compressfile"
// Validation schema
const BusinessUnitDataSchema = Yup.object().shape({
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
  initData,
  btnRef,
  saveBusinessUnit,
  resetBtnRef,
  // disableHandler,
  businessUnitCode,
  businessUnitName,
  isEdit,
  setFileObjects,
  fileObjects,
}) {
  // console.log(initData)
  const Language_URL = "/domain/Purchase/GetLanguageList";
  const BaseCurrency_URL = "/domain/Purchase/GetBaseCurrencyList";
  const [lngList, setLng] = useState("");
  const [currencyList, setCurrency] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch()
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
        languageList = null;
      }
      const { status: st, data: cr } = crnc;
      if (st === 200 && cr.length) {
        let currencyListTemp = [];
        cr &&
          cr.forEach((item) => {
            let items = {
              value: item?.value,
              label: item?.label,
            };
            currencyListTemp.push(items);
          });
        setCurrency(currencyListTemp);
        currencyListTemp = null;
      }
    } catch (error) {}
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          languageName: { value: 1, label: "English" },
          currencyName: { value: 141, label: "Taka" },
        }}
        validationSchema={BusinessUnitDataSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveBusinessUnit(values, () => {
            resetForm(initData);
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
            <Form className="form form-label-right">
              <div className="form-group row global-form align-items-center">
                <div className="col-lg-3">
                  <Field
                    value={values?.businessUnitName || ""}
                    name="businessUnitName"
                    component={Input}
                    placeholder="Business Unit"
                    label="Business Unit"
                    // errors={errors}
                    disabled={businessUnitName}
                  />
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values.businessUnitCode || ""}
                    name="businessUnitCode"
                    component={Input}
                    placeholder="Code"
                    label="Code"
                    disabled={businessUnitCode}
                  />
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values.businessUnitAddress || ""}
                    name="businessUnitAddress"
                    component={Input}
                    placeholder="Address"
                    label="Address"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Language</label>
                  <Field
                    name="languageName"
                    component={() => (
                      <Select
                        options={lngList}
                        placeholder="Select Language"
                        value={values.languageName}
                        onChange={(valueOption) => {
                          setFieldValue("languageName", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                    placeholder="Language"
                    label="Language"
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
                    touched &&
                    touched.languageName
                      ? errors.languageName.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-3">
                  <label>Base Currency</label>
                  <Field
                    name="currencyName"
                    component={() => (
                      <Select
                        value={values.currencyName}
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
                    errors &&
                    errors.currencyName
                      ? errors.currencyName.value
                      : ""}
                  </p>
                </div>
                <div className="col-auto">
                  <button
                    className="btn btn-primary mr-2"
                    type="button"
                    onClick={() => setOpen(true)}
                  >
                    Attachment
                  </button>
                  {values?.image && (
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        dispatch(
                          getDownlloadFileView_Action(values?.image)
                        );
                      }}
                    >
                      Attachment View
                    </button>
                  )}
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
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
            <DropzoneDialogBase
              filesLimit={1}
              acceptedFiles={["image/*"]}
              fileObjects={fileObjects}
              cancelButtonText={"cancel"}
              submitButtonText={"submit"}
              maxFileSize={10000000}
              open={open}
              onAdd={(newFileObjs) => {
                setFileObjects([].concat(newFileObjs));
              }}
              onDelete={(deleteFileObj) => {
                const newData = fileObjects.filter(
                  (item) => item.file.name !== deleteFileObj.file.name
                );
                setFileObjects(newData);
              }}
              onClose={() => setOpen(false)}
              onSave={async () => {
                try {
                  // console.log(fileObjects[0])
                  // console.log(`file size ${fileObjects[0].file.size / 1024 / 1024} MB`);
                  const compressedFile = await compressfile([fileObjects[0].file])
                  // const compressedFile = await imageCompression(fileObjects[0].file, options);
                  // console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
                  // console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
              
                  // await uploadToServer(compressedFile); // write your own logic
                  attachmentUpload(compressedFile).then((data) => {
                    setFieldValue("imageId", data?.length > 0 ? data[0]?.id : "");
                  });
                  setOpen(false);
                } catch (error) {
                  console.log(error)
                  setOpen(false);
                }

              }}
              showPreviews={true}
              showFileNamesInPreview={true}
            />
          </>
        )}
      </Formik>
      {/* <ConfirmationModal title="Confirmation" body="Do you want to proceed" handleClose={handleClose} show={show} /> */}
    </>
  );
}
