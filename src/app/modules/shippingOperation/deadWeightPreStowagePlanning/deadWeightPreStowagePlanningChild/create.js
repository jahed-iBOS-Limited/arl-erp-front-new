import { Form, Formik } from "formik";
import html2pdf from "html2pdf.js";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { uploadPDF } from "./helper";
import VesselLayoutPDF from "./vesselLayoutPDF";
import { generateFileUrl } from "../../utils/helper";
import EmailEditorForPublicRoutes from "../../utils/emailEditorForPublicRotes";
import { toast } from "react-toastify";

const initData = {
  strName: "",
  strEmail: "",
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

  // ====
  numHold: "",
  holdPort: "",
  holdCargo: "",
  holdCargoQTY: ""
};

export const exportToPDF = (elementId, fileName) => {
  return new Promise((resolve, reject) => {
    const element = document.getElementById(elementId); // Select the HTML element for PDF
    const options = {
      margin: 0,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 1.0 }, // Max quality for image
      html2canvas: {
        scale: 4, // Increased scale for better resolution
        useCORS: true, // Handle cross-origin issues for images
        dpi: 300,
        letterRendering: true,
      },
      jsPDF: {
        unit: "px",
        format: [element.scrollWidth, element.scrollHeight], // Dynamic page size based on content
        orientation: "l" // Landscape orientation
      },
    };

    // Generate PDF from the selected HTML element
    html2pdf()
      .set(options)
      .from(element)
      .toPdf()
      .output("blob")
      .then((pdfBlob) => {
        resolve(pdfBlob); // Return PDF blob for upload or save
      })
      .catch((error) => {
        reject(error);
      });
  });
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
  const [payloadInfo, setPayloadInfo] = useState(null);
  const [uploadLoading, setLoading] = useState(false);
  const [
    vesselNominationData,
    getVesselNominationData,
    loading,
  ] = useAxiosGet();
  const [vesselData, getVesselData, loading2] = useAxiosGet();
  const componentRef = useRef();
  const [holdsArray, setHoldsArray] = useState([]);
  const [portDDL, getPortDDL] = useAxiosGet();
  const [cargoDDL, getCargoDDL] = useAxiosGet();
  const [rows, setRows] = useState([]);

  console.log("rows", rows)



  useEffect(() => {
    getPortDDL(`${imarineBaseUrl}/domain/Stakeholder/GetPortDDL`);
    getCargoDDL(`${imarineBaseUrl}/domain/HireOwner/GetCargoDDL`);


    if (vesselData?.intHoldNumber) {
      const array = Array.from({ length: vesselData.intHoldNumber }, (_, index) => ({
        value: index + 1,
        label: `Hold ${index + 1}`,
      }));
      setHoldsArray(array);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselData?.intHoldNumber]);

  useEffect(() => {
    if (paramId) {
      getVesselNominationData(
        `${imarineBaseUrl}/domain/VesselNomination/GetByIdVesselNomination?VesselNominationId=${paramId}`,
        (nominationData) => {
          getVesselData(
            `${imarineBaseUrl}/domain/VesselNomination/GetVesselMasterData?vesselId=${nominationData?.intVesselId}`
          );
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]);


  const handleAdd = (values, setFieldValue) => {
    // Creating a new row object from the form values
    const newRow = {
      intAutoId: 0,
      intDeadWeightId: 0,
      intVesselNominationId: +paramId || 0,
      numHoldId: +values.numHold?.value || 0,
      intPortId: +values.holdPort?.value || 0,
      strPortName: values.holdPort?.label || "",
      strCargoName: values.holdCargo?.label || "",
      numCargoQuantity: +values.holdCargoQTY || 0,
    };

    setRows((prevRows) => [...prevRows, newRow]);

    setFieldValue("numHold", "");
    setFieldValue("holdPort", "");
    setFieldValue("holdCargo", "");
    setFieldValue("holdCargoQTY", "");
  };


  const saveHandler = async (values, cb) => {
    if (!rows?.length) {
      return toast.warn("Please Add Hold Info for Pre-Stowage")
    }

    let numHoldTotal = 0;
    const numHoldFields = {};

    // Loop through the number of holds and dynamically build the fields
    for (let i = 1; i <= vesselData?.intHoldNumber; i++) {
      const holdValue = +values[`numHold${i}`] || i;
      numHoldFields[`numHold${i}`] = holdValue;
      numHoldTotal += holdValue; // Sum up the values for the total
    }

    // Generate PDF and upload it
    const pdfBlob = await exportToPDF("vesselLayoutPDF", "vessel_nomination");
    const uploadResponse = await uploadPDF(pdfBlob, setLoading);

    // Assuming the response contains the uploaded file ID
    const pdfURL = uploadResponse?.[0]?.id || "";

    const commonPayload = {
      strNameOfVessel: vesselNominationData?.strNameOfVessel || "",
      intVoyageNo: vesselNominationData?.intVoyageNo || "",
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
      strVesselNominationCode:
        paramCode || values?.strVesselNominationCode || "",
      PreStowagePlan: generateFileUrl(pdfURL),
      // Always thouse fileds are bellow of all filed
      // ...numHoldFields, // Spread the dynamically generated numHold fields
      // TotalLoadableQuantity: numHoldTotal, // Add the total loadable quantity
    };

    // Setting payload for display
    setPayloadInfo({
      ...commonPayload,
    });

    // Final payload for API
    const payload = {
      header: {
        ...commonPayload,
        ...numHoldFields, // Spread the dynamically generated numHold fields
        numGrandTotalAmount: numHoldTotal, // Add the grand total amount
        strName: values?.strName,
        strEmail: values?.strEmail,
        intDeadWeightId: 0,
        intAccountId: accountId,
        intBusinessUnitId: 0,
        strBusinessUnitName: "",
        strEmailAddress: "",
        intVesselNominationId: +paramId || 0,
        isActive: true,
        dteCreateDate: _todayDate(),
        intCreateBy: userId,
      },
      rows: rows
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
      .required("Water Density is required")
      .positive("Water Density must be a positive number"),
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
    // intCargoLoadMts: Yup.number()
    //   .required("Cargo Load Mts is required")
    //   .positive("Cargo Load Mts must be a positive number"),
    intFinalCargoToloadMts: Yup.number()
      .required("Final Cargo to Load Mts is required")
      .positive("Final Cargo to Load Mts must be a positive number"),
    strRemarks: Yup.string().optional(),
    strName: Yup.string().required("Name is required"),
    strDraftType: Yup.object()
      .shape({
        value: Yup.string().required("Draft Type is required"),
        label: Yup.string().required("Draft Type is required"),
      })
      .typeError("Draft Type is required"),
    strEmail: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const calculateFinalCargoToload = (values, setFieldValue) => {
    // Use Number() to convert values, defaulting to 0 if conversion fails
    const intDisplacementDraftMts = Number(values.intDisplacementDraftMts) || 0;
    const intLightShipMts = Number(values.intLightShipMts) || 0;
    const intFoFuelOilMts = Number(values.intFoFuelOilMts) || 0;
    const intFoDoDiselOilMts = Number(values.intFoDoDiselOilMts) || 0;
    const intFwFreshWaterMts = Number(values.intFwFreshWaterMts) || 0;
    // const intDockWaterDensity = Number(values.intDockWaterDensity) || 1; // Default to 1 for water density
    const intConstantMts = Number(values.intConstantMts) || 0;
    const intUnpumpAbleBallastMts = Number(values.intUnpumpAbleBallastMts) || 0;
    // const intCargoLoadMts = Number(values.intCargoLoadMts) || 0;

    // Calculate the total of all cargo-related metrics
    const totalCargoToloadMts =
      intFoFuelOilMts +
      intFoDoDiselOilMts +
      intFwFreshWaterMts +
      intConstantMts +
      intUnpumpAbleBallastMts;

    // Calculate the final cargo to load metric
    const finalCargoToloadMts =
      ((intDisplacementDraftMts - intLightShipMts) - totalCargoToloadMts);

    // Ensure the final cargo value is valid and not NaN
    const validFinalCargoToloadMts = isNaN(finalCargoToloadMts)
      ? 0
      : finalCargoToloadMts;

    // Update the final value in the form state, ensuring it's rounded to 2 decimals
    setFieldValue(
      "intFinalCargoToloadMts",
      validFinalCargoToloadMts.toFixed(2)
    );
  };

  const handlePDF = useReactToPrint({
    onPrintError: (error) => console.log(error),
    content: () => componentRef?.current,

  });
  return (
    <div
      style={{
        background: "#fff",
      }}
    >
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          strVesselNominationCode: paramCode || "",
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
        {({
          handleSubmit,
          resetForm,
          values,
          setFieldValue,
          isValid,
          errors,
          touched,
          setValues,
        }) => (
          <>
            {(loader || loading || loading2 || uploadLoading) && <Loading />}
            <IForm
              title={`Create Dead Weight & Pre-Stowage`}
              isHiddenReset
              isHiddenBack
              isHiddenSave
              renderProps={() => {
                return (
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary mr-3"
                      onClick={() => {
                        handlePDF();
                      }}
                    >
                      Export PDF
                    </button>
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
                <div className="form-group  global-form row">
                  <div className="col-12">
                    <h4>Dead Weight</h4>
                  </div>
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
                      onChange={(e) =>
                        setFieldValue("strEmail", e.target.value)
                      }
                      errors={errors}
                    />
                  </div>
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
                      disabled
                    />
                  </div>
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
                  <div className="col-lg-2">
                    <NewSelect
                      name="strDraftType"
                      options={[
                        { value: "Winter", label: "Winter" },
                        { value: "Tropical", label: "Tropical" },
                        { value: "Summer", label: "Summer" },
                      ]}
                      value={values?.strDraftType}
                      label="Draft Type"
                      onChange={(valueOption) => {
                        setValues({
                          ...values,
                          strDraftType: valueOption || "",
                          intDisplacementDraftMts:
                            valueOption?.value === "Winter"
                              ? vesselData?.numWinterDisplacementDraftMts
                              : valueOption?.value === "Tropical"
                                ? vesselData?.numTropicalDisplacementDraftMts
                                : valueOption?.value === "Summer"
                                  ? vesselData?.numSummerDisplacementDraftMts
                                  : 0,
                          // intDockWaterDensity: "",
                          intLightShipMts:
                            valueOption?.value === "Winter"
                              ? vesselData?.numWinterLightShipMts
                              : valueOption?.value === "Tropical"
                                ? vesselData?.numTropicalLightShipMts
                                : valueOption?.value === "Summer"
                                  ? vesselData?.numSummerLightShipMts
                                  : 0,
                          // intFoFuelOilMts: "",
                          // intFoDoDiselOilMts: "",
                          // intFwFreshWaterMts: "",
                          // intConstantMts: "",
                          // intUnpumpAbleBallastMts: "",
                          // intCargoLoadMts: "",
                          // intFinalCargoToloadMts: "",
                        });
                        calculateFinalCargoToload(
                          {
                            ...values,
                            intDisplacementDraftMts:
                              valueOption?.value === "Winter"
                                ? +vesselData?.numWinterDisplacementDraftMts
                                : valueOption?.value === "Tropical"
                                  ? +vesselData?.numTropicalDisplacementDraftMts
                                  : valueOption?.value === "Summer"
                                    ? +vesselData?.numSummerDisplacementDraftMts
                                    : 0,
                            intLightShipMts:
                              valueOption?.value === "Winter"
                                ? +vesselData?.numWinterLightShipMts
                                : valueOption?.value === "Tropical"
                                  ? +vesselData?.numTropicalLightShipMts
                                  : valueOption?.value === "Summer"
                                    ? +vesselData?.numSummerLightShipMts
                                    : 0,
                          },
                          setFieldValue
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-2">
                    <InputField
                      value={values.intDisplacementDraftMts || ""}
                      label="Displacement Draft Mts"
                      name="intDisplacementDraftMts"
                      type="number"
                      onChange={(e) => {
                        setFieldValue(
                          "intDisplacementDraftMts",
                          e.target.value
                        );
                        calculateFinalCargoToload(
                          {
                            ...values,
                            intDisplacementDraftMts: +e.target.value || 0,
                          },
                          setFieldValue
                        );
                      }}
                      errors={errors}
                      disabled={!values?.strDraftType}
                    />
                  </div>

                  <div className="col-lg-2">
                    <InputField
                      value={values.intLightShipMts || ""}
                      label="Light Ship Mts"
                      name="intLightShipMts"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("intLightShipMts", e.target.value);
                        calculateFinalCargoToload(
                          {
                            ...values,
                            intLightShipMts: +e.target.value || 0,
                          },
                          setFieldValue
                        );
                      }}
                      errors={errors}
                      disabled={!values?.strDraftType}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      value={values.intFoFuelOilMts}
                      label="Fuel Oil Mts"
                      name="intFoFuelOilMts"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("intFoFuelOilMts", e.target.value);
                        calculateFinalCargoToload(
                          {
                            ...values,
                            intFoFuelOilMts: +e.target.value || 0,
                          },
                          setFieldValue
                        );
                      }}
                      errors={errors}
                      disabled={!values?.strDraftType}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      value={values.intFoDoDiselOilMts}
                      label="Disel Oil Mts"
                      name="intFoDoDiselOilMts"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("intFoDoDiselOilMts", e.target.value);
                        calculateFinalCargoToload(
                          {
                            ...values,
                            intFoDoDiselOilMts: +e.target.value || 0,
                          },
                          setFieldValue
                        );
                      }}
                      errors={errors}
                      disabled={!values?.strDraftType}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      value={values.intFwFreshWaterMts}
                      label="Fresh Water Mts"
                      name="intFwFreshWaterMts"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("intFwFreshWaterMts", e.target.value);
                        calculateFinalCargoToload(
                          {
                            ...values,
                            intFwFreshWaterMts: +e.target.value || 0,
                          },
                          setFieldValue
                        );
                      }}
                      errors={errors}
                      disabled={!values?.strDraftType}
                    />
                  </div>

                  <div className="col-lg-2">
                    <InputField
                      value={values.intDockWaterDensity}
                      label="Water Density"
                      name="intDockWaterDensity"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("intDockWaterDensity", e.target.value);
                        calculateFinalCargoToload(
                          {
                            ...values,
                            intDockWaterDensity: +e.target.value || 0,
                          },
                          setFieldValue
                        );
                      }}
                      errors={errors}
                      disabled={!values?.strDraftType}
                    />
                  </div>

                  <div className="col-lg-2">
                    <InputField
                      value={values.intConstantMts}
                      label="Constant Mts"
                      name="intConstantMts"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("intConstantMts", e.target.value);
                        calculateFinalCargoToload(
                          {
                            ...values,
                            intConstantMts: +e.target.value || 0,
                          },
                          setFieldValue
                        );
                      }}
                      errors={errors}
                      disabled={!values?.strDraftType}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      value={values.intUnpumpAbleBallastMts}
                      label="UnpumpAble Ballast Mts"
                      name="intUnpumpAbleBallastMts"
                      type="number"
                      onChange={(e) => {
                        setFieldValue(
                          "intUnpumpAbleBallastMts",
                          e.target.value
                        );
                        calculateFinalCargoToload(
                          {
                            ...values,
                            intUnpumpAbleBallastMts: +e.target.value || 0,
                          },
                          setFieldValue
                        );
                      }}
                      errors={errors}
                      disabled={!values?.strDraftType}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      value={values.intCargoLoadMts}
                      label="Cargo Load Mts"
                      name="intCargoLoadMts"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("intCargoLoadMts", e.target.value);
                        calculateFinalCargoToload(
                          {
                            ...values,
                            intCargoLoadMts: +e.target.value || 0,
                          },
                          setFieldValue
                        );
                      }}
                      errors={errors}
                      disabled={!values?.strDraftType}
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
                      disabled={true}
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
                <div className="form-group global-form row">
                  <div className="col-12">
                    <h4>Pre-Stowage</h4>
                  </div>

                  <div className="col-lg-2">
                    <NewSelect
                      name="numHold"
                      options={
                        holdsArray || []
                      }
                      value={values?.numHold}
                      label="Select Hold"
                      onChange={(valueOption) => {
                        setFieldValue("numHold", valueOption || "")
                      }}

                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="holdPort"
                      options={
                        portDDL || []
                      }
                      value={values?.holdPort}
                      label="Select Port"
                      onChange={(valueOption) => {
                        setFieldValue("holdPort", valueOption || "")
                      }}

                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="holdCargo"
                      options={
                        cargoDDL || []
                      }
                      value={values?.holdCargo}
                      label="Select Cargo"
                      onChange={(valueOption) => {
                        setFieldValue("holdCargo", valueOption || "")
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      value={values.holdCargoQTY}
                      label="Cargo Qty"
                      name="holdCargoQTY"
                      type="number"
                      onChange={(e) => {
                        if (+e.target.validationSchema < 0) return;
                        setFieldValue("holdCargoQTY", e.target.value)
                      }
                      }
                    />
                  </div>
                  <div><button disabled={!values?.numHold || !values?.holdPort || !values?.holdCargo || !values?.holdCargoQTY} type="button" onClick={() => { handleAdd(values, setFieldValue) }} className="btn btn-primary mt-5">Add</button></div>
                </div>
                {/* <div className="row mt-5 mb-5">
                  <div className="col-12">
                    <VesselLayout vesselData={vesselData} values={values} />
                  </div>
                </div> */}
                <style type="text/css" media="print">
                  {`
                    @media print {
                      body {
                        background: #fff;
                      }
                      @page {
                        size: landscape !important;
                      }
                      .pdfPrint{
                        margin: 0!important;
                        padding: 0!important;
                        zoom: 80%;
                        }
                      .pdfPrint .content_wrapper {
                        height: 100% !important;
                        max-height: 100% !important;
                        width: auto !important;
                        overflow: visible !important;
                        margin: 0;
                        padding: 0;
                      }

                      .pdfPrint .images_wrapper{
                       zoom: ${vesselData?.intHoldNumber > 7 ? "60%" : "80%"}; 
                      }
                    }
                  `}
                </style>

                <div
                  ref={componentRef}
                  className="mt-5 mb-5 pdfPrint"
                  id="vesselLayoutPDF"
                >
                  <div className="col-12 content_wrapper">
                    <VesselLayoutPDF vesselData={vesselData} values={values} vesselNominationData={vesselNominationData} holdRows={rows} />
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
    </div>
  );
}
