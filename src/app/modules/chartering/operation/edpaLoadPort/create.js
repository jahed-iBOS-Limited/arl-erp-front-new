import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";

import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { imarineBaseUrl, marineBaseUrlPythonAPI } from "../../../../App";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import AttachmentUploaderNew from "../../../_helper/attachmentUploaderNew";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import MailSender from "../mailSender";
import { generateFileUrl } from "../helper";

const initData = {
  strEmailAddress: "",
  strAttachmentForPort: "",
  strAttachmentForPortDisbursment: "",
  strVesselNominationCode: "",
  numGrandTotalAmount: 0,
};
export default function EDPALoadPortCreate() {
  const {
    profileData: { userId, accountId },
    selectedBusinessUnit: { value: buId, label },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [attachment, setAttachment] = useState("");
  const { paramId, paramCode } = useParams();
  const [isShowModal, setIsShowModal] = useState(false);
  const [payloadInfo, setPayloadInfo] = useState({});

  const [, onSave, loader] = useAxiosPost();

  useEffect(() => {}, []);

  const saveHandler = (values, cb) => {
    setPayloadInfo({
      strAttachmentForPort: generateFileUrl(values?.strAttachmentForPort),
      strAttachmentForPortDisbursment: generateFileUrl(
        values?.strAttachmentForPortDisbursment
      ),
      intVesselNominationId: +paramId || 0,
      strVesselNominationCode:
        paramCode || values?.strVesselNominationCode || "",
      numGrandTotalAmount: values?.numGrandTotalAmount,
    });

    const payload = {
      intEpdaAndPortInfoId: 0,
      intAccountId: accountId,
      intBusinessUnitId: 0,
      strBusinessUnitName: "",
      strEmailAddress: "",
      strAttachmentForPort: values?.strAttachmentForPort,
      strAttachmentForPortDisbursment: values?.strAttachmentForPortDisbursment,
      intVesselNominationId: +paramId || 0,
      strVesselNominationCode:
        paramCode || values?.strVesselNominationCode || "",
      numGrandTotalAmount: values?.numGrandTotalAmount,
      isActive: true,
      dteCreateDate: _todayDate(),
      intCreateBy: userId,
    };

    onSave(
      `${imarineBaseUrl}/domain/VesselNomination/CreateEpdaAndPortInfo`,
      payload,
      cb,
      true
    );
  };

  const validationSchema = Yup.object().shape({
    strVesselNominationCode: Yup.string().required("Code is required"),
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...initData, strVesselNominationCode: paramCode || "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setIsShowModal(true);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loader && <Loading />}
          <IForm
            title={`Create EDPA Load Port Info `}
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
              <div className="form-group  global-form row">
                <div className="col-lg-2">
                  <InputField
                    value={values.strVesselNominationCode}
                    label="Please copy code from email subject"
                    name="strVesselNominationCode"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("strVesselNominationCode", e.target.value)
                    }
                  />
                </div>

                {/* Land Quantity (Decimal) */}
                <div className="col-lg-2">
                  <InputField
                    value={values.numGrandTotalAmount}
                    label="Grand Total"
                    name="numGrandTotalAmount"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("numGrandTotalAmount", e.target.value)
                    }
                  />
                </div>
                <div className="col-lg-2 ">
                  <label htmlFor="">Attachment For Port</label>
                  <div className="">
                    <AttachmentUploaderNew
                      style={{
                        backgroundColor: "transparent",
                        color: "black",
                      }}
                      isExistAttachment={values?.strAttachmentForPort}
                      CBAttachmentRes={(attachmentData) => {
                        if (Array.isArray(attachmentData)) {
                          setAttachment(attachmentData?.[0]?.id);
                          setFieldValue(
                            "strAttachmentForPort",
                            attachmentData?.[0]?.id
                          );
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-2 " style={{ marginLeft: "-20px" }}>
                  <label htmlFor="">Attachment For Port Disbursment</label>
                  <div className="">
                    <AttachmentUploaderNew
                      style={{
                        backgroundColor: "transparent",
                        color: "black",
                      }}
                      isExistAttachment={
                        values?.strAttachmentForPortDisbursment
                      }
                      CBAttachmentRes={(attachmentData) => {
                        if (Array.isArray(attachmentData)) {
                          setAttachment(attachmentData?.[0]?.id);
                          setFieldValue(
                            "strAttachmentForPortDisbursment",
                            attachmentData?.[0]?.id
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <IViewModal
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                  title={"Send Mail"}
                >
                  <MailSender payloadInfo={payloadInfo} />
                </IViewModal>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
