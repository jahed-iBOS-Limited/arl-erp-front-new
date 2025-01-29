import React from "react";
import Select from "react-select";
import customStyles from "../../../../../selectCustomStyle";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import { IInput } from "../../../../../_helper/_input";
import { toast } from "react-toastify";

const RowDtoTable = ({
  rowDto,
  remover,
  rowDtoHandler,
  locationTypeDDL,
  stockDDL,
  setRowDto,
  values,
  selectedBusinessUnit,
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
                    <td
                      style={{ width: "100px" }}
                      className="disabled-feedback disable-border"
                    >
                      {selectedBusinessUnit?.value === 4 ||
                      selectedBusinessUnit?.value === 144 ? (
                        <IInput
                          value={rowDto[index]?.quantity}
                          name="quantity"
                          type="number"
                          placeholder="Quantity"
                          required
                          onChange={(e) => {
                            if (
                              ![4, 175].includes(selectedBusinessUnit?.value) &&
                              +e.target.value > +item?.availableStock
                            ) {
                              return toast.warn(
                                "Quantity can't be greater than available stock"
                              );
                            } else {
                              rowDtoHandler("quantity", e.target.value, index);
                            }
                          }}
                          step="any"
                        />
                      ) : (
                        <IInput
                          value={rowDto[index]?.quantity}
                          name="quantity"
                          type="number"
                          placeholder="Quantity"
                          required
                          onChange={(e) => {
                            if (+e.target.value > +item?.availableStock) {
                              rowDtoHandler("quantity", 0, index);
                              return toast.warn(
                                "Quantity can't be greater than available stock"
                              );
                            } else {
                              rowDtoHandler("quantity", e.target.value, index);
                            }
                          }}
                          step="any"
                          max={
                            values.refType.label === "NA (Without Reference)"
                              ? item?.availableStock
                              : item?.restQty
                          }
                        />
                      )}
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
