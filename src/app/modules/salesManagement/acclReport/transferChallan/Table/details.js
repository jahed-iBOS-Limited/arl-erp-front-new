/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import {
  _todaysEndTime,
  _todaysStartTime,
} from "../../../../_helper/_currentTime";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";

export default function TransferChallanDetails({ rowDto, loading }) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const printRef = useRef();

  let totalQuantity = 0;

  return (
    <>
      <ICard
        printTitle="Print"
        isPrint={true}
        isShowPrintBtn={true}
        componentRef={printRef}
        isExcelBtn={true}
        excelFileNameWillbe="Transfer Challan Details"
        title="Transfer Challan Details"
        exportTableId="table-to-xlsx-two"
      >
        {loading && <Loading />}

        {rowDto?.length ? (
          <table
            ref={printRef}
            id="table-to-xlsx-two"
            className="table table-striped table-bordered global-table table-font-size-sm"
          >
            <thead>
              <tr>
                <th>SL</th>
                <th>Challan number</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>ShipPoint</th>
                <th>Vehicle Number</th>
              </tr>
            </thead>

            <tbody>
              {rowDto?.map((itm, i) => {
                totalQuantity += itm?.quantity;
                return (
                  <tr key={i}>
                    <td className="text-center"> {i + 1}</td>
                    <td> {itm?.transactionCode}</td>
                    <td> {itm?.itemName}</td>
                    <td className="text-right"> {itm?.quantity}</td>
                    <td> {_dateFormatter(itm?.date)}</td>
                    <td> {itm?.shippointName}</td>
                    <td> {itm?.vehicleNo}</td>
                  </tr>
                );
              })}
              <tr style={{ fontWeight: "bold" }} className="text-right">
                <td colSpan="3" className="text-right">
                  {" "}
                  Total
                </td>
                <td>{totalQuantity}</td>
                <td colSpan="3"></td>
              </tr>
            </tbody>
          </table>
        ) : (
          <h4 className="text-center pt-5">No Data Found</h4>
        )}
      </ICard>
    </>
  );
}
