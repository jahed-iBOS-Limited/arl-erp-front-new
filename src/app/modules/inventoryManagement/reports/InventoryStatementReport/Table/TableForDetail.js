/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import InfoCircle from "../../../../_helper/_helperIcons/_infoCircle";
import numberWithCommas from "../../../../_helper/_numberWithCommas";

const TableForDetail = ({
  inventoryStatement,
  setTableItem,
  setIsShowModal,
  closingQty,
  closingValue,
}) => {
  /* Grand Total Maker */
  const [grandTotalList, setGrandTotalList] = useState([]);

  const grandTotal = () => {
    let numOpenQty = 0,
      // numOpenValue = 0,
      numAdjustQty = 0,
      // numAdjustValue = 0,
      numReceiveQty = 0,
      numReceiveValue = 0,
      numProductionQty = 0,
      // numProductionValue = 0,
      numIssueQty = 0,
      numIssueValue = 0,
      numPurReturnQty = 0,
      numPurReturnValue = 0,
      numTransInQty = 0,
      // numTransInValue = 0,
      numTransOutQty = 0,
      // numTransOutValue = 0,
      closingValueSum = 0,
      avgRateSum = 0,
      closingQtySum = 0;

    for (let i = 0; i < inventoryStatement?.length; i++) {
      let item = inventoryStatement[i];
      numOpenQty = numOpenQty + +item?.numOpenQty;
      // numOpenValue = numOpenValue + +item?.numOpenValue;
      numAdjustQty = numAdjustQty + +item?.numAdjustQty;
      // numAdjustValue = numAdjustValue + +item?.numAdjustValue;
      numReceiveQty = numReceiveQty + +item?.numReceiveQty;
      numReceiveValue = numReceiveValue + +item?.numReceiveValue;
      numProductionQty = numProductionQty + +item?.numProductionQty;
      // numProductionValue = numProductionValue + +item?.numProductionValue;
      numIssueQty = numIssueQty + +item?.numIssueQty;
      numIssueValue = numIssueValue + +item?.numIssueValue;
      numPurReturnQty = numPurReturnQty + +item?.numPurReturnQty;
      numPurReturnValue = numPurReturnValue + +item?.numPurReturnValue;
      numTransInQty = numTransInQty + +item?.numTransInQty;
      // numTransInValue = numTransInValue + +item?.numTransInValue;
      numTransOutQty = numTransOutQty + +item?.numTransOutQty;
      // numTransOutValue = numTransOutValue + +item?.numTransOutValue;
      closingQtySum = closingQtySum + closingQty(item);
      closingValueSum = closingValueSum + closingValue(item);
    }

    return {
      numOpenQty,
      // numOpenValue,
      numAdjustQty,
      // numAdjustValue,
      numReceiveQty,
      numReceiveValue,
      numProductionQty,
      // numProductionValue,
      numIssueQty,
      numIssueValue,
      numPurReturnQty,
      numPurReturnValue,
      numTransInQty,
      // numTransInValue,
      numTransOutQty,
      // numTransOutValue,
      closingQtySum,
      avgRateSum,
      closingValueSum,
    };
  };

  useEffect(() => {
    if (inventoryStatement?.length > 0) {
      setGrandTotalList(Object?.values(grandTotal()));
    }
  }, [inventoryStatement]);

  return (
    inventoryStatement?.length > 0 && (
      <div className="react-bootstrap-table table-responsive">
        <div className="loan-scrollable-table inventory-statement-report">
          <div style={{ maxHeight: "500px" }} className="scroll-table _table">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm">
              <thead>
                <tr>
                  <th style={{ minWidth: "30px" }}>SL</th>
                  <th>Item</th>
                  <th style={{ minWidth: "100px" }}>Item Code</th>
                  <th style={{ minWidth: "100px" }}>UoM Name</th>
                  <th style={{ minWidth: "100px" }}>Warehouse</th>
                  <th>Location/Bin</th>
                  <th style={{ minWidth: "50px" }}>Opening Qty</th>
                  {/* <th style={{ minWidth: "80px" }}>Opening Value</th> */}
                  <th style={{ minWidth: "50px" }}>Adjust Inv Qty</th>
                  {/* <th style={{ minWidth: "50px" }}>Adjust Inv Value</th> */}
                  <th style={{ minWidth: "50px" }}>Receive Inv Qty</th>
                  <th style={{ minWidth: "50px" }}>Receive Inv Value</th>
                  <th style={{ minWidth: "90px" }}>
                    Received From Production Qty
                  </th>
                  {/* <th style={{ minWidth: "90px" }}>
                    Received From Production Value
                  </th> */}
                  <th style={{ minWidth: "50px" }}>Issue Inv Qty</th>
                  <th style={{ minWidth: "50px" }}>Issue Inv Value</th>
                  <th style={{ minWidth: "70px" }}>Purchase Return Qty</th>
                  <th style={{ minWidth: "70px" }}>Purchase Return Value</th>
                  <th style={{ minWidth: "70px" }}>Transfer in Qty</th>
                  {/* <th style={{ minWidth: "80px" }}>Transfer in Value</th> */}
                  <th style={{ minWidth: "70px" }}>Transfer out Qty</th>
                  {/* <th style={{ minWidth: "80px" }}>Transfer out Value</th> */}
                  <th style={{ minWidth: "70px" }}>Closing Qty</th>
                  <th style={{ minWidth: "70px" }}>Avg Rate</th>
                  <th style={{ minWidth: "80px" }}>Closing Value</th>
                  <th style={{ minWidth: "70px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {inventoryStatement?.length > 0 &&
                  inventoryStatement?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ width: "30px" }} className="text-center">
                          {item?.sl}
                        </td>
                        <td>
                          <span className="pl-2">{item?.strItemName}</span>
                        </td>
                        <td>
                          <span className="pl-2">{item?.strItemCode}</span>
                        </td>
                        <td>
                          <span className="pl-2">{item?.strUomName}</span>
                        </td>
                        <td>
                          <span className="pl-2">{item?.strWhname}</span>
                        </td>
                        <td>
                          <span className="pl-2">{item?.strLocation_BIN}</span>
                        </td>
                        <td className="text-right">
                          <span>{numberWithCommas((item?.numOpenQty || 0).toFixed(2))}</span>
                        </td>
                        {/* <td className="text-right">
                          <span>
                            {numberWithCommas(
                              (item?.numOpenValue || 0).toFixed(2)
                            )}
                          </span>
                        </td> */}
                        <td className="text-right">
                          <span>{numberWithCommas((item?.numAdjustQty || 0).toFixed(2))}</span>
                        </td>
                        {/* <td className="text-right">
                          <span>
                            {numberWithCommas(
                              (item?.numAdjustValue || 0).toFixed(2)
                            )}
                          </span>
                        </td> */}
                        <td className="text-right">
                          <span className="pl-2">{numberWithCommas((item?.numReceiveQty || 0).toFixed(2))}</span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">
                            {numberWithCommas(
                              (item?.numReceiveValue || 0).toFixed(2)
                            )}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">{numberWithCommas((item?.numProductionQty || 0).toFixed(2))}</span>
                        </td>
                        {/* <td className="text-right">
                          <span className="pl-2">
                            {numberWithCommas(
                              (item?.numProductionValue || 0).toFixed(2)
                            )}
                          </span>
                        </td> */}
                        <td className="text-right">
                          <span className="pl-2">{numberWithCommas((item?.numIssueQty || 0).toFixed(2))}</span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">
                            {numberWithCommas(
                              (item?.numIssueValue || 0).toFixed(2)
                            )}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">{numberWithCommas((item?.numPurReturnQty || 0).toFixed(2))}</span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">
                            {numberWithCommas(
                              (item?.numPurReturnValue || 0).toFixed(2)
                            )}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">{numberWithCommas((item?.numTransInQty || 0).toFixed(2))}</span>
                        </td>
                        {/* <td className="text-right">
                          <span className="pl-2">
                            {numberWithCommas(
                              (item?.numTransInValue || 0).toFixed(2)
                            )}
                          </span>
                        </td> */}
                        <td className="text-right">
                          <span className="pl-2">{numberWithCommas((item?.numTransOutQty || 0).toFixed(2))}</span>
                        </td>
                        {/* <td className="text-right">
                          <span className="pl-2">
                            {numberWithCommas(
                              (item?.numTransOutValue || 0).toFixed(2)
                            )}
                          </span>
                        </td> */}
                        <td className="text-right">
                          <span className="pl-2">
                            {numberWithCommas(
                              (item?.numClosisngQty || 0).toFixed(2)
                            )}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">
                            {numberWithCommas(
                              (item?.numAvgRate || 0).toFixed(2)
                            )}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">
                            {numberWithCommas(
                              (closingValue(item) || 0).toFixed(2)
                            )}
                          </span>
                        </td>
                        <td className="text-center">
                          <InfoCircle
                            clickHandler={() => {
                              setIsShowModal(true);
                              setTableItem(item);
                            }}
                            classes="text-primary"
                          />
                        </td>
                      </tr>
                    );
                  })}

                <tr>
                  <td colSpan="1"></td>
                  <td colSpan="1"></td>
                  <td colspan="4" className="text-right">
                    Grand Total
                  </td>
                  {grandTotalList?.map((item, index) => (
                    <td className="text-right" key={index} colSpan="1">
                      {item?.toFixed(2) || 0}
                    </td>
                  ))}
                  <td colSpan="21"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  );
};

export default TableForDetail;
