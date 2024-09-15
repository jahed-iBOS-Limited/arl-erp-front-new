import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import AttachmentUploaderNew from "../../../_helper/attachmentUploaderNew";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _todayDate } from "../../../_helper/_todayDate";

// Initial data
const initData = {
  strVesselName: "",
  strVoyageNo: "",
  strCode: "",
  strSoffile: "",
  strNorfile: "",
  strFinalDraftSurveyReportFile: "",
  strFinalStowagePlanFile: "",
  strMatesReceiptFile: "",
  strCargoManifestFile: "",
  strMasterReceiptOfSampleFile: "",
  strAuthorizationLetterFile: "",
  strSealingReportFile: "",
  strHoldInspectionReportFile: "",
  strRemarks: "",
};

export default function CreateDischargePort() {
  const {
    profileData: { userId, accountId },
    selectedBusinessUnit: { value: buId, label: businessUnitName },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [attachment, setAttachment] = useState("");
  const [, onSave, loader] = useAxiosPost();

  const saveHandler = (values, cb) => {
    const payload = {
      intAutoId: 0,
      intAccountId: accountId,
      strAccountName: "Akij",
      intBusinessUnitId: buId,
      strBusinessUnitName: businessUnitName,
      strVesselName: values.strVesselName,
      strVoyageNo: values.strVoyageNo,
      strCode: values.strCode,
      strSoffile: values.strSoffile,
      strNorfile: values.strNorfile,
      strFinalDraftSurveyReportFile: values.strFinalDraftSurveyReportFile,
      strFinalStowagePlanFile: values.strFinalStowagePlanFile,
      strMatesReceiptFile: values.strMatesReceiptFile,
      strCargoManifestFile: values.strCargoManifestFile,
      strMasterReceiptOfSampleFile: values.strMasterReceiptOfSampleFile,
      strAuthorizationLetterFile: values.strAuthorizationLetterFile,
      strSealingReportFile: values.strSealingReportFile,
      strHoldInspectionReportFile: values.strHoldInspectionReportFile,
      strRemarks: values.strRemarks,
      dteLastActionDateTime: _todayDate(),
      dteServerDateTime: _todayDate(),
      intActionBy: userId,
      isActive: true,
    };

    onSave(
      `${imarineBaseUrl}/domain/VesselNomination/CreateDepartureDocumentsDischargePort`,
      payload,
      cb,
      true
    );
  };

  // Validation schema for required fields
  const validationSchema = Yup.object().shape({
    strVesselName: Yup.string().required("Vessel Name is required"),
    strVoyageNo: Yup.string().required("Voyage No is required"),
    strCode: Yup.string().required("Code is required"),
  });

  return (
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
      {({ handleSubmit, values, setFieldValue, isValid, errors, touched }) => (
        <>
          {loader && <Loading />}
          <IForm
            title="Create Discharge Port"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Save
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group global-form row">
                {/* Vessel Name */}
                <div className="col-lg-2">
                  <InputField
                    value={values.strVesselName}
                    label="Vessel Name *"
                    name="strVesselName"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("strVesselName", e.target.value)
                    }
                    errors={errors}
                  />
                </div>

                {/* Voyage No */}
                <div className="col-lg-2">
                  <InputField
                    value={values.strVoyageNo}
                    label="Voyage No *"
                    name="strVoyageNo"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("strVoyageNo", e.target.value)
                    }
                    errors={errors}
                  />
                </div>

                {/* Code */}
                <div className="col-lg-2">
                  <InputField
                    value={values.strCode}
                    label="Code *"
                    name="strCode"
                    type="text"
                    onChange={(e) => setFieldValue("strCode", e.target.value)}
                    errors={errors}
                  />
                </div>

                {/* SOF */}
                <div className="col-lg-2 d-flex flex-column">
                  <label>SOF</label>
                  <AttachmentUploaderNew
                    isExistAttachment={values?.strSoffile}
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        setAttachment(attachmentData?.[0]?.id);
                        setFieldValue("strSoffile", attachmentData?.[0]?.id);
                      }
                    }}
                  />
                </div>

                {/* NOR */}
                <div className="col-lg-2 d-flex flex-column">
                  <label>NOR</label>
                  <AttachmentUploaderNew
                    isExistAttachment={values?.strNorfile}
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        setAttachment(attachmentData?.[0]?.id);
                        setFieldValue("strNorfile", attachmentData?.[0]?.id);
                      }
                    }}
                  />
                </div>

                {/* Final Draft Survey Report */}
                <div className="col-lg-2 d-flex flex-column">
                  <label>Final Draft Survey Report</label>
                  <AttachmentUploaderNew
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        setAttachment(attachmentData?.[0]?.id);
                        setFieldValue(
                          "strFinalDraftSurveyReportFile",
                          attachmentData?.[0]?.id
                        );
                      }
                    }}
                    isExistAttachment={values?.strFinalDraftSurveyReportFile}
                  />
                </div>

                {/* Final Stowage Plan */}
                <div className="col-lg-2 d-flex flex-column">
                  <label>Final Stowage Plan</label>
                  <AttachmentUploaderNew
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        setAttachment(attachmentData?.[0]?.id);
                        setFieldValue(
                          "strFinalStowagePlanFile",
                          attachmentData?.[0]?.id
                        );
                      }
                    }}
                    isExistAttachment={values?.strFinalStowagePlanFile}
                  />
                </div>

                {/* Mate's Receipt */}
                <div className="col-lg-2 d-flex flex-column">
                  <label>Mate's Receipt</label>
                  <AttachmentUploaderNew
                    isExistAttachment={values?.strMatesReceiptFile}
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        setAttachment(attachmentData?.[0]?.id);
                        setFieldValue(
                          "strMatesReceiptFile",
                          attachmentData?.[0]?.id
                        );
                      }
                    }}
                  />
                </div>

                {/* Cargo Manifest */}
                <div className="col-lg-2 d-flex flex-column">
                  <label>Cargo Manifest</label>
                  <AttachmentUploaderNew
                    isExistAttachment={values?.strCargoManifestFile}
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        setAttachment(attachmentData?.[0]?.id);
                        setFieldValue(
                          "strCargoManifestFile",
                          attachmentData?.[0]?.id
                        );
                      }
                    }}
                  />
                </div>

                {/* Master Receipt of Sample */}
                <div className="col-lg-2 d-flex flex-column">
                  <label>Master Receipt of Sample</label>
                  <AttachmentUploaderNew
                    isExistAttachment={values?.strMasterReceiptOfSampleFile}
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        setAttachment(attachmentData?.[0]?.id);
                        setFieldValue(
                          "strMasterReceiptOfSampleFile",
                          attachmentData?.[0]?.id
                        );
                      }
                    }}
                  />
                </div>

                {/* Authorization Letter */}
                <div className="col-lg-2 d-flex flex-column">
                  <label>Authorization Letter</label>
                  <AttachmentUploaderNew
                    isExistAttachment={values?.strAuthorizationLetterFile}
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        setAttachment(attachmentData?.[0]?.id);
                        setFieldValue(
                          "strAuthorizationLetterFile",
                          attachmentData?.[0]?.id
                        );
                      }
                    }}
                  />
                </div>

                {/* Sealing Report */}
                <div className="col-lg-2 d-flex flex-column">
                  <label>Sealing Report</label>
                  <AttachmentUploaderNew
                    isExistAttachment={values?.strSealingReportFile}
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        setAttachment(attachmentData?.[0]?.id);
                        setFieldValue(
                          "strSealingReportFile",
                          attachmentData?.[0]?.id
                        );
                      }
                    }}
                  />
                </div>

                {/* Hold Inspection report */}
                <div className="col-lg-2 d-flex flex-column">
                  <label>Hold Inspection report</label>
                  <AttachmentUploaderNew
                    isExistAttachment={values?.strHoldInspectionReportFile}
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        setAttachment(attachmentData?.[0]?.id);
                        setFieldValue(
                          "strHoldInspectionReportFile",
                          attachmentData?.[0]?.id
                        );
                      }
                    }}
                  />
                </div>

                {/* Remarks */}
                <div className="col-lg-3">
                  <InputField
                    value={values.strRemarks}
                    label="Remarks"
                    name="strRemarks"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("strRemarks", e.target.value)
                    }
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
