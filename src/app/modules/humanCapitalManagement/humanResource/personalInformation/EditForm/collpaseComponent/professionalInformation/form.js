import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../../../_helper/_inputField";
import IDelete from "./../../../../../../_helper/_helperIcons/_delete";
import { DropzoneDialogBase } from "material-ui-dropzone";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
import { empAttachment_action } from "../../../helper";
import IEdit from "./../../../../../../_helper/_helperIcons/_edit";
//import IView from "./../../../../../../_helper/_helperIcons/_view";
import { _dateFormatter } from "./../../../../../../_helper/_dateFormate";
import ButtonStyleOne from "../../../../../../_helper/button/ButtonStyleOne";
//import { useDispatch } from "react-redux";
//import { getDownlloadFileView_Action } from "../../../../../../_helper/_redux/Actions";

// Validation schema
const validationSchema = Yup.object().shape({
  // CGPAScal: Yup.object().shape({
  //   label: Yup.string().required("CGPA Scal is required"),
  //   value: Yup.string().required("CGPA Scal is required"),
  // }),
  // companyName: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Company Name required"),
  // companyBusiness: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Company Business required"),
  // companyLocation: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Company Location required"),
  // designation: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Designation required"),
  // department: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Department required"),
  // serviceLengthFrom: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Service Length From required"),
  // serviceLengthTo: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Service Length To required"),
  // areaOfExperiences: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Area of Experiences (Skill) required"),
  // responsibilities: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Responsibilities required"),
});

