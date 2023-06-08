import React from "react";
import { _dateFormatter } from "./../../../_helper/_dateFormate";

function GridTable({ rowDto, printRef }) {
  return (
    <div>
      <div className="loan-scrollable-table">
        <div className="scroll-table _table" style={{ maxHeight: "540px" }}>
          <table
            id="table-to-xlsx"
            className="table table-striped table-bordered bj-table bj-table-landing"
            ref={printRef}
          >
            <thead>
              <tr>
                <th style={{ minWidth: "35px" }}>SL</th>
                <th style={{ minWidth: "45px" }}>Unit</th>
                <th style={{ minWidth: "125px" }}>Challan Number</th>
                <th style={{ minWidth: "75px" }}>Challan Date</th>
                <th style={{ minWidth: "175px" }}>ShipToAddress</th>
                <th style={{ minWidth: "180px" }}>Customer Name</th>
                <th style={{ minWidth: "140px" }}>Customer Address</th>
                <th style={{ minWidth: "100px" }}>Customer Phone 1</th>
                <th style={{ minWidth: "100px" }}>Customer Phone 1</th>
                <th style={{ minWidth: "100px" }}>vehicale No</th>
                <th style={{ minWidth: "60px" }}>Own/Rental</th>
                <th style={{ minWidth: "128px" }}>Product Description</th>
                <th style={{ minWidth: "85px" }}>Received Status</th>
                <th style={{ minWidth: "100px" }}>Problem Description</th>
                <th style={{ minWidth: "100px" }}>Remarks</th>
                <th style={{ minWidth: "125px" }}>User Name</th>
              </tr>
            </thead>
            <tbody>
              {rowDto.length >= 0 &&
                rowDto.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.unit}</td>
                    <td>{item?.challanNumber}</td>
                    <td>{_dateFormatter(item?.challanDate)}</td>
                    <td>{item?.shipToAddress}</td>
                    <td>{item?.customerName}</td>
                    <td>{item?.customerAddress}</td>
                    <td>{item?.customerPhone1}</td>
                    <td>{item?.customerPhone2}</td>
                    <td>{item?.vehicleNo}</td>
                    <td>{item?.ownerType}</td>
                    <td>{item?.productDescription}</td>
                    <td>{item?.receivedStatus ? "true" : "false"}</td>
                    <td>{item?.problemDescription}</td>
                    <td>{item?.remarks}</td>
                    <td>{item?.userName}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default GridTable;
