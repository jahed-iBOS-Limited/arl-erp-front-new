import React from 'react'
import { _dateFormatter } from '../../../_helper/_dateFormate'

const AccidentEntryModal = ({ clickedRowItem }) => {
    return (
        <div style={{
            width: '90%',
            margin: 'auto',
        }}>
            <>

                <div className="row mt-3">
                    <div className="col-lg-4">
                        <b>Employee Code</b>
                        <p>{clickedRowItem?.employeeCode}</p>
                    </div>
                    <div className="col-lg-4">
                        <b>Employee Name</b>
                        <p>{clickedRowItem?.employeeName}</p>
                    </div>
                    <div className="col-lg-4">
                        <b>Designation</b>
                        <p>{clickedRowItem?.designationName}</p>
                    </div>
                    <div className="col-lg-4">
                        <b>Contact Number</b>
                        <p>{clickedRowItem?.contactNumber}</p>
                    </div>
                    <div className="col-lg-4">
                        <b>Age</b> <br />
                        <>{clickedRowItem?.age}</>
                    </div>
                    <div className="col-lg-4">
                        <b>Department</b>
                        <p>{clickedRowItem?.departmentName}</p>
                    </div>
                    <div className="col-lg-4">
                        <b>Gender</b>
                        <p>{clickedRowItem?.gender}</p>
                    </div>
                    <div className="col-lg-4">
                        <b>Accident Date</b>
                        <p>{_dateFormatter(clickedRowItem?.accidentDateTime)}</p>
                    </div>
                    <div className="col-lg-4">
                        <b>Place of Accident</b>
                        <p style={{
                            wordBreak: 'break-word'
                        }}>{clickedRowItem?.accidentPlace}</p>
                    </div>
                    <div className="col-lg-4">
                        <b>Reason of Accident</b>
                        <p style={{
                            wordBreak: 'break-word'
                        }}>{clickedRowItem?.accidentReason}</p>
                    </div>
                    <div className="col-lg-4">
                        <b>Name of Injuries</b>
                        <p style={{
                            wordBreak: 'break-word'
                        }}>{clickedRowItem?.nameOfInjuries}</p>
                    </div>
                </div>

                <table className="table table-striped mt-3 bj-table bj-table-landing">
                    <thead>
                        <tr>
                            <th>Witness 1</th>
                            <th>Witness 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{
                                textAlign: 'left'
                            }}>
                                <b>Name: </b>
                                {clickedRowItem?.firstWitnessName}
                            </td>
                            <td style={{
                                textAlign: 'left'
                            }}><b>Name: </b>{clickedRowItem?.secondWitnessName}
                            </td>
                        </tr>
                        <tr >
                            <td style={{
                                textAlign: 'left'
                            }}> <b>Designation: </b> {clickedRowItem?.firstWitnessDesignation}
                            </td>
                            <td style={{
                                textAlign: 'left'
                            }}><b>Designation: </b> {clickedRowItem?.secondWitnessDesignation}
                            </td>
                        </tr>
                        <tr >
                            <td style={{
                                textAlign: 'left'
                            }}> <b>Department:</b> {clickedRowItem?.firstWitnessDepartment}
                            </td>
                            <td style={{
                                textAlign: 'left'
                            }}> <b>Department: </b> {clickedRowItem?.secondWitnessDepartment}
                            </td>
                        </tr>
                    </tbody>
                </table></>
        </div>
    )
}

export default AccidentEntryModal