export default function _Form({
  initData,
  saveHandler,
  disableHandler,
  setEdit,
  setFileObjects,
  fileObjects,
  edit,
  rowDto,
  rowDataAddHandler,
  remover,
  setUploadImage,
  editBtnHandler,
  editClick,
  setEditClick,
  singleData,
  isDisabled,
  empProfessionalInfoById,
  setRowDto,
}) {
  const [open, setOpen] = React.useState(false);
  //const dispatch = useDispatch();
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
          setValues,
        }) => (
          <div className={!edit ? "editForm" : ""}>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Create Working Experience"}>
                <CardHeaderToolbar>
                  {edit ? (
                    <>
                      <button
                        onClick={() => {
                          setEdit(false);
                          resetForm(initData);
                          setEditClick(false);
                          setRowDto([]);
                          empProfessionalInfoById();
                        }}
                        className="btn btn-light "
                        type="button"
                      >
                        <i className="fas fa-times pointer"></i>
                        Cancel
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
                  {edit && (
                    <div className="row global-form global-form-custom bj-left pb-2">
                      <div className="col-lg-3">
                        <label>Company Name</label>
                        <InputField
                          value={values?.companyName}
                          name="companyName"
                          placeholder="Company Name"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Company Business</label>
                        <InputField
                          value={values?.companyBusiness}
                          name="companyBusiness"
                          placeholder="Company Business"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Company Location</label>
                        <InputField
                          value={values?.companyLocation}
                          name="companyLocation"
                          placeholder="Company Location"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Designation/Rank</label>
                        <InputField
                          value={values?.designation}
                          name="designation"
                          placeholder="Designation/Rank"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3 mt-1">
                        <label>Department</label>
                        <InputField
                          value={values?.department}
                          name="department"
                          placeholder="Department"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3 mt-1">
                        <label>Service Length From</label>
                        <InputField
                          value={values?.serviceLengthFrom}
                          name="serviceLengthFrom"
                          placeholder="Service Length From"
                          onChange={(e) => {
                            setFieldValue("serviceLengthTo", "");
                            setFieldValue("serviceLengthFrom", e.target.value);
                          }}
                          type="date"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3 mt-5 d-flex justify-content-start align-items-center">
                        <input
                          disabled={!edit}
                          type="checkbox"
                          id="checkbox_id"
                          checked={values?.currentlyWorking}
                          name="currentlyWorking"
                          onChange={(event) => {
                            setFieldValue(
                              "currentlyWorking",
                              event.target.checked
                            );
                          }}
                        />
                        <label for="checkbox_id" className="mr-2 ml-3">
                          Currently Working
                        </label>
                      </div>
                      {values?.currentlyWorking === false && (
                        <>
                          <div className="col-lg-3 mt-1">
                            <label>Service Length To</label>
                            <InputField
                              value={values?.serviceLengthTo}
                              name="serviceLengthTo"
                              placeholder="Service Length To"
                              type="date"
                              disabled={!edit || !values?.serviceLengthFrom}
                              min={values?.serviceLengthFrom}
                            />
                          </div>
                        </>
                      )}
                      <div className="col-lg-3 mt-1">
                        <label>Area of Experiences (Skill)</label>
                        <InputField
                          value={values?.areaOfExperiences}
                          name="areaOfExperiences"
                          placeholder="Area of Experiences (Skill)"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3 mt-1">
                        <label>Responsibilities</label>
                        <InputField
                          value={values?.responsibilities}
                          name="responsibilities"
                          placeholder="Responsibilities"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div
                        style={{ marginTop: "19px" }}
                        className={!edit ? "d-none" : "col-lg-3"}
                      >
                        {/* <button
                          className="btn btn-primary mr-1"
                          type="button"
                          onClick={() => setOpen(true)}
                        >
                          Document Attachment
                        </button> */}
                        {!editClick && (
                          <ButtonStyleOne
                            disabled={
                              !values.companyName ||
                              !values.companyBusiness ||
                              !values.companyLocation ||
                              !values.designation ||
                              !values.department ||
                              !values.serviceLengthFrom ||
                              !values.areaOfExperiences ||
                              !values.responsibilities ||
                              (!values?.currentlyWorking &&
                                !values?.serviceLengthTo)
                            }
                            className="btn btn-primary"
                            type="button"
                            onClick={() => rowDataAddHandler(values)}
                            label="Add"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* row end */}
                  {/* Table Start */}
                  {!editClick && (
                    <div className="row global-form global-form-custom bg_none">
                      <div className="col-lg-12 pr-0 pl-0">
                        {rowDto?.length > 0 && (
                          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                            <thead>
                              <tr>
                                <th style={{ width: "35px" }}>SL</th>
                                <th style={{ width: "35px" }}>Company Name</th>
                                <th style={{ width: "35px" }}>
                                  Company Business
                                </th>
                                <th style={{ width: "35px" }}>
                                  Company Location
                                </th>
                                <th style={{ width: "35px" }}>Designation</th>
                                <th style={{ width: "35px" }}>Department</th>
                                <th style={{ width: "35px" }}>
                                  Service Length
                                </th>
                                <th style={{ width: "35px" }}>
                                  Area of Experiences (Skill)
                                </th>
                                <th style={{ width: "35px" }}>
                                  Responsibilities
                                </th>
                                {/* <th style={{ width: "35px" }}>Attachment</th> */}
                                {edit && (
                                  <th style={{ width: "35px" }}>Action</th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((itm, index) => (
                                <tr key={index}>
                                  <td className="text-center">{index + 1}</td>
                                  <td className="">{itm?.companyName}</td>
                                  <td className="">{itm?.companyBusiness}</td>
                                  <td className="">{itm?.companyLocation}</td>
                                  <td className="">{itm?.designation}</td>
                                  <td className="">{itm?.department}</td>
                                  {itm?.isCurrentlyWorking === true ? (
                                    <td className="">{`${_dateFormatter(
                                      itm?.fromServiceLength
                                    )} to ${"Present"}`}</td>
                                  ) : (
                                    <td className="">{`${_dateFormatter(
                                      itm?.fromServiceLength
                                    )} to ${_dateFormatter(
                                      itm?.toServiceLength
                                    )}`}</td>
                                  )}

                                  <td className="">{itm?.areaOfExperiences}</td>
                                  <td className="">{itm?.responsibilities}</td>
                                  {/* <td className="text-center">
                                    {itm?.documentLink && (
                                      <IView
                                        clickHandler={() => {
                                          dispatch(
                                            getDownlloadFileView_Action(
                                              itm?.documentLink
                                            )
                                          );
                                        }}
                                      />
                                    )}
                                  </td> */}
                                  {edit && (
                                    <td className="text-center">
                                      <div className=" d-flex justify-content-around">
                                        {singleData.length > 0 && (
                                          <span
                                            onClick={() => {
                                              editBtnHandler(
                                                index,
                                                itm,
                                                setValues
                                              );
                                            }}
                                          >
                                            <IEdit />
                                          </span>
                                        )}

                                        <IDelete id={index} remover={remover} />
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Table End */}

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
                      empAttachment_action(fileObjects).then((data) => {
                        setUploadImage(data);
                      });
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
