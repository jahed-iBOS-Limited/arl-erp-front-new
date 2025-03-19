import React, { useRef } from "react";
import Loading from "../../../../../_helper/_loading";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import ReactToPrint from "react-to-print";
import printIcon from "./../../../../../_helper//images/print-icon.png";
import { _fixedPoint } from "../../../../../_helper/_fixedPoint";

import moment from "moment";
function PrintFormetReportDebitNote({
  singleData,
  viewClick,
  profileData,
  title,
  loading,
}) {
  const printRef = useRef();
  const claculator = (arr, key) => {
    const total = arr?.reduce((acc, cur) => (acc += cur?.[key]), 0);
    return total;
  };
  return (
    <>
      <div componentRef={printRef} ref={printRef} className="print_wrapper">
        <div className="row global-table">
          <div className="col-lg-12 text-right printSectionNone">
            <ReactToPrint
              trigger={() => (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: "2px 5px" }}
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
          <div className="col-lg-12">
            <div
              className="report_top mt-5 d-flex flex-column justify-content-center align-items-center"
              style={{ position: "relative" }}
            >
              <div style={{ position: "absolute", top: "11px", right: "0" }}>
                <span
                  style={{ border: "1px solid gray", fontSize: 18 }}
                  className="p-2"
                >
                  <strong>Mushak-6.8</strong>
                </span>
              </div>
              <p className="mb-1">
                Government of the People's Republic of Bangladesh
              </p>
              <p className="mb-1">National Board of Revenue</p>
              <h1 className="mb-1">{title}</h1>
              <p className="mb-1">
                (See clauses (g) of Sub-Rule (1) of Rule 40)
              </p>
            </div>
          </div>
          <div className="col-lg-12 d-flex justify-content-between">
            {/* <div className="createNoteReportLeft">
              <p className="p-0 m-0">
                <strong>Organization Name: </strong>
                {singleData?.objHeader?.organizationName}
              </p>
              <p className="p-0 m-0">
                <strong>Organization Address: </strong>
                {singleData?.objHeader?.organizationAddress}
              </p>
              <p className="p-0 m-0">
                <strong>BIN No: </strong>
                {singleData?.objHeader?.organizationBinNo}
              </p>
              <p className="p-0 m-0">
                <strong>Customer/Receiver Name: </strong>
                {singleData?.objHeader?.supplierName}
              </p>
              <p className="p-0 m-0">
                <strong>Customer/Receiver Address: </strong>
                {singleData?.objHeader?.supplierAddress}
              </p>
              <p className="p-0 m-0">
                <strong>Customer/Receiver BIN No: </strong>
                {singleData?.objHeader?.supplierBinNo}
              </p>
              <p className="p-0 m-0">
                <strong>Vehicle Type and No: </strong>
                {singleData?.objHeader?.vehicleTypeAndNo}
              </p>
            </div> */}
            <div className="createNoteReportLeft">
              <p className="p-0 m-0">
                <strong>Organization Name: </strong>
                {singleData?.objHeader?.supplierName}
              </p>
              <p className="p-0 m-0">
                <strong>Organization Address: </strong>
                {singleData?.objHeader?.supplierAddress}
              </p>
              <p className="p-0 m-0">
                <strong>BIN No: </strong>
                {singleData?.objHeader?.supplierBinNo}
              </p>
              <p className="p-0 m-0">
                <strong>Customer/Receiver Name: </strong>
                {singleData?.objHeader?.organizationName}
              </p>
              <p className="p-0 m-0">
                <strong>Customer/Receiver Address: </strong>
                {singleData?.objHeader?.organizationAddress}
              </p>
              <p className="p-0 m-0">
                <strong>Customer/Receiver BIN No: </strong>
                {singleData?.objHeader?.organizationBinNo}
              </p>
              <p className="p-0 m-0">
                <strong>Vehicle Type and No: </strong>
                {singleData?.objHeader?.vehicleTypeAndNo}
              </p>
            </div>
            <div className="createNoteReportRight">
              {/* <p>
                <strong>Telephone:</strong>
              </p>
              <p className="mb-1">
                <strong>Fax:</strong>
              </p> */}
              <p className="p-0 m-0">
                <strong>Debit Note No: </strong> {viewClick?.taxPurchaseCode}
              </p>
              {/* <p className="p-0 m-0">
                <strong>Date: </strong>
                {_dateFormatter(singleData?.objHeader?.taxPurchaseDate)}
              </p> */}
              <p className="p-0 m-0">
                <b>
                  Date of Issue:
                  {singleData?.objHeader?.taxPurchaseDate &&
                    _dateFormatter(singleData?.objHeader?.taxPurchaseDate)}
                </b>
              </p>
              <p className="p-0 m-0">
                <b>
                  Time of Issue:{" "}
                  {moment(singleData?.objHeader?.taxPurchaseDate).format("LTS")}
                </b>
              </p>
            </div>
          </div>

          <div className="col-lg-12 pr-0 pl-0">
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th style={{ width: "20px" }} rowspan="2">
                    S/N
                  </th>
                  <th style={{ width: "100px" }} rowspan="2">
                    Orginal Tax Invoice No & Date
                  </th>

                  <th style={{ width: "150px" }} rowspan="2">
                    Details Of Supply
                  </th>
                  <th style={{ width: "150px" }} colspan="4">
                    Mentioned Original Mushak-6.3
                  </th>
                  {/* <th style={{ width: "150px" }} rowspan="2">
                    Total Price
                  </th> */}
                  <th style={{ width: "150px" }} colspan="4">
                    Related to Increase Adjustment
                  </th>
                </tr>
                <tr>
                  <th style={{ width: "150px" }}>Total Price</th>
                  <th style={{ width: "150px" }}>Quantity</th>
                  <th style={{ width: "150px" }}>Vat Amount</th>
                  <th style={{ width: "150px" }}>SD Amount</th>
                  <th style={{ width: "150px" }}>Total Price</th>
                  <th style={{ width: "150px" }}>Quantity</th>
                  <th style={{ width: "150px" }}>VAT Amount</th>
                  <th style={{ width: "150px" }}>SD Amount</th>
                </tr>
              </thead>
              {singleData?.objRow?.length > 0 && (
                <tbody>
                  {loading && <Loading />}
                  {singleData?.objRow?.map((tableData, index) => {
                    return (
                      <tr key={index}>
                        <td> {index + 1} </td>
                        <td> {tableData?.originalInvoiceNo} </td>
                        <td> {tableData?.supplyDetails} </td>
                        <td className="text-right">
                          {" "}
                          {_fixedPoint(tableData?.iGrandTotal)}{" "}
                        </td>
                        <td className="text-right">
                          {" "}
                          {_fixedPoint(tableData?.iQuantity)}{" "}
                        </td>
                        <td className="text-right">
                          {" "}
                          {_fixedPoint(tableData?.iVat)}{" "}
                        </td>
                        <td className="text-right">
                          {" "}
                          {_fixedPoint(tableData?.isd)}{" "}
                        </td>
                        <td className="text-right">
                          {" "}
                          {_fixedPoint(tableData?.grandTotal)}
                        </td>
                        <td className="text-right">
                          {" "}
                          {_fixedPoint(tableData?.dQuantity)}{" "}
                        </td>
                        <td className="text-right">
                          {" "}
                          {_fixedPoint(tableData?.dVat)}{" "}
                        </td>
                        <td className="text-right">
                          {" "}
                          {_fixedPoint(tableData?.dsd)}{" "}
                        </td>
                      </tr>
                    );
                  })}
                  <tr style={{ backgroundColor: "#f1e4e4" }}>
                    <td colspan="3" style={{ textAlign: "right !important" }}>
                      <b>Total Amount:</b>
                    </td>
                    <td className="text-right">
                      <b>
                        {_fixedPoint(
                          claculator(singleData?.objRow, "iGrandTotal")
                        )}
                      </b>
                    </td>
                    <td className="text-right">
                      <b>
                        {_fixedPoint(
                          claculator(singleData?.objRow, "iQuantity")
                        )}
                      </b>
                    </td>
                    <td className="text-right">
                      <b>
                        {_fixedPoint(claculator(singleData?.objRow, "iVat"))}
                      </b>
                    </td>
                    <td className="text-right">
                      <b>
                        {_fixedPoint(claculator(singleData?.objRow, "isd"))}
                      </b>
                    </td>
                    <td className="text-right">
                      <b>
                        {_fixedPoint(
                          claculator(singleData?.objRow, "grandTotal")
                        )}
                      </b>
                    </td>
                    <td className="text-right">
                      <b>
                        {_fixedPoint(
                          claculator(singleData?.objRow, "dQuantity")
                        )}
                      </b>
                    </td>
                    <td className="text-right">
                      <b>
                        {_fixedPoint(claculator(singleData?.objRow, "dVat"))}
                      </b>
                    </td>
                    <td className="text-right">
                      <b>
                        {_fixedPoint(claculator(singleData?.objRow, "dsd"))}
                      </b>
                    </td>
                  </tr>
                </tbody>
              )}

              <tfoot>
                <tr>
                  <td colspan="11">
                    {`Reason of Debit Note: ${singleData?.objHeader
                      ?.narration || ""}`}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="col-lg-12 mt-6">
          <p className="mb-0">
            <strong>Name: </strong> {profileData?.userName}
          </p>
          <p className="mb-0">
            <strong>Designation: </strong> {profileData?.designationName}
          </p>
          <p className="mt-2">
            <strong>Signature:</strong>
          </p>
        </div>
      </div>
    </>
  );
}

export default PrintFormetReportDebitNote;
