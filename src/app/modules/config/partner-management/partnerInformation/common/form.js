import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  businessPartnerName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Partner Name is required"),
  // billingName: Yup.string()
  //   .min(2, "Minimum 2 symbols")
  //   .max(100, "Maximum 100 symbols")
  //   .required("Billing Name is required"),
  // billingAddress: Yup.string()
  //   .min(2, "Minimum 2 symbols")
  //   .max(100, "Maximum 100 symbols")
  //   .required("Billing Address is required"),
  businessPartnerType: Yup.object().shape({
    label: Yup.string().required("Partner Type is required"),
    value: Yup.string().required("Partner Type is required"),
  }),
  // businessPartnerCode: Yup.string()
  //   .min(2, "Minimum 2 symbols")
  //   .max(50, "Maximum 50 symbols")
  //   .required("Code is required"),
  businessPartnerAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Partner Address is required"),
  contactNumber: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Contact Number is required"),
  licenseNo: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("License No is required"),
});

export default function _Form({
  product,
  btnRef,
  saveWarehouse,
  resetBtnRef,
  setFileObjects,
  fileObjects,
}) {
  const [itemTypeList, setItemTypeList] = useState("");
  const [itemTypeOption, setItemTypeOption] = useState([]);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    getInfoData();
  }, []);

  const getInfoData = async () => {
    try {
      const res = await Axios.get(
        "/partner/BusinessPartnerBasicInfo/GetBusinessPartnerTypeList"
      );
      setItemTypeList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const itemTypes = [];
    itemTypeList &&
      itemTypeList.forEach((item) => {
        let items = {
          value: item.businessPartnerTypeId,
          label: item.businessPartnerTypeName,
        };
        itemTypes.push(items);
      });
    setItemTypeOption(itemTypes);
  }, [itemTypeList]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveWarehouse(values, () => {
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
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
                  <Field
                    value={values.businessPartnerName || ""}
                    name="businessPartnerName"
                    component={Input}
                    placeholder="Business Partner Name"
                    label="Business Partner Name"
                  />
                </div>
                {/* <div className="col-lg-4">
                  <Field
                    value={values.businessPartnerCode || ""}
                    name="businessPartnerCode"
                    component={Input}
                    placeholder="Business Partner Code"
                    label="Business Partner Code"
                    // errors={errors}
                    disabled={businessPartnerCode}
                  />
                </div> */}
                <div className="col-lg-4">
                  <label>Partner Type</label>
                  <Field
                    name="businessPartnerType"
                    component={() => (
                      <Select
                        options={itemTypeOption}
                        placeholder="Select Partner Type"
                        value={values?.businessPartnerType}
                        onChange={(valueOption) => {
                          setFieldValue("businessPartnerType", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        name="businessPartnerType"
                        label="Partner Type"
                      />
                    )}
                    placeholder="Select Partner Type"
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.businessPartnerAddress || ""}
                    name="businessPartnerAddress"
                    component={Input}
                    placeholder="Business Partner Address"
                    label="Business Partner Address"
                  />
                </div>
              </div>
              <div className="form-group row">
                {/* <div className="col-lg-4">
                  <Field
                    value={values.billingName || ""}
                    name="billingName"
                    component={Input}
                    placeholder="Billing Name"
                    label="Billing Name"
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.billingAddress || ""}
                    name="billingAddress"
                    component={Input}
                    placeholder="Billing Address"
                    label="Billing Address"
                  />
                </div> */}
                {/* <div className="col-lg-4">
                  <Field
                    value={values.businessPartnerAddress || ""}
                    name="businessPartnerAddress"
                    component={Input}
                    placeholder="Business Partner Address"
                    label="Business Partner Address"
                  />
                </div> */}
                <div className="col-lg-4">
                  <Field
                    value={values.contactNumber || ""}
                    name="contactNumber"
                    component={Input}
                    placeholder="Contact Number"
                    label="Contact Number"
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.email || ""}
                    name="email"
                    component={Input}
                    placeholder="Email"
                    label="Email (Optional)"
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.bin || ""}
                    name="bin"
                    component={Input}
                    placeholder="BIN"
                    label="BIN (Optional)"
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.licenseNo || ""}
                    name="licenseNo"
                    component={Input}
                    placeholder="Licence Number"
                    label="Licence Number"
                  />
                </div>
                <div className="col-lg-4">
                  <button
                    className="btn btn-primary mr-2 mt-7"
                    type="button"
                    onClick={() => setOpen(true)}
                  >
                    Attachment
                  </button>
                  {values?.attachmentLink && (
                    <button
                      className="btn btn-primary mt-7"
                      type="button"
                      onClick={() => {
                        dispatch(
                          getDownlloadFileView_Action(values?.attachmentLink)
                        );
                      }}
                    >
                      View
                    </button>
                  )}
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
                onSubmit={() => resetForm(product)}
              ></button>
            </Form>

            <DropzoneDialogBase
              filesLimit={1}
              acceptedFiles={["image/*", "application/pdf"]}
              fileObjects={fileObjects}
              cancelButtonText={"cancel"}
              submitButtonText={"submit"}
              maxFileSize={1000000}
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
              onSave={() => {
                setOpen(false);
              }}
              showPreviews={true}
              showFileNamesInPreview={true}
            />
          </>
        )}
      </Formik>
    </>
  );
}
