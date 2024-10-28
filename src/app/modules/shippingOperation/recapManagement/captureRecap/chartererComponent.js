import React from "react";
import IDelete from "../../../_helper/_helperIcons/_delete";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";

const ChartererComponent = ({ chartererList, setChartererList, chartererDDL, cargoDDL, portDDL, values, setFieldValue, errors, touched }) => {
    // Function to handle adding a new charterer
    const handleAddCharterer = () => {
        setChartererList([
            ...chartererList,
            {
                intRowId: chartererList.length,
                intVesselNominationId: 0,
                intChartererId: 0,
                strChartererName: "",
                numFreightRate: 0,
                dteServerDatetime: new Date().toISOString(),
                dteLastActionDateTime: new Date().toISOString(),
                isActive: true,
                nominationCargosList: [],
            },
        ]);
    };

    // Function to handle adding cargo to a specific charterer
    const handleAddCargo = (index) => {
        const updatedChartererList = [...chartererList];
        updatedChartererList[index].nominationCargosList.push({
            intRowId: updatedChartererList[index].nominationCargosList.length,
            intVesselNominationId: 0,
            intChartererId: 0,
            intCargoId: 0,
            strCargoName: "",
            intCargoQuantityMts: 0,
            intLoadPortId: 0,
            strLoadPortName: "",
            intDischargePortId: 0,
            strDischargePortName: "",
            dteServerDatetime: new Date().toISOString(),
            dteLastActionDateTime: new Date().toISOString(),
            isActive: true,
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
        <div className="border p-2 mt-5">
            {chartererList.map((charterer, index) => (
                <div key={index} className="form-group global-form mb-4">
                    <div className="row">
                        <div className="col-12 text-right">
                            <span onClick={() => { handleDeleteCharterer(index) }}>
                                <IDelete />
                            </span>
                        </div>
                        <div className="col-lg-3">
                            <NewSelect
                                name={`chartererName-${index}`}
                                options={chartererDDL || []}
                                value={charterer.strChartererName}
                                label="Charterer Name"
                                onChange={(valueOption) => {
                                    const updatedChartererList = [...chartererList];
                                    updatedChartererList[index].intChartererId = valueOption?.value;
                                    updatedChartererList[index].strChartererName = valueOption?.label;
                                    setChartererList(updatedChartererList);
                                }}
                                errors={errors}
                                touched={touched}
                            />
                        </div>
                        <div className="col-lg-3">
                            <InputField
                                value={charterer.numFreightRate}
                                label="Freight Rate"
                                name={`freightRate-${index}`}
                                type="number"
                                onChange={(e) => {
                                    const updatedChartererList = [...chartererList];
                                    updatedChartererList[index].numFreightRate = e.target.value;
                                    setChartererList(updatedChartererList);
                                }}
                                errors={errors}
                            />
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-lg-3">
                            <NewSelect
                                name={`cargoName-${index}`}
                                options={cargoDDL}
                                label="Cargo Name"
                                onChange={(valueOption) => {
                                    // handle cargo name change for a new cargo
                                }}
                                errors={errors}
                                touched={touched}
                            />
                        </div>
                        <div className="col-lg-3">
                            <InputField
                                label="Cargo Quantity (Mts)"
                                name={`cargoQuantity-${index}`}
                                type="number"
                                onChange={(e) => {
                                    // handle cargo quantity change for a new cargo
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
                                    // handle load port change for a new cargo
                                }}
                                errors={errors}
                                touched={touched}
                            />
                        </div>
                        <div className="col-lg-3">
                            <NewSelect
                                name={`dischargePort-${index}`}
                                options={portDDL}
                                label="Discharge Port"
                                onChange={(valueOption) => {
                                    // handle discharge port change for a new cargo
                                }}
                                errors={errors}
                                touched={touched}
                            />
                        </div>
                        <div className="">
                            <button
                                className="btn btn-primary ml-5 mt-5"
                                onClick={() => handleAddCargo(index)}
                            >
                                Add Cargo +
                            </button>
                        </div>
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
                                                    <td>{cargo.intCargoQuantityMts}</td>
                                                    <td className="text-center">
                                                        <span onClick={() => {
                                                            handleRemoveCargo(index, idx)
                                                        }}>
                                                            <IDelete />
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Add Charterer Button */}
            <div className="row">
                <div className="col-12 text-center mt-2">
                    <button
                        type="button"
                        className="btn btn-lg btn-info col-lg-6 px-3 py-2"
                        onClick={handleAddCharterer}
                    >
                        + Add Charterer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChartererComponent;
