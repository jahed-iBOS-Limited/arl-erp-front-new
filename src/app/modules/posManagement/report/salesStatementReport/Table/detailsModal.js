import React, { useEffect, useState, useRef } from "react";
import { InventoryLedger_api } from "../helper";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { shallowEqual } from "react-redux";
import { _timeFormatter } from "./../../../../_helper/_timeFormatter";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import Loading from "./../../../../_helper/_loading";
import numberWithCommas from "../../../../_helper/_numberWithCommas";


const DetailsModal = ({ tableItem, values, type }) => {


  const [inventoryLedger, setInventoryLedger] = useState([]);
  const [loading, setLoading] = useState(false);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    // this modal component is used from two place

    InventoryLedger_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.wh?.value,
      values?.plant?.value,
      values?.fromDate,
      values?.toDate,
      // this modal is used from two place, for summary table and for detail table
      // type  1 means summary,
    // type 2 means detail
      tableItem?.opnQty || tableItem?.openQty,
      tableItem?.openValue,
      tableItem?.clossingQty,
      tableItem?.clossingValue,
      tableItem?.intItemId,
      setInventoryLedger,
      setLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableItem]);

  const printRef = useRef();
  return (
    <>
      {loading && <Loading />}
      <div
        className="text-right pointer"
        style={{ position: "absolute", top: "16px", right: "16px" }}
      >
        <ReactToPrint
          trigger={() => (
            <i
              style={{ fontSize: "18px", marginRight: "5px" }}
              className="fas fa-print"
            ></i>
          )}
          content={() => printRef.current}
        />
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button btn btn-primary"
          table="table-to-xlsx"
          filename="Employee Payroll Details"
          sheet="tablexls"
          buttonText="Excel"
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
        <div className="d-flex justify-content-center">
          <h6 className="pr-2">Plant: {values?.plant?.label},</h6>
          <h6>Warehouse: {values?.wh?.label}</h6>
        </div>
        <div className="text-center">
          <h6>Inventory Ledger</h6>
        </div>
        <div>
          <h6 className="text-center">
            Item Name:{" "}
            {`${inventoryLedger?.header?.itemName} (${inventoryLedger?.header?.itemCode}`}
            )
          </h6>
        </div>
        <div className="d-flex justify-content-between">
          <h6>
            From Date: {values?.fromDate} Time:{" "}
            {_timeFormatter(values?.fromTime)}
          </h6>
          <h6>
            To Date: {values?.toDate} Time: {_timeFormatter(values?.toTime)}
          </h6>
        </div>
        <table
          className="table table-striped table-bordered global-table"
          id="table-to-xlsx"
        >
          <thead>
            <tr>
              <th>SL</th>
              <th>Transection Date</th>
              <th>Transection Code</th>
              <th>Transection Name</th>
              <th>Reference Type Name</th>
              <th>Reference No.</th>
              <th>Bin Number</th>
              <th>Location</th>
              {/* <th>Stock Type</th> */}
              <th>Qty.</th>
              <th>Value</th>
              {/* <th>Issue Qty.</th>
              <th>Value</th> */}
              <th>Balance Qty.</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {inventoryLedger?.row?.map((item, index) => {
              //balanceQty = balanceQty + item?.receiveQty - item?.issueQty;
              // balanceValue =
              //   balanceValue + item?.receiveValue - item?.issueValue;
              return (
                <>
                  {index === 0 && (
                    <tr className="bg-light">
                      <td>{index + 1}</td>
                      <td>{values?.fromDate}</td>
                      <td>{"-"}</td>
                      <td>{"Opening Balance"}</td>
                      <td>{"-"}</td>
                      <td>{"-"}</td>
                      <td>{"-"}</td>
                      <td>{"-"}</td>
                      {/* <td>{"-"}</td> */}
                      {/* <td>{"-"}</td> */}
                      <td className="text-right">0</td>
                      <td className="text-right">0</td>
                      {/* <td className="text-right">0</td>
                      <td className="text-right">0</td> */}
                      <td className="text-right">0</td>
                      <td className="text-right">0</td>
                    </tr>
                  )}
                  <tr>
                    <td>{index + 2}</td>
                    <td>{_dateFormatter(item?.transactionDate)}</td>
                    <td>{item?.inventoryTransactionCode}</td>
                    <td>{item?.transactionName}</td>
                    <td>{item?.referenceTypeName}</td>
                    <td>{item?.referenceNo}</td>
                    <td>{item?.binNumber}</td>
                    <td>{item?.inventoryLocationName}</td>
                    {/* <td>{item?.stockTypeName}</td> */}
                    <td className="text-right">
                      {Math.abs(item?.transactionQty || 0)}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(( Math.abs(item?.transactionValue || 0)).toFixed(2))}
                    </td>
                    {/* <td className="text-right">{item?.issueQty}</td>
                    <td className="text-right">{item?.issueValue}</td> */}
                    {/* opening balance 0 */}
                    <td className="text-right">{Math.abs(item?.balanceQty || 0)}</td>
                    {/* opening balance 0 */}
                    <td className="text-right">
                      {numberWithCommas(( Math.abs(item?.balanceValue || 0)).toFixed(2))}
                    </td>
                  </tr>

                  {index === inventoryLedger?.row?.length - 1 && (
                    <tr className="bg-light">
                      <td>{index + 3}</td>
                      <td>{values?.toDate}</td>
                      <td>{"-"}</td>
                      <td>{"Closing Balance"}</td>
                      <td>{"-"}</td>
                      <td>{"-"}</td>
                      <td>{"-"}</td>
                      <td>{"-"}</td>
                      {/* <td>{"-"}</td> */}
                      <td className="text-right">0</td>
                      <td className="text-right">0</td>
                      {/* <td className="text-right">0</td>
                      <td className="text-right">0</td> */}
                      <td className="text-right">0</td>
                      <td className="text-right">0</td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DetailsModal;
