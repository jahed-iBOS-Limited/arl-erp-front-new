import { Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { attachmentUpload } from "./helper";
const validationSchema = Yup.object().shape({
  activityDateTime: Yup.string().required("Date is required"),
  to: Yup.string()
    .required("To is required")
    .email("Invalid email address"),
  cc: Yup.string()
    .required("CC is required")
    .email("Invalid email address"),
  bcc: Yup.string()
    .required("BCC is required")
    .email("Invalid email address"),
  titleOrSubject: Yup.string().required("Subject is required"),
  description: Yup.string().required("Description is required"),
  followUpDate: Yup.string().required("Follow Up Date is required"),
});
export default function EmailTab({ data }) {
  const formikRef = React.useRef(null);
  const dispatch = useDispatch();

  const {
    profileData: { userId },
    selectedBusinessUnit,
  } = useSelector((state) => state?.authData || {}, shallowEqual);

  const [open, setOpen] = React.useState(false);
  const [fileObjects, setFileObjects] = React.useState([]);
  const [scheduleTypeDDL, getScheduleTypeDDL] = useAxiosGet();
  const [, SaveCustomerFollowUpActivity, isLoading] = useAxiosPost();

  const saveHandler = (values, cb) => {
    const payload = {
      followUpActivityId: 0,
      businessUnitId: selectedBusinessUnit?.value,
      customerAcquisitionId: data?.customerAcquisitionId || 0,
      stageName: data?.currentStage || "",
      activityTypeId: 2,
      activityTypeName: "Email",

      from: values?.from || "",
      to: values?.to || "",
      cc: values?.cc || "",
      bcc: values?.bcc || "",

      activityDateTime: values?.activityDateTime || new Date(),
      titleOrSubject: values?.titleOrSubject || "",

      description: values?.description || "",
      //   outcome: values?.outcome || "",
      attachment: values?.documentFileId || "",
      actionBy: userId || 0,

      scheduleTypeId: values?.scheduleTypeName?.value || 0,
      scheduleTypeName: values?.scheduleTypeName?.label || "",

      followUpDate: values?.followUpDate || new Date(),
    };
    SaveCustomerFollowUpActivity(
      "/oms/SalesQuotation/CreateCustomerFollowUpActivity",
      payload,
      () => {
        if (cb) {
          cb();
        }
      },
      "save"
    );
  };

  // get all ddl
  React.useEffect(() => {
    getScheduleTypeDDL(`/oms/SalesQuotation/GetFollowUpActivityTypeDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ICustomCard
      title={"Email"}
      saveHandler={(values) => {
        formikRef.current.submitForm();
      }}
      resetHandler={() => {
        formikRef.current.resetForm();
      }}
    >
      {isLoading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          activityDateTime: "",
          to: "",
          cc: "",
          bcc: "",
          titleOrSubject: "",
          description: "",
          scheduleTypeName: "",
          followUpDate: "",
          attachment: "",
          documentFileId: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            {/* <h1>{JSON.stringify(errors)}</h1> */}
            <Form className="form form-label-right">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "10px",
                }}
              >
                <div className="form-group row global-form">
                  {/* Date */}
                  <div className="col-lg-3">
                    <InputField
                      label="Date"
                      type="datetime-local"
                      name="activityDateTime"
                      value={values?.activityDateTime}
                      onChange={(e) => {
                        setFieldValue("activityDateTime", e.target.value);
                      }}
                    />
                  </div>
                  {/* to */}
                  <div className="col-lg-3">
                    <InputField
                      label="To"
                      name="to"
                      value={values?.to}
                      placeholder="To"
                      onChange={(e) => {
                        setFieldValue("to", e.target.value);
                      }}
                    />
                  </div>
                  {/* CC */}
                  <div className="col-lg-3">
                    <InputField
                      label="CC"
                      name="cc"
                      value={values?.cc}
                      placeholder="cc"
                      onChange={(e) => {
                        setFieldValue("cc", e.target.value);
                      }}
                    />
                  </div>
                  {/* BCC */}
                  <div className="col-lg-3">
                    <InputField
                      label="BCC"
                      name="bcc"
                      value={values?.bcc}
                      placeholder="bcc"
                      onChange={(e) => {
                        setFieldValue("bcc", e.target.value);
                      }}
                    />
                  </div>
                  {/* Subject */}
                  <div className="col-lg-3">
                    <InputField
                      label="Subject"
                      name="titleOrSubject"
                      value={values?.titleOrSubject}
                      placeholder="Subject"
                      onChange={(e) => {
                        setFieldValue("titleOrSubject", e.target.value);
                      }}
                    />
                  </div>
                  {/* Description */}
                  <div className="col-lg-3">
                    <InputField
                      label="Description"
                      name="description"
                      value={values?.description}
                      placeholder="Description"
                      onChange={(e) => {
                        setFieldValue("description", e.target.value);
                      }}
                    />
                  </div>

                  {/* scheduleType */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Schedule Type"}
                      options={scheduleTypeDDL || []}
                      value={values?.scheduleTypeName}
                      name="scheduleTypeName"
                      onChange={(valueOption) => {
                        setFieldValue("scheduleTypeName", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* Follow Up Date */}
                  <div className="col-lg-3">
                    <InputField
                      label="Follow Up Date"
                      type="datetime-local"
                      name="followUpDate"
                      value={values?.followUpDate}
                      onChange={(e) => {
                        setFieldValue("followUpDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-6 mt-5">
                    <button
                      className="btn btn-primary mr-2 "
                      type="button"
                      onClick={() => setOpen(true)}
                    >
                      Attachment
                    </button>
                    {values?.documentFileId && (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(values?.documentFileId)
                          );
                        }}
                      >
                        Attachment View
                      </button>
                    )}
                  </div>
                </div>
              </div>
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
                attachmentUpload(fileObjects).then((data) => {
                  const documentFileId = data?.[0]?.id;
                  setFieldValue("documentFileId", documentFileId || "");
                });
              }}
              showPreviews={true}
              showFileNamesInPreview={true}
            />
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}
