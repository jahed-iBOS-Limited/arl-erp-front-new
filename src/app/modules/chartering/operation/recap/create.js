import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios"; // Import axios for API calls
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";

// Initial data for the form
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

export default function RecapCreate() {
  const [objProps, setObjprops] = useState({});

  // Save handler function to call API and bind data
  const saveHandler = async (values, cb) => {
    const payload = {
      Schedule_to_send: 10,
      Name_of_Vessel: values.vesselName,
      Account_Name: values.accountName,
      Cargo: values.cargoName,
      Cargo_Quantity_MTS: values.cargoQuantity,
      Name_of_Load_Port: values.loadPort,
      Laycan_from: values.laycanFrom,
      Laycan_to: values.laycanTo,
      Load_Rate: values.loadRate,
      Demurrage_Dispatch: values.demurrageDispatch,
      ETA_Load_Port: values.etaLoadPort,
      Discharge_Port: values.dischargePort,
      Discharge_Rate: values.dischargeRate,
      Freight: values.freight,
      Load_port_DA: values.loadPortDA,
      Discharge_port_DA: values.dischargePortDA,
      Shipper_Agent_Email_for_Vessel_Nomination: values.shipperEmail,
      Voyage_Type: values.voyageType,
      Charterer_Name: values.chartererName,
      TimestampforRecap: new Date().toLocaleString(),
    };

    try {
      await axios.post("/automation/recap", payload);
      alert("Submitted Successful");
      cb(); // Call the callback to reset the form
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed");
    }
  };

  return (
    <IForm title="Create Recap" getProps={setObjprops} isHiddenReset={true} isHiddenBack>
      {false && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData} // Initialize form with empty values
        // Add validation schema if needed
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
          isValid,
          errors,
          touched,
        }) => (
          <Form className="form form-label-right">
            {false && <Loading />}
            <div className="form-group global-form row mt-5">
              <div className="col-lg-3">
                <NewSelect
                  name="voyageType"
                  options={[
                    { value: "Voyage Charter", label: "Voyage Charter" },
                    { value: "Time Charter", label: "Time Charter" },
                  ]}
                  value={values.voyageType}
                  label="Voyage"
                  onChange={(valueOption) =>
                    setFieldValue("voyageType", valueOption)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="shipType"
                  options={[
                    { value: "Type1", label: "Type 1" },
                    { value: "Type2", label: "Type 2" },
                  ]}
                  value={values.shipType}
                  label="Ship"
                  onChange={(valueOption) =>
                    setFieldValue("shipType", valueOption)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.vesselName}
                  label="Vessel Name"
                  name="vesselName"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("vesselName", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.accountName}
                  label="Account"
                  name="accountName"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("accountName", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.cargoName}
                  label="Cargo"
                  name="cargoName"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("cargoName", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.cargoQuantity}
                  label="Quantity (Mts)"
                  name="cargoQuantity"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("cargoQuantity", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.deliveryPort}
                  label="Delivery Port"
                  name="deliveryPort"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("deliveryPort", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.loadPort}
                  label="Load Port"
                  name="loadPort"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("loadPort", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.laycanFrom}
                  label="Laycan From"
                  name="laycanFrom"
                  type="date"
                  onChange={(e) =>
                    setFieldValue("laycanFrom", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.laycanTo}
                  label="Laycan To"
                  name="laycanTo"
                  type="date"
                  onChange={(e) =>
                    setFieldValue("laycanTo", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.loadRate}
                  label="Load Rate (Mts)"
                  name="loadRate"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("loadRate", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.demurrageDispatch}
                  label="Demurrage/Dispatch"
                  name="demurrageDispatch"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("demurrageDispatch", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.etaLoadPort}
                  label="ETA Load Port"
                  name="etaLoadPort"
                  type="date"
                  onChange={(e) =>
                    setFieldValue("etaLoadPort", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.dischargePort}
                  label="Discharge Port"
                  name="dischargePort"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("dischargePort", e.target.value)
                  }
                  errors={errors}
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
                  type="text"
                  onChange={(e) => setFieldValue("freight", e.target.value)}
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.loadPortDA}
                  label="Load Port D/A"
                  name="loadPortDA"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("loadPortDA", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.dischargePortDA}
                  label="Discharge Port D/A"
                  name="dischargePortDA"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("dischargePortDA", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.shipperEmail}
                  label="Shipper Email"
                  name="shipperEmail"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("shipperEmail", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.chartererName}
                  label="Charterer"
                  name="chartererName"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("chartererName", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.brokerName}
                  label="Broker"
                  name="brokerName"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("brokerName", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.brokerEmail}
                  label="Broker Email"
                  name="brokerEmail"
                  type="text"
                  onChange={(e) =>
                    setFieldValue("brokerEmail", e.target.value)
                  }
                  errors={errors}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.nominationSchedule}
                  label="Nomination Schedule"
                  name="nominationSchedule"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("nominationSchedule", e.target.value)
                  }
                  errors={errors}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{ display: "none" }}
              ref={objProps?.btnRef}
              onClick={() => handleSubmit()}
            ></button>

            <button
              type="reset"
              style={{ display: "none" }}
              ref={objProps?.resetBtnRef}
              onClick={() => resetForm(initData)}
            ></button>
          </Form>
        )}
      </Formik>
    </IForm>
  );
}
