import React from "react";
import Select from "react-select";
import customStyles from "../../../../../selectCustomStyle";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import { IInput } from "../../../../../_helper/_input";

const RowDtoTable = ({
  rowDto,
  remover,
  rowDtoHandler,
  locationTypeDDL,
  stockDDL,
  setRowDto,
  values,
}) => {
  return (
    <div className="mt-2">
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
                  <th>Current Stock</th>
                  <th>Location</th>
                  {values.refType.label !== "NA (Without Reference)" && (
                    <th>Ref Qty</th>
                  )}
                  {values.refType.label !== "NA (Without Reference)" && (
                    <th>Rest Qty</th>
                  )}
                  {/* <th>Stock Type</th> */}
                  {/* <th>Transfer Location</th> */}
                  {/* <th>Transfer Stock Type</th> */}
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center align-middle"> {index + 1} </td>
                    <td className="text-center align-middle">
                      {" "}
                      {item?.itemCode}{" "}
                    </td>
                    <td className="">{item?.itemName}</td>
                    <td className="">{item?.uoMname}</td>
                    <td className="text-center align-middle">
                      {item?.availableStock}
                    </td>
                    <td
                      className="text-center align-middle"
                      style={{ width: "150px" }}
                    >
                      <Select
                        onChange={(valueOption) => {
                          rowDtoHandler(
                            "fromLocation",
                            {
                              value: valueOption?.value,
                              label: valueOption?.label,
                              binNumber: valueOption?.binNumber,
                            },
                            index
                          );
                          rowDtoHandler(
                            "availableStock",
                            valueOption?.currentStock,
                            index
                          );
                        }}
                        defaultValue={item.fromLocation || ""}
                        isSearchable={true}
                        name="fromLocation"
                        styles={customStyles}
                        options={item?.transferDDl}
                        placeholder="Location"
                      />
                    </td>
                    {values.refType.label !== "NA (Without Reference)" && (
                      <td className="text-center align-middle">
                        {item?.refQty}
                      </td>
                    )}
                    {values.refType.label !== "NA (Without Reference)" && (
                      <td className="text-center align-middle">
                        {item?.restQty}
                      </td>
                    )}
                    {/* <td className="disabled-feedback disable-border">
                  <Select
                      onChange={(valueOption) => {
                        // rowDtoHandler(
                        //   "stockType",
                        //   {
                        //     value: valueOption?.value,
                        //     label: valueOption?.label,
                        //   },
                        //   index
                        // );
                      }}
                      defaultValue={
                        item.fromStock || ""
                      }
                      isDisabled={true}
                      isSearchable={true}
                      styles={customStyles}
                      options={[]}
                      placeholder="Stock"
                    />
                  </td> */}
                    {/* <td className="text-center align-middle">
                  <Select
                      onChange={(valueOption) => {
                        rowDtoHandler(
                          "location",
                          {
                            value: valueOption?.value,
                            label: valueOption?.label,
                          },
                          index
                        );
                      }}
                      defaultValue={
                        item.transferToLocation[0]
                      }
                      isSearchable={true}
                      name="location"
                      styles={customStyles}
                      options={item.transferToLocation}
                      placeholder="Location"
                    />
                  </td> */}
                    {/* <td className="disabled-feedback disable-border">
                  <Select
                      onChange={(valueOption) => {
                        rowDtoHandler(
                          "stockType",
                          {
                            value: valueOption?.value,
                            label: valueOption?.label,
                          },
                          index
                        );
                      }}
                      defaultValue={
                        item.stockType || ""
                      }
                      isSearchable={true}
                      styles={customStyles}
                      options={stockDDL}
                      placeholder="Stock"
                    />
                  </td> */}
                    <td
                      style={{ width: "100px" }}
                      className="disabled-feedback disable-border"
                    >
                      <IInput
                        value={rowDto[index]?.quantity}
                        name="quantity"
                        type="number"
                        placeholder="Quantity"
                        required
                        onChange={(e) => {
                          rowDtoHandler("quantity", e.target.value, index);
                        }}
                        step="any"
                        min={0.1}
                        max={
                          values.refType.label === "NA (Without Reference)"
                            ? item?.availableStock
                            : item?.restQty
                        }
                      />
                    </td>
                    <td className="text-center align-middle">
                      <IDelete remover={remover} id={item?.itemName} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default RowDtoTable;
