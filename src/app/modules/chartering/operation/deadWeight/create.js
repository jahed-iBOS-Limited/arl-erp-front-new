import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";

import * as Yup from "yup";
import { imarineBaseUrl, marineBaseUrlPythonAPI } from "../../../../App";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { useParams } from "react-router-dom";
import IViewModal from "../../../_helper/_viewModal";
import MailSender from "../mailSender";
import { generateFileUrl } from "../helper";

const initData = {
  strVesselNominationCode: "",
  strDraftType: "",
  intDisplacementDraftMts: "",
  intDockWaterDensity: "",
  intLightShipMts: "",
  intFoFuelOilMts: "",
  intFoDoDiselOilMts: "",
  intFwFreshWaterMts: "",
  intConstantMts: "",
  intUnpumpAbleBallastMts: "",
  intCargoLoadMts: "",
  intFinalCargoToloadMts: "",
  strRemarks: "",
};
export default function DeadWeightCreate() {
  const {
    profileData: { userId, accountId },
    selectedBusinessUnit: { value: buId, label },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [, onSave, loader] = useAxiosPost();
  const { paramId, paramCode } = useParams();
  const [isShowModal, setIsShowModal] = useState(false);
  const [payloadInfo, setPayloadInfo] = useState({});

  useEffect(() => {}, []);

  const saveHandler = (values, cb) => {
    setPayloadInfo({
      strDraftType: values?.strDraftType?.value,
      intDisplacementDraftMts: +values?.intDisplacementDraftMts || 0,
      intDockWaterDensity: +values?.intDockWaterDensity || 0,
      intLightShipMts: +values?.intLightShipMts || 0,
      intFoFuelOilMts: +values?.intFoFuelOilMts || 0,
      intFoDoDiselOilMts: +values?.intFoDoDiselOilMts || 0,
      intFwFreshWaterMts: +values?.intFwFreshWaterMts || 0,
      intConstantMts: +values?.intConstantMts || 0,
      intUnpumpAbleBallastMts: +values?.intUnpumpAbleBallastMts || 0,
      intCargoLoadMts: +values?.intCargoLoadMts || 0,
      intFinalCargoToloadMts: +values?.intFinalCargoToloadMts || 0,
      strRemarks: values?.strRemarks,
      strAttachmentForPort: generateFileUrl(values?.strAttachmentForPort),
      strAttachmentForPortDisbursment: generateFileUrl(
        values?.strAttachmentForPortDisbursment
      ),
      strVesselNominationCode:
        paramCode || values?.strVesselNominationCode || "",
      numGrandTotalAmount: +values?.numGrandTotalAmount,
    });

    const payload = {
      intDeadWeightId: 0,
      strDraftType: values?.strDraftType?.value,
      intDisplacementDraftMts: +values?.intDisplacementDraftMts || 0,
      intDockWaterDensity: +values?.intDockWaterDensity || 0,
      intLightShipMts: +values?.intLightShipMts || 0,
      intFoFuelOilMts: +values?.intFoFuelOilMts || 0,
      intFoDoDiselOilMts: +values?.intFoDoDiselOilMts || 0,
      intFwFreshWaterMts: +values?.intFwFreshWaterMts || 0,
      intConstantMts: +values?.intConstantMts || 0,
      intUnpumpAbleBallastMts: +values?.intUnpumpAbleBallastMts || 0,
      intCargoLoadMts: +values?.intCargoLoadMts || 0,
      intFinalCargoToloadMts: +values?.intFinalCargoToloadMts || 0,
      strRemarks: values?.strRemarks,
      intAccountId: accountId,
      intBusinessUnitId: 0,
      strBusinessUnitName: "",
      strEmailAddress: "",
      strAttachmentForPort: values?.strAttachmentForPort,
      strAttachmentForPortDisbursment: values?.strAttachmentForPortDisbursment,
      intVesselNominationId: +paramId || 0,
      strVesselNominationCode:
        paramCode || values?.strVesselNominationCode || "",
      numGrandTotalAmount: +values?.numGrandTotalAmount,
      isActive: true,
      dteCreateDate: _todayDate(),
      intCreateBy: userId,
    };

    onSave(
      `${imarineBaseUrl}/domain/VesselNomination/CreateDeadWeight`,
      payload,
      cb,
      true
    );
  };

  const validationSchema = Yup.object().shape({
    strVesselNominationCode: Yup.string().required("Code is required"),
    intDisplacementDraftMts: Yup.number()
      .required("Displacement Draft Mts is required")
      .positive("Displacement Draft Mts must be a positive number"),
    intDockWaterDensity: Yup.number()
      .required("Dock Water Density is required")
      .positive("Dock Water Density must be a positive number"),
    intLightShipMts: Yup.number()
      .required("Light Ship Mts is required")
      .positive("Light Ship Mts must be a positive number"),
    intFoFuelOilMts: Yup.number()
      .required("Fuel Oil Mts is required")
      .positive("Fuel Oil Mts must be a positive number"),
    intFoDoDiselOilMts: Yup.number()
      .required("Diesel Oil Mts is required")
      .positive("Diesel Oil Mts must be a positive number"),
    intFwFreshWaterMts: Yup.number()
      .required("Fresh Water Mts is required")
      .positive("Fresh Water Mts must be a positive number"),
    intConstantMts: Yup.number()
      .required("Constant Mts is required")
      .positive("Constant Mts must be a positive number"),
    intUnpumpAbleBallastMts: Yup.number()
      .required("Unpumpable Ballast Mts is required")
      .positive("Unpumpable Ballast Mts must be a positive number"),
    intCargoLoadMts: Yup.number()
      .required("Cargo Load Mts is required")
      .positive("Cargo Load Mts must be a positive number"),
    intFinalCargoToloadMts: Yup.number()
      .required("Final Cargo to Load Mts is required")
      .positive("Final Cargo to Load Mts must be a positive number"),
    strRemarks: Yup.string().optional(),
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
            title={`Create Dead Weight `}
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
                    label="Code"
                    name="strVesselNominationCode"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("strVesselNominationCode", e.target.value)
                    }
                    errors={errors}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="strDraftType"
                    options={[
                      { value: "Winter", label: "Winter" },
                      { value: "Tropical", label: "Tropical" },
                      { value: "Seasonal", label: "Seasonal" },
                    ]}
                    value={values?.strDraftType}
                    label="Draft Type"
                    onChange={(valueOption) => {
                      setFieldValue("strDraftType", valueOption || "");
                    }}
                    errors={errors}
                  />
                </div>

                <div className="col-lg-2">
                  <InputField
                    value={values.intDisplacementDraftMts}
                    label="Displacement Draft Mts"
                    name="intDisplacementDraftMts"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("intDisplacementDraftMts", e.target.value)
                    }
                    errors={errors}
                  />
                </div>

                <div className="col-lg-2">
                  <InputField
                    value={values.intLightShipMts}
                    label="Light Ship Mts"
                    name="intLightShipMts"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("intLightShipMts", e.target.value)
                    }
                    errors={errors}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values.intFoFuelOilMts}
                    label="Fuel Oil Mts"
                    name="intFoFuelOilMts"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("intFoFuelOilMts", e.target.value)
                    }
                    errors={errors}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values.intFoDoDiselOilMts}
                    label="Disel Oil Mts"
                    name="intFoDoDiselOilMts"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("intFoDoDiselOilMts", e.target.value)
                    }
                    errors={errors}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values.intFwFreshWaterMts}
                    label="Fresh Water Mts"
                    name="intFwFreshWaterMts"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("intFwFreshWaterMts", e.target.value)
                    }
                    errors={errors}
                  />
                </div>

                <div className="col-lg-2">
                  <InputField
                    value={values.intDockWaterDensity}
                    label="Dock Water Density"
                    name="intDockWaterDensity"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("intDockWaterDensity", e.target.value)
                    }
                    errors={errors}
                  />
                </div>

                <div className="col-lg-2">
                  <InputField
                    value={values.intConstantMts}
                    label="Constant Mts"
                    name="intConstantMts"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("intConstantMts", e.target.value)
                    }
                    errors={errors}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values.intUnpumpAbleBallastMts}
                    label="UnpumpAble Ballast Mts"
                    name="intUnpumpAbleBallastMts"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("intUnpumpAbleBallastMts", e.target.value)
                    }
                    errors={errors}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values.intCargoLoadMts}
                    label="Cargo Load Mts"
                    name="intCargoLoadMts"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("intCargoLoadMts", e.target.value)
                    }
                    errors={errors}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values.intFinalCargoToloadMts}
                    label="Final Cargo Toload Mts"
                    name="intFinalCargoToloadMts"
                    type="number"
                    onChange={(e) =>
                      setFieldValue("intFinalCargoToloadMts", e.target.value)
                    }
                    errors={errors}
                  />
                </div>

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
                  />
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
