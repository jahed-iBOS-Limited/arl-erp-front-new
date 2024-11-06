import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import AttachmentUploaderNew from "../../../_helper/attachmentUploaderNew";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import EmailEditorForPublicRoutes from "../../utils/emailEditorForPublicRotes";
import { generateFileUrl } from "../../utils/helper";


// Initial data
const initData = {
  strName: "",
  strEmail: "",
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
  departureDocuments: "",
};

export default function CreateLoadPort() {
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
  const [isShowModal, setIsShowModal] = useState(false);
  const [payloadInfo, setPayloadInfo] = useState(null);
  const [
    vesselNominationData,
    getVesselNominationData,
    loading,
  ] = useAxiosGet();

  useEffect(() => {
    getVesselDDL(`${imarineBaseUrl}/domain/Voyage/GetVesselDDL?AccountId=${accountId}&BusinessUnitId=${buId}
      `);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, buId]);

  useEffect(() => {
    if (paramId) {
      getVesselNominationData(
        `${imarineBaseUrl}/domain/VesselNomination/GetByIdVesselNomination?VesselNominationId=${paramId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]);

  const saveHandler = (values, cb) => {
    setPayloadInfo({
      // strName: values?.strName,
      // strEmail: values?.strEmail,
      strVesselName: values?.strNameOfVessel || "",
      strVoyageNo: values?.intVoyageNo || "",
      // intVesselNominationId: +paramId || 0,
      strCode: paramCode || values.strCode || "",
      strSoffile: generateFileUrl(values.strSoffile),
      strNorfile: generateFileUrl(values.strNorfile),
      strFinalDraftSurveyReportFile: generateFileUrl(
        values.strFinalDraftSurveyReportFile
      ),
      strFinalStowagePlanFile: generateFileUrl(values.strFinalStowagePlanFile),
      strMatesReceiptFile: generateFileUrl(values.strMatesReceiptFile),
      strCargoManifestFile: generateFileUrl(values.strCargoManifestFile),
      strMasterReceiptOfSampleFile: generateFileUrl(
        values.strMasterReceiptOfSampleFile
      ),
      strAuthorizationLetterFile: generateFileUrl(
        values.strAuthorizationLetterFile
      ),
      strSealingReportFile: generateFileUrl(values.strSealingReportFile),
      strHoldInspectionReportFile: generateFileUrl(
        values.strHoldInspectionReportFile
      ),

      strRemarks: values.strRemarks,

      // Dynamically add extra attachments based on the length of departureDocuments
      ...(values?.departureDocuments?.length > 0 && values?.departureDocuments.reduce((acc, item, index) => {
        const attachmentKey = `ExtraAttachment${index + 1}`;
        acc[attachmentKey] = generateFileUrl(item); // Generate dynamic key and URL
        return acc;
      }, {})),
    });

    const payload = {
      strName: values?.strName,
      strEmail: values?.strEmail,
      intAutoId: 0,
      intAccountId: accountId,
      strAccountName: "Akij",
      intBusinessUnitId: buId,
      strBusinessUnitName: businessUnitName,
      strVesselName: values?.strNameOfVessel || "",
      strVoyageNo: values?.intVoyageNo || "",
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
      departureDocuments: values?.departureDocuments?.length > 0 ? values?.departureDocuments?.map((item) => ({
        strDocumentId: item?.id,
        headerId: 0,
      })) : []
    };

    onSave(
      `${imarineBaseUrl}/domain/VesselNomination/CreateDepartureDocumentsLoadPort`,
      payload,
      cb,
      true
    );
  };

  // Validation schema for required fields
  const validationSchema = Yup.object().shape({
    // strVesselName: Yup.object()
    //   .shape({
    //     value: Yup.string().required("Vessel is required"),
    //     label: Yup.string().required("Vessel is required"),
    //   })
    //   .typeError("Vessel is required"),
    // strVoyageNo: Yup.object()
    //   .shape({
    //     value: Yup.string().required("Voyage No is required"),
    //     label: Yup.string().required("Voyage No is required"),
    //   })
    //   .typeError("Voyage No is required"),
    strNameOfVessel: Yup.string().required("Name Of Vessel is required"),
    intVoyageNo: Yup.string().required("Code is required"),
    strCode: Yup.string().required("Voyage No is required"),
    strName: Yup.string().required("Name is required"),
    strEmail: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        strCode: paramCode || "",
        strNameOfVessel: vesselNominationData?.strNameOfVessel || "",
        intVoyageNo: vesselNominationData?.intVoyageNo || "",
      }}
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
          {(loader || loading) && <Loading />}
          <IForm
            title="Create Load Port"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    disabled={!payloadInfo}
                    className="btn btn-primary mr-3"
                    onClick={() => {
                      setIsShowModal(true);
                    }}
                  >
                    Send Mail
                  </button>
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
                <div className="col-lg-2">
                  <InputField
                    value={values.strName || ""}
                    label="Name"
                    name="strName"
                    type="text"
                    onChange={(e) => setFieldValue("strName", e.target.value)}
                    errors={errors}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values.strEmail || ""}
                    label="Email"
                    name="strEmail"
                    type="text"
                    onChange={(e) => setFieldValue("strEmail", e.target.value)}
                    errors={errors}
                  />
                </div>
                {/* Vessel Name */}
                {/* <div className="col-lg-2">
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
                </div> */}
                <div className="col-lg-2">
                  <InputField
                    value={values.strNameOfVessel}
                    label="Name Of Vessel"
                    name="strNameOfVessel"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("strNameOfVessel", e.target.value)
                    }
                    errors={errors}
                    disabled
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values.intVoyageNo}
                    label="Voyage No"
                    name="intVoyageNo"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("intVoyageNo", e.target.value)
                    }
                    errors={errors}
                    disabled
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
                    disabled
                  />
                </div>

                {/* SOF */}
                <div className="col-lg-2 d-flex flex-column">
                  <label>SOF</label>
                  <AttachmentUploaderNew
                    isForPublicRoute={true}
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
                    isForPublicRoute={true}
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
                    isForPublicRoute={true}
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
                    isForPublicRoute={true}
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
                    isForPublicRoute={true}
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
                    isForPublicRoute={true}
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
                    isForPublicRoute={true}
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
                    isForPublicRoute={true}
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
                    isForPublicRoute={true}
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
                    isForPublicRoute={true}
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

                <div className="col-lg-2 d-flex flex-column">
                  <label>Extra Attachments</label>
                  <AttachmentUploaderNew
                    isForPublicRoute={true}
                    isExistAttachment={values?.departureDocuments}
                    fileUploadLimits={5}
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        setAttachment(attachmentData?.[0]?.id);
                        setFieldValue(
                          "departureDocuments",
                          attachmentData?.map((item) => item)
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
                >
                  {/* <MailSender payloadInfo={payloadInfo} /> */}
                  <EmailEditorForPublicRoutes
                    payloadInfo={payloadInfo}
                    cb={() => {
                      setIsShowModal(false);
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
