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

export default function CustomerChallanFromGhatDetails({ rowDto, loading }) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const printRef = useRef();

  const totals = {
    totalQuantity: 0,
    totalAmount: 0,
  };

  return (
    <>
      <ICard
        printTitle="Print"
        isPrint={true}
        isShowPrintBtn={true}
        componentRef={printRef}
        isExcelBtn={true}
        excelFileNameWillbe="Customer Challan From Ghat Details"
        title="Customer Challan From Ghat Details"
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
                <th>Rate</th>
                <th>Total Amount</th>
                <th>Date</th>
                <th>ShipPoint</th>
                <th>Customer Name</th>
              </tr>
            </thead>

            <tbody>
              {rowDto?.map((itm, i) => {
                totals.totalQuantity += itm?.quantity;
                totals.totalAmount += itm?.totalAmount;
                return (
                  <tr key={i}>
                    <td className="text-center"> {i + 1}</td>
                    <td> {itm?.deliveryCode}</td>
                    <td> {itm?.itemName}</td>
                    <td className="text-right"> {itm?.quantity}</td>
                    <td className="text-right"> {itm?.itemPrice}</td>
                    <td className="text-right"> {itm?.totalAmount}</td>
                    <td> {_dateFormatter(itm?.date)}</td>
                    <td> {itm?.shippoint}</td>
                    <td> {itm?.partnerName}</td>
                  </tr>
                );
              })}
              <tr style={{ fontWeight: "bold" }} className="text-right">
                <td colSpan="3" className="text-right">
                  {" "}
                  Total
                </td>
                <td>{totals.totalQuantity}</td>
                <td></td>
                <td>{totals.totalAmount}</td>
                <td colSpan="4"></td>
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
