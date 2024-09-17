import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import AttachmentUploaderNew from "../../../_helper/attachmentUploaderNew";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _todayDate } from "../../../_helper/_todayDate";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { useParams } from "react-router-dom";
import IViewModal from "../../../_helper/_viewModal";
import MailSender from "../mailSender";

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

  const { paramId, paramCode } = useParams();

  const [attachment, setAttachment] = useState("");
  const [, onSave, loader] = useAxiosPost();
  const [vesselDDL, getVesselDDL] = useAxiosGet();
  const [voyageDDL, getVoyageDDL, , setVoyageDDL] = useAxiosGet();
  const [isShowModal, setIsShowModal] = useState(false);

  useEffect(() => {
    getVesselDDL(`${imarineBaseUrl}/domain/Voyage/GetVesselDDL?AccountId=${accountId}&BusinessUnitId=${buId}
      `);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, buId]);

  const saveHandler = (values, cb) => {
    const payload = {
      intAutoId: 0,
      intAccountId: accountId,
      strAccountName: "Akij",
      intBusinessUnitId: buId,
      strBusinessUnitName: businessUnitName,
      strVesselName: values.strVesselName?.label,
      strVoyageNo: values.strVoyageNo?.label,
      intVesselNominationId: +paramId || 0,
      strCode: paramCode || values.strCode || "",
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
    strVesselName: Yup.object()
      .shape({
        value: Yup.string().required("Vessel is required"),
        label: Yup.string().required("Vessel is required"),
      })
      .typeError("Vessel is required"),
    strVoyageNo: Yup.object()
      .shape({
        value: Yup.string().required("Voyage No is required"),
        label: Yup.string().required("Voyage No is required"),
      })
      .typeError("Voyage No is required"),
    strCode: Yup.string().required("Code is required"),
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...initData, strCode: paramCode || "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setIsShowModal(true);
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
                  <NewSelect
                    name="strVesselName"
                    options={vesselDDL}
                    value={values.strVesselName}
                    label="Vessel Name"
                    onChange={(valueOption) => {
                      setFieldValue("strVesselName", valueOption);
                      setFieldValue("strVoyageNo", "");
                      setVoyageDDL([]);
                      if (valueOption) {
                        getVoyageDDL(
                          `${imarineBaseUrl}/domain/PortPDA/GetVoyageDDLNew?AccountId=1&BusinessUnitId=${buId}&vesselId=${valueOption?.value}&VoyageTypeId=0&ReturnType=0&HireTypeId=0`
                        );
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-2">
                  <NewSelect
                    name="strVoyageNo"
                    options={voyageDDL}
                    value={values.strVoyageNo}
                    label="Voyage No"
                    onChange={(valueOption) =>
                      setFieldValue("strVoyageNo", valueOption)
                    }
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {/* Code */}
                <div className="col-lg-2">
                  <InputField
                    value={values.strCode}
                    label="Code"
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
              <div>
                <IViewModal
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                  title={"Send Mail"}
                  modelSize={"md"}
                >
                  <MailSender
                    payloadInfo={{
                      strVesselName: values.strVesselName?.label,
                      strVoyageNo: values.strVoyageNo?.label,
                      intVesselNominationId: +paramId || 0,
                      strCode: paramCode || values.strCode || "",
                      strSoffile: `https://erp.ibos.io/domain/Document/DownlloadFile?id=${values.strSoffile}`,
                      strNorfile: `https://erp.ibos.io/domain/Document/DownlloadFile?id=${values.strNorfile}`,
                      strFinalDraftSurveyReportFile: `https://erp.ibos.io/domain/Document/DownlloadFile?id=${values.strFinalDraftSurveyReportFile}`,
                      strFinalStowagePlanFile: `https://erp.ibos.io/domain/Document/DownlloadFile?id=${values.strFinalStowagePlanFile}`,
                      strMatesReceiptFile: `https://erp.ibos.io/domain/Document/DownlloadFile?id=${values.strMatesReceiptFile}`,
                      strCargoManifestFile: `https://erp.ibos.io/domain/Document/DownlloadFile?id=${values.strCargoManifestFile}`,
                      strMasterReceiptOfSampleFile: `https://erp.ibos.io/domain/Document/DownlloadFile?id=${values.strMasterReceiptOfSampleFile}`,
                      strAuthorizationLetterFile: `https://erp.ibos.io/domain/Document/DownlloadFile?id=${values.strAuthorizationLetterFile}`,
                      strSealingReportFile: `https://erp.ibos.io/domain/Document/DownlloadFile?id=${values.strSealingReportFile}`,
                      strHoldInspectionReportFile: `https://erp.ibos.io/domain/Document/DownlloadFile?id=${values.strHoldInspectionReportFile}`,

                      strRemarks: values.strRemarks,
                    }}
                  />
                </IViewModal>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
