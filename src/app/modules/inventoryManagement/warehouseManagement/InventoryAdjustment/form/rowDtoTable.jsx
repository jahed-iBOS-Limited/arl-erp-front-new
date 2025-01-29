import React from "react";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { IInput } from "../../../../_helper/_input";
const RowDtoTable = ({
  rowDto,
  remover,
  locationTypeDDL,
  stockDDL,
  rowDtoHandler,
  setRowDto,
  values,
  landingData,
}) => {
  return (
    <div className="mt-2 invTable">
      {rowDto?.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-bordered inv-table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Uom</th>
                  <th>Location</th>
                  <th>Current Stock</th>
                  <th>Physical Stock</th>
                  <th>Adjustment Quantity</th>
                  <th>Rate</th>
                  <th>Adjustment Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((item, index) => {
                  const cogs = item?.cogs || 0;

                  const numTransactionQuantity =
                    item?.numTransactionQuantity || 0;
                  return (
                    <tr key={index}>
                      <td className="text-center align-middle">
                        {" "}
                        {index + 1}{" "}
                      </td>
                      <td className="text-center align-middle">
                        {" "}
                        {item?.itemCode}{" "}
                      </td>
                      <td className="">{item?.itemName}</td>
                      <td className="">{item?.uoMname}</td>
                      <td
                        className="text-center align-middle"
                        style={{ width: "200px" }}
                      >
                        {item?.location?.label}
                      </td>
                      <td className="text-center align-middle">
                        {" "}
                        {item?.openStockQty}{" "}
                      </td>
                      <td
                        style={{ width: "100px" }}
                        className="disabled-feedback disable-border"
                      >
                        <IInput
                          value={rowDto[index]?.physicalStockQty}
                          name="physicalStockQty"
                          type="number"
                          placeholder=""
                          required
                          onChange={(e) => {
                            rowDtoHandler(
                              "physicalStockQty",
                              e.target.value,
                              index
                            );
                            let numTransactionQuantity = 0;
                            const prvOpenStockQty = item?.openStockQty;
                            const physicalStockQty = +e.target.value || 0;
                            // stock qty 0 or greater than 0
                            if (prvOpenStockQty >= 0) {
                              numTransactionQuantity =
                                physicalStockQty - (+prvOpenStockQty || 0);
                            } else {
                              let openStockQty = +prvOpenStockQty * -1;
                              numTransactionQuantity = physicalStockQty
                                ? openStockQty + (+physicalStockQty || 0)
                                : openStockQty;
                            }
                            rowDtoHandler(
                              "numTransactionQuantity",
                              Number(numTransactionQuantity.toFixed(6)),
                              index
                            );

                            rowDtoHandler(
                              "monTransactionValue",
                              (numTransactionQuantity * item?.cogs).toFixed(6),
                              index
                            );
                          }}
                          step="any"
                        />
                      </td>
                      <td className="text-center align-middle">
                        {Number(numTransactionQuantity.toFixed(6))}
                      </td>
                      <td className="text-center align-middle">
                        {" "}
                        {Number(cogs.toFixed(6))}{" "}
                      </td>
                      <td className="text-center align-middle">
                        {item?.monTransactionValue}
                      </td>
                      <td className="text-center align-middle">
                        <IDelete remover={remover} id={index} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default RowDtoTable;
