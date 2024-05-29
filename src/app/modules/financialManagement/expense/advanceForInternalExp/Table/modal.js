import { Form, Formik } from 'formik';
import React, { useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import ReactToPrint from 'react-to-print';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import printIcon from "../../../../_helper/images/print-icon.png";
const ViewRowItem = ({ children }) => {
    const printRef = useRef();
    console.log("test", children)
    const storeData = useSelector((state) => {
        return {
            profileData: state?.authData?.profileData,
            selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
        };
    }, shallowEqual);
    const { selectedBusinessUnit } = storeData;


    return (
        <Formik
            enableReinitialize={true}
            initialValues={{}}
        >
            {({
                handleSubmit,
                resetForm,
                values,
                errors,
                touched,
                setFieldValue,
                isValid,
            }) => (
                <>
                    <Form
                        className="form form-label-right"
                        componentRef={printRef}
                        ref={printRef}
                    >
                        <div className="row mr-2 ml-1">
                            <div className="col-lg-12 mt-5">
                                <div
                                    className="text-center "
                                    style={{ position: "relative" }}
                                >
                                    <h2>{selectedBusinessUnit?.label}</h2>
                                    <h5> {selectedBusinessUnit?.address}</h5>
                                    <h3>Advance For Internal Expense</h3>

                                    <ReactToPrint
                                        pageStyle={
                                            "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}"
                                        }
                                        trigger={() => (
                                            <button
                                                type="button"
                                                className="btn btn-primary printSectionNone"
                                                style={{
                                                    padding: "2px 5px",
                                                    position: "absolute",
                                                    top: "0",
                                                    right: "0",
                                                }}
                                            >
                                                <img
                                                    style={{
                                                        width: "25px",
                                                        paddingRight: "5px",
                                                    }}
                                                    src={printIcon}
                                                    alt="print-icon"
                                                />
                                                Print
                                            </button>
                                        )}
                                        content={() => printRef.current}
                                    />
                                </div>
                            </div>

                            <div className="col-lg-12 mt-6 d-flex flex-wrap" style={{ fontSize: "15px" }}>
                                <p className="pr-4">
                                    <b>Disbursement Center:</b>{" "}
                                    {children?.disbursementCenterName}
                                </p>
                                <p className="pr-4">
                                    <b>Expense Group:</b>{" "}
                                    {children?.expenseGroup}
                                </p>
                                <p className="pr-4">
                                    <b>Currency Name:</b>{" "} {children?.currencyName}
                                </p>
                                <p className="pr-4">
                                    <b>Payment Type:</b>{" "} {children?.instrumentName}
                                </p>
                                <p className="pr-4">
                                    <b>Due Date</b>{" "} {_dateFormatter(children?.dueDate)}
                                </p>
                            </div>
                        </div>
                        <div className="row w-100 mr-2 ml-1">
                            <div className="col-lg-12">
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm global-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "40px" }}>SL</th>
                                                <th style={{ width: "100px" }}>Advance Code</th>
                                                <th style={{ width: "57px" }}>Employee Id:</th>
                                                <th style={{ width: "80px" }}>Employee Name</th>
                                                <th style={{ width: "80px" }}>Requested Ammount</th>
                                                <th style={{ width: "80px" }}>Requested Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="advanceInternalExp_table">
                                            <tr>
                                                <td className="text-center">
                                                    <div className="pl-2">
                                                        1
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div className="pl-2">
                                                        {children?.advanceCode}
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div className="pl-2">
                                                        {children?.employeeId}
                                                    </div>
                                                </td>
                                                <td className="text-left">
                                                    <div className="pl-2">
                                                        {children?.employeeName}
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div className="pl-2">
                                                        {children?.requestedAmmount}
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div className="pl-2">
                                                        {_dateFormatter(children?.requestDate)}
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </Form>
                </>
            )}
        </Formik>
    )
}

export default ViewRowItem