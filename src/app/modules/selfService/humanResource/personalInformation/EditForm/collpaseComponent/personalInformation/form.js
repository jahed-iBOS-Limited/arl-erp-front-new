import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../../../_helper/_select";
import InputField from "../../../../../../_helper/_inputField";
import { DropzoneDialogBase } from "material-ui-dropzone";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
//import { useDispatch } from "react-redux";
//import { getDownlloadFileView_Action } from "../../../../../../_helper/_redux/Actions";

// Validation schema
const validationSchema = Yup.object().shape({
  nationality: Yup.object()
    .shape({
      label: Yup.string().required("Nationality is required"),
      value: Yup.string().required("Nationality is required"),
    })
    .typeError("Nationality is required"),
  identificationType: Yup.object()
    .shape({
      label: Yup.string().required("Identification type is required"),
      value: Yup.string().required("Identification type is required"),
    })
    .typeError("Identification type is required"),
  bloodGroup: Yup.object()
    .shape({
      label: Yup.string(),
      value: Yup.string(),
    })
    .nullable(),
  // religion: Yup.object()
  //   .shape({
  //     label: Yup.string().required("Religion is required"),
  //     value: Yup.string().required("Religion is required"),
  //   })
  //   .typeError("Religion is required"),
  maritalStatus: Yup.object()
    .shape({
      label: Yup.string().required("Marital status is required"),
      value: Yup.string().required("Marital status is required"),
    })
    .typeError("Marital status is required"),

  employeeNickName: Yup.string()
    .min(1, "Minimum 1 symbol")
    .max(100, "Maximum 100 symbols")
    .typeError("Maximum 100 symbols"),
  dateOfBirth: Yup.string()
    .min(1, "Minimum 1 symbol")
    .max(100, "Maximum 100 symbols")
    .required("Date of Birth is required")
    .typeError("Date of Birth is required"),
  placeofBirth: Yup.string()
    .min(1, "Minimum 1 symbol")
    .max(100, "Maximum 100 symbols")
    .required("Place of Birth is required")
    .typeError("Place of Birth is required"),
  identificationNo: Yup.string()
    .min(1, "Minimum 1 symbol")
    .max(100, "Maximum 100 symbols")
    .required("Identification no is required")
    .typeError("Identification no is required"),
  height: Yup.string()
    .min(1, "Minimum 1 symbol")
    .max(100, "Maximum 100 symbols")
    .required("Height (cm) is required")
    .typeError("Height (cm) is required"),
  weight: Yup.string()
    .min(1, "Minimum 1 symbol")
    .max(100, "Maximum 100 symbols")
    .required("Weight (kg) is required")
    .typeError("Weight (kg) is required"),
  emailPersonal: Yup.string()
    .min(1, "Minimum 1 symbol")
    .max(100, "Maximum 100 symbols")
    .nullable(),
  employeeTINNo: Yup.string()
    .min(1, "Minimum 1 symbol")
    .max(100, "Maximum 100 symbols")
    .nullable(),
  alternativeContactNo: Yup.string()
    .min(1, "Minimum 1 symbol")
    .max(100, "Maximum 100 symbols")
    .nullable(),
  residenceContactNo: Yup.string()
    .min(1, "Minimum 1 symbol")
    .max(100, "Maximum 100 symbols")
    .nullable(),
  personalContactNo: Yup.string()
    .min(11, "Minimum 11 symbols")
    .max(11, "Maximum 11 symbols")
    .required("Personal Contact No is required")
    .typeError("Personal contact no is required"),
  dateofMarriage: Yup.string().when("maritalStatus", {
    is: (status) => status?.label === "Married",
    then: Yup.string()
      .required("Marital Status required")
      .typeError("Marital Status required"),
  }),
});

