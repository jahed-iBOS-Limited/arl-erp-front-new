import React, { useEffect, useState, useRef } from "react";
import { InventoryLedger_api } from "../helper";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { shallowEqual } from "react-redux";
// import { _timeFormatter } from "./../../../../_helper/_timeFormatter";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
const DetailsModal = ({ tableItem, values }) => {
  const [inventoryLedger, setInventoryLedger] = useState([]);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    InventoryLedger_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.customer?.value,
      values?.fromDate,
      values?.toDate,
      setInventoryLedger
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableItem]);

  const printRef = useRef();
  return (
    <>
      <div
        className="text-right pointer"
        style={{ position: "absolute", top: "16px", right: "16px" }}
      >
        <ReactToPrint
          trigger={() => (
            <i style={{ fontSize: "18px" }} className="fas fa-print"></i>
          )}
          content={() => printRef.current}
        />
      </div>

      <div className="inventoryStatement-reports mt-6 " ref={printRef}>
        <div
          className="text-right pointer"
          style={{ position: "absolute", top: "161px", right: "42px" }}
        ></div>
        <div className="text-center">
          <h3>Business Unit : {selectedBusinessUnit?.label}</h3>
        </div>
        
        <div className="text-center">
          <h6>Inventory Ledger</h6>
        </div>
        <div className="d-flex justify-content-around">
          <h6>
            From Date: {values?.fromDate}
          </h6>
          <h6>
            To Date: {values?.toDate}
          </h6>
        </div>
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Transection Date</th>
              <th>Transection Name</th>
              <th>Reference No.</th>
              <th>Inventory Location</th>
              <th>Stock Type</th>
              <th>Receive Qty.</th>
              <th>Value</th>
              <th>Issue Qty.</th>
              <th>Value</th>
              <th>Balance Qty.</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {inventoryLedger?.row?.map((item, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{_dateFormatter(item?.transactionDate)}</td>
                <td>{item?.transactionName}</td>
                <td>{item?.referenceNo}</td>
                <td>{item?.inventoryLocationName}</td>
                <td>{item?.stockTypeName}</td>
                <td>{item?.receiveQty}</td>
                <td>{item?.receiveValue}</td>
                <td>{item?.issueQty}</td>
                <td>{item?.issueValue}</td>
                <td>{item?.balanceQty}</td>
                <td>{item?.balanceValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DetailsModal;
