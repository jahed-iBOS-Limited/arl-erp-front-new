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
import { useLocation } from "react-router-dom";
import { set } from "lodash";

const initData = {
  strCode: "",
  strNameOfVessel: "", //DDL
  strMasterEmail: "",
  strCurrentPosition: "",
  strLoadPort: "", //DDL
  strBallastEcoMax: "",
  numBallastDistance: "",
  numBallastSpeed: "",
  numBallastVlsfoConsumptionMt: "",
  numBallastLsmgoConsumptionMt: "",
  numBallastPassageVlsfoConsumptionMt: "",
  numBallastPassageLsmgoConsumptionMt: "",
  strDischargePort: "", // DDL
  strLadenEcoMax: "",
  numLadenDistance: "",
  numLadenSpeed: "",
  numLadenVlsfoConsumptionMt: "",
  numLadenLsmgoConsumptionMt: "",
  numLadenPassageVlsfoConsumptionMt: "",
  numLadenPassageLsmgoConsumptionMt: "",
  intLoadRate: "",
  numCargoQty: "",
  numLoadPortStay: "",
  intDischargeRate: "",
  numDischargePortStay: "",
  numLoadPortStayVlsfoConsumptionMt: "",
  numLoadPortStayLsmgoConsumptionMt: "",
  numDischargePortStayVlsfoConsumptionMt: "",
  numDischargePortStayLsmgoConsumptionMt: "",
  numTotalVlsfoConsumptionMt: "",
  numTotalLsmgoConsumptionMt: "",
  numToleranceVlsfoPercentage: "",
  numNetTotalConsumableVlsfoMt: "",
  strBunkerPort: "", //DDL
  strBunkerTrader: "",
  strBunkerType: "",
};

const validationSchema = Yup.object().shape({
  strNameOfVessel: Yup.object()
    .shape({
      value: Yup.string().required("Vessel is required"),
      label: Yup.string().required("Vessel is required"),
    })
    .typeError("Vessel is required"),

  strCode: Yup.string().required("Code is required"),

  strLoadPort: Yup.object()
    .shape({
      value: Yup.string().required("Load Port Name is required"),
      label: Yup.string().required("Load Port Name is required"),
    })
    .typeError("Load Port Name is required"),
  strDischargePort: Yup.object()
    .shape({
      value: Yup.string().required("Discharge Port Name is required"),
      label: Yup.string().required("Discharge Port Name is required"),
    })
    .typeError("Discharge Port Name is required"),
});

