import React from "react";
import Select from "react-select";
import customStyles from "../../../../../selectCustomStyle";
const RowDtoTable = ({
  rowDto,
  remover,
  locationTypeDDL,
  stockDDL,
  rowDtoHandler,
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
                  {/* <th>Ref. Qty.</th>
                <th>Rest Qty.</th> */}
                  <th>Location</th>
                  <th>Current Stock</th>
                  {/* <th>Stock Type</th> */}
                  <th>Net Value</th>
                  <th>Quantity</th>
                  {/* <th>Action</th> */}
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
                    {/* <td className="text-center align-middle">
                  {item?.refQty}
                  </td>
                  <td className="text-center align-middle">
                    {" "}
                    {item?.restQty || 0}{" "}
                  </td> */}
                    <td
                      className="text-center align-middle"
                      style={{ width: "200px" }}
                    >
                      <Select
                        onChange={(valueOption) => {
                          rowDtoHandler(
                            "location",
                            {
                              value: valueOption?.value,
                              label: valueOption?.label,
                              binNumber: valueOption?.binNumber,
                            },
                            index
                          );

                          console.log(valueOption, "cueent stock");
                          rowDtoHandler(
                            "currentStock",
                            valueOption?.currentStock,
                            index
                          );
                        }}
                        defaultValue={item?.location || ""}
                        isSearchable={true}
                        styles={customStyles}
                        options={item?.locationddl}
                        placeholder="Location"
                      />
                    </td>
                    <td className="text-center">{item?.currentStock}</td>
                    <td className="text-center">{item?.netValue}</td>
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
                        item?.stockType || ""
                      }
                      isSearchable={true}
                      styles={customStyles}
                      options={stockDDL}
                      placeholder="Stock"
                    />
                  </td> */}
                    <td style={{ width: "100px" }} className="text-center">
                      {item?.quantity}
                      {/* <IInput
                      value={rowDto[index]?.quantity}
                      name="quantity"
                      type="number"
                      placeholder="Quantity"
                      required
                      onChange={(e) => {
                        rowDtoHandler("quantity", e.target.value, index);
                      }}
                      min="0"
                      max={item?.restQty}
                    /> */}
                    </td>
                    {/* <td className="text-center align-middle">
                    <IDelete remover={remover} id={item?.itemId} />
                  </td> */}
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