export default function _Form({
  initData,
  saveHandler,
  nationalityDDL,
  bloodGroupDDL,
  identificationTypeDDL,
  setEdit,
  religionDDL,
  setFileObjects,
  fileObjects,
  meritalStatusDDL,
  edit,
  isDisabled,
  singleData,
}) {
  const [open, setOpen] = React.useState(false);

  // const dispatch = useDispatch();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, nationality: nationalityDDL[17] }}
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
          <div className={!edit ? "editForm" : ""}>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Create Personal Information"}>
                <CardHeaderToolbar>
                  {edit ? (
                    <>
                      <button
                        onClick={() => {
                          setEdit(false);
                          resetForm(initData);
                        }}
                        className="btn btn-light "
                        type="button"
                      >
                        <i className="fas fa-times pointer"></i>
                        Close
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="btn btn-primary ml-2"
                        type="submit"
                        disabled={isDisabled}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEdit(true)}
                      className="btn btn-light"
                      type="button"
                    >
                      <i className="fas fa-pen-square pointer"></i>
                      Edit
                    </button>
                  )}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form global-form-custom bj-left pb-2">
                    <div className="col-lg-3">
                      <NewSelect
                        name="nationality"
                        options={nationalityDDL || []}
                        value={values?.nationality}
                        label="Nationality"
                        onChange={(valueOption) => {
                          setFieldValue("nationality", valueOption);
                        }}
                        placeholder="Nationality"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <label>Date of Birth</label>
                      <InputField
                        value={values?.dateOfBirth}
                        name="dateOfBirth"
                        placeholder="Date of Birth"
                        type="date"
                        disabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <label>Place of Birth</label>
                      <InputField
                        value={values?.placeofBirth}
                        name="placeofBirth"
                        placeholder="Place of Birth"
                        type="text"
                        disabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <label>Employee Nick Name (Optional)</label>
                      <InputField
                        value={values?.employeeNickName}
                        name="employeeNickName"
                        placeholder="Employee Nick Name"
                        type="text"
                        disabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="identificationType"
                        options={identificationTypeDDL || []}
                        value={values?.identificationType}
                        label="Identification Type"
                        onChange={(valueOption) => {
                          setFieldValue("identificationType", valueOption);
                        }}
                        placeholder="Identification Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1 ">
                      <label>Identification No</label>
                      <InputField
                        value={values?.identificationNo}
                        name="identificationNo"
                        placeholder="Identification No"
                        type="text"
                        disabled={!edit}
                      />
                    </div>
                    {/* <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="gender"
                        options={genderDDL || []}
                        value={values?.gender}
                        label="Gender"
                        onChange={(valueOption) => {
                          setFieldValue("gender", valueOption);
                        }}
                        placeholder="Gender"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div> */}
                    {/* <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="religion"
                        options={religionDDL || []}
                        value={values?.religion}
                        label="Religion"
                        onChange={(valueOption) => {
                          setFieldValue("religion", valueOption);
                        }}
                        placeholder="Religion"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div> */}
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="bloodGroup"
                        options={bloodGroupDDL || []}
                        value={values?.bloodGroup}
                        label="Blood Group (Optional)"
                        onChange={(valueOption) => {
                          setFieldValue("bloodGroup", valueOption);
                        }}
                        placeholder="Blood Group"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <label>Height (CM)</label>
                      <InputField
                        value={values?.height}
                        name="height"
                        placeholder="Height (CM)"
                        type="number"
                        disabled={!edit}
                        min="0"
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <label>Weight (KG)</label>
                      <InputField
                        value={values?.weight}
                        name="weight"
                        placeholder="Weight (KG)"
                        type="number"
                        disabled={!edit}
                        min={0}
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <label>Personal Email (If Any)</label>
                      <InputField
                        value={values?.emailPersonal}
                        name="emailPersonal"
                        placeholder="Email (Personal) "
                        type="email"
                        disabled={!edit}
                        required
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <label>Employee TIN No (Optional)</label>
                      <InputField
                        value={values?.employeeTINNo}
                        name="employeeTINNo"
                        placeholder="Employee TIN No "
                        type="text"
                        disabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <label>Personal Contact No</label>
                      <InputField
                        value={values?.personalContactNo}
                        name="personalContactNo"
                        placeholder="Personal Contact No "
                        type="text"
                        disabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <label>Office Contact No (If Any)</label>
                      <InputField
                        value={values?.alternativeContactNo}
                        name="alternativeContactNo"
                        placeholder="Office Contact No "
                        type="text"
                        disabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <label>Residence Contact No. (Optional)</label>
                      <InputField
                        value={values?.residenceContactNo}
                        name="residenceContactNo"
                        placeholder="Residence Contact No. "
                        type="text"
                        disabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="maritalStatus"
                        options={meritalStatusDDL || []}
                        value={values?.maritalStatus || ""}
                        label="Marital Status"
                        onChange={(valueOption) => {
                          setFieldValue("maritalStatus", valueOption);
                        }}
                        placeholder="Marital Status"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    {values?.maritalStatus?.label === "Married" && (<div className="col-lg-3">
                      <label>Date of Marriage</label>
                      <InputField
                        value={values?.dateofMarriage}
                        name="dateofMarriage"
                        placeholder="Date of Marriage"
                        type="date"
                        disabled={!edit}
                      />
                    </div>)}
                    
                    {/* <div className={!edit ? "d-none" : "col-lg-3 mt-5"}>
                      <button
                        className="btn btn-primary mr-2"
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        Identification Doc
                      </button>

                      {values?.identificationDoc && (
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => {
                            dispatch(
                              getDownlloadFileView_Action(
                                values?.identificationDoc
                              )
                            );
                          }}
                        >
                          View
                        </button>
                      )}
                    </div> */}
                  </div>
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
                      console.log("onSave", fileObjects);
                      setOpen(false);
                    }}
                    showPreviews={true}
                    showFileNamesInPreview={true}
                  />
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}
