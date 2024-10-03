import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { commonBunkerInputFieldsCalculatorFunc } from "./utils";

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
  numDepatureDraftForward: "",
  numDepatureDraftAft: ""
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

  const [, onSave, loader] = useAxiosPost();
  const [vesselDDL, getVesselDDL] = useAxiosGet();
  const [portDDL, getPortDDL] = useAxiosGet();
  const [, GetVesselMasterData, vesselMasterDataLoading] = useAxiosGet();

  const formikRef = React.useRef(null);
  const location = useLocation();
  const landingData = location?.state?.landingData;
  const history = useHistory();

  useEffect(() => {
    if (landingData) {
      const modData = {
        strCode: landingData?.strCode || "",
        strNameOfVessel: landingData?.intVesselId
          ? {
              value: landingData?.intVesselId || 0,
              label: landingData?.strNameOfVessel || "",
            }
          : "",
        // strMasterEmail: landingData?.strMasterEmail || "",
        strCurrentPosition: landingData?.strCurrentPosition || "",
        numBallastDistance: landingData?.numBallast || 0,
        numBallastSpeed: landingData?.numBallastSpeed || 0,
        strLoadPort: landingData?.intLoadPortId
          ? {
              value: landingData?.intLoadPortId || 0,
              label:
                landingData?.strNameOfLoadPort ||
                landingData?.strLoadPort ||
                "",
            }
          : "",
        strDischargePort: landingData?.intDischargePortId
          ? {
              value: landingData?.intDischargePortId || 0,
              label: landingData?.strDischargePort || "",
            }
          : "",
        strBallastEcoMax: landingData?.strBallastEcoMax || "",
        numBallastVlsfoConsumptionMt:
          landingData?.numBallastVlsfoConsumptionMt || 0,
        numBallastLsmgoConsumptionMt:
          landingData?.numBallastLsmgoConsumptionMt || 0,
        numBallastPassageVlsfoConsumptionMt:
          landingData?.numBallastPassageVlsfoConsumptionMt || 0,
        numBallastPassageLsmgoConsumptionMt:
          landingData?.numBallastPassageLsmgoConsumptionMt || 0,
        strLadenEcoMax: landingData?.strLadenEcoMax || "",
        numLadenDistance: landingData?.numLadenDistance || 0,
        numLadenSpeed: landingData?.numLadenSpeed || 0,
        numLadenVlsfoConsumptionMt:
          landingData?.numLadenVlsfoConsumptionMt || 0,
        numLadenLsmgoConsumptionMt:
          landingData?.numLadenLsmgoConsumptionMt || 0,
        numLadenPassageVlsfoConsumptionMt:
          landingData?.numLadenPassageVlsfoConsumptionMt || 0,
        numLadenPassageLsmgoConsumptionMt:
          landingData?.numLadenPassageLsmgoConsumptionMt || 0,
        intLoadRate: landingData?.intLoadRate || 0,
        intDischargeRate: landingData?.intDischargeRate || 0,
        numCargoQty: landingData?.intCargoQuantityMts || 0,
        numLoadPortStay: landingData?.numLoadPortStay || 0,
        numDischargePortStay: landingData?.numDischargePortStay || 0,
        numLoadPortStayVlsfoConsumptionMt:
          landingData?.numLoadPortStayVlsfoConsumptionMt || 0,
        numLoadPortStayLsmgoConsumptionMt:
          landingData?.numLoadPortStayLsmgoConsumptionMt || 0,
        numDischargePortStayVlsfoConsumptionMt:
          landingData?.numDischargePortStayVlsfoConsumptionMt || 0,
        numDischargePortStayLsmgoConsumptionMt:
          landingData?.numDischargePortStayLsmgoConsumptionMt || 0,
        numTotalVlsfoConsumptionMt:
          landingData?.numTotalVlsfoConsumptionMt || 0,
        numTotalLsmgoConsumptionMt:
          landingData?.numTotalLsmgoConsumptionMt || 0,
        numToleranceVlsfoPercentage:
          landingData?.numToleranceVlsfoPercentage || 0,
        numNetTotalConsumableVlsfoMt:
          landingData?.numNetTotalConsumableVlsfoMt || 0,
        strBunkerPort: landingData?.intBunkerPortId
          ? {
              value: landingData?.intBunkerPortId || 0,
              label: landingData?.strBunkerPort || "",
            }
          : "",
        strBunkerTrader: landingData?.strBunkerTrader || "",
        strBunkerType: landingData?.strBunkerType || "",
        // strIntendedSpeed: "",
        // numPortStayLsmgoPerDay: landingData?.numPortStayLsmgoPerDay || 0,
        // numPortStayVlsfoPerDay: landingData?.numPortStayVlsfoPerDay || 0,
        // numNetTotalConsumableLsmgoMt:
        //   landingData?.numNetTotalConsumableLsmgoMt || 0,
      };

      if (formikRef.current) {
        formikRef.current.setValues(modData);
      }

      if (landingData?.intVesselId) {
        GetVesselMasterData(
          `${imarineBaseUrl}/domain/VesselNomination/GetVesselMasterData?vesselId=${landingData?.intVesselId}`,
          (resData) => {
            if (formikRef.current && resData) {
              formikRef.current.setFieldValue(
                "strMasterEmail",
                resData?.strMasterEmail || ""
              );
              formikRef.current.setFieldValue(
                "numBallastEcoSpeed",
                resData?.numBallastEcoSpeed || ""
              );
              formikRef.current.setFieldValue(
                "numBallastMaxSpeed",
                resData?.numBallastMaxSpeed || ""
              );
              formikRef.current.setFieldValue(
                "numLadenEcoSpeed",
                resData?.numLadenEcoSpeed || ""
              );
              formikRef.current.setFieldValue(
                "numLadenMaxSpeed",
                resData?.numLadenMaxSpeed || ""
              );

              formikRef.current.setFieldValue(
                "numBallastVlsfoConsumptionMt",
                resData?.numBallastVlsfoconsumptionMtPerday || ""
              );
              formikRef.current.setFieldValue(
                "numBallastLsmgoConsumptionMt",
                resData?.numBallastLsmgoconsumptionMtPerday || ""
              );
              formikRef.current.setFieldValue(
                "numLadenVlsfoConsumptionMt",
                resData?.numLadenVlsfoconsumptionMtPerday || ""
              );
              formikRef.current.setFieldValue(
                "numLadenLsmgoConsumptionMt",
                resData?.numLadenLsmgoconsumptionMtPerday || ""
              );

              // Port Stay VLSFO/Day
              formikRef.current.setFieldValue(
                "numPortStayVlsfoPerDay",
                resData?.numPortWorkingVlsfoperDay || ""
              );
              //Port Stay LSMGO/Day
              formikRef.current.setFieldValue(
                "numPortStayLsmgoPerDay",
                resData?.numPortWorkingLsmgoperDay || ""
              );

            }
          }
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landingData]);

  useEffect(() => {
    getVesselDDL(`${imarineBaseUrl}/domain/Voyage/GetVesselDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}
`);
    getPortDDL(`${imarineBaseUrl}/domain/Stakeholder/GetPortDDL`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);
  const saveHandler = async (values, cb) => {
    const payload = {
      
      strCode: values?.strCode || "",
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
      intVesselNominationId:
        landingData?.intId || landingData?.intVesselNominationId || 0,
      numPortStayVlsfoperDay: +values?.numPortStayVlsfoPerDay || 0,
      numPortStayLsmgoperDay: +values?.numPortStayLsmgoPerDay || 0,
      intIntendedSpeed: +values?.intendedSpeed?.value || 0,
      strIntIntendedSpeed: values?.intendedSpeed?.label || "",
      numNetTotalConsumableLsmgoMt: +values?.numNetTotalConsumableLsmgoMt || 0,
      numDepatureDraftForward: +values?.numDepatureDraftForward || 0,
      numDepatureDraftAft: +values?.numDepatureDraftAft || 0
    };

    onSave(
      `${imarineBaseUrl}/domain/VesselNomination/CreateBunkerCalculator`,
      payload,
      cb,
      true
    );
  };
  return (
    <Formik
      innerRef={formikRef}
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          history.goBack();
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
        setValues,
      }) => (
        <IForm
          title="Create Bunker Management"
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
          {(loader || vesselMasterDataLoading) && <Loading />}
          <Form className="form form-label-right">
            <div className="form-group  global-form row">
              <div className="col-lg-3">
                <InputField
                  value={values?.strCode || ""}
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
                  value={values?.strNameOfVessel || ""}
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
                  value={values?.strMasterEmail || ""}
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
                  value={values?.strCurrentPosition || ""}
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
                <NewSelect
                  name="intendedSpeed"
                  options={[
                    {
                      value: 1,
                      label: "Eco Speed",
                    },
                    {
                      value: 2,
                      label: "Max Speed",
                    },
                  ]}
                  value={values?.intendedSpeed || ""}
                  label="Intended Speed"
                  onChange={(valueOption) => {
                    if (valueOption?.value === 1) {
                      setFieldValue(
                        "numBallastSpeed",
                        values?.numBallastEcoSpeed || ""
                      );
                      setFieldValue(
                        "numLadenSpeed",
                        values?.numLadenEcoSpeed || 0
                      );

                      commonBunkerInputFieldsCalculatorFunc({
                        values: {
                          ...values,
                          numBallastSpeed: values?.numBallastEcoSpeed || "",
                          numLadenSpeed: values?.numLadenEcoSpeed || "",
                          intendedSpeed: valueOption,
                        },
                        setValues: setValues,
                        key: "numBallastSpeed",
                      });
                    } else if (valueOption?.value === 2) {
                      setFieldValue(
                        "numBallastSpeed",
                        values?.numBallastMaxSpeed || ""
                      );
                      setFieldValue(
                        "numLadenSpeed",
                        values?.numLadenMaxSpeed || ""
                      );

                      commonBunkerInputFieldsCalculatorFunc({
                        values: {
                          ...values,
                          numBallastSpeed: values?.numBallastMaxSpeed || "",
                          numLadenSpeed: values?.numLadenMaxSpeed || "",
                          intendedSpeed: valueOption,
                        },
                        setValues: setValues,
                        key: "",
                      });
                    } else {
                      commonBunkerInputFieldsCalculatorFunc({
                        values: {
                          ...values,
                          numBallastSpeed: "",
                          numLadenSpeed: "",
                          intendedSpeed: "",
                        },
                        setValues: setValues,
                        key: "",
                      });
                    }
                  }}
                  errors={errors}
                  touched={touched}
                  isDisabled={landingData?.strIntendedSpeed}
                  placeholder="Select Intended Speed"
                />
              </div>
              {/* <div className="col-lg-3">
                <InputField
                  value={values?.strBallastEcoMax || ""}
                  label="Ballast Eco Max"
                  name="strBallastEcoMax"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("strBallastEcoMax", e.target.value)
                  }
                  errors={errors}
                />
              </div> */}
              <div className="col-lg-3">
                <InputField
                  value={values?.numBallastDistance || ""}
                  label="Ballast Distance"
                  name="numBallastDistance"
                  type="number"
                  onChange={(e) => {
                    setFieldValue("numBallastDistance", e.target.value);
                    commonBunkerInputFieldsCalculatorFunc({
                      values: {
                        ...values,
                        numBallastDistance: e.target.value,
                      },
                      setValues: setValues,
                      key: "numBallastDistance",
                    });
                  }}
                  errors={errors}
                  disabled={landingData?.numBallast}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numBallastSpeed || ""}
                  label="Ballast Speed"
                  name="numBallastSpeed"
                  type="number"
                  onChange={(e) => {
                    setFieldValue("numBallastSpeed", e.target.value);
                    commonBunkerInputFieldsCalculatorFunc({
                      values: {
                        ...values,
                        numBallastSpeed: e.target.value,
                      },
                      setValues: setValues,
                      key: "numBallastSpeed",
                    });
                  }}
                  errors={errors}
                  disabled={landingData?.numBallastSpeed}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numBallastVlsfoConsumptionMt || ""}
                  label="Ballast VLSFO Consumption (Mt)/Day"
                  name="numBallastVlsfoConsumptionMt"
                  type="number"
                  onChange={(e) => {
                    setFieldValue(
                      "numBallastVlsfoConsumptionMt",
                      e.target.value
                    );
                    commonBunkerInputFieldsCalculatorFunc({
                      values: {
                        ...values,
                        numBallastVlsfoConsumptionMt: e.target.value,
                      },
                      setValues: setValues,
                      key: "numBallastVlsfoConsumptionMt",
                    });
                  }}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numBallastLsmgoConsumptionMt || ""}
                  label="Ballast LSMGO Consumption (Mt)/Day"
                  name="numBallastLsmgoConsumptionMt"
                  type="number"
                  onChange={(e) => {
                    setFieldValue(
                      "numBallastLsmgoConsumptionMt",
                      e.target.value
                    );
                    commonBunkerInputFieldsCalculatorFunc({
                      values: {
                        ...values,
                        numBallastLsmgoConsumptionMt: e.target.value,
                      },
                      setValues: setValues,
                      key: "numBallastLsmgoConsumptionMt",
                    });
                  }}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numBallastPassageVlsfoConsumptionMt || ""}
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
                  disabled
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numBallastPassageLsmgoConsumptionMt || ""}
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
                  disabled
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="strLoadPort"
                  options={portDDL}
                  value={values?.strLoadPort || ""}
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
                  value={values?.strDischargePort || ""}
                  label="Discharge Port"
                  onChange={(valueOption) =>
                    setFieldValue("strDischargePort", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                  isDisabled={landingData?.strDischargePort}
                />
              </div>
              {/* <div className="col-lg-3">
                <InputField
                  value={values?.strLadenEcoMax || ""}
                  label="Laden Eco Max"
                  name="strLadenEcoMax"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("strLadenEcoMax", e.target.value)
                  }
                  errors={errors}
                />
              </div> */}
              <div className="col-lg-3">
                <InputField
                  value={values?.numLadenDistance || ""}
                  label="Laden Distance"
                  name="numLadenDistance"
                  type="number"
                  onChange={(e) => {
                    setFieldValue("numLadenDistance", e.target.value);
                    commonBunkerInputFieldsCalculatorFunc({
                      values: {
                        ...values,
                        numLadenDistance: e.target.value,
                      },
                      setValues: setValues,
                      key: "numLadenDistance",
                    });
                  }}
                  errors={errors}
                  // disabled={landingData?.numLadenDistance}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numLadenSpeed || ""}
                  label="Laden Speed"
                  name="numLadenSpeed"
                  type="number"
                  onChange={(e) => {
                    setFieldValue("numLadenSpeed", e.target.value);
                    commonBunkerInputFieldsCalculatorFunc({
                      values: {
                        ...values,
                        numLadenSpeed: e.target.value,
                      },
                      setValues: setValues,
                      key: "numLadenSpeed",
                    });
                  }}
                  errors={errors}
                  disabled={landingData?.numLadenSpeed}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numLadenVlsfoConsumptionMt || ""}
                  label="Laden VLSFO Consumption (Mt)/Day"
                  name="numLadenVlsfoConsumptionMt"
                  type="number"
                  onChange={(e) => {
                    setFieldValue("numLadenVlsfoConsumptionMt", e.target.value);
                    commonBunkerInputFieldsCalculatorFunc({
                      values: {
                        ...values,
                        numLadenVlsfoConsumptionMt: e.target.value,
                      },
                      setValues: setValues,
                      key: "numLadenVlsfoConsumptionMt",
                    });
                  }}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numLadenLsmgoConsumptionMt || ""}
                  label="Laden LSMGO Consumption (Mt)/Day"
                  name="numLadenLsmgoConsumptionMt"
                  type="number"
                  onChange={(e) => {
                    setFieldValue("numLadenLsmgoConsumptionMt", e.target.value);
                    commonBunkerInputFieldsCalculatorFunc({
                      values: {
                        ...values,
                        numLadenLsmgoConsumptionMt: e.target.value,
                      },
                      setValues: setValues,
                      key: "numLadenLsmgoConsumptionMt",
                    });
                  }}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numLadenPassageVlsfoConsumptionMt || ""}
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
                  disabled
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numLadenPassageLsmgoConsumptionMt || ""}
                  label="Laden Passage LSMGO Consumption (Mt)"
                  name="numLadenPassageLsmgoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    // setFieldValue(
                    //   "numLadenPassageLsmgoConsumptionMt",
                    //   e.target.value
                    // )
                    commonBunkerInputFieldsCalculatorFunc({
                      values: {
                        ...values,
                        numLadenPassageLsmgoConsumptionMt: e.target.value,
                      },
                      setValues: setValues,
                      key: "numLadenPassageLsmgoConsumptionMt",
                    })
                  }
                  errors={errors}
                  disabled
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.intLoadRate || ""}
                  label="Load Rate"
                  name="intLoadRate"
                  type="number"
                  onChange={(e) => {
                    setFieldValue("intLoadRate", e.target.value);
                    commonBunkerInputFieldsCalculatorFunc({
                      values: {
                        ...values,
                        intLoadRate: e.target.value,
                      },
                      setValues: setValues,
                      key: "intLoadRate",
                    });
                  }}
                  errors={errors}
                  disabled={landingData?.intLoadRate}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numCargoQty || ""}
                  label="Cargo Quantity"
                  name="numCargoQty"
                  type="number"
                  onChange={(e) => {
                    setFieldValue("numCargoQty", e.target.value);

                    commonBunkerInputFieldsCalculatorFunc({
                      values: {
                        ...values,
                        numCargoQty: e.target.value,
                      },
                      setValues: setValues,
                      key: "numCargoQty",
                    });
                  }}
                  errors={errors}
                  disabled={landingData?.intCargoQuantityMts}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.intDischargeRate || ""}
                  label="Discharge Rate"
                  name="intDischargeRate"
                  type="number"
                  onChange={(e) => {
                    setFieldValue("intDischargeRate", e.target.value);
                    commonBunkerInputFieldsCalculatorFunc({
                      values: {
                        ...values,
                        intDischargeRate: e.target.value,
                      },
                      setValues: setValues,
                      key: "intDischargeRate",
                    });
                  }}
                  errors={errors}
                  disabled={landingData?.intDischargeRate}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numLoadPortStay || ""}
                  label="Load Port Stay"
                  name="numLoadPortStay"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("numLoadPortStay", e.target.value)
                  }
                  errors={errors}
                  disabled
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numDischargePortStay || ""}
                  label="Discharge Port Stay"
                  name="numDischargePortStay"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("numDischargePortStay", e.target.value)
                  }
                  errors={errors}
                  disabled
                />
              </div>
              {/* new  */}
              <div className="col-lg-3">
                <InputField
                  value={values?.numPortStayVlsfoPerDay || ""}
                  label="Port Stay VLSFO/Day"
                  name="numPortStayVlsfoPerDay"
                  type="number"
                  onChange={(e) => {
                    setFieldValue("numPortStayVlsfoPerDay", e.target.value);
                    commonBunkerInputFieldsCalculatorFunc({
                      values: {
                        ...values,
                        numPortStayVlsfoPerDay: e.target.value,
                      },
                      setValues: setValues,
                      key: "numPortStayVlsfoPerDay",
                    });
                  }}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numPortStayLsmgoPerDay || ""}
                  label="Port Stay LSMGO/Day"
                  name="numPortStayLsmgoPerDay"
                  type="number"
                  onChange={(e) => {
                    setFieldValue("numPortStayLsmgoPerDay", e.target.value);
                    commonBunkerInputFieldsCalculatorFunc({
                      values: {
                        ...values,
                        numPortStayLsmgoPerDay: e.target.value,
                      },
                      setValues: setValues,
                      key: "numPortStayLsmgoPerDay",
                    });
                  }}
                  errors={errors}
                />
              </div>
              {/* end */}
              <div className="col-lg-3">
                <InputField
                  value={values?.numLoadPortStayVlsfoConsumptionMt || ""}
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
                  disabled
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numLoadPortStayLsmgoConsumptionMt || ""}
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
                  disabled
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numDischargePortStayVlsfoConsumptionMt || ""}
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
                  disabled
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numDischargePortStayLsmgoConsumptionMt || ""}
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
                  disabled
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numTotalVlsfoConsumptionMt || ""}
                  label="Total VLSFO Consumption (Mt)"
                  name="numTotalVlsfoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("numTotalVlsfoConsumptionMt", e.target.value)
                  }
                  errors={errors}
                  disabled
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numTotalLsmgoConsumptionMt || ""}
                  label="Total LSMGO Consumption (Mt)"
                  name="numTotalLsmgoConsumptionMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("numTotalLsmgoConsumptionMt", e.target.value)
                  }
                  errors={errors}
                  disabled
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numToleranceVlsfoPercentage || ""}
                  label="Tolerance Percentage"
                  name="numToleranceVlsfoPercentage"
                  type="number"
                  onChange={(e) => {
                    setFieldValue(
                      "numToleranceVlsfoPercentage",
                      e.target.value
                    );
                    commonBunkerInputFieldsCalculatorFunc({
                      values: {
                        ...values,
                        numToleranceVlsfoPercentage: e.target.value,
                      },
                      setValues: setValues,
                      key: "numToleranceVlsfoPercentage",
                    });
                  }}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numNetTotalConsumableVlsfoMt || ""}
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
                  disabled
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numNetTotalConsumableLsmgoMt || ""}
                  label="Net Total Consumable LSMGO (Mt)"
                  name="numNetTotalConsumableLsmgoMt"
                  type="number"
                  onChange={(e) =>
                    setFieldValue(
                      "numNetTotalConsumableLsmgoMt",
                      e.target.value
                    )
                  }
                  errors={errors}
                  disabled
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="strBunkerPort"
                  options={portDDL}
                  value={values?.strBunkerPort || ""}
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
                  value={values?.strBunkerTrader || ""}
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
                  value={values?.strBunkerType || ""}
                  label="Bunker Type"
                  name="strBunkerType"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("strBunkerType", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numDepatureDraftForward || ""}
                  label="Depature Draft Forward"
                  name="numDepatureDraftForward"
                  type="number"
                  onChange={(e) => {
                    setFieldValue(
                      "numDepatureDraftForward",
                      e.target.value
                    );
                  }}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.numDepatureDraftAft || ""}
                  label="Depature Draft Aft"
                  name="numDepatureDraftAft"
                  type="number"
                  onChange={(e) => {
                    setFieldValue(
                      "numDepatureDraftAft",
                      e.target.value
                    );
                  }}
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
