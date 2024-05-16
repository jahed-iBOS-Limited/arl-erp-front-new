import React, { useEffect, useState, useRef } from "react";
import { InventoryLedger_api } from "../helper";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";

import { shallowEqual } from "react-redux";
import { _timeFormatter } from "./../../../../_helper/_timeFormatter";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import Loading from "./../../../../_helper/_loading";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { downloadFile } from "../../../../_helper/downloadFile";

const DetailsModal = ({ tableItem, values, type }) => {
  const [inventoryLedger, setInventoryLedger] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(null);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { selectedBusinessUnit } = storeData;

  useEffect(() => {
    // this modal component is used from two place
    InventoryLedger_api(
      selectedBusinessUnit?.value,
      tableItem?.whId,
      values?.fromDate,
      values?.toDate,
      // this modal is used from two place, for summary table and for detail table
      // type  1 means summary,
      // type 2 means detail
      tableItem?.itemId,
      setInventoryLedger,
      setLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableItem]);

  const printRef = useRef();

  const getQuantityAndValueTotal = (inventoryLedger) => {
    let quantityTotal = 0;
    let valueTotal = 0;
    for (let i = 0; i < inventoryLedger.length; i++) {
      const element = inventoryLedger[i];
      quantityTotal += element?.numTransQty;
      valueTotal += element?.numTransValue;
    }
    return { quantityTotal, valueTotal };
  };

  useEffect(() => {
    setTotal(getQuantityAndValueTotal(inventoryLedger));
  }, [inventoryLedger]);

  const getGrandRate = (item, total) => {
    const grandTotal =
      (Number(+total?.quantityTotal || 0) * Math.abs(+item?.numRate || 0)) /
        +total?.quantityTotal || 0;

    return grandTotal || 0;
  };

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
        {/* <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button btn btn-primary"
          table="table-to-xlsx"
          filename="Employee Payroll Details"
          sheet="tablexls"
          buttonText="Excel"
        /> */}
        <button
          className="btn btn-primary"
          type="button"
          onClick={(e) => {
            let api = `/wms/WmsReport/InventoryStatementByIdNewDownload?businessUnitId=${selectedBusinessUnit?.value}&warehouseId=${values?.wh?.value}&itemId=${tableItem?.itemId}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`;
            downloadFile(api, "Inventory Statement", "xlsx", setLoading);
          }}
        >
          Export Excel
        </button>
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
            <span className="ml-2">UOM: {tableItem?.strUomName}</span>
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
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th>SL</th>
                <th
                  style={{
                    width: "80px",
                  }}
                >
                  Transection Date
                </th>
                <th
                  style={{
                    width: "90px",
                  }}
                >
                  Transection Code
                </th>
                <th
                  style={{
                    width: "100px",
                  }}
                >
                  Transection Type
                </th>
                <th>Reference No.</th>
                <th
                  style={{
                    width: "100px",
                  }}
                >
                  Qty.
                </th>
                <th
                  style={{
                    width: "100px",
                  }}
                >
                  Value
                </th>
                <th
                  style={{
                    width: "100px",
                  }}
                >
                  Rate
                </th>
                {/* <th
                style={{
                  width: "100px",
                }}
              >
                Opening
              </th>
              <th
                style={{
                  width: "100px",
                }}
              >
                Valuation
              </th> */}
              </tr>
            </thead>
            <tbody>
              {inventoryLedger?.map((item, index) => {
                return (
                  <>
                    {/* {index === 0 && (
                    <tr className="bg-light">
                      <td className="font-weight-bold">{index + 1}</td>
                      <td className="font-weight-bold">{values?.fromDate}</td>
                      <td>{"-"}</td>
                      <td className="font-weight-bold">{"Opening Balance"}</td>
                      <td>{"-"}</td>
                      <td>{"-"}</td>
                      <td>{"-"}</td>
                      <td>{"-"}</td>
                    </tr>
                  )} */}
                    <tr>
                      <td>{index + 1}</td>
                      <td>{_dateFormatter(item?.dteTransDate)}</td>
                      <td>{item?.strCode}</td>
                      <td>{item?.strTransType}</td>
                      <td>{item?.strReff}</td>
                      <td className="text-right">
                        {(item?.numTransQty || 0)?.toFixed(2)}
                      </td>
                      <td className="text-right">{item?.numTransValue}</td>
                      <td className="text-right">
                        {numberWithCommas(
                          Math.abs(item?.numRate || 0).toFixed(2)
                        )}
                      </td>
                      {/* <td className="text-right">
                      {item?.isOpening ? "Yes" : "NO"}
                    </td>
                    <td className="text-right">
                      {item?.isValuation ? "Yes" : "NO"}
                    </td> */}
                    </tr>

                    {index === inventoryLedger.length - 1 && (
                      <tr className="bg-light">
                        <td className="font-weight-bold">{index + 2}</td>
                        <td className="font-weight-bold">{values?.toDate}</td>
                        <td>{"-"}</td>
                        <td className="font-weight-bold">
                          {"Closing Balance"}
                        </td>
                        <td>{"-"}</td>
                        <td className="text-right">
                          {total?.quantityTotal.toFixed(2)}
                        </td>
                        <td className="text-right">
                          {numberWithCommas(
                            (
                              Number(total?.quantityTotal.toFixed(6)) *
                              Math.abs(item?.numRate || 0)
                            ).toFixed(2)
                          )}
                        </td>
                        <td className="text-right">
                          {/* {numberWithCommas(
                          Math.abs(item?.numRate || 0).toFixed(2)
                        )} */}
                          {getGrandRate(item, total).toFixed(2)}
                        </td>
                        {/* <td>{"-"}</td>
                      <td>{"-"}</td> */}
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
