import React from 'react'
import IDelete from '../../../_helper/_helperIcons/_delete'

function NominationCargosList({ nominationCargosList, handleRemoveCargo, isModalView }) {
    return (
        <div className="row mt-3">
            <div className="col-12">
                {nominationCargosList.length > 0 && (
                    <div className="table-responsive">
                        <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                            <thead>
                                <tr>
                                    <th>SL</th>
                                    <th>Cargo Name</th>
                                    <th>Load Port</th>
                                    <th>Discharge Port</th>
                                    <th>Cargo Quantity</th>
                                    {!isModalView && <th>Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {nominationCargosList.map((cargo, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{cargo.strCargoName}</td>
                                        <td>{cargo.strLoadPortName}</td>
                                        <td>{cargo.strDischargePortName}</td>
                                        <td className="text-center">{cargo.intCargoQuantityMts}</td>
                                        {!isModalView && (<td className="text-center">
                                            <span onClick={() => {
                                                handleRemoveCargo && handleRemoveCargo(idx)
                                            }}>
                                                <IDelete />
                                            </span>
                                        </td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NominationCargosList
