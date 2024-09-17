import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { imarineBaseUrl } from "../../../../App";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";

const initData = {
  voyageType: "",
  shipType: "",
  vesselName: "",
  accountName: "",
  cargoName: "",
  cargoQuantity: "",
  deliveryPort: "",
  loadPort: "",
  laycanFrom: "",
  laycanTo: "",
  loadRate: "",
  demurrageDispatch: "",
  etaLoadPort: "",
  dischargePort: "",
  dischargeRate: "",
  freight: "",
  loadPortDA: "",
  dischargePortDA: "",
  shipperEmail: "",
  chartererName: "",
  brokerName: "",
  brokerEmail: "",
  nominationSchedule: "",
};

const validationSchema = Yup.object().shape({
  voyageType: Yup.object()
    .shape({
      value: Yup.string().required("Voyage Type is required"),
      label: Yup.string().required("Voyage Type is required"),
    })
    .typeError("Voyage Type is required"),

  shipType: Yup.object()
    .shape({
      value: Yup.string().required("Ship Type is required"),
      label: Yup.string().required("Ship Type is required"),
    })
    .typeError("Ship Type is required"),
  vesselName: Yup.object()
    .shape({
      value: Yup.string().required("Vessel is required"),
      label: Yup.string().required("Vessel is required"),
    })
    .typeError("Vessel is required"),
  accountName: Yup.string().required("Account Name is required"),
  cargoName: Yup.object()
    .shape({
      value: Yup.string().required("Cargo is required"),
      label: Yup.string().required("Cargo is required"),
    })
    .typeError("Cargo is required"),
  cargoQuantity: Yup.string().required("Cargo Quantity is required"),
  deliveryPort: Yup.object()
    .shape({
      value: Yup.string().required("Delivery Port is required"),
      label: Yup.string().required("Delivery Port is required"),
    })
    .typeError("Delivery Port is required"),
  loadPort: Yup.object()
    .shape({
      value: Yup.string().required("Load Port Name is required"),
      label: Yup.string().required("Load Port Name is required"),
    })
    .typeError("Load Port Name is required"),
  laycanFrom: Yup.date().required("Laycan From Date is required"),
  laycanTo: Yup.date().required("Laycan To Date is required"),
  loadRate: Yup.string().required("Load Rate is required"),
  demurrageDispatch: Yup.string().required("Demurrage / Dispatch is required"),
  etaLoadPort: Yup.date().required("ETA Load Port Date is required"),
  dischargePort: Yup.string().required("Discharge Port Name is required"),
  dischargeRate: Yup.string().required("Discharge Rate is required"),
  shipperEmail: Yup.string()
    .email("Invalid email")
    .required("Shipper Email is required"),
});

