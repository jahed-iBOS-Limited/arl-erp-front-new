import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { imarineBaseUrl } from "../../../../App";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import ICustomTable from "../../_chartinghelper/_customTable";
import IViewModal from "../../_chartinghelper/_viewModal";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import ViewVesselNomination from "./viewVesselNomination";
import { toast } from "react-toastify";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const dummydata = {data:[
    {
      strAcceptReject: "1",
      strRemarks: "All good",
      intId: 22,
      strCode: "1",
      dteScheduleToSend: "2021-06-01T00:00:00",
      intVesselId: null,
      strNameOfVessel: null,
      intVoyageTypeId: 1,
      strVoyageType: "Voyage Chartered",
      intVoyageNo: 2,
      dteVoyageCommenced: "2021-06-01T00:00:00",
      dteVoyageCompletion: "2021-06-01T00:00:00",
      intVoyageDurationDays: 3,
      intChartererId: 3,
      strChartererName: "ASLL",
      intBrokerId: 23,
      strBrokerName: "Ocean Broker",
      strBrokerEmail: "tanvir@ibos.io",
      dteCpdate: "2021-06-01T00:00:00",
      strAccountName: "Akij Cement Company Ltd",
      intCargoId: 12,
      strCargo: "crud",
      intCargoQuantityMts: 34,
      numFreightPerMt: 543,
      strNameOfLoadPort: "Chittagong",
      strLaycan: "2021-06-01 00:00:00.000",
      intLoadRate: 343,
      numDemurrageDispatch: 34,
      dteEtaloadPort: "2021-06-01T00:00:00",
      strDischargePort: "Chittagong",
      intDischargeRate: 23,
      numFreight: 545,
      numLoadPortDa: 45,
      numDischargePortDa: 45,
      numBallast: 45,
      numSteaming: 45,
      numAdditionalDistance: 45,
      numBallastSpeed: 54,
      numLadenSpeed: 54,
      intExtraDays: 54,
      strShipperEmailForVesselNomination: "tanvir@ibos.io",
      strBunkerAgent: "Arpan",
      strExpendituresForPisurvey: "Survey",
      strPlaceOfDelivery: "Krabi",
      strDischargePortAgentEmail: "tanvir@ibos.io",
      isVesselNominationEmailSent: true
    },
    {
      strAcceptReject: "0",
      strRemarks: "Pending approval",
      intId: 23,
      strCode: "2",
      dteScheduleToSend: "2021-07-01T00:00:00",
      intVesselId: 101,
      strNameOfVessel: "MV Oceanic",
      intVoyageTypeId: 2,
      strVoyageType: "Time Chartered",
      intVoyageNo: 5,
      dteVoyageCommenced: "2021-07-01T00:00:00",
      dteVoyageCompletion: "2021-07-05T00:00:00",
      intVoyageDurationDays: 5,
      intChartererId: 5,
      strChartererName: "XYZ Shipping",
      intBrokerId: 45,
      strBrokerName: "Global Broker",
      strBrokerEmail: "broker@xyz.com",
      dteCpdate: "2021-07-01T00:00:00",
      strAccountName: "AB Group",
      intCargoId: 15,
      strCargo: "steel",
      intCargoQuantityMts: 50,
      numFreightPerMt: 600,
      strNameOfLoadPort: "Singapore",
      strLaycan: "2021-07-01 00:00:00.000",
      intLoadRate: 300,
      numDemurrageDispatch: 40,
      dteEtaloadPort: "2021-07-01T00:00:00",
      strDischargePort: "Shanghai",
      intDischargeRate: 25,
      numFreight: 600,
      numLoadPortDa: 50,
      numDischargePortDa: 50,
      numBallast: 50,
      numSteaming: 50,
      numAdditionalDistance: 50,
      numBallastSpeed: 60,
      numLadenSpeed: 60,
      intExtraDays: 60,
      strShipperEmailForVesselNomination: "shipper@xyz.com",
      strBunkerAgent: "Bunker Ltd",
      strExpendituresForPisurvey: "Inspection",
      strPlaceOfDelivery: "Shanghai",
      strDischargePortAgentEmail: "agent@xyz.com",
      isVesselNominationEmailSent: false
    }
  ]}
  

