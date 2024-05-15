import React from "react";
import Select from "react-select";
import { Formik, Form } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import * as Yup from "yup";
import InputField from "../../../../../../_helper/_inputField";
import IDelete from "./../../../../../../_helper/_helperIcons/_delete";
import NewSelect from "./../../../../../../_helper/_select";
import customStyles from "./../../../../../../selectCustomStyle";
import FormikError from "./../../../../../../_helper/_formikError";
import { _monthsFunc } from "./months";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
import { empAttachment_action } from "../../../helper";
import IEdit from "./../../../../../../_helper/_helperIcons/_edit";
import ButtonStyleOne from "../../../../../../_helper/button/ButtonStyleOne";
// Validation schema
const validationSchema = Yup.object().shape({
  // traningYear: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Traning Year required"),
  // trainingTitle: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Training Title required"),
  // issuingOrganization: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Issuing Organization required"),
  // duration: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Duration (days) required"),
  // trainingCovered: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Training Covered On required"),
  // months: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Months required"),
  // year: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Months required"),
});

export default function _Form({
  initData,
  saveHandler,
  disableHandler,
  setEdit,
  edit,
  rowDto,
  setFileObjects,
  fileObjects,
  yearDecrementDDL,
  yearIncrementDDL,
  rowDataAddHandler,
  remover,
  setUploadImage,
  editBtnHandler,
  editClick,
  setEditClick,
  singleData,
  isDisabled,
  getTrainingInfoById,
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
            {console.log("Values", values)}
            {console.log("rowDto", rowDto)}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Create Training/Certificate Information"}>
                <CardHeaderToolbar>
                  {edit ? (
                    <>
                      <button
                        onClick={() => {
                          setEdit(false);
                          resetForm(initData);
                          setEditClick(false);
                          setRowDto([]);
                          getTrainingInfoById();
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
                    <div className="row global-table global-form-custom bj-left pb-2">
                      <div className="col-lg-3">
                        <label>Training Title</label>
                        <InputField
                          value={values?.trainingTitle}
                          name="trainingTitle"
                          placeholder="Training Title"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Issuing Organization</label>
                        <InputField
                          value={values?.issuingOrganization}
                          name="issuingOrganization"
                          placeholder="Issuing Organization"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="traningYear"
                          options={yearDecrementDDL || []}
                          value={values?.traningYear}
                          label="Traning Year"
                          onChange={(valueOption) => {
                            setFieldValue("traningYear", valueOption);
                          }}
                          placeholder="Traning Year"
                          errors={errors}
                          touched={touched}
                          isDisabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Duration (days)</label>
                        <InputField
                          value={values?.duration}
                          name="duration"
                          placeholder="Duration (days)"
                          type="number"
                          disabled={!edit}
                          min="0"
                        />
                      </div>
                      <div className="col-lg-3 text-center">
                        <label> Issue Date </label>
                        <div className="d-flex">
                          <div className="w-50">
                            <Select
                              onChange={(valueOption) => {
                                setFieldValue("months", valueOption);
                              }}
                              options={_monthsFunc() || []}
                              value={values?.months}
                              isSearchable={true}
                              name="months"
                              styles={customStyles}
                              placeholder="Month"
                            />
                            <FormikError
                              errors={errors}
                              name="months"
                              touched={touched}
                            />
                          </div>
                          <div className="w-50">
                            <Select
                              onChange={(valueOption) => {
                                setFieldValue("year", valueOption);
                              }}
                              options={yearDecrementDDL || []}
                              value={values?.year}
                              isSearchable={true}
                              name="year"
                              styles={customStyles}
                              placeholder="Year"
                            />
                            <FormikError
                              errors={errors}
                              name="year"
                              touched={touched}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 d-flex justify-content-start align-items-center">
                        <input
                          disabled={!edit}
                          style={{
                            position: "relative",
                            top: "4px",
                            marginRight: "4px",
                          }}
                          type="checkbox"
                          id="checkbox_id"
                          checked={values?.credential}
                          name="credential"
                          onChange={(event) => {
                            setFieldValue("credential", event.target.checked);
                            setFieldValue("months1", "");
                            setFieldValue("year1", "");
                          }}
                        />
                        <label for="checkbox_id" className="mt-3">
                          This credential does not expire
                        </label>
                      </div>
                      {!values?.credential && (
                        <div className="col-lg-3 text-center">
                          <label> Expiration Date </label>
                          <div className="d-flex">
                            <div className="w-50">
                              <Select
                                onChange={(valueOption) => {
                                  setFieldValue("months1", valueOption);
                                }}
                                options={_monthsFunc() || []}
                                value={values?.months1}
                                isSearchable={true}
                                name="months1"
                                styles={customStyles}
                                placeholder="Month"
                                // isDisabled={!values?.credential}
                              />
                              <FormikError
                                errors={errors}
                                name="months1"
                                touched={touched}
                              />
                            </div>
                            <div className="w-50">
                              <Select
                                onChange={(valueOption) => {
                                  setFieldValue("year1", valueOption);
                                }}
                                options={yearIncrementDDL || []}
                                value={values?.year1}
                                isSearchable={true}
                                name="year1"
                                styles={customStyles}
                                placeholder="Year"
                                // isDisabled={!values?.credential}
                              />
                              <FormikError
                                errors={errors}
                                name="year1"
                                touched={touched}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-lg-3">
                        <label>Training Covered On</label>
                        <InputField
                          value={values?.trainingCovered}
                          name="trainingCovered"
                          placeholder="Training Covered On"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      <div className="col-lg-3 mt-1">
                        <label>Credential ID (Optional) </label>
                        <InputField
                          value={values?.credentialId}
                          name="credentialId"
                          placeholder="Credential ID"
                          type="text"
                          disabled={!edit}
                        />
                      </div>
                      {}
                      <div
                        style={{ marginTop: "18px" }}
                        className={!edit ? "d-none" : "col-lg-3"}
                      >
                        {!editClick && (
                          <ButtonStyleOne
                            className="btn btn-primary"
                            type="button"
                            onClick={() => rowDataAddHandler(values)}
                            disabled={
                              values?.credential === true
                                ? (!values.trainingTitle ||
                                  !values.issuingOrganization ||
                                  !values.traningYear ||
                                  !values.duration ||
                                  !values.months ||
                                  !values.year ||
                                  !values.trainingCovered)
                                : (!values.trainingTitle ||
                                  !values.issuingOrganization ||
                                  !values.traningYear ||
                                  !values.duration ||
                                  !values.months1 ||
                                  !values.year1 ||
                                  !values.trainingCovered)
                            }
                            label="Add"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* row end */}
                  {/* Table Start */}
                  {!editClick && (
                    <div className="row global-table global-form-custom bg_none">
                      <div className="col-lg-12 pr-0 pl-0">
                        {rowDto?.length > 0 && (
                           <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                            <thead>
                              <tr>
                                <th style={{ width: "35px" }}>SL</th>
                                <th style={{ width: "35px" }}>
                                  Training Title
                                </th>
                                <th style={{ width: "35px" }}>
                                  Issuing Organization
                                </th>
                                <th style={{ width: "35px" }}>Traning Year</th>
                                <th style={{ width: "35px" }}>
                                  Duration (days)
                                </th>
                                <th style={{ width: "35px" }}>
                                  Issue & ExpireDate
                                </th>
                                <th style={{ width: "35px" }}>
                                  Training Covered On
                                </th>
                                <th style={{ width: "35px" }}>
                                  Credential ID (Optional)
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
                                  <td className="">{itm?.trainingTitle}</td>
                                  <td className="">
                                    {itm?.issuingOrganization}
                                  </td>
                                  <td className="text-center">
                                    {itm?.trainingYear}
                                  </td>
                                  <td className="text-center">
                                    {itm?.durationDays}
                                  </td>
                                  <td className="text-center">{`${itm?.monthOfIssue} - ${itm?.yearOfIssue}, ${itm?.monthOfExpire} - ${itm?.yearOfExpire} `}</td>
                                  <td className="text-center">
                                    {itm?.trainingCoveredOn}
                                  </td>
                                  <td className="text-center">
                                    {itm?.credentialId}
                                  </td>
                                  {/* <td className="text-center">
                                    {itm?.attachment && (
                                      <IView
                                        clickHandler={() => {
                                          dispatch(
                                            getDownlloadFileView_Action(
                                              itm?.attachment
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
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Table End */}
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
