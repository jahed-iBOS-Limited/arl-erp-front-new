import React, { useRef } from 'react'
import IDelete from '../../../../_helper/_helperIcons/_delete'
import { createExcelSheet, excelSheetUploadHandler, mopTenderDataTableHeader } from '../helper'
import "./style.css"
import { ErrorMessage } from 'formik'

const BADCExcelSheet = ({ ghatDDL, values, setFieldValue }) => {
    const fileInputRef = useRef(null)
    // console.log(ghatDDL)
    return (
        <div>
            <div>
                <button
                    className="btn btn-primary mr-1"
                    // create excel sheet & pass ghat ddl for create excel sheet with ghat ddl
                    onClick={() => createExcelSheet(ghatDDL)}
                    type="button">
                    <i className="fa fa-download"></i>
                    Download Excel Sheet
                </button>
                <button
                    className="btn btn-primary mr-1"
                    // create click on input field with this
                    onClick={() => {
                        fileInputRef.current.click();
                    }}
                    type="button"
                >
                    <i className="fa fa-upload"></i>
                    Import Excel
                </button>
                <input
                    type="file"
                    onChange={async (e) => {
                        const data = await excelSheetUploadHandler(
                            e.target.files[0],
                            values,
                            ghatDDL
                        );
                        // set to state for track of show & delete
                        // setMopRowsData(data)
                        // console.log(data)
                        setFieldValue("mopRowsData", data)
                        // remove current file path
                        // console.log(fileInputRef.current.value)
                        fileInputRef.current.value = "";
                    }}
                    hidden
                    ref={fileInputRef}
                    accept=".csv, .ods, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
            </div>

            <p className="text-danger">
                <ErrorMessage name='mopRowsData' />
            </p>

            {/* Show MOP Rows Data Table if Item is Exist */}
            {
                values?.mopRowsData?.length > 1 && <div className="table-responsive">
                    <table className={
                        "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm global-table mop-table-td-right"
                    }>
                        <thead>
                            {mopTenderDataTableHeader?.map(head => (
                                <th>{head}</th>
                            ))}
                        </thead>
                        <tbody>
                            {values?.mopRowsData?.map((item, index) => (
                                <tr key={index}>
                                    <td>{item?.ghatName}</td>
                                    <td>{item?.distance}</td>
                                    <td>{item?.rangOto100}</td>
                                    <td>{item?.rang101to200}</td>
                                    <td>{item?.rang201to300}</td>
                                    <td>{item?.rang301to400}</td>
                                    <td>{item?.rang401to500}</td>
                                    <td>{item?.totalRate}</td>
                                    <td>{item?.taxVat}</td>
                                    <td>{item?.invoiceCost}</td>
                                    <td>{item?.labourBill}</td>
                                    <td>{item?.transPortCost}</td>
                                    <td>{item?.additionalCost}</td>
                                    <td>{item?.totalCost}</td>
                                    <td>{item?.totalRecive}</td>
                                    <td>{item?.quantity}</td>
                                    <td>{item?.billAmount}</td>
                                    <td>{item?.costAmount}</td>
                                    <td>{item?.profitAmount}</td>
                                    <td><IDelete

                                        remover={() => {
                                            const updatedData = values?.mopRowsData?.filter((item, id) => index !== id)
                                            setFieldValue("mopRowsData", updatedData)
                                        }}
                                        id={index}
                                    /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }

        </div>
    )
}

export default BADCExcelSheet