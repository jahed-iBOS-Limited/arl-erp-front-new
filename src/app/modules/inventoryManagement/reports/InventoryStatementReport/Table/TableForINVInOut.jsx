/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
// import InfoCircle from "../../../../_helper/_helperIcons/_infoCircle";
import numberWithCommas from "../../../../_helper/_numberWithCommas";

const TableForINVInOut = ({
  inventoryStatement,
  setTableItem,
  setIsShowModal,
}) => {
  return (
    inventoryStatement?.length > 0 && (
      <div className="react-bootstrap-table table-responsive">
        <div className="loan-scrollable-table inventory-statement-report">
          <div style={{ maxHeight: "500px" }} className="scroll-table _table">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm">
              <thead>
                <tr>
                  <th style={{ minWidth: "30px" }}>SL</th>
                  <th>Item Name</th>
                  <th style={{ minWidth: "100px" }}>Item Code</th>
                  <th style={{ minWidth: "100px" }}>UoM Name</th>
                  <th style={{ minWidth: "100px" }}>Warehouse</th>
                  <th style={{ minWidth: "100px" }}>Opening Qty</th>
                  <th style={{ minWidth: "100px" }}>In Qty</th>
                  <th style={{ minWidth: "100px" }}>Out Qty</th>
                  {/* <th style={{ minWidth: "100px" }}>Transit Qty</th> */}
                  <th style={{ minWidth: "100px" }}>Closing Qty</th>
                  {/* <th style={{ minWidth: "100px" }}>Avg Rate</th>
                  <th style={{ minWidth: "100px" }}>Closing Value</th>
                  <th style={{ minWidth: "70px" }}>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {inventoryStatement?.length > 0 &&
                  inventoryStatement?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ width: "30px" }} className="text-center">
                          {index + 1}
                        </td>
                        <td>
                          <span className="pl-2">{item?.strItemName}</span>
                        </td>
                        <td>
                          <span className="pl-2">{item?.strItemCode}</span>
                        </td>
                        <td>
                          <span className="pl-2">{item?.strBaseUomName}</span>
                        </td>
                        <td>
                          <span className="pl-2">{item?.strWarehouseName}</span>
                        </td>

                        <td className="text-right">
                          <span>
                            {numberWithCommas(
                              (item?.numOpenQty || 0).toFixed(2)
                            )}
                          </span>
                        </td>
                        <td className="text-right">
                          <span>
                            {numberWithCommas((item?.numInQty || 0).toFixed(2))}
                          </span>
                        </td>
                        <td className="text-right">
                          <span>
                            {numberWithCommas(
                              (item?.numOutQty || 0).toFixed(2)
                            )}
                          </span>
                        </td>
                        {/* <td className="text-right">
                          <span>{numberWithCommas((item?.numTransitQty || 0).toFixed(2))}</span>
                        </td> */}
                        {/* <td className="text-right">
                          <span>{numberWithCommas((item?.numClosisngQty || 0).toFixed(2))}</span>
                        </td> */}
                        {/* <td className="text-right">
                          <span>{numberWithCommas((item?.numAvgRate || 0).toFixed(2))}</span>
                        </td> */}
                        <td className="text-right">
                          <span>
                            {numberWithCommas(
                              (item?.numCloseQty || 0).toFixed(2)
                            )}
                          </span>
                        </td>
                        {/* <td className="text-center">
                          <InfoCircle
                            clickHandler={() => {
                              setIsShowModal(true);
                              setTableItem(item);
                            }}
                            classes="text-primary"
                          />
                        </td> */}
                      </tr>
                    );
                  })}

                <tr>
                  <td colSpan="1"></td>
                  <td colSpan="1"></td>
                  <td colsSpan="4" className="text-right">
                    Total
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  );
};

export default TableForINVInOut;
