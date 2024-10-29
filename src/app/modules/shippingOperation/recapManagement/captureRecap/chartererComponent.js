import React from "react";
import IDelete from "../../../_helper/_helperIcons/_delete";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { toast } from "react-toastify";

const ChartererComponent = ({ chartererList, setChartererList, chartererDDL, cargoDDL, portDDL, values, setFieldValue, errors, touched, shipperNameList, viewId }) => {
    // Function to handle adding a new charterer
    const handleAddCharterer = () => {
        setChartererList([
            ...chartererList,
            {
                intRowId: 0,
                intVesselNominationId: 0,
                intChartererId: 0,
                strChartererName: "",
                numFreightRate: "",
                strShipperName: "",
                strShipperEmailForVesselNomination: "",
                intShipperId: 0,
                nominationCargosList: [],
            },
        ]);
    };


    // Function to handle adding cargo to a specific charterer
    const handleAddCargo = (index, cargoName, cargoQuantity, loadPort, dischargePort) => {
        const updatedChartererList = [...chartererList];
        const existingCargo = updatedChartererList[index].nominationCargosList.find(
            (cargo) => cargo.strCargoName === cargoName.label
        );

        if(existingCargo){
            return toast.warn("Cargo already exists and will not be added again.")
        }
        
        updatedChartererList[index].nominationCargosList.push({
            intRowId: 0,
            intVesselNominationId: 0,
            intChartererId: updatedChartererList[index].intChartererId,
            intCargoId: +cargoName.value || 0,
            strCargoName: cargoName.label || "",
            intCargoQuantityMts: +cargoQuantity || 0,
            intLoadPortId: +loadPort.value || 0,
            strLoadPortName: loadPort.label || "",
            intDischargePortId: +dischargePort.value || 0,
            strDischargePortName: dischargePort.label || "",
        });
        setChartererList(updatedChartererList);
    };

    // Function to handle removing a cargo from a specific charterer
    const handleRemoveCargo = (chartererIndex, cargoIndex) => {
        const updatedChartererList = [...chartererList];
        updatedChartererList[chartererIndex].nominationCargosList.splice(cargoIndex, 1);
        setChartererList(updatedChartererList);
    };

    // Function to delete an item from chartererList
    const handleDeleteCharterer = (index) => {
        // Create a new list excluding the item to delete
        const updatedList = chartererList.filter((_, i) => i !== index);
        // Update the state
        setChartererList(updatedList);
    };

    return (
        <>
            {chartererList.map((charterer, index) => (
                <div className="p-2 mt-5" style={{ border: '2px solid #CBDCEB', }}>
                    <div key={index} className="form-group global-form mb-4">
                        <div className="row">
                            {(index !== 0 && !viewId) && (<div className="col-12 text-right">
                                <span>
                                    <IDelete remover={() => {
                                        handleDeleteCharterer(index)

                                    }} style={{ fontSize: "14px" }} />
                                </span>
                            </div>)}
                            <div className="col-lg-3">
                                <NewSelect
                                    name={`strChartererName-${index}`}
                                    options={chartererDDL || []}
                                    value={{ value: charterer.intChartererId, label: charterer.strChartererName }}
                                    label="Charterer Name"
                                    onChange={(valueOption) => {
                                        const updatedChartererList = [...chartererList];
                                        updatedChartererList[index].intChartererId = valueOption?.value;
                                        updatedChartererList[index].strChartererName = valueOption?.label;
                                        setChartererList(updatedChartererList);
                                    }}
                                    errors={errors}
                                    touched={touched}
                                    isDisabled={viewId}
                                />
                            </div>
                            <div className="col-lg-3">
                                <InputField
                                    value={charterer.numFreightRate || ""}
                                    label="Freight Rate"
                                    name={`numFreightRate-${index}`}
                                    type="number"
                                    onChange={(e) => {
                                        const updatedChartererList = [...chartererList];
                                        updatedChartererList[index].numFreightRate = +e.target.value;
                                        setChartererList(updatedChartererList);
                                    }}
                                    errors={errors}
                                />
                            </div>
                            <div className="col-lg-3">
                                <NewSelect
                                    name={`strShipperName-${index}`}
                                    options={shipperNameList || []}
                                    value={{ value: charterer.intShipperId, label: charterer.strShipperName }}
                                    label="Shipper Name"
                                    onChange={(valueOption) => {
                                        const updatedChartererList = [...chartererList];
                                        updatedChartererList[index].intShipperId = valueOption?.value;
                                        updatedChartererList[index].strShipperName = valueOption?.label;
                                        updatedChartererList[index].strShipperEmailForVesselNomination = valueOption?.email;
                                        setChartererList(updatedChartererList);
                                    }}
                                    errors={errors}
                                    touched={touched}
                                    isDisabled={viewId}
                                />
                            </div>
                            <div className="col-lg-3">
                                <InputField
                                    value={charterer.strShipperEmailForVesselNomination}
                                    label="Shipper Email"
                                    name={`strShipperEmailForVesselNomination-${index}`}
                                    type="email"
                                    onChange={(e) => {
                                        const updatedChartererList = [...chartererList];
                                        updatedChartererList[index].strShipperEmailForVesselNomination = e.target.value;
                                        setChartererList(updatedChartererList);
                                    }}
                                    errors={errors}
                                />
                            </div>
                        </div>
                        <hr />
                        {!viewId && (<div className="row">
                            <div className="col-lg-3">
                                <NewSelect
                                    name={`cargoName-${index}`}
                                    options={cargoDDL}
                                    label="Cargo Name"
                                    onChange={(valueOption) => {
                                        setFieldValue(`cargoName-${index}`, valueOption)
                                    }}
                                    errors={errors}
                                    touched={touched}
                                    isDisabled={viewId}
                                />
                            </div>
                            <div className="col-lg-3">
                                <InputField
                                    label="Cargo Quantity (Mts)"
                                    name={`cargoQuantity-${index}`}
                                    type="number"
                                    onChange={(e) => {
                                        setFieldValue(`cargoQuantity-${index}`, e.target.value)
                                    }}
                                    errors={errors}
                                />
                            </div>
                            <div className="col-lg-3">
                                <NewSelect
                                    name={`loadPort-${index}`}
                                    options={portDDL}
                                    label="Load Port"
                                    onChange={(valueOption) => {
                                        setFieldValue(`loadPort-${index}`, valueOption)
                                    }}
                                    errors={errors}
                                    touched={touched}
                                    isDisabled={viewId}
                                />
                            </div>
                            <div className="col-lg-3">
                                <NewSelect
                                    name={`dischargePort-${index}`}
                                    options={portDDL}
                                    label="Discharge Port"
                                    onChange={(valueOption) => {
                                        setFieldValue(`dischargePort-${index}`, valueOption)
                                    }}
                                    errors={errors}
                                    touched={touched}
                                    isDisabled={viewId}
                                />
                            </div>
                            {!viewId && (<div className="">
                                <button
                                    disabled={!values[`cargoName-${index}`] || !values[`cargoQuantity-${index}`] || !values[`loadPort-${index}`] || !values[`dischargePort-${index}`]}
                                    type="button"
                                    className="btn btn-primary ml-5 mt-5"
                                    onClick={() => {
                                        handleAddCargo(
                                            index,
                                            values[`cargoName-${index}`] || {},
                                            values[`cargoQuantity-${index}`] || 0,
                                            values[`loadPort-${index}`] || {},
                                            values[`dischargePort-${index}`] || {}
                                        )
                                    }}
                                >
                                    Add Cargo +
                                </button>
                            </div>)}

                        </div>)}


                    </div>
                    {/* Display Cargo List */}
                    <div className="row mt-3">
                        <div className="col-12">
                            {charterer.nominationCargosList.length > 0 && (
                                <div className="table-responsive">
                                    <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                                        <thead>
                                            <tr>
                                                <th>SL</th>
                                                <th>Cargo Name</th>
                                                <th>Load Port</th>
                                                <th>Discharge Port</th>
                                                <th>Cargo Quantity</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {charterer.nominationCargosList.map((cargo, idx) => (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{cargo.strCargoName}</td>
                                                    <td>{cargo.strLoadPortName}</td>
                                                    <td>{cargo.strDischargePortName}</td>
                                                    <td className="text-center">{cargo.intCargoQuantityMts}</td>
                                                    <td className="text-center">
                                                        {!viewId && (<span onClick={() => {
                                                            handleRemoveCargo(index, idx)
                                                        }}>
                                                            <IDelete />
                                                        </span>)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                    {index === chartererList?.length - 1 && (
                        <>
                            {/* Add Charterer Button */}
                            {!viewId && (<div className="row">
                                <div className="col-12 text-center mt-2">
                                    <button
                                        disabled={
                                            !chartererList[index]["strChartererName"] ||
                                            !chartererList[index]["numFreightRate"] ||
                                            !chartererList[index]["strShipperName"] ||
                                            !chartererList[index]["strShipperEmailForVesselNomination"] ||
                                            !chartererList[index]?.nominationCargosList?.length
                                        }

                                        type="button"
                                        className="btn btn-lg btn-info col-lg-6 px-3 py-2"
                                        onClick={handleAddCharterer}
                                    >
                                        + Add Charterer
                                    </button>
                                </div>
                            </div>)}

                        </>
                    )}
                </div>

            ))}
        </>
    );
};

export default ChartererComponent;
