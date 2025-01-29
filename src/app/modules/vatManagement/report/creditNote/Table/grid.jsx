import moment from "moment";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import printIcon from "../../../../_helper/images/print-icon.png";
const GridData = ({ singleData, title, profileData, values }) => {
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
            <div className="report_top mt-5 d-flex flex-column justify-content-center align-items-center">
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
          <div className="col-lg-12">
            <div className="createNoteReportLeft">
              <div className="d-flex justify-content-between">
                <div>
                  <p>
                    <strong>Organization Name:</strong>{" "}
                    {singleData?.objHeader?.organizationName}
                  </p>
                  <p>
                    <strong>Organization Address:</strong>{" "}
                    {singleData?.objHeader?.organizationAddress}
                  </p>
                  <p className="mb-1">
                    <strong>BIN No:</strong>{" "}
                    {singleData?.objHeader?.organizationBinNo}
                  </p>
                  <p>
                    <strong>Customer/Receiver Name:</strong>{" "}
                    {singleData?.objHeader?.customerName}
                  </p>
                  <p>
                    <strong>Customer/Receiver Address:</strong>{" "}
                    {singleData?.objHeader?.customerAddress}
                  </p>
                  <p className="mb-1">
                    <strong>Customer/Receiver BIN No:</strong>{" "}
                    {singleData?.objHeader?.customerBinNo}
                  </p>
                  <p>
                    <strong>Vehicle Type and No:</strong>{" "}
                    {singleData?.objHeader?.vehicleTypeandNo}
                  </p>
                </div>
                <div>
                  <p className="p-0 m-0">
                    <strong>
                      {title === "CREDIT NOTE" ? "Credit Note" : "Debit Note"}{" "}
                      No:{" "}
                    </strong>{" "}
                    {values?.musok}
                  </p>

                  <p className="p-0 m-0">
                    <b>
                      Date of Issue:{" "}
                      {singleData?.objHeader?.taxCreditNoteDateTime &&
                        _dateFormatter(
                          singleData?.objHeader?.taxCreditNoteDateTime
                        )}
                    </b>
                  </p>
                  <p className="p-0 m-0">
                    <b>
                      Time of Issue:{" "}
                      {singleData?.objHeader?.taxCreditNoteDateTime &&
                        moment(
                          singleData?.objHeader?.taxCreditNoteDateTime
                        ).format("LTS")}
                    </b>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-12 pr-0 pl-0">
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th style={{ width: "50px" }} rowspan="2">
                    S/N
                  </th>
                  <th style={{ width: "150px" }} rowspan="2">
                    Orginal Tax Invoice No & Date
                  </th>
                  <th style={{ width: "150px" }} rowspan="2">
                    Details Of Supply
                  </th>
                  <th style={{ width: "150px" }} rowspan="2">
                    Total Price
                  </th>
                  <th style={{ width: "150px" }} colspan="3">
                    Mentioned Original Mushak-6.3
                  </th>
                  <th style={{ width: "150px" }} rowspan="2">
                    Total Price
                  </th>
                  <th style={{ width: "150px" }} colspan="3">
                    Decreased Amount
                  </th>
                </tr>
                <tr>
                  <th style={{ width: "150px" }}>Quantity</th>
                  <th style={{ width: "150px" }}>Vat Amount</th>
                  <th style={{ width: "150px" }}>SD Amount</th>
                  <th style={{ width: "150px" }}>Quantity</th>
                  <th style={{ width: "150px" }}>VAT Amount</th>
                  <th style={{ width: "150px" }}>SD Amount</th>
                </tr>
              </thead>
              <tbody>
                {singleData?.objRow?.map((tableData, index) => {
                  const totalPrice =
                    tableData?.iGrandTotal - (tableData?.dVat + tableData?.dsd);
                  return (
                    <tr key={index}>
                      <td> {index + 1} </td>
                      <td> {tableData?.originalInvoiceNo} </td>
                      <td> {tableData?.supplyDetails} </td>
                      <td> {tableData?.iGrandTotal} </td>
                      <td> {tableData?.iQuantity} </td>
                      <td> {tableData?.iVat} </td>
                      <td> {tableData?.isd} </td>
                      <td> {totalPrice} </td>
                      <td> {tableData?.dQuantity} </td>
                      <td> {tableData?.dVat} </td>
                      <td> {tableData?.dsd} </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colspan="3" style={{ textAlign: "left !important" }}>
                    Total Amount:
                  </td>
                  <td> {claculator(singleData?.objRow, "iGrandTotal")} </td>
                  <td> {claculator(singleData?.objRow, "iQuantity")} </td>
                  <td> {claculator(singleData?.objRow, "iVat")} </td>
                  <td> {claculator(singleData?.objRow, "isd")} </td>
                  <td>
                    {" "}
                    {singleData?.objRow?.reduce(
                      (acc, cur) =>
                        (acc += cur?.iGrandTotal - (cur?.dVat + cur?.dsd)),
                      0
                    )}{" "}
                  </td>
                  <td> {claculator(singleData?.objRow, "dQuantity")} </td>
                  <td> {claculator(singleData?.objRow, "dVat")} </td>
                  <td> {claculator(singleData?.objRow, "isd")} </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="11">Reason of Credit Note:</td>
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
};

export default GridData;