const initData = {};

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
    { name: "Vessel Nomination" },
    { name: "EDPA Loadport" },
    { name: "Pre Stowage" },
    { name: "On Hire Bunker and Conditional Survey(CS)" },
    { name: "Voyage Instruction" },
    { name: "PI & Survey" },
    { name: "Voyage License/Flag Waiver" },
    { name: "TCL" },
    { name: "Weather Routing Company" },
    { name: "Departure Document Loadport" },
    { name: "EPDA Discharge Port" },
    { name: "Offhire Bunker Condition(CS)" }
  ];
  

 export default function VesselNomination() {
  const saveHandler = (values, cb) => {};
  const [show, setShow] = useState(false);
  const onHide = () => setShow(false);
  const [landingData, getLandingData, loading, ] = useAxiosGet()
  const [, vesselNominationMainSend] = useAxiosPost();
  const [, edpaLoadportMailSend] = useAxiosPost();
  const [, preStowageMailSend] = useAxiosPost();
  const [, onHireBunkerSurveyMailSend] = useAxiosPost();
  const [, voyageInstructionMailSend] = useAxiosPost();
  const [, piSurveyMailSend] = useAxiosPost();
  const [, voyageLicenseFlagWaiverMailSend] = useAxiosPost();
  const [, tclMailSend] = useAxiosPost();
  const [, weatherRoutingCompanyMailSend] = useAxiosPost();
  const [, departureDocumentLoadPortMailSend] = useAxiosPost();
  const [, epdaDischargePortMailSend] = useAxiosPost();
  const [, offHireBunkerSurveyMailSend] = useAxiosPost();


  const getGridData = () => {
    getLandingData(
      `${imarineBaseUrl}/domain/VesselNomination/VesselNominationLanding`
    );
  };

 useEffect(()=> {
    getGridData();
 },[])

 
 const getButtonVisibility = (data) => {
  let visibility = [];

  if (data?.isVesselNominationEmailSent) {
    visibility.push("edpaLoadportSend");
  }
  if (data?.isVesselNominationEmailSent && data?.edpaLoadportSend) {
    visibility.push("preStowageSend");
  }
  if (data?.isVesselNominationEmailSent && data?.edpaLoadportSend && data?.preStowageSend) {
    visibility.push("onHireBunkerSurveySent");
  }
  if (data?.isVesselNominationEmailSent && data?.edpaLoadportSend && data?.preStowageSend && data?.onHireBunkerSurveySent) {
    visibility.push("voyageInstructionSent");
  }
  if (data?.isVesselNominationEmailSent && data?.edpaLoadportSend && data?.preStowageSend && data?.onHireBunkerSurveySent && data?.voyageInstructionSent) {
    visibility.push("pisurveySent");
  }
  if (data?.isVesselNominationEmailSent && data?.edpaLoadportSend && data?.preStowageSend && data?.onHireBunkerSurveySent && data?.voyageInstructionSent && data?.pisurveySent) {
    visibility.push("voyageLicenseFlagWaiverSend");
  }
  if (data?.isVesselNominationEmailSent && data?.edpaLoadportSend && data?.preStowageSend && data?.onHireBunkerSurveySent && data?.voyageInstructionSent && data?.pisurveySent && data?.voyageLicenseFlagWaiverSend) {
    visibility.push("tclSend");
  }
  if (data?.isVesselNominationEmailSent && data?.edpaLoadportSend && data?.preStowageSend && data?.onHireBunkerSurveySent && data?.voyageInstructionSent && data?.pisurveySent && data?.voyageLicenseFlagWaiverSend && data?.tclSend) {
    visibility.push("weatherRoutingCompanySend");
  }
  if (data?.isVesselNominationEmailSent && data?.edpaLoadportSend && data?.preStowageSend && data?.onHireBunkerSurveySent && data?.voyageInstructionSent && data?.pisurveySent && data?.voyageLicenseFlagWaiverSend && data?.tclSend && data?.weatherRoutingCompanySend) {
    visibility.push("departureDocumentLoadPortSend");
  }
  if (data?.isVesselNominationEmailSent && data?.edpaLoadportSend && data?.preStowageSend && data?.onHireBunkerSurveySent && data?.voyageInstructionSent && data?.pisurveySent && data?.voyageLicenseFlagWaiverSend && data?.tclSend && data?.weatherRoutingCompanySend && data?.departureDocumentLoadPortSend) {
    visibility.push("epdadischargePortSent");
  }
  if (data?.isVesselNominationEmailSent && data?.edpaLoadportSend && data?.preStowageSend && data?.onHireBunkerSurveySent && data?.voyageInstructionSent && data?.pisurveySent && data?.voyageLicenseFlagWaiverSend && data?.tclSend && data?.weatherRoutingCompanySend && data?.departureDocumentLoadPortSend && data?.epdadischargePortSent) {
    visibility.push("offHireBunkerSurveySent");
  }

  return visibility;
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
            {landingData?.length > 0 && (
                <ICustomTable ths={headers}scrollable={true}>
                  {landingData?.map((item, index) => {
                    const visibleButtons = getButtonVisibility(item);
                    console.log("visibleButtons", visibleButtons)
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
                      <td className="text-center">{item?.intCargoQuantityMts}</td>
                      <td className="text-right">{item?.numFreightPerMt}</td>
                      <td className="text-center">
                        <button
                          className={item.isVesselNominationEmailSent ? "btn btn-sm btn-success px-1 py-1" : "btn btn-sm btn-primary px-1 py-1"}
                          type="button"
                          onClick={() => {
                            if(item.isVesselNominationEmailSent) return toast.warn("Vessel Nomination Email Already Sent");
                            console.log("VESSEL NOMINATION SEND");
                            vesselNominationMainSend(`${imarineBaseUrl}/automation/nomination_vessel_email_sender_with_id`, {intId: item?.intId},
                            () => {
                              getGridData();
                            },
                            true
                            )
                          }}
                          disabled={item.isVesselNominationEmailSent}
                        >
                          VESSEL NOMINATION SEND
                        </button>
                      </td>
                      <td className="text-center">
                        {visibleButtons.includes("edpaLoadportSend") && (
                          <button
                            className="btn btn-sm btn-primary px-1 py-1"
                            type="button"
                            onClick={() => {
                              console.log("EDPA LOADPORT SEND");
                              if(item.edpaLoadportSend) return toast.warn("EDPA Loadport Email Already Sent");
                              edpaLoadportMailSend(`${imarineBaseUrl}/automation/epda_load_port_mail`, {intId: item?.intId},
                              () => {
                                getGridData();
                              },
                              true
                            )
                            }}
                            disabled={item.edpaLoadportSend}
                          >
                            EDPA LOADPORT SEND
                          </button>
                        )}
                      </td>
                      <td className="text-center">
                        {visibleButtons.includes("preStowageSend") && (
                          <button
                            className="btn btn-sm btn-primary px-1 py-1"
                            type="button"
                            onClick={() => {
                              console.log("PRE STOWAGE SEND");
                              if(item.preStowageSend) return toast.warn("Pre Stowage Email Already Sent");
                              preStowageMailSend(`${imarineBaseUrl}​/automation​/pre_stowage_plan_mail_sender`, {intId: item?.intId},
                              () => {
                                getGridData();
                              },
                              true
                            )
                            }}
                          >
                            PRE STOWAGE SEND
                          </button>
                        )}
                      </td>
                      <td className="text-center">
                        {visibleButtons.includes("onHireBunkerSurveySent") && (
                          <button
                            className="btn btn-sm btn-primary px-1 py-1"
                            type="button"
                            onClick={() => {
                              console.log("ON HIRE BUNKER SURVEY SENT");
                              if(item.onHireBunkerSurveySent) return toast.warn("On Hire Bunker Survey Email Already Sent");
                              onHireBunkerSurveyMailSend(`${imarineBaseUrl}/automation/bunker_on_hire_condition_surveyor`, {intId: item?.intId},
                              () => {
                                getGridData();
                              },
                              true
                            )
                            }}
                          >
                            ON HIRE BUNKER SURVEY SENT
                          </button>
                        )}
                      </td>
                      <td className="text-center">
                        {visibleButtons.includes("voyageInstructionSent") && (
                          <button
                            className="btn btn-sm btn-primary px-1 py-1"
                            type="button"
                            onClick={() =>{
                              console.log("VOYAGE INSTRUCTION SENT");
                              if(item.voyageInstructionSent) return toast.warn("Voyage Instruction Email Already Sent");
                              voyageInstructionMailSend(`${imarineBaseUrl}/automation/voyage_instruction_email_sender`, {intId: item?.intId},
                              () => {
                                getGridData();
                              },
                              true
                            )
                            }}
                          >
                            VOYAGE INSTRUCTION SENT
                          </button>
                        )}
                      </td>
                      <td className="text-center">
                        {visibleButtons.includes("pisurveySent") && (
                          <button
                            className="btn btn-sm btn-primary px-1 py-1"
                            type="button"
                            onClick={() => {
                              console.log("PI SURVEY SENT");
                              if(item.pisurveySent) return toast.warn("PI Survey Email Already Sent");
                              piSurveyMailSend(`${imarineBaseUrl}/automation/P_n_I_surveyor_email_sender`, {intId: item?.intId},
                              () => {
                                getGridData();
                              },
                              true
                            )
                            }}
                          >
                            PI SURVEY SENT
                          </button>
                        )}
                      </td>
                      <td className="text-center">
                        {visibleButtons.includes("voyageLicenseFlagWaiverSend") && (
                          <button
                            className="btn btn-sm btn-primary px-1 py-1"
                            type="button"
                            onClick={() =>{
                              console.log("VOYAGE LICENSE/FLAG WAIVER SEND");
                              if(item.voyageLicenseFlagWaiverSend) return toast.warn("Voyage License/Flag Waiver Email Already Sent");
                              voyageLicenseFlagWaiverMailSend(`${imarineBaseUrl}/automation/voyage_license_flag_waiver_email_sender`, {intId: item?.intId},
                              () => {
                                getGridData();
                              },
                              true
                            )
                            }}
                          >
                            VOYAGE LICENSE/FLAG WAIVER SEND
                          </button>
                        )}
                      </td>
                      <td className="text-center">
                        {visibleButtons.includes("tclSend") && (
                          <button
                            className="btn btn-sm btn-primary px-1 py-1"
                            type="button"
                            onClick={() =>{
                              console.log("TCL SEND");
                              if(item.tclSend) return toast.warn("TCL Email Already Sent");
                              tclMailSend(`${imarineBaseUrl}/automation/TCL_coverage_email_sender`, {intId: item?.intId},
                              () => {
                                getGridData();
                              },
                              true
                            )
                            }}
                          >
                            TCL SEND
                          </button>
                        )}
                      </td>
                      <td className="text-center">
                        {visibleButtons.includes("weatherRoutingCompanySend") && (
                          <button
                            className="btn btn-sm btn-primary px-1 py-1"
                            type="button"
                            onClick={() => {
                              console.log("WEATHER ROUTING COMPANY SEND");
                              if(item.weatherRoutingCompanySend) return toast.warn("Weather Routing Company Email Already Sent");
                              weatherRoutingCompanyMailSend(`${imarineBaseUrl}/automation/weather_routing_email_sender`, {intId: item?.intId},
                              () => {
                                getGridData();
                              },
                              true
                            )
                            }}
                          >
                            WEATHER ROUTING COMPANY SEND
                          </button>
                        )}
                      </td>
                      <td className="text-center">
                        {visibleButtons.includes("departureDocumentLoadPortSend") && (
                          <button
                            className="btn btn-sm btn-primary px-1 py-1"
                            type="button"
                            onClick={() =>{
                              if(item.departureDocumentLoadPortSend) return toast.warn("Departure Document Loadport Email Already Sent");
                              departureDocumentLoadPortMailSend(`${imarineBaseUrl}automation/departure_document_email_sender`, {intId: item?.intId},
                              () => {
                                getGridData();
                              },
                              true
                            )
                            }}
                          >
                            DEPARTURE DOCUMENT LOADPORT SEND
                          </button>
                        )}
                      </td>
                      <td className="text-center">
                        {visibleButtons.includes("epdadischargePortSent") && (
                          <button
                            className="btn btn-sm btn-primary px-1 py-1"
                            type="button"
                            onClick={() =>{
                              console.log("EPDA DISCHARGE PORT SENT");
                              if(item.epdadischargePortSent) return toast.warn("EPDA Discharge Port Email Already Sent");
                              epdaDischargePortMailSend(`${imarineBaseUrl}/automation/epda_discharge_port_mail`, {intId: item?.intId},
                              () => {
                                getGridData();
                              },
                              true
                            )
                            }}
                          >
                            EPDA DISCHARGE PORT SENT
                          </button>
                        )}
                      </td>
                      <td className="text-center">
                        {visibleButtons.includes("offHireBunkerSurveySent") && (
                          <button
                            className="btn btn-sm btn-primary px-1 py-1"
                            type="button"
                            onClick={() =>{
                              console.log("OFFHIRE BUNKER CONDITION (CS) SEND");
                              if(item.offHireBunkerSurveySent) return toast.warn("Offhire Bunker Survey Email Already Sent");
                              offHireBunkerSurveyMailSend(`${imarineBaseUrl}/automation/bunker_off_hire_condition_surveyor`, {intId: item?.intId},
                              () => {
                                getGridData();
                              },
                              true
                            )
                            }}
                          >
                            OFFHIRE BUNKER CONDITION (CS) SEND
                          </button>
                        )}
                      </td>
                    </tr>
                    )
                  })}
                </ICustomTable>
              )}
            </Form>
          </IForm>
          <IViewModal show={show} onHide={onHide}>
            <ViewVesselNomination />
          </IViewModal>
        </>
      )}
    </Formik>
  );
}
