import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../../../_helper/_select";
import InputField from "../../../../../../_helper/_inputField";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { empAttachment_action } from "./../../../../../../inventoryManagement/warehouseManagement/assetReceive/helper/Actions";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../../../_metronic/_partials/controls";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../../../../_helper/_redux/Actions";
import ButtonStyleOne from "../../../../../../_helper/button/ButtonStyleOne";
import { useLocation } from "react-router";

// Validation schema
const validationSchema = Yup.object().shape({
  payrollGroup: Yup.object()
    .shape({
      label: Yup.string().required("Payroll group is required"),
      value: Yup.string().required("Payroll group is required"),
    })
    .typeError("Payroll group is required"),
  remunerationType: Yup.object()
    .shape({
      label: Yup.string().required("Remuneration type is required"),
      value: Yup.string().required("Remuneration type is required"),
    })
    .typeError("Remuneration type is required"),
  cardNo: Yup.string()
    .min(1, "Minimum 1 symbol")
    .max(100, "Maximum 100 symbols")
    .typeError("Maximum 100 symbols"),
  comments: Yup.string()
    .min(1, "Minimum 1 symbol")
    .max(100, "Maximum 100 symbols")
    .typeError("Maximum 100 symbols"),
});

export default function _Form({
  initData,
  saveHandler,
  setEdit,
  payrollGroupDDL,
  organizationStructureDDL,
  organizationComponentDDL,
  remunerationTypeDDL,
  edit,
  isDisabled,
  setFileObjects,
  fileObjects,
  employeeGroupDDL,
}) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const [uploadImage, setUploadImage] = useState("");

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          calenderType: {
            value: 0,
            label: "Calender General",
          },
        }}
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
              <CardHeader title={"Create Administrative Information"}>
                {!location?.state?.fromReRegistration && (
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
                )}
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form global-form-custom bj-left pb-2">
                    <div className="col-lg-3">
                      <NewSelect
                        name="payrollGroup"
                        options={payrollGroupDDL}
                        value={values?.payrollGroup}
                        label="Payroll Group"
                        onChange={(valueOption) => {
                          setFieldValue("payrollGroup", valueOption);
                        }}
                        placeholder="Payroll Group"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="remunerationType"
                        options={remunerationTypeDDL}
                        value={values?.remunerationType}
                        label="Remuneration Type"
                        onChange={(valueOption) => {
                          setFieldValue("remunerationType", valueOption);
                        }}
                        placeholder="Remuneration Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    {console.log("edit", edit)}

                    <div className="col-lg-3 mt-1">
                      <label>Card's Chip No. (Optional)</label>
                      <InputField
                        value={values?.cardNo}
                        name="cardNo"
                        placeholder="Card No."
                        type="text"
                        disabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="employeeGroup"
                        options={employeeGroupDDL}
                        value={values?.employeeGroup}
                        label="Employee Group (Optional)"
                        onChange={(valueOption) => {
                          setFieldValue("employeeGroup", valueOption);
                        }}
                        placeholder="Employee Group"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="organizationStructure"
                        options={organizationStructureDDL}
                        value={values?.organizationStructure}
                        label="Organization Structure (Optional)"
                        onChange={(valueOption) => {
                          setFieldValue("organizationStructure", valueOption);
                        }}
                        placeholder="Organization Structure"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="organizationComponent"
                        options={organizationComponentDDL}
                        value={values?.organizationComponent}
                        label="Organization Component (Optional)"
                        onChange={(valueOption) => {
                          setFieldValue("organizationComponent", valueOption);
                        }}
                        placeholder="Organization Component"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>

                    <div className="col-lg-3 mt-1">
                      <label>Comments (Optional)</label>
                      <InputField
                        value={values?.comments}
                        name="comments"
                        placeholder="Comments"
                        type="text"
                        disabled={!edit}
                      />
                    </div>
                    <div
                      style={{ marginTop: "19px" }}
                      className={!edit ? "d-none" : "col-lg-3"}
                    >
                      <ButtonStyleOne
                        className="btn btn-primary mr-2"
                        type="button"
                        onClick={() => setOpen(true)}
                        label="Attachment"
                      />
                      <ButtonStyleOne
                        className="btn btn-primary mr-2"
                        type="button"
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(uploadImage[0]?.id)
                          );
                        }}
                        label="View"
                      />

                      {values?.joiningLetter && (
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => {
                            dispatch(
                              getDownlloadFileView_Action(values?.joiningLetter)
                            );
                          }}
                        >
                          View
                        </button>
                      )}
                    </div>
                    <div></div>
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
                      empAttachment_action(fileObjects).then((data) => {
                        setUploadImage(data);
                        setFileObjects([]);
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
