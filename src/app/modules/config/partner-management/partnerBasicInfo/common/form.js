import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import NewSelect from "../../../../_helper/_select";
import { getdivisionDDL, getdistrictDDL, getpoliceStationDDL } from "../helper";
import InputField from "../../../../_helper/_inputField";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  email: Yup.string().email("Valid Email is required"),
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
  businessPartnerType: Yup.object()
    .shape({
      label: Yup.string().required("Partner Type is required"),
      value: Yup.string().required("Partner Type is required"),
    })
    .typeError("Partner Type is required"),
  // businessPartnerCode: Yup.string()
  //   .min(2, "Minimum 2 symbols")
  //   .max(50, "Maximum 50 symbols")
  //   .required("Code is required"),
  businessPartnerAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Partner Address is required"),
  contactNumber: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Contact Number is required"),
  licenseNo: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("License No is required"),
  proprietor: Yup.string().required("Proprietor Name is required"),

  /* Last Added */
  // district: Yup.object().when(
  //   "isDistrictUpzillaStatus",
  //   (isDistrictUpzillaStatus, Schema) => {
  //     if (isDistrictUpzillaStatus) {
  //       return Schema.required("District is required");
  //     }
  //   }
  // ),
  // policeStation: Yup.object().when(
  //   "isDistrictUpzillaStatus",
  //   (isDistrictUpzillaStatus, Schema) => {
  //     if (isDistrictUpzillaStatus) {
  //       return Schema.required("Police Station is required");
  //     }
  //   }
  // ),
});

export default function _Form({
  product,
  btnRef,
  saveWarehouse,
  resetBtnRef,
  setFileObjects,
  fileObjects,
  id,
}) {
  const [itemTypeList, setItemTypeList] = useState("");
  const [itemTypeOption, setItemTypeOption] = useState([]);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const [divisionDDL, setdivisionDDL] = useState([]);
  const [districtDDL, setdistrictDDL] = useState([]);
  const [policeStationDDL, setpoliceStationDDL] = useState([]);

  useEffect(() => {
    getInfoData();
    getdivisionDDL(18, setdivisionDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemTypeList]);

console.log({product})
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
              <div className="form-group row global-form">
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
                  <NewSelect
                    name="businessPartnerType"
                    options={itemTypeOption}
                    value={values?.businessPartnerType}
                    label="Partner Type"
                    onChange={(valueOption) => {
                      setFieldValue("businessPartnerType", valueOption);
                    }}
                    placeholder="Select Partner Type"
                    isSearchable={true}
                    errors={errors}
                    touched={touched}
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
                  <InputField
                    value={values.proprietor || ""}
                    name="proprietor"
                    placeholder="Proprietor Name"
                    type="text"
                    label="Proprietor Name"
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.contactNumber || ""}
                    name="contactNumber"
                    component={Input}
                    placeholder="Contact Number (Proprietor)"
                    label="Contact Number (Proprietor)"
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    value={values.contactPerson || ""}
                    name="contactPerson"
                    placeholder="Contact Person"
                    type="text"
                    label="Contact Person"
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    value={values.contactNumber2 || ""}
                    name="contactNumber2"
                    placeholder="Contact Number (Contact Person)"
                    type="text"
                    label="Contact Number (Contact Person)"
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    value={values.contactNumber3 || ""}
                    name="contactNumber3"
                    placeholder="Contact Number (Other)"
                    type="text"
                    label="Contact Number (Other)"
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
                  <NewSelect
                    name="division"
                    options={divisionDDL}
                    value={values?.division}
                    label="State/Division (Optional)"
                    onChange={(valueOption) => {
                      setFieldValue("division", valueOption);
                      setFieldValue("district", "");
                      setFieldValue("policeStation", "");
                      getdistrictDDL(18, valueOption?.value, setdistrictDDL);
                    }}
                    placeholder="Select State/Division"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="district"
                    options={districtDDL}
                    value={values?.district}
                    label="City/District (Optional)"
                    onChange={(valueOption) => {
                      setFieldValue("district", valueOption);
                      setFieldValue("policeStation", "");
                      getpoliceStationDDL(
                        18,
                        values?.division?.value,
                        valueOption?.value,
                        setpoliceStationDDL
                      );
                    }}
                    placeholder="Select City/District"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="policeStation"
                    options={policeStationDDL}
                    value={values?.policeStation}
                    label="PoliceStation (Optional)"
                    onChange={(valueOption) => {
                      setFieldValue("policeStation", valueOption);
                    }}
                    placeholder="Select PoliceStation"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {!product?.createNewUser ? 
                <>
                  <div className="col-lg-2 d-flex align-items-center justify-content-center mt-2">
                  <Field
                    name="createNewUser"
                    component={() => (
                      <input
                        id="createNewUser"
                        type="checkbox"
                        className="mr-2 pointer"
                        value={values.createNewUser}
                        checked={values.createNewUser}
                        name="createNewUser"
                        onChange={(e) => {
                          setFieldValue("createNewUser", e.target.checked);
                        }}
                        // disabled={product?.createNewUser}
                      />
                    )}
                    label="Is slab program"
                  />
                  <label className="d-block pointer" for="createNewUser">
                    Create New User
                  </label>
                </div>
                </> : 
                <>
                <div className="col-lg-2 d-flex align-items-center justify-content-center mt-2">
                  <Field
                    name="updateUserLoginId"
                    component={() => (
                      <input
                        id="updateUserLoginId"
                        type="checkbox"
                        className="mr-2 pointer"
                        value={values.updateUserLoginId}
                        checked={values.updateUserLoginId}
                        name="updateUserLoginId"
                        onChange={(e) => {
                          setFieldValue("updateUserLoginId", e.target.checked);
                        }}
                        // disabled={product?.updateUserLoginId}
                      />
                    )}
                    label="Is slab program"
                  />
                  <label className="d-block pointer" for="updateUserLoginId">                   
                    Update User LogIn Information
                  </label>
                </div>
                </>  
              }

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
