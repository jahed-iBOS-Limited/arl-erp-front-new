import React, { useEffect, useState, useRef } from "react";
import { InventoryLedger_api_new } from "../helper";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { shallowEqual } from "react-redux";
import Loading from "../../../../_helper/_loading";
import { _timeFormatter } from "../../../../_helper/_timeFormatter";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const DetailsModalNew = ({ tableItem, values, type, whId }) => {
  const [inventoryLedger, setInventoryLedger] = useState([]);
  const [loading, setLoading] = useState(false);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { selectedBusinessUnit } = storeData;

  useEffect(() => {
    InventoryLedger_api_new(
      selectedBusinessUnit?.value,
      tableItem?.whId || whId || 0,
      values?.fromDate,
      values?.toDate,
      tableItem?.itemId,
      setInventoryLedger,
      setLoading,
      type
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
          id="test-table-xls-button-att-reports"
          className="btn btn-primary mr-2 ml-5"
          table="inventory-ledger-reports"
          filename="Inventory Ledger Report"
          sheet="Inventory Ledger Report"
          buttonText="Export Excel"
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
            Item Name: {`${tableItem?.strItemName} (${tableItem?.strItemCode}`})
            <span className="ml-2">
              UOM: {[5,6].includes(type) ? tableItem?.strBaseUOM : tableItem?.strUomName}
            </span>
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
            id="inventory-ledger-reports"
            className="table table-striped table-bordered global-table"
          >
            <thead>
              <tr>
                <th>SL</th>
                <th>Transaction Date</th>
                <th>Transaction Code</th>
                <th>Transaction Type</th>
                <th>Reference No</th>
                <th>Opening Stock</th>
                <th>Quantity</th>
                <th>Value</th>
                <th>Closing Stock</th>
                <th>Running Unit Rate</th>
                <th>Weighted Avg Rate</th>
              </tr>
            </thead>
            <tbody>
              {inventoryLedger?.map((item, index) => {
                return (
                  <>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{_dateFormatter(item?.dteTransactionDate)}</td>
                      <td>{item?.strInventoryTransactionCode}</td>
                      <td>{item?.strTransactionTypeName}</td>
                      <td>{item?.strReferenceCode}</td>
                      <td className="text-right">{item?.openingStock}</td>
                      <td className="text-right">
                        {item?.issueOrreceivedQty?.toFixed(4)}
                      </td>
                      <td className="text-right">
                        {item?.issueOrReceiveValue?.toFixed(4)}
                      </td>
                      <td className="text-right">{item?.closingStock}</td>
                      <td className="text-right">{(item?.runingRate)?.toFixed(4)}</td>
                      <td className="text-right">
                        {item?.avgRate?.toFixed(4)}
                      </td>
                    </tr>

                    {/* {index === inventoryLedger.length - 1 && (
                                        <tr className="bg-light">
                                            <td className="font-weight-bold">{index + 2}</td>
                                            <td className="font-weight-bold">{values?.toDate}</td>
                                            <td className="text-center">{"-"}</td>
                                            <td className="text-center">{"-"}</td>
                                            <td className="font-weight-bold">{"Closing Balance"}</td>
                                            <td className="text-center">{"-"}</td>
                                            <td className="text-right">
                                                {inventoryLedger?.reduce(
                                                    (acc, curr) => acc + curr?.issueOrreceivedQty,
                                                    0
                                                )?.toFixed(4)}
                                            </td>
                                            <td className="text-right">
                                                {inventoryLedger?.reduce(
                                                    (acc, curr) => acc + curr?.issueOrReceiveValue,
                                                    0
                                                )?.toFixed(4)}
                                            </td>
                                            <td className="text-right">
                                                {inventoryLedger?.reduce(
                                                    (acc, curr) => acc + curr?.closingStock,
                                                    0
                                                )?.toFixed(4)}
                                            </td>
                                            <td></td>
                                            <td className="text-right">
                                                {
                                                    (inventoryLedger?.reduce(
                                                        (acc, curr) => acc + curr?.issueOrReceiveValue,
                                                        0
                                                    ) / inventoryLedger?.reduce(
                                                        (acc, curr) => acc + curr?.closingStock,
                                                        0
                                                    ))?.toFixed(4)
                                                }
                                            </td>
                                        </tr>
                                    )} */}
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

export default DetailsModalNew;
