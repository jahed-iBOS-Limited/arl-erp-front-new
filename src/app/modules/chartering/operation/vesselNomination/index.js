import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { imarineBaseUrl, marineBaseUrlPythonAPI } from "../../../../App";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import ICustomTable from "../../_chartinghelper/_customTable";
import IViewModal from "../../_chartinghelper/_viewModal";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import VoyageLicenseFlagAttachment from "./voyageFlagLicenseAttachment";
import EmailEditor from "../emailEditor";
import { getEmailInfoandSendMail } from "../helper";
import DiffEmailSender from "../diffEmailSender";
import FormikSelect from "../../_chartinghelper/common/formikSelect";
import customStyles from "../../_chartinghelper/common/selectCustomStyle";
import { getVesselDDL, getVoyageDDLNew } from "../../helper";
import { shallowEqual, useSelector } from "react-redux";

const initData = {
  voyageFlagLicenseAtt: "",
};

const headers = [
  { name: "SL" },
  { name: "Code" },
  { name: "Vessel Name" },
  { name: "Voyage Type" },
  { name: "Voyage No" },
  { name: "Charterer Name" },
  { name: "Broker Name" },
  { name: "Load Port" },
  { name: "Discharge Port" },
  { name: "Cargo Quantity(Mt)" },
  { name: "Freight Per(Mt)" },
  { name: "Bunker Calculator" },
  { name: "Pre Stowage" },
  { name: "Vessel Nomination" },
  { name: "EDPA Loadport" },
  { name: "On Hire Bunker and Conditional Survey(CS)" },
  { name: "Dead Weight Calculation" },
  { name: "Voyage Instruction" },
  { name: "PI & Survey" },
  { name: "Voyage License/Flag Waiver" },
  { name: "TCL" },
  { name: "Weather Routing Company" },
  { name: "Departure Document Loadport" },
  { name: "EPDA Discharge Port" },
  { name: "Off Hire Bunker Survey" },
  { name: "Departure Document Discharge Port" },
];

