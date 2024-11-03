import React, { useState } from "react";
import IDelete from "../../../_helper/_helperIcons/_delete";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { toast } from "react-toastify";
import NominationCargosList from "./nominationCargosList";

const ChartererComponent = ({ chartererList, setChartererList, chartererDDL, cargoDDL, portDDL, values, setFieldValue, errors, touched, shipperNameList, viewId }) => {

    const [nominationCargosList, setNominationCargosList] = useState([])
    // Function to handle adding a new charterer
    const handleAddCharterer = (values) => {

        if (!nominationCargosList?.length) {
            return ("Add at least one Nomination Cargo")
        }

        setChartererList([
            ...chartererList,
            {
                intRowId: 0,
                intVesselNominationId: 0,
                intChartererId: +values?.strChartererName?.value || 0,
                strChartererName: values?.strChartererName?.label || "",
                numFreightRate: +values?.numFreightRate || 0,
                strShipperName: values?.strShipperName?.label || "",
                strShipperEmailForVesselNomination: values?.strShipperEmailForVesselNomination || "",
                intShipperId: values?.strShipperName?.value || 0,
                nominationCargosList: nominationCargosList,
            },
        ]);

        setNominationCargosList([])
    };


    // Function to handle adding cargo to a specific charterer
    const handleAddCargo = (values) => {

        const newCargoList = {
            intRowId: 0,
            intVesselNominationId: 0,
            intChartererId: values?.strChartererName?.value,
            intCargoId: +values?.cargoName.value || 0,
            strCargoName: values?.cargoName.label || "",
            intCargoQuantityMts: +values?.cargoQuantity || 0,
            intLoadPortId: +values?.loadPort.value || 0,
            strLoadPortName: values?.loadPort.label || "",
            intDischargePortId: +values?.dischargePort.value || 0,
            strDischargePortName: values?.dischargePort.label || "",
        }
        setNominationCargosList([...nominationCargosList, newCargoList]);
    };

    // Function to handle removing a cargo from a specific charterer
    const handleRemoveCargo = (cargoIndex) => {
        const updateCargoList = nominationCargosList.filter((item, index) => index !== cargoIndex);
        setNominationCargosList(updateCargoList);
    };



    return (
        <>
            <div className="p-2 mt-5" style={{ border: '2px solid #CBDCEB', }}>
                <div className="form-group global-form mb-4">
                    <div className="row">

                        <div className="col-lg-3">
                            <NewSelect
                                name="strChartererName"
                                options={chartererDDL || []}
                                value={values?.strChartererName}
                                label="Charterer Name"
                                onChange={(valueOption) => {
                                    setFieldValue("strChartererName", valueOption)
                                    setNominationCargosList([]);
                                }}
                                errors={errors}
                                touched={touched}
                            />
                        </div>
                        <div className="col-lg-3">
                            <InputField
                                value={values?.numFreightRate || ""}
                                label="Freight Rate"
                                name="numFreightRate"
                                type="number"
                                onChange={(e) => {
                                    setFieldValue("numFreightRate", e.target.value)
                                }}
                                errors={errors}
                            />
                        </div>
                        <div className="col-lg-3">
                            <NewSelect
                                name="strShipperName"
                                options={shipperNameList || []}
                                value={values?.strShipperName}
                                label="Shipper Name"
                                onChange={(valueOption) => {
                                    setFieldValue("strShipperName", valueOption)
                                    setFieldValue("strShipperEmailForVesselNomination", valueOption?.email || "")
                                }}
                                errors={errors}
                                touched={touched}
                            />
                        </div>
                        <div className="col-lg-3">
                            <InputField
                                value={values.strShipperEmailForVesselNomination}
                                label="Shipper Email"
                                name="strShipperEmailForVesselNomination"
                                type="email"
                                onChange={(e) => {
                                    setFieldValue("strShipperEmailForVesselNomination", e.target.value)
                                }}
                                errors={errors}
                            />
                        </div>
                    </div>
                    <hr />

                    <div className="row">
                        <div className="col-lg-3">
                            <NewSelect
                                name="cargoName"
                                value={values?.cargoName}
                                options={cargoDDL}
                                label="Cargo Name"
                                onChange={(valueOption) => {
                                    setFieldValue("cargoName", valueOption)
                                }}
                                errors={errors}
                                touched={touched}
                            />
                        </div>
                        <div className="col-lg-3">
                            <InputField
                                label="Cargo Quantity (Mts)"
                                value={values?.cargoQuantity}
                                name="cargoQuantity"
                                type="number"
                                onChange={(e) => {
                                    setFieldValue("cargoQuantity", e.target.value)
                                }}
                                errors={errors}
                            />
                        </div>
                        <div className="col-lg-3">
                            <NewSelect
                                name="loadPort"
                                options={portDDL}
                                label="Load Port"
                                value={values?.loadPort}
                                onChange={(valueOption) => {
                                    setFieldValue("loadPort", valueOption)
                                }}
                                errors={errors}
                                touched={touched}
                            />
                        </div>
                        <div className="col-lg-3">
                            <NewSelect
                                name="dischargePort"
                                value={values?.dischargePort}
                                options={portDDL}
                                label="Discharge Port"
                                onChange={(valueOption) => {
                                    setFieldValue("dischargePort", valueOption)
                                }}
                                errors={errors}
                                touched={touched}
                            />
                        </div>
                        <div className="">
                            <button
                                disabled={!values?.strChartererName || !values?.cargoName || !values?.cargoQuantity || !values?.loadPort || !values?.dischargePort}
                                type="button"
                                className="btn btn-primary ml-5 mt-5"
                                onClick={() => {

                                    const existingCargo = nominationCargosList.find(
                                        (cargo) => cargo.strCargoName === values?.cargoName.label
                                    );

                                    if (existingCargo) {
                                        return toast.warn("Cargo already exists and will not be added again.")
                                    }

                                    setFieldValue("cargoName", "")
                                    setFieldValue("cargoQuantity", "")
                                    setFieldValue("loadPort", "")
                                    setFieldValue("dischargePort", "")
                                    handleAddCargo(values)
                                }}
                            >
                                Add Cargo +
                            </button>
                        </div>

                    </div>


                </div>
                {/* Display Cargo List */}
                <NominationCargosList
                    nominationCargosList={nominationCargosList} handleRemoveCargo={handleRemoveCargo}
                />


                <div className="row">
                    <div className="col-12 text-center mt-2">
                        <button
                            disabled={
                                !values?.strChartererName ||
                                !values?.numFreightRate ||
                                !values?.strShipperName ||
                                !values?.strShipperEmailForVesselNomination ||
                                !nominationCargosList?.length
                            }

                            type="button"
                            className="btn btn-lg btn-info col-lg-6 px-3 py-2"
                            onClick={() => {

                                const existingCharterer = chartererList.find(
                                    (cargo) => cargo.strChartererName === values?.strChartererName.label
                                );

                                if (existingCharterer) {
                                    return toast.warn("Charterer already exists and will not be added again.")
                                }

                                setFieldValue("strChartererName", "")
                                setFieldValue("numFreightRate", "")
                                setFieldValue("strShipperName", "")
                                setFieldValue("strShipperEmailForVesselNomination", "")

                                handleAddCharterer(values)
                            }}
                        >
                            + Add Charterer
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChartererComponent;
