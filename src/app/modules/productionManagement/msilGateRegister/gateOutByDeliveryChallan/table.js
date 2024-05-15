import React from "react";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import IView from "./../../../_helper/_helperIcons/_view";

export default function PendingTable({
  rowData,
  type,
  setItem,
  setIsShowModel,
  bu,
}) {
  return (
    <>
      {type === 2 ? (
        <div className="table-responsive">
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th style={{ width: "30px" }}>SL</th>
                <th>Entry Date</th>
                <th>In Time</th>
                <th>Reg. No</th>
                <th>Visitor Name</th>
                <th>Mobile Number</th>
                <th>Address</th>
                <th>Vehicle Number</th>
                <th>Reason</th>
                <th>Visited Person</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowData?.gateOut?.length > 0 &&
                rowData?.gateOut.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-center">
                      {_dateFormatter(item?.dteEntryDate)}
                    </td>
                    <td className="text-center">
                      {_timeFormatter(item?.tmInTime || "")}
                    </td>
                    <td className="text-center">{item?.strEntryCode}</td>
                    <td>{item?.strVisitorName}</td>
                    <td className="text-center">{item?.strVisitorMobileNo}</td>
                    <td>{item?.strVisitorAddress}</td>
                    <td className="text-center">{item?.strVehicleNo}</td>
                    <td>{item?.strVisitingReason}</td>
                    <td>{item?.strVisitedPerson}</td>

                    <td className="text-center">
                      <span
                        onClick={() => {
                          setItem(item);
                          setIsShowModel(true);
                        }}
                      >
                        <IView />
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {type === 3 ? (
        <div className="table-responsive">
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th style={{ width: "30px" }}>SL</th>
                <th>Entry Date</th>
                <th>Reg. No</th>
                <th>Driver Name</th>
                <th>Mobile Number</th>
                <th>Vehicle Number</th>
                <th>In Time before lunch</th>
                <th>Out Time before lunch</th>
                <th>In Time after lunch</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowData?.gateOut?.length > 0 &&
                rowData?.gateOut.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-center">
                      {_dateFormatter(item?.dteEntryDate)}
                    </td>
                    <td className="text-center">{item?.strEntryCode}</td>
                    <td>{item?.strDriverName}</td>
                    <td className="text-center">{item?.strDriverMobileNo}</td>
                    <td>{item?.strVehicleNo}</td>
                    <td className="text-center">
                      {_timeFormatter(item?.tmInTime || "")}
                    </td>
                    <td className="text-center">
                      {_timeFormatter(item?.tmOutTime || "")}
                    </td>
                    <td className="text-center">
                      {_timeFormatter(item?.tmInTimeAfterLunch || "")}
                    </td>
                    <td className="text-center">
                      <span
                        onClick={() => {
                          setItem(item);
                          setIsShowModel(true);
                        }}
                      >
                        <IView />
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {type === 1 ? (
        <div className="table-responsive">
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th style={{ width: "30px" }}>SL</th>
                <th>Entry Date</th>
                <th>Reg. No</th>
                <th>Client Type</th>
                <th>Name</th>
                <th>Vehicle Number</th>
                <th>Driver Name</th>
                <th>Mobile Number</th>
                <th>Invoice Number</th>
                <th>Net Weight</th>
                <th>In Time</th>
                <th>Shift In charge</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowData?.gateOut?.length > 0 &&
                rowData?.gateOut.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-center">
                      {_dateFormatter(item?.dteEntryDate)}
                    </td>
                    <td className="text-center">{item?.strEntryCode}</td>
                    <td>{item?.strClientTypeName}</td>
                    <td>{item?.strSupplierName}</td>
                    <td className="text-center">{item?.strVehicleNo}</td>
                    <td>{item?.strDriverName}</td>
                    <td className="text-center">{item?.strDriverMobileNo}</td>
                    <td className="text-center">{item?.strInvoiceNo}</td>
                    <td className="text-center">{item?.numNetWeight}</td>
                    <td className="text-center">
                      {_timeFormatter(item?.tmInTime || "")}
                    </td>
                    <td>{item?.strShiftInCharge}</td>
                    <td className="text-center">
                      <span
                        onClick={() => {
                          setItem(item);
                          setIsShowModel(true);
                        }}
                      >
                        <IView />
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}
