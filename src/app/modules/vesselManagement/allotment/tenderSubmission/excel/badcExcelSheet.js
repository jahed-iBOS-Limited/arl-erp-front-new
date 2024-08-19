import React, { useRef, useState } from 'react'
import { createExcelSheet, excelSheetUploadHandler } from '../helper'

const BADCExcelSheet = ({ ghatDDL, values }) => {
    const fileInputRef = useRef(null)
    const [mopRowsData, setMopRowsData] = useState([])
    console.log(ghatDDL)
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
                            values
                        );
                        // set to state for track of show & delete
                        // setMopRowsData(data)
                        // remove value from 
                        // remove current file path
                        // console.log(fileInputRef.current.value)
                        fileInputRef.current.value = "";
                    }}
                    hidden
                    ref={fileInputRef}
                    accept=".csv, .ods, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
            </div>

        </div>
    )
}

export default BADCExcelSheet