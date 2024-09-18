import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { marineBaseUrlPythonAPI } from "../../../../App";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IViewModal from "../../_chartinghelper/_viewModal";
import MailSender from "../mailSender";

const initData = {
  strVesselNominationCode: "",
  isVesselNominationAccept: true,
  strRemarks: "",
};

const validationSchema = Yup.object().shape({
  strVesselNominationCode: Yup.string().required(
    "Vessel Nomination Code is required"
  ),
});

export default function VesselNominationAcceptanceCreate() {
  const { profileData } = useSelector((state) => state?.authData, shallowEqual);

  const [objProps, setObjprops] = useState({});
  const [, onSave, loader] = useAxiosPost();
  const { paramId, paramCode } = useParams();
  const [isShowModal, setIsShowModal] = useState(false);

  const saveHandler = async (values, cb) => {
    const payload = {
      intVesselNominationId: +paramId || 0,
      strVesselNominationCode:
        paramCode || values?.strVesselNominationCode || "",
      isVesselNominationAccept: values?.isVesselNominationAccept,
      strRemarks: values?.strRemarks || "",
      intActionBy: profileData?.userId,
    };

    onSave(
      `${marineBaseUrlPythonAPI}/domain/VesselNomination/CreateVesselNominationAcceptance`,
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
          setIsShowModal(true);
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
                modelSize={"md"}
              >
                <MailSender
                  payloadInfo={{
                    strVesselNominationCode:
                      paramCode || values?.strVesselNominationCode || "",
                    isVesselNominationAccept: values?.isVesselNominationAccept,
                    strRemarks: values?.strRemarks || "",
                  }}
                />
              </IViewModal>
            </div>
          </Form>
        </IForm>
      )}
    </Formik>
  );
}
