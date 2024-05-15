import moment from "moment";
import React, { useEffect, useState } from "react";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import Loading from './../../../../_helper/_loading';
import { shipmentTransferDetails_api } from "./../helper";
function TransferDetails({ currentRowData }) {
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentRowData?.shipPint?.value) {
      const {
        selectedBusinessUnit,
        profileData,
        shipPint,
        fromDate,
        fromTime,
        toDate,
        toTime,
        reportType
      } = currentRowData;
      const fromDateTime = moment(`${fromDate} ${fromTime}`).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
      const toDateTime = moment(`${toDate} ${toTime}`).format(
        "YYYY-MM-DDTHH:mm:ss"
      );

      shipmentTransferDetails_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        shipPint?.value,
        fromDateTime,
        toDateTime,
        reportType?.value,
        setRowDto,
        setLoading
      );
    }
  }, [currentRowData]);
  return (
    <>
    {loading && <Loading />}
      <div className="table-responsive">
        <table className="table global-table table-responsive">
          <thead>
            <tr>
              <th>SL</th>
              <th>Challan No</th>
              <th>Date</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>VehicleNo</th>
            </tr>
          </thead>
          <tbody>
            {rowDto?.map((item, index) => (
              <tr key={index}>
                <td> {index + 1} </td>
                <td> {item?.challanNo} </td>
                <td> {_dateFormatter(item?.date)} </td>
                <td> {item?.itemName} </td>
                <td className="text-right"> {item?.quantity} </td>
                <td> {item?.vehicleNo} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TransferDetails;
