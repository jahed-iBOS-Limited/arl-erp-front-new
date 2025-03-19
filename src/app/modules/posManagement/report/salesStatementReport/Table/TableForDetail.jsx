import React from "react";
import InfoCircle from "../../../../_helper/_helperIcons/_infoCircle";
import numberWithCommas from "../../../../_helper/_numberWithCommas";

const TableForDetail = ({
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
                  <th>Item</th>
                  <th>Location/Bin</th>
                  <th style={{ minWidth: "50px" }}>Opening Qty</th>
                  <th style={{ minWidth: "50px" }}>Opening Value</th>
                  <th style={{ minWidth: "50px" }}>Adjust Inv Qty</th>
                  <th style={{ minWidth: "50px" }}>Adjust Inv Value</th>
                  <th style={{ minWidth: "70px" }}>Issue Return Qty</th>
                  <th style={{ minWidth: "70px" }}>Issue Return Value</th>
                  {/* <th style={{ minWidth: "70px" }}>
                    Location Transfer Qty
                  </th>
                  <th style={{ minWidth: "70px" }}>
                    Location Transfer value
                  </th> */}
                  <th style={{ minWidth: "50px" }}>Receive Inv Qty</th>
                  <th style={{ minWidth: "50px" }}>Receive Inv Value</th>
                  <th style={{ minWidth: "90px" }}>Received From Production Qty</th>
                  <th style={{ minWidth: "90px" }}>Received From Production Value</th>
                  <th style={{ minWidth: "50px" }}>Issue Inv Qty</th>
                  <th style={{ minWidth: "50px" }}>Issue Inv Value</th>
                  <th style={{ minWidth: "70px" }}>Purchase Return Qty</th>
                  <th style={{ minWidth: "70px" }}>Purchase Return Value</th>
                  <th style={{ minWidth: "70px" }}>Transfer in Qty</th>
                  <th style={{ minWidth: "80px" }}>Transfer in Value</th>
                  <th style={{ minWidth: "70px" }}>Transfer out Qty</th>
                  <th style={{ minWidth: "80px" }}>Transfer out Value</th>
                  <th style={{ minWidth: "70px" }}>Closing Qty</th>
                  <th style={{ minWidth: "70px" }}>Closing Value</th>
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
                          <span className="pl-2">{item?.strInventoryLocationName}</span>
                        </td>
                        <td className="text-right">
                          <span>{item?.openQty}</span>
                        </td>
                        <td className="text-right">
                          <span>{numberWithCommas(( item?.openValue || 0).toFixed(2))}</span>
                        </td>
                        <td className="text-right">
                          <span>{item?.qtyAdjustInventory}</span>
                        </td>
                        <td className="text-right">
                          <span>{numberWithCommas(( item?.valueAdjustInventory || 0).toFixed(2))}</span>
                        </td>
                        <td className="text-right">
                          <span>{item?.qtyIssueReturn}</span>
                        </td>
                        <td className="text-right">
                          <span>{numberWithCommas(( item?.valueIssueReturn || 0).toFixed(2))}</span>
                        </td>
                        {/* <td className="text-right">
                          <span>{item?.qtyLocationTransfer}</span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">
                            {numberWithCommas(( item?.valueLocationTransfer || 0).toFixed(2))}
                          </span>
                        </td> */}
                        <td className="text-right">
                          <span className="pl-2">
                            {item?.qtyReceiveInventory}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">
                            {numberWithCommas(( item?.valueReceiveInventory || 0).toFixed(2))}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">
                            {item?.qtyReceivedFromProduction}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">
                            {numberWithCommas(( item?.valueReceivedFromProduction || 0).toFixed(2))}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">
                            {item?.qtyIssueInventory}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">
                            {numberWithCommas(( item?.valueIssueInventory || 0).toFixed(2))}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">
                            {item?.qtyPurchaseReturn}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">
                            {numberWithCommas(( item?.valuePurchaseReturn || 0).toFixed(2))}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">{item?.qtyTransferIn}</span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">
                            {numberWithCommas(( item?.valueTransferIn || 0).toFixed(2))}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">{item?.qtyTransferOut}</span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">
                            {numberWithCommas(( item?.valueTransferOut || 0).toFixed(2))}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">{item?.clossingQty}</span>
                        </td>
                        <td className="text-right">
                          <span className="pl-2">{numberWithCommas(( item?.clossingValue || 0).toFixed(2))}</span>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  );
};

export default TableForDetail;
