import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { imarineBaseUrl, marineBaseUrlPythonAPI } from "../../../../App";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IViewModal from "../../_chartinghelper/_viewModal";
import MailSender from "../mailSender";
import EmailEditorForPublicRoutes from "../emailEditorForPublicRotes";

const initData = {
  strName: "",
  strEmail: "",
  strVesselNominationCode: "",
  isVesselNominationAccept: true,
  strRemarks: "",
};

const validationSchema = Yup.object().shape({
  strVesselNominationCode: Yup.string().required(
    "Vessel Nomination Code is required"
  ),
  strName: Yup.string().required("Name is required"),
  strEmail: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

export default function VesselNominationAcceptanceCreate() {
  const { profileData } = useSelector((state) => state?.authData, shallowEqual);

  const [objProps, setObjprops] = useState({});
  const [, onSave, loader] = useAxiosPost();
  const { paramId, paramCode } = useParams();
  const [isShowModal, setIsShowModal] = useState(false);
  const [payloadInfo, setPayloadInfo] = useState(null);

  const saveHandler = async (values, cb) => {
    setPayloadInfo({
      // strName: values?.strName,
      // strEmail: values?.strEmail,
      strVesselNominationCode:
        paramCode || values?.strVesselNominationCode || "",
      isVesselNominationAccept: values?.isVesselNominationAccept,
      strRemarks: values?.strRemarks || "",
    });

    const payload = {
      strName: values?.strName,
      strEmail: values?.strEmail,
      intVesselNominationId: +paramId || 0,
      strVesselNominationCode:
        paramCode || values?.strVesselNominationCode || "",
      isVesselNominationAccept: values?.isVesselNominationAccept,
      strRemarks: values?.strRemarks || "",
      intActionBy: profileData?.userId,
    };

    onSave(
      `${imarineBaseUrl}/domain/VesselNomination/CreateVesselNominationAcceptance`,
      payload,
      cb,
      true
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...initData, strVesselNominationCode: paramCode || "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
        setSubmitting(false);
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        errors,
        touched,
      }) => (
        <IForm
          title="Create Vessel Nomination Acceptance"
          getProps={setObjprops}
          isHiddenReset={true}
          isHiddenSave
          isPositionRight
          renderProps={() => {
            return (
              <div>
                <button
                  type="button"
                  disabled={!payloadInfo}
                  className="btn btn-primary ml-3"
                  onClick={() => {
                    setIsShowModal(true);
                  }}
                >
                  Send Mail
                </button>
                <button
                  type="submit"
                  className="btn btn-primary ml-3"
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
          {loader && <Loading />}
          <Form className="form form-label-right">
            <div className="form-group global-form row">
              <div className="col-lg-3">
                <InputField
                  value={values.strName || ""}
                  label="Name"
                  name="strName"
                  type="text"
                  onChange={(e) => setFieldValue("strName", e.target.value)}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.strEmail || ""}
                  label="Email"
                  name="strEmail"
                  type="text"
                  onChange={(e) => setFieldValue("strEmail", e.target.value)}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.strVesselNominationCode || ""}
                  label="Vessel Nomination Code"
                  name="strVesselNominationCode"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("strVesselNominationCode", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.strRemarks || ""}
                  label="Remarks"
                  name="strRemarks"
                  type="text"
                  onChange={(e) => setFieldValue("strRemarks", e.target.value)}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3 mt-5 ml-5">
                <div className="mt-1">
                  <input
                    type="checkbox"
                    id="isVesselNominationAccept"
                    name="isVesselNominationAccept"
                    checked={values.isVesselNominationAccept || false}
                    onChange={(e) =>
                      setFieldValue(
                        "isVesselNominationAccept",
                        e.target.checked
                      )
                    }
                    className="form-check-input"
                  />
                  <label
                    htmlFor="isVesselNominationAccept"
                    className="form-check-label"
                  >
                    Accept Vessel Nomination
                  </label>
                </div>
              </div>
            </div>
            <div>
              <IViewModal
                show={isShowModal}
                onHide={() => setIsShowModal(false)}
                title={"Send Mail"}
              >
                {/* <MailSender payloadInfo={payloadInfo} /> */}
                <EmailEditorForPublicRoutes payloadInfo={payloadInfo} cb={()=>{setIsShowModal(false)}}/>
              </IViewModal>
            </div>
          </Form>
        </IForm>
      )}
    </Formik>
  );
}