export default function VesselNomination() {
  const saveHandler = (values, cb) => {};
  const [show, setShow] = useState(false);
  const onHide = () => setShow(false);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [landingData, getLandingData, loader] = useAxiosGet();
  const [, vesselNominationMainSend] = useAxiosPost();
  const [, edpaLoadportMailSend] = useAxiosPost();
  const [, preStowageMailSend] = useAxiosPost();
  const [, onHireBunkerSurveyMailSend] = useAxiosPost();
  const [, voyageInstructionMailSend] = useAxiosPost();
  const [, piSurveyMailSend] = useAxiosPost();
  // const [, voyageLicenseFlagWaiverMailSend] = useAxiosPost();
  const [, tclMailSend] = useAxiosPost();
  const [, weatherRoutingCompanyMailSend] = useAxiosPost();
  const [, departureDocumentLoadPortMailSend] = useAxiosPost();
  const [, epdaDischargePortMailSend] = useAxiosPost();
  const [, offHireBunkerSurveyMailSend] = useAxiosPost();
  const [isShowMailModal, setIsShowMailModal] = useState(false);
  const [isDiffMailSenderModal, setIsDiffMailSenderModal] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [loading, setLoading] = useState(false);

  const [singleRowData, setSingleRowData] = useState({});
  const history = useHistory();

  const getGridData = (values) => {
    const shipTypeSTR = values?.shipType
      ? `shipType=${values?.shipType?.label}`
      : "";
    const voyageTypeSTR = values?.voyageType
      ? `&voyageType=${values?.voyageType?.label}`
      : "";
    const vesselNameSTR = values?.vesselName
      ? `&vesselName=${values?.vesselName?.label}`
      : "";
    const voyageNoSTR = values?.voyageNo
      ? `&voyageNo=${values?.voyageNo?.label}`
      : "";
    getLandingData(
      `${imarineBaseUrl}/domain/VesselNomination/VesselNominationLanding?${shipTypeSTR}${voyageTypeSTR}${vesselNameSTR}${voyageNoSTR}`
    );
  };

  useEffect(() => {
    getGridData();
  }, []);

  // const getButtonVisibility = (data) => {
  //   let visibility = [];

  //   if (data?.isVesselNominationEmailSent) {
  //     visibility.push("edpaLoadportSend");
  //   }
  //   if (data?.isVesselNominationEmailSent && data?.edpaLoadportSend) {
  //     visibility.push("isBunkerCalculationSave");
  //   }
  //   if (
  //     data?.isVesselNominationEmailSent &&
  //     data?.isBunkerCalculationSave &&
  //     data?.edpaLoadportSend
  //   ) {
  //     visibility.push("preStowageSend");
  //   }
  //   if (
  //     data?.isVesselNominationEmailSent &&
  //     data?.isBunkerCalculationSave &&
  //     data?.edpaLoadportSend &&
  //     data?.preStowageSend
  //   ) {
  //     visibility.push("onHireBunkerSurveySent");
  //   }
  //   if (
  //     data?.isVesselNominationEmailSent &&
  //     data?.isBunkerCalculationSave &&
  //     data?.edpaLoadportSend &&
  //     data?.preStowageSend &&
  //     data?.onHireBunkerSurveySent
  //   ) {
  //     visibility.push("isDeadWeightCalculationSave");
  //   }
  //   if (
  //     data?.isVesselNominationEmailSent &&
  //     data?.isBunkerCalculationSave &&
  //     data?.edpaLoadportSend &&
  //     data?.preStowageSend &&
  //     data?.onHireBunkerSurveySent &&
  //     data?.isDeadWeightCalculationSave
  //   ) {
  //     visibility.push("voyageInstructionSent");
  //   }
  //   if (
  //     data?.isVesselNominationEmailSent &&
  //     data?.isBunkerCalculationSave &&
  //     data?.edpaLoadportSend &&
  //     data?.preStowageSend &&
  //     data?.onHireBunkerSurveySent &&
  //     data?.isDeadWeightCalculationSave &&
  //     data?.voyageInstructionSent
  //   ) {
  //     visibility.push("pisurveySent");
  //   }
  //   if (
  //     data?.isVesselNominationEmailSent &&
  //     data?.isBunkerCalculationSave &&
  //     data?.edpaLoadportSend &&
  //     data?.preStowageSend &&
  //     data?.onHireBunkerSurveySent &&
  //     data?.isDeadWeightCalculationSave &&
  //     data?.voyageInstructionSent &&
  //     data?.pisurveySent
  //   ) {
  //     visibility.push("voyageLicenseFlagWaiverSend");
  //   }
  //   if (
  //     data?.isVesselNominationEmailSent &&
  //     data?.isBunkerCalculationSave &&
  //     data?.edpaLoadportSend &&
  //     data?.preStowageSend &&
  //     data?.onHireBunkerSurveySent &&
  //     data?.isDeadWeightCalculationSave &&
  //     data?.voyageInstructionSent &&
  //     data?.pisurveySent &&
  //     data?.voyageLicenseFlagWaiverSend
  //   ) {
  //     visibility.push("tclSend");
  //   }
  //   if (
  //     data?.isVesselNominationEmailSent &&
  //     data?.isBunkerCalculationSave &&
  //     data?.edpaLoadportSend &&
  //     data?.preStowageSend &&
  //     data?.onHireBunkerSurveySent &&
  //     data?.isDeadWeightCalculationSave &&
  //     data?.voyageInstructionSent &&
  //     data?.pisurveySent &&
  //     data?.voyageLicenseFlagWaiverSend &&
  //     data?.tclSend
  //   ) {
  //     visibility.push("weatherRoutingCompanySend");
  //   }
  //   if (
  //     data?.isVesselNominationEmailSent &&
  //     data?.isBunkerCalculationSave &&
  //     data?.edpaLoadportSend &&
  //     data?.preStowageSend &&
  //     data?.onHireBunkerSurveySent &&
  //     data?.isDeadWeightCalculationSave &&
  //     data?.voyageInstructionSent &&
  //     data?.pisurveySent &&
  //     data?.voyageLicenseFlagWaiverSend &&
  //     data?.tclSend &&
  //     data?.weatherRoutingCompanySend
  //   ) {
  //     visibility.push("departureDocumentLoadPortSend");
  //   }
  //   if (
  //     data?.isVesselNominationEmailSent &&
  //     data?.isBunkerCalculationSave &&
  //     data?.edpaLoadportSend &&
  //     data?.preStowageSend &&
  //     data?.onHireBunkerSurveySent &&
  //     data?.isDeadWeightCalculationSave &&
  //     data?.voyageInstructionSent &&
  //     data?.pisurveySent &&
  //     data?.voyageLicenseFlagWaiverSend &&
  //     data?.tclSend &&
  //     data?.weatherRoutingCompanySend &&
  //     data?.departureDocumentLoadPortSend
  //   ) {
  //     visibility.push("departureDocumentDischargePortSend");
  //   }
  //   if (
  //     data?.isVesselNominationEmailSent &&
  //     data?.isBunkerCalculationSave &&
  //     data?.edpaLoadportSend &&
  //     data?.preStowageSend &&
  //     data?.onHireBunkerSurveySent &&
  //     data?.isDeadWeightCalculationSave &&
  //     data?.voyageInstructionSent &&
  //     data?.pisurveySent &&
  //     data?.voyageLicenseFlagWaiverSend &&
  //     data?.tclSend &&
  //     data?.weatherRoutingCompanySend &&
  //     data?.departureDocumentLoadPortSend &&
  //     data?.departureDocumentDischargePortSend
  //   ) {
  //     visibility.push("epdadischargePortSent");
  //   }
  //   if (
  //     data?.isVesselNominationEmailSent &&
  //     data?.isBunkerCalculationSave &&
  //     data?.edpaLoadportSend &&
  //     data?.preStowageSend &&
  //     data?.onHireBunkerSurveySent &&
  //     data?.isDeadWeightCalculationSave &&
  //     data?.voyageInstructionSent &&
  //     data?.pisurveySent &&
  //     data?.voyageLicenseFlagWaiverSend &&
  //     data?.tclSend &&
  //     data?.weatherRoutingCompanySend &&
  //     data?.departureDocumentLoadPortSend &&
  //     data?.departureDocumentDischargePortSend &&
  //     data?.epdadischargePortSent
  //   ) {
  //     visibility.push("offHireBunkerSurveySent");
  //   }

  //   return visibility;
  // };

  const getButtonVisibility = (data) => {
    let visibility = [
      "isBunkerCalculationSave",
      "edpaLoadportSend",
      "onHireBunkerSurveySent",
      "isDeadWeightCalculationSave",
      "voyageInstructionSent",
      "pisurveySent",
      "voyageLicenseFlagWaiverSend",
      "tclSend",
      "weatherRoutingCompanySend",
      "departureDocumentLoadPortSend",
      "departureDocumentDischargePortSend",
      "epdadischargePortSent",
      "offHireBunkerSurveySent",
    ];

    // // First block
    // if (data?.isVesselNominationEmailSent) {
    //   visibility.push("isBunkerCalculationSave");
    // }

    // Second block
    if (data?.isBunkerCalculationSave) {
      visibility.push("preStowageSend");
    }

    // Third block - Push all remaining visibility states if previous conditions are met
    // if (
    //   data?.isVesselNominationEmailSent &&
    //   data?.isBunkerCalculationSave &&
    //   data?.preStowageSend
    // ) {
    //   visibility.push(
    //     "edpaLoadportSend",
    //     "onHireBunkerSurveySent",
    //     "isDeadWeightCalculationSave",
    //     "voyageInstructionSent",
    //     "pisurveySent",
    //     "voyageLicenseFlagWaiverSend",
    //     "tclSend",
    //     "weatherRoutingCompanySend",
    //     "departureDocumentLoadPortSend",
    //     "departureDocumentDischargePortSend",
    //     "epdadischargePortSent",
    //     "offHireBunkerSurveySent"
    //   );
    // }

    return visibility;
  };

  const getVoyageDDL = (values) => {
    getVoyageDDLNew({
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      id: values?.vesselName?.value,
      setter: setVoyageNoDDL,
      setLoading: setLoading,
      shipType: 0,
      isComplete: 0,
      voyageTypeId: 0,
    });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
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
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {false && <Loading />}
          <IForm
            title="Vessel Nomination"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <>
                <div className="form-group global-form row mb-5">
                  <div className="col-lg-2">
                    <FormikSelect
                      value={values?.shipType}
                      isSearchable={true}
                      options={[
                        { value: 1, label: "Own Ship" },
                        { value: 2, label: "Charterer Ship" },
                      ]}
                      styles={customStyles}
                      name="shipType"
                      placeholder="Ship Type"
                      label="Ship Type"
                      onChange={(valueOption) => {
                        setFieldValue("shipType", valueOption);
                        setFieldValue("vesselName", "");
                        setFieldValue("voyageNo", "");
                        setVesselDDL([]);
                        if (valueOption) {
                          getVesselDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            setVesselDDL,
                            valueOption?.value === 2 ? 2 : ""
                          );
                        }else{
                          getGridData();
                        }
                      }}
                    />
                  </div>

                  <div className="col-lg-2">
                    <FormikSelect
                      value={values?.voyageType}
                      isSearchable={true}
                      options={[
                        { value: 1, label: "Time Charter" },
                        { value: 2, label: "Voyage Charter" },
                      ]}
                      styles={customStyles}
                      name="voyageType"
                      placeholder="Voyage Type"
                      label="Voyage Type"
                      onChange={(valueOption) => {
                        setFieldValue("vesselName", "");
                        setFieldValue("voyageNo", "");
                        setFieldValue("voyageType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-2">
                    <FormikSelect
                      value={values?.vesselName}
                      isSearchable={true}
                      options={vesselDDL || []}
                      styles={customStyles}
                      name="vesselName"
                      placeholder="Vessel Name"
                      label="Vessel Name"
                      onChange={(valueOption) => {
                        setFieldValue("vesselName", valueOption);
                        setFieldValue("voyageNo", "");
                        if (valueOption) {
                          getVoyageDDL({ ...values, vesselName: valueOption });
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <FormikSelect
                      value={values?.voyageNo || ""}
                      isSearchable={true}
                      options={voyageNoDDL || []}
                      styles={customStyles}
                      name="voyageNo"
                      placeholder="Voyage No"
                      label="Voyage No"
                      onChange={(valueOption) => {
                        setFieldValue("voyageNo", valueOption);
                      }}
                      isDisabled={!values?.vesselName}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      disabled={!values?.shipType}
                      onClick={() => {
                        getGridData(values);
                      }}
                      style={{ marginTop: "18px" }}
                      className="btn btn-primary"
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="mt-5">
                  {landingData?.length > 0 && (
                    <ICustomTable ths={headers} scrollable={true}>
                      {landingData?.map((item, index) => {
                        const visibleButtons = getButtonVisibility(item);
                        return (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td>{item?.strCode}</td>
                            <td>{item?.strNameOfVessel}</td>
                            <td>{item?.strVoyageType}</td>
                            <td className="text-center">{item?.intVoyageNo}</td>
                            <td>{item?.strChartererName}</td>
                            <td>{item?.strBrokerName}</td>
                            <td>{item?.strNameOfLoadPort}</td>
                            <td>{item?.strDischargePort}</td>
                            <td className="text-center">
                              {item?.intCargoQuantityMts}
                            </td>
                            <td className="text-right">
                              {item?.numFreightPerMt}
                            </td>

                            <td className="text-center">
                              {visibleButtons.includes(
                                "isBunkerCalculationSave"
                              ) && (
                                <button
                                  className={
                                    item.isBunkerCalculationSave
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  type="button"
                                  onClick={() => {
                                    // if (!item?.edpaLoadportSend) {
                                    //   return toast.warn(
                                    //     "Please Send EDPA Loadport Email First"
                                    //   );
                                    // }
                                    history.push(
                                      "/chartering/operation/bunkerManagement/create",
                                      {
                                        landingData: item,
                                      }
                                    );
                                  }}
                                  disabled={item?.isBunkerCalculationSave}
                                >
                                  Bunker Calculator
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes("preStowageSend") && (
                                <button
                                  className={
                                    item.preStowageSend
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  type="button"
                                  onClick={() => {
                                    // if (item.preStowageSend)
                                    //   return toast.warn(
                                    //     "Pre Stowage Email Already Sent"
                                    //   );
                                    setSingleRowData({
                                      ...item,
                                      columnName: "PRE STOWAGE",
                                    });
                                    setIsShowMailModal(true);
                                    // preStowageMailSend(
                                    //   `${marineBaseUrlPythonAPI}/automation/pre_stowage_plan_mail_sender`,
                                    //   { intId: item?.intId },
                                    //   () => {
                                    //     getGridData();
                                    //   },
                                    //   true
                                    // );
                                  }}
                                  disabled={item.preStowageSend}
                                >
                                  PRE STOWAGE SEND
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              <button
                                className={
                                  item.isVesselNominationEmailSent
                                    ? "btn btn-sm btn-success px-1 py-1"
                                    : "btn btn-sm btn-warning px-1 py-1"
                                }
                                type="button"
                                // onClick={() => {
                                //   if(item.isVesselNominationEmailSent) return toast.warn("Vessel Nomination Email Already Sent");

                                //   vesselNominationMainSend(`${marineBaseUrlPythonAPI}/automation/nomination_vessel_email_sender_with_id`, {intId: item?.intId},
                                //   () => {
                                //     getGridData();
                                //   },
                                //   true
                                //   )
                                // }}
                                onClick={() => {
                                  // if (item.isVesselNominationEmailSent)
                                  //   return toast.warn(
                                  //     "Vessel Nomination Email Already Sent"
                                  //   );
                                  setSingleRowData({
                                    ...item,
                                    columnName: "VESSEL NOMINATION",
                                  });
                                  setIsShowMailModal(true);
                                }}
                                disabled={item.isVesselNominationEmailSent}
                              >
                                VESSEL NOMINATION SEND
                              </button>
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes("edpaLoadportSend") && (
                                <button
                                  className={
                                    item.edpaLoadportSend
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  type="button"
                                  onClick={() => {
                                    // if (item.edpaLoadportSend)
                                    //   return toast.warn(
                                    //     "EDPA Loadport Email Already Sent"
                                    //   );
                                    setSingleRowData({
                                      ...item,
                                      columnName: "EDPA LOADPORT",
                                    });
                                    // setIsShowMailModal(true);
                                    setIsDiffMailSenderModal(true);
                                  }}
                                  disabled={item.edpaLoadportSend}
                                >
                                  EDPA LOADPORT SEND
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes(
                                "onHireBunkerSurveySent"
                              ) && (
                                <button
                                  className={
                                    item.onHireBunkerSurveySent
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.onHireBunkerSurveySent)
                                      return toast.warn(
                                        "On Hire Bunker Survey Email Already Sent"
                                      );
                                    // onHireBunkerSurveyMailSend(
                                    //   `${marineBaseUrlPythonAPI}/automation/bunker_on_hire_condition_surveyor`,
                                    //   { intId: item?.intId },
                                    //   () => {
                                    //     getGridData();
                                    //   },
                                    //   true
                                    // );
                                    setSingleRowData({
                                      ...item,
                                      columnName: "ON HIRE BUNKER SURVEY",
                                    });
                                    setIsShowMailModal(true);
                                  }}
                                  disabled={item.onHireBunkerSurveySent}
                                >
                                  ON HIRE BUNKER SURVEY SENT
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes(
                                "isDeadWeightCalculationSave"
                              ) && (
                                <button
                                  className={
                                    item.isDeadWeightCalculationSave
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (!item?.onHireBunkerSurveySent) {
                                      return toast.warn(
                                        "Please Send On Hire Bunker Survey Email First"
                                      );
                                    }
                                    history.push(
                                      `/chartering/operation/pre-stowagePlanning/create/${item?.intId}/${item?.strCode}`,
                                      {
                                        landingData: item,
                                      }
                                    );
                                  }}
                                  disabled={item?.isDeadWeightCalculationSave}
                                >
                                  DEAD WEIGHT CALCULATION
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes(
                                "voyageInstructionSent"
                              ) && (
                                <button
                                  className={
                                    item.voyageInstructionSent
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  type="button"
                                  onClick={() => {
                                    // if (item.voyageInstructionSent)
                                    //   return toast.warn(
                                    //     "Voyage Instruction Email Already Sent"
                                    //   );
                                    // voyageInstructionMailSend(
                                    //   `${marineBaseUrlPythonAPI}/automation/voyage_instruction_email_sender`,
                                    //   { intId: item?.intId },
                                    //   () => {
                                    //     getGridData();
                                    //   },
                                    //   true
                                    // );
                                    setSingleRowData({
                                      ...item,
                                      columnName: "VOYAGE INSTRUCTION",
                                    });
                                    setIsShowMailModal(true);
                                  }}
                                  disabled={item.voyageInstructionSent}
                                >
                                  VOYAGE INSTRUCTION SENT
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes("pisurveySent") && (
                                <button
                                  className={
                                    item.pisurveySent
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  type="button"
                                  onClick={() => {
                                    // if (item.pisurveySent)
                                    //   return toast.warn(
                                    //     "PI Survey Email Already Sent"
                                    //   );
                                    // piSurveyMailSend(
                                    //   `${marineBaseUrlPythonAPI}/automation/P_n_I_surveyor_email_sender`,
                                    //   { intId: item?.intId },
                                    //   () => {
                                    //     getGridData();
                                    //   },
                                    //   true
                                    // );
                                    setSingleRowData({
                                      ...item,
                                      columnName: "PI SURVEY",
                                    });
                                    setIsShowMailModal(true);
                                  }}
                                  disabled={item.pisurveySent}
                                >
                                  PI SURVEY SENT
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes(
                                "voyageLicenseFlagWaiverSend"
                              ) && (
                                <button
                                  className={
                                    item.voyageLicenseFlagWaiverSend
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  type="button"
                                  onClick={() => {
                                    // if (item.voyageLicenseFlagWaiverSend) {
                                    //   return toast.warn("Voyage License/Flag Waiver Email Already Sent");
                                    // }
                                    setSingleRowData({
                                      ...item,
                                      columnName: "VOYAGE LICENSE/FLAG WAIVER",
                                    });
                                    // setIsShowMailModal(true);
                                    setShow(true);
                                    // setVoyageLicenseFlagShow(true);
                                    //   console.log("VOYAGE LICENSE/FLAG WAIVER SEND");
                                    //   if(item.voyageLicenseFlagWaiverSend) return toast.warn("Voyage License/Flag Waiver Email Already Sent");
                                    //   voyageLicenseFlagWaiverMailSend(`${marineBaseUrlPythonAPI}/automation/voyage_license_flag_waiver_email_sender`, {intId: item?.intId},
                                    //   () => {
                                    //     getGridData();
                                    //   },
                                    //   true
                                    // )
                                  }}
                                  disabled={item.voyageLicenseFlagWaiverSend}
                                >
                                  VOYAGE LICENSE/FLAG WAIVER SEND
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes("tclSend") && (
                                <button
                                  className={
                                    item.tclSend
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.tclSend)
                                      return toast.warn(
                                        "TCL Email Already Sent"
                                      );
                                    // tclMailSend(
                                    //   `${marineBaseUrlPythonAPI}/automation/TCL_coverage_email_sender`,
                                    //   { intId: item?.intId },
                                    //   () => {
                                    //     getGridData();
                                    //   },
                                    //   true
                                    // );
                                    setSingleRowData({
                                      ...item,
                                      columnName: "TCL",
                                    });
                                    setIsShowMailModal(true);
                                  }}
                                  disabled={item.tclSend}
                                >
                                  TCL SEND
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes(
                                "weatherRoutingCompanySend"
                              ) && (
                                <button
                                  className={
                                    item.weatherRoutingCompanySend
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.weatherRoutingCompanySend)
                                      return toast.warn(
                                        "Weather Routing Company Email Already Sent"
                                      );
                                    // weatherRoutingCompanyMailSend(
                                    //   `${marineBaseUrlPythonAPI}/automation/weather_routing_email_sender`,
                                    //   { intId: item?.intId },
                                    //   () => {
                                    //     getGridData();
                                    //   },
                                    //   true
                                    // );
                                    setSingleRowData({
                                      ...item,
                                      columnName: "WEATHER ROUTING COMPANY",
                                    });
                                    // setIsShowMailModal(true);
                                    setIsDiffMailSenderModal(true);
                                  }}
                                  disabled={item.weatherRoutingCompanySend}
                                >
                                  WEATHER ROUTING COMPANY SEND
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes(
                                "departureDocumentLoadPortSend"
                              ) && (
                                <button
                                  className={
                                    item.departureDocumentLoadPortSend
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.departureDocumentLoadPortSend)
                                      return toast.warn(
                                        "Departure Document Loadport Email Already Sent"
                                      );
                                    // departureDocumentLoadPortMailSend(
                                    //   `${marineBaseUrlPythonAPI}/automation/departure_document_email_sender`,
                                    //   { intId: item?.intId },
                                    //   () => {
                                    //     getGridData();
                                    //   },
                                    //   true
                                    // );
                                    setSingleRowData({
                                      ...item,
                                      columnName: "DEPARTURE DOCUMENT LOADPORT",
                                    });
                                    setIsShowMailModal(true);
                                  }}
                                  disabled={item.departureDocumentLoadPortSend}
                                >
                                  DEPARTURE DOCUMENT LOADPORT SEND
                                </button>
                              )}
                            </td>
                      
                            <td className="text-center">
                              {visibleButtons.includes(
                                "epdadischargePortSent"
                              ) && (
                                <button
                                  className={
                                    item.epdadischargePortSent
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.epdadischargePortSent)
                                      return toast.warn(
                                        "EPDA Discharge Port Email Already Sent"
                                      );
                                    // epdaDischargePortMailSend(
                                    //   `${marineBaseUrlPythonAPI}/automation/epda_discharge_port_mail`,
                                    //   { intId: item?.intId },
                                    //   () => {
                                    //     getGridData();
                                    //   },
                                    //   true
                                    // );
                                    setSingleRowData({
                                      ...item,
                                      columnName: "EPDA DISCHARGE PORT",
                                    });
                                    setIsDiffMailSenderModal(true);
                                  }}
                                  disabled={item.epdadischargePortSent}
                                >
                                  EPDA DISCHARGE PORT SENT
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes(
                                "offHireBunkerSurveySent"
                              ) && (
                                <button
                                  className={
                                    item.offHireBunkerSurveySent
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.offHireBunkerSurveySent)
                                      return toast.warn(
                                        "Offhire Bunker Survey Email Already Sent"
                                      );
                                    // offHireBunkerSurveyMailSend(
                                    //   `${marineBaseUrlPythonAPI}/automation/bunker_off_hire_condition_surveyor`,
                                    //   { intId: item?.intId },
                                    //   () => {
                                    //     getGridData();
                                    //   },
                                    //   true
                                    // );
                                    setSingleRowData({
                                      ...item,
                                      columnName: "OFFHIRE BUNKER SURVEY",
                                    });
                                    setIsShowMailModal(true);
                                  }}
                                  disabled={item.offHireBunkerSurveySent}
                                >
                                  OFFHIRE BUNKER SURVEY SENT
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              {visibleButtons.includes(
                                "departureDocumentDischargePortSend"
                              ) && (
                                <button
                                  className={
                                    item.departureDocumentDischargePortSend
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  type="button"
                                  onClick={() => {
                                    if (item.departureDocumentDischargePortSend)
                                      return toast.warn(
                                        "Departure Document Discharge Port Email Already Sent"
                                      );
                                    // departureDocumentLoadPortMailSend(
                                    //   `${marineBaseUrlPythonAPI}/automation/departure_document_email_sender`,
                                    //   { intId: item?.intId },
                                    //   () => {
                                    //     getGridData();
                                    //   },
                                    //   true
                                    // );
                                    setSingleRowData({
                                      ...item,
                                      columnName:
                                        "DEPARTURE DOCUMENT DISCHARGE PORT",
                                    });
                                    setIsShowMailModal(true);
                                  }}
                                  disabled={
                                    item.departureDocumentDischargePortSend
                                  }
                                >
                                  DEPARTURE DOCUMENT DISCHARGE PORT SEND
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </ICustomTable>
                  )}
                </div>
              </>
            </Form>
          </IForm>
          <IViewModal show={show} onHide={onHide}>
            <VoyageLicenseFlagAttachment
              values={values}
              setFieldValue={setFieldValue}
              item={singleRowData}
              getGridData={getGridData}
              setShow={setShow}
              setIsShowMailModal={setIsShowMailModal}
            />
          </IViewModal>
          <IViewModal
            show={isShowMailModal}
            onHide={() => {
              setIsShowMailModal(false);
            }}
          >
            <EmailEditor
              emailEditorProps={{
                intId: singleRowData?.intId,
                singleRowData: singleRowData,
                // emailInfoUrl: "/automation/vessel_nomitaion_mail_format",
                // sendEmailUrl: "/automation/vessel_nomitaion_mail_sent",
                cb: () => {
                  getGridData();
                  setIsShowMailModal(false);
                },
              }}
            />
          </IViewModal>
          <IViewModal
            show={isDiffMailSenderModal}
            onHide={() => {
              setIsDiffMailSenderModal(false);
            }}
          >
            <DiffEmailSender
              emailEditorProps={{
                intId: singleRowData?.intId,
                singleRowData: singleRowData,
                cb: () => {
                  getGridData();
                  setIsDiffMailSenderModal(false);
                },
              }}
            />
          </IViewModal>
        </>
      )}
    </Formik>
  );
}
