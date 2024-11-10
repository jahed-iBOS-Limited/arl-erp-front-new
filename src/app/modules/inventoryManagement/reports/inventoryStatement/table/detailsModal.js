import React, { useEffect, useState, useRef } from "react";
import { InventoryLedger_api } from "../helper";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { shallowEqual } from "react-redux";
import { _timeFormatter } from "./../../../../_helper/_timeFormatter";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import Loading from "./../../../../_helper/_loading";
const DetailsModal = ({ tableItem, values }) => {
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
    InventoryLedger_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.wh?.value,
      values?.plant?.value,
      values?.fromDate,
      values?.toDate,
      tableItem?.openingQty,
      tableItem?.openingValue,
      tableItem?.closingQty,
      tableItem?.closingValue,
      tableItem?.itemId,
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
        <div className="table-responsive">
          <table
            className="table table-striped table-bordered global-table"
            id="table-to-xlsx"
          >
            <thead>
              <tr>
                <th>SL</th>
                <th>Transection Date</th>
                <th>Transection Name</th>
                <th>Reference No.</th>
                <th>Bin Number</th>
                <th>Inventory Location</th>
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
              {console.log(inventoryLedger)}
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
                        <td>{"Opening Balance"}</td>
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
                      <td>{item?.transactionName}</td>
                      <td>{item?.referenceNo}</td>
                      <td>{item?.binNumber}</td>
                      <td>{item?.inventoryLocationName}</td>
                      {/* <td>{item?.stockTypeName}</td> */}
                      <td className="text-right">{item?.transactionQty}</td>
                      <td className="text-right">{item?.transactionValue}</td>
                      {/* <td className="text-right">{item?.issueQty}</td>
                    <td className="text-right">{item?.issueValue}</td> */}
                      {/* opening balance 0 */}
                      <td className="text-right">{item?.balanceQty}</td>
                      {/* opening balance 0 */}
                      <td className="text-right">{item?.balanceValue}</td>
                    </tr>
                    {console.log(inventoryLedger)}
                    {index === inventoryLedger?.row?.length - 1 && (
                      <tr className="bg-light">
                        <td>{index + 3}</td>
                        <td>{values?.toDate}</td>
                        <td>{"Closing Balance"}</td>
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
      </div>
    </>
  );
};

export default DetailsModal;