export default function RecapCreate() {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [objProps, setObjprops] = useState({});
  const [, onSave, loader] = useAxiosPost();
  const [vesselDDL, getVesselDDL] = useAxiosGet();
  const [portDDL, getPortDDL] = useAxiosGet();
  const [cargoDDL, getCargoDDL] = useAxiosGet();
  const [chartererDDL, getChartererDDL] = useAxiosGet();

  useEffect(() => {
    getVesselDDL(`${imarineBaseUrl}/domain/Voyage/GetVesselDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}
`);
    getPortDDL(`${imarineBaseUrl}/domain/Stakeholder/GetPortDDL`);
    getCargoDDL(`${imarineBaseUrl}/domain/HireOwner/GetCargoDDL
`);
    getChartererDDL(
      `${imarineBaseUrl}/domain/PortPDA/GetCharterParty?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
  }, []);
  const saveHandler = async (values, cb) => {
    const payload = {
      IsActive: 1,
      // dteCPDate: values.laycanFrom || "2021-06-01T00:00:00.000Z",
      // dteDeliveryDateGMT: "2021-06-01T00:00:00.000Z",
      // dteEPDADischargeLastSubmissionDateTime: "2021-06-01T00:00:00.000Z",
      // dteEPDALastSubmissionDateTime: "2021-06-01T00:00:00.000Z",
      // dteLastActionDateTime: new Date().toISOString(),
      // dteOffHireBunkerLastSubmissionDateTime: "2021-06-01T00:00:00.000Z",
      // dteOnHireBunkerLastSubmissionDateTime: "2021-06-01T00:00:00.000Z",
      // dteReDeliveryDateGMT: "2021-06-01T00:00:00.000Z",
      // dteScheduleToSend: "2021-06-01T00:00:00.000Z",
      // dteServerDateTime: new Date().toISOString(),
      // dteTimestampForRecap: new Date().toISOString(),
      // dteVoyageCommenced: "2021-06-01T00:00:00.000Z",
      // dteVoyageCompletion: "2021-06-01T00:00:00.000Z",
      intAccountId: profileData?.accountId,
      // intBrokerId: 23,
      // intCargoId: 12,
      // intChartererId: 3,
      // intExtraDays: 54,
      // intId: 22,
      // intLastActionBy: 1,
      // intVesselId: 2,
      // intVoyageDurationDays: 3,
      // intVoyageNo: 2,
      // intVoyageTypeId: 1,
      // isEPDAAgentResponseSent: 1,
      // isEPDACSsent: 1,
      // isEPDADischargeCSsent: 1,
      // isEPDADischargeSent: 1,
      // isEPDASent: 1,
      // isOffHireBunkerCSSent: 1,
      // isOffHireBunkerSurveySent: 1,
      // isOnHireBunkerCSSent: 1,
      // isOnHireBunkerSurveySent: 1,
      // isPISurveyEmailSent: 1,
      // isVesselNominationEmailSent: 1,
      // numAP: 23,
      // numAdditionalDistance: 45,
      // numAddressCommissionPercentage: 232,
      // numBallast: 45,
      // numBallastSpeed: 54,
      // numBrokerCommissionPercentage: 232,
      // numCVE30Days: 23,
      // numDailyHire: 23,
      // numDeadFreight: 23,
      // numDemurrageRate: 23,
      // numDespatchRate: 23,
      // numDetention: 23,
      // numFreightPerMT: 543,
      // numFreightPercentage: 32,
      // numILOHC: 23,
      // numLSFOPricePerMT: 23,
      // numLSMGOPricePerMT: 23,
      // numLadenSpeed: 54,
      // numOthers: 23,
      // numSteaming: 45,
      // strAcceptReject: "",
      // strBunkerAgent: "",
      // strCode: 1,
      // strDischargePortAgentEmail: "",
      // strExpendituresForPISurvey: "",
      // strPlaceOfDelivery: "",
      // strRedeliveryPlace: "",
      // strServiceType: "",
      // strVendorName: "",
      // strVesselOwnerName: "",
      // ===========
      strVoyageType: values.voyageType?.label || "",
      intShipTyeId: values?.shipType?.value || 0,
      strShipType: values?.shipType?.label || "",
      strNameOfVessel: values.vesselName?.label || "",
      strAccountName: values.accountName || "",
      strCargo: values.cargoName?.label || "",
      intCargoQuantityMTS: +values.cargoQuantity || 0,
      strNameOfLoadPort: values.loadPort?.label || "",
      strPlaceOfDelivery: values?.deliveryPort?.label || "",
      strLaycan: values.laycanFrom || "",
      dteLaycanFrom: values?.laycanFrom || "",
      dteLaycanTo: values?.laycanTo,
      intLoadRate: +values.loadRate || 0,
      numDemurrageDispatch: +values.demurrageDispatch || 0,
      dteETALoadPort: values.etaLoadPort || "",
      strDischargePort: values.dischargePort?.label || "",
      intDischargeRate: +values.dischargeRate || 0,
      numFreight: +values.freight || 0,
      numLoadPortDA: +values.loadPortDA || 0,
      numDischargePortDA: +values.dischargePortDA || 0,
      strShipperEmailForVesselNomination: values.shipperEmail || "",
      strChartererName: values.chartererName?.label || "",
      strBrokerName: values.brokerName || "",
      strBrokerEmail: values.brokerEmail || "",
    };

    onSave(`${imarineBaseUrl}/automation/recap`, payload, cb, true);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          title="Create Recap"
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
            <div className="form-group global-form row mt-5">
              <div className="col-lg-3">
                <NewSelect
                  name="voyageType"
                  options={[
                    { value: 1, label: "Time Charter" },
                    { value: 2, label: "Voyage Charter" },
                  ]}
                  value={values.voyageType}
                  label="Voyage Type"
                  onChange={(valueOption) =>
                    setFieldValue("voyageType", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="shipType"
                  options={[
                    { value: 1, label: "Own Ship" },
                    { value: 2, label: "Charterer Ship" },
                  ]}
                  value={values.shipType}
                  label="Ship Type"
                  onChange={(valueOption) =>
                    setFieldValue("shipType", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="vesselName"
                  options={vesselDDL}
                  value={values.vesselName}
                  label="Vessel Name"
                  onChange={(valueOption) =>
                    setFieldValue("vesselName", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.accountName}
                  label="Account Name"
                  name="accountName"
                  type="text"
                  onChange={(e) => setFieldValue("accountName", e.target.value)}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="cargoName"
                  options={cargoDDL}
                  value={values.cargoName}
                  label="Cargo Name"
                  onChange={(valueOption) =>
                    setFieldValue("cargoName", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.cargoQuantity}
                  label="Cargo Quantity (Mts)"
                  name="cargoQuantity"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("cargoQuantity", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="deliveryPort"
                  options={portDDL}
                  value={values.deliveryPort}
                  label="Delivery Port"
                  onChange={(valueOption) =>
                    setFieldValue("deliveryPort", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="loadPort"
                  options={portDDL}
                  value={values.loadPort}
                  label="Load Port"
                  onChange={(valueOption) =>
                    setFieldValue("loadPort", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div className="col-lg-3">
                <InputField
                  value={values.laycanFrom}
                  label="Laycan From Date"
                  name="laycanFrom"
                  type="date"
                  onChange={(e) => setFieldValue("laycanFrom", e.target.value)}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.laycanTo}
                  label="Laycan To Date"
                  name="laycanTo"
                  type="date"
                  onChange={(e) => setFieldValue("laycanTo", e.target.value)}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.loadRate}
                  label="Load Rate (Mts)
"
                  name="loadRate"
                  type="number"
                  onChange={(e) => setFieldValue("loadRate", e.target.value)}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.demurrageDispatch}
                  label="Demurrage / Dispatch"
                  name="demurrageDispatch"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("demurrageDispatch", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.etaLoadPort}
                  label="ETA Load Port Date"
                  name="etaLoadPort"
                  type="date"
                  onChange={(e) => setFieldValue("etaLoadPort", e.target.value)}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="dischargePort"
                  options={portDDL}
                  value={values.dischargePort}
                  label="Discharge Port"
                  onChange={(valueOption) =>
                    setFieldValue("dischargePort", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.dischargeRate}
                  label="Discharge Rate (Mts)"
                  name="dischargeRate"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("dischargeRate", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.freight}
                  label="Freight"
                  name="freight"
                  type="number"
                  onChange={(e) => setFieldValue("freight", e.target.value)}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.loadPortDA}
                  label="Load Port D/A"
                  name="loadPortDA"
                  type="number"
                  onChange={(e) => setFieldValue("loadPortDA", e.target.value)}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.dischargePortDA}
                  label="Discharge Port D/A"
                  name="dischargePortDA"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("dischargePortDA", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.shipperEmail}
                  label="Shipper Email for Vessel Nomination
"
                  name="shipperEmail"
                  type="email"
                  onChange={(e) =>
                    setFieldValue("shipperEmail", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="chartererName"
                  options={chartererDDL}
                  value={values.chartererName}
                  label="Charterer Name"
                  onChange={(valueOption) =>
                    setFieldValue("chartererName", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.brokerName}
                  label="Broker Name"
                  name="brokerName"
                  type="text"
                  onChange={(e) => setFieldValue("brokerName", e.target.value)}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.brokerEmail}
                  label="Broker Email"
                  name="brokerEmail"
                  type="email"
                  onChange={(e) => setFieldValue("brokerEmail", e.target.value)}
                  errors={errors}
                />
              </div>
            </div>
          </Form>
        </IForm>
      )}
    </Formik>
  );
}