export default function BunkerManagementCreate() {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [objProps, setObjprops] = useState({});
  const [, onSave, loader] = useAxiosPost();
  const [vesselDDL, getVesselDDL] = useAxiosGet();
  const [portDDL, getPortDDL] = useAxiosGet();
  const [carryForwardData, setCarryForwardData] = useState({}); 

  const location = useLocation();
  const  landingData = location?.state?.landingData;

  console.log("landingData", landingData);
  useEffect(() => {
    if(landingData){
      const modData = {
        strCode: landingData?.strCode,
        strNameOfVessel: {
          value: landingData?.intVesselId,
          label: landingData?.strNameOfVessel,
        },
        numBallastDistance: landingData?.numBallast,
        numBallastSpeed: landingData?.numBallastSpeed,
        strLoadPort: {
          value: landingData?.intLoadPortId,
          label: landingData?.strNameOfLoadPort,
        },
        strDischargePort: {
          value: landingData?.intDischargePortId,
          label: landingData?.strDischargePort,
        },
        // numLadenDistance: landingData?.numLadenDistance,
        numLadenSpeed: landingData?.numLadenSpeed,
        intLoadRate: landingData?.intLoadRate,
        intDischargeRate: landingData?.intDischargeRate,
        numCargoQty: landingData?.intCargoQuantityMts,
      }
      setCarryForwardData(modData);
    }
  }, [landingData]);

  useEffect(() => {
    getVesselDDL(`${imarineBaseUrl}/domain/Voyage/GetVesselDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}
`);
    getPortDDL(`${imarineBaseUrl}/domain/Stakeholder/GetPortDDL`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);
  const saveHandler = async (values, cb) => {
    const payload = {
      strCode: paramCode || values?.strCode || "",
      strNameOfVessel: values?.strNameOfVessel?.label || "",
      strMasterEmail: values?.strMasterEmail || "",
      strCurrentPosition: values?.strCurrentPosition || "",
      intLoadPortId: +values?.strLoadPort?.value || 0,
      strLoadPort: values?.strLoadPort?.label || "",
      strBallastEcoMax: values?.strBallastEcoMax || "",
      numBallastDistance: +values?.numBallastDistance || 0,
      numBallastSpeed: +values?.numBallastSpeed || 0,
      numBallastVlsfoConsumptionMt: +values?.numBallastVlsfoConsumptionMt || 0,
      numBallastLsmgoConsumptionMt: +values?.numBallastLsmgoConsumptionMt || 0,
      numBallastPassageVlsfoConsumptionMt:
        +values?.numBallastPassageVlsfoConsumptionMt || 0,
      numBallastPassageLsmgoConsumptionMt:
        +values?.numBallastPassageLsmgoConsumptionMt || 0,
      intDischargePortId: +values?.strDischargePort?.value || 0,
      strDischargePort: values?.strDischargePort?.label || "",
      strLadenEcoMax: values?.strLadenEcoMax || "",
      numLadenDistance: +values?.numLadenDistance || 0,
      numLadenSpeed: +values?.numLadenSpeed || 0,
      numLadenVlsfoConsumptionMt: +values?.numLadenVlsfoConsumptionMt || 0,
      numLadenLsmgoConsumptionMt: +values?.numLadenLsmgoConsumptionMt || 0,
      numLadenPassageVlsfoConsumptionMt:
        +values?.numLadenPassageVlsfoConsumptionMt || 0,
      numLadenPassageLsmgoConsumptionMt:
        +values?.numLadenPassageLsmgoConsumptionMt || 0,
      intLoadRate: +values?.intLoadRate || 0,
      numCargoQty: +values?.numCargoQty || 0,
      numLoadPortStay: +values?.numLoadPortStay || 0,
      intDischargeRate: +values?.intDischargeRate || 0,
      numDischargePortStay: +values?.numDischargePortStay || 0,
      numLoadPortStayVlsfoConsumptionMt:
        +values?.numLoadPortStayVlsfoConsumptionMt || 0,
      numLoadPortStayLsmgoConsumptionMt:
        +values?.numLoadPortStayLsmgoConsumptionMt || 0,
      numDischargePortStayVlsfoConsumptionMt:
        +values?.numDischargePortStayVlsfoConsumptionMt || 0,
      numDischargePortStayLsmgoConsumptionMt:
        +values?.numDischargePortStayLsmgoConsumptionMt || 0,
      numTotalVlsfoConsumptionMt: +values?.numTotalVlsfoConsumptionMt || 0,
      numTotalLsmgoConsumptionMt: +values?.numTotalLsmgoConsumptionMt || 0,
      numToleranceVlsfoPercentage: +values?.numToleranceVlsfoPercentage || 0,
      numNetTotalConsumableVlsfoMt: +values?.numNetTotalConsumableVlsfoMt || 0,
      intBunkerPortId: +values?.strBunkerPort?.value || 0,
      strBunkerPort: values?.strBunkerPort?.label || "",
      strBunkerTrader: values?.strBunkerTrader || "",
      intBunkerTypeId: +values?.intBunkerTypeId || 0,
      strBunkerType: values?.strBunkerType || "",
      intLastActionBy: +profileData?.userId,
      intAccountId: +profileData?.accountId,
      intVesselId: +values?.strNameOfVessel?.value || 0,
      intVesselNominationId: +paramId || 0,
    };

    onSave(
      `${imarineBaseUrl}/domain/VesselNomination/CreateBunkerCalculat`,
      payload,
      cb,
      true
    );
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={carryForwardData || initData}
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
          title="Create Bunker Management"
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
            <div className="form-group  global-form row">
              <div className="col-lg-3">
                <InputField
                  value={values.strCode}
                  label="Code"
                  name="strCode"
                  type="text"
                  onChange={(e) => setFieldValue("strCode", e.target.value)}
                  errors={errors}
                  disabled={landingData?.strCode}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="strNameOfVessel"
                  options={vesselDDL}
                  value={values.strNameOfVessel}
                  label="Name of Vessel"
                  onChange={(valueOption) =>
                    setFieldValue("strNameOfVessel", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                  isDisabled={landingData?.strNameOfVessel}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.strMasterEmail}
                  label="Master Email"
                  name="strMasterEmail"
                  type="email"
                  onChange={(e) =>
                    setFieldValue("strMasterEmail", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.strCurrentPosition}
                  label="Current Position"
                  name="strCurrentPosition"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("strCurrentPosition", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.strBallastEcoMax}
                  label="Ballast Eco Max"
                  name="strBallastEcoMax"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("strBallastEcoMax", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numBallastDistance}
                  label="Ballast Distance"
                  name="numBallastDistance"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("numBallastDistance", e.target.value)
                  }
                  errors={errors}
                  disabled={landingData?.numBallast}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numBallastSpeed}
                  label="Ballast Speed"
                  name="numBallastSpeed"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("numBallastSpeed", e.target.value)
                  }
                  errors={errors}
                  disabled={landingData?.numBallastSpeed}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numBallastVlsfoConsumptionMt}
                  label="Ballast VLSFO Consumption (Mt)"
                  name="numBallastVlsfoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue(
                      "numBallastVlsfoConsumptionMt",
                      e.target.value
                    )
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numBallastLsmgoConsumptionMt}
                  label="Ballast LSMGO Consumption (Mt)"
                  name="numBallastLsmgoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue(
                      "numBallastLsmgoConsumptionMt",
                      e.target.value
                    )
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numBallastPassageVlsfoConsumptionMt}
                  label="Ballast Passage VLSFO Consumption (Mt)"
                  name="numBallastPassageVlsfoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue(
                      "numBallastPassageVlsfoConsumptionMt",
                      e.target.value
                    )
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numBallastPassageLsmgoConsumptionMt}
                  label="Ballast Passage LSMGO Consumption (Mt)"
                  name="numBallastPassageLsmgoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue(
                      "numBallastPassageLsmgoConsumptionMt",
                      e.target.value
                    )
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="strLoadPort"
                  options={portDDL}
                  value={values.strLoadPort}
                  label="Load Port"
                  onChange={(valueOption) =>
                    setFieldValue("strLoadPort", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                  isDisabled={landingData?.strNameOfLoadPort}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="strDischargePort"
                  options={portDDL}
                  value={values.strDischargePort}
                  label="Discharge Port"
                  onChange={(valueOption) =>
                    setFieldValue("strDischargePort", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                  isDisabled={landingData?.strDischargePort}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.strLadenEcoMax}
                  label="Laden Eco Max"
                  name="strLadenEcoMax"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("strLadenEcoMax", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numLadenDistance}
                  label="Laden Distance"
                  name="numLadenDistance"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("numLadenDistance", e.target.value)
                  }
                  errors={errors}
                  // disabled={landingData?.numLadenDistance}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numLadenSpeed}
                  label="Laden Speed"
                  name="numLadenSpeed"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("numLadenSpeed", e.target.value)
                  }
                  errors={errors}
                  disabled={landingData?.numLadenSpeed}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numLadenVlsfoConsumptionMt}
                  label="Laden VLSFO Consumption (Mt)"
                  name="numLadenVlsfoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("numLadenVlsfoConsumptionMt", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numLadenLsmgoConsumptionMt}
                  label="Laden LSMGO Consumption (Mt)"
                  name="numLadenLsmgoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("numLadenLsmgoConsumptionMt", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numLadenPassageVlsfoConsumptionMt}
                  label="Laden Passage VLSFO Consumption (Mt)"
                  name="numLadenPassageVlsfoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue(
                      "numLadenPassageVlsfoConsumptionMt",
                      e.target.value
                    )
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numLadenPassageLsmgoConsumptionMt}
                  label="Laden Passage LSMGO Consumption (Mt)"
                  name="numLadenPassageLsmgoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue(
                      "numLadenPassageLsmgoConsumptionMt",
                      e.target.value
                    )
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.intLoadRate}
                  label="Load Rate"
                  name="intLoadRate"
                  type="number"
                  onChange={(e) => setFieldValue("intLoadRate", e.target.value)}
                  errors={errors}
                  disabled={landingData?.intLoadRate}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numCargoQty}
                  label="Cargo Quantity"
                  name="numCargoQty"
                  type="number"
                  onChange={(e) => setFieldValue("numCargoQty", e.target.value)}
                  errors={errors}
                  disabled={landingData?.intCargoQuantityMts}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.intDischargeRate}
                  label="Discharge Rate"
                  name="intDischargeRate"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("intDischargeRate", e.target.value)
                  }
                  errors={errors}
                  disabled={landingData?.intDischargeRate}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numLoadPortStay}
                  label="Load Port Stay"
                  name="numLoadPortStay"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("numLoadPortStay", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numDischargePortStay}
                  label="Discharge Port Stay"
                  name="numDischargePortStay"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("numDischargePortStay", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numLoadPortStayVlsfoConsumptionMt}
                  label="Load Port Stay VLSFO Consumption (Mt)"
                  name="numLoadPortStayVlsfoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue(
                      "numLoadPortStayVlsfoConsumptionMt",
                      e.target.value
                    )
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numLoadPortStayLsmgoConsumptionMt}
                  label="Load Port Stay LSMGO Consumption (Mt)"
                  name="numLoadPortStayLsmgoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue(
                      "numLoadPortStayLsmgoConsumptionMt",
                      e.target.value
                    )
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numDischargePortStayVlsfoConsumptionMt}
                  label="Discharge Port Stay VLSFO Consumption (Mt)"
                  name="numDischargePortStayVlsfoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue(
                      "numDischargePortStayVlsfoConsumptionMt",
                      e.target.value
                    )
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numDischargePortStayLsmgoConsumptionMt}
                  label="Discharge Port Stay LSMGO Consumption (Mt)"
                  name="numDischargePortStayLsmgoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue(
                      "numDischargePortStayLsmgoConsumptionMt",
                      e.target.value
                    )
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numTotalVlsfoConsumptionMt}
                  label="Total VLSFO Consumption (Mt)"
                  name="numTotalVlsfoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("numTotalVlsfoConsumptionMt", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numTotalLsmgoConsumptionMt}
                  label="Total LSMGO Consumption (Mt)"
                  name="numTotalLsmgoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("numTotalLsmgoConsumptionMt", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numToleranceVlsfoPercentage}
                  label="Tolerance VLSFO Percentage"
                  name="numToleranceVlsfoPercentage"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("numToleranceVlsfoPercentage", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numNetTotalConsumableVlsfoMt}
                  label="Net Total Consumable VLSFO (Mt)"
                  name="numNetTotalConsumableVlsfoMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue(
                      "numNetTotalConsumableVlsfoMt",
                      e.target.value
                    )
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="strBunkerPort"
                  options={portDDL}
                  value={values.strBunkerPort}
                  label="Bunker Port"
                  onChange={(valueOption) =>
                    setFieldValue("strBunkerPort", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.strBunkerTrader}
                  label="Bunker Trader"
                  name="strBunkerTrader"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("strBunkerTrader", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.strBunkerType}
                  label="Bunker Type"
                  name="strBunkerType"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("strBunkerType", e.target.value)
                  }
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
