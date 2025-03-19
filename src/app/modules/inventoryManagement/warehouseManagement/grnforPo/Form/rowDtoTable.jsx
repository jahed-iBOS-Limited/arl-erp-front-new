import React from "react";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { IInput } from "../../../../_helper/_input";
// import customStyles from "../../../../../selectCustomStyle";
// import IDelete from "../../../../../_helper/_helperIcons/_delete";
// import { IInput } from "../../../../../_helper/_input";

const RowDtoTable = ({
  rowDto,
  remover,
  rowDtoHandler,
  setRowDto,
  locationTypeDDL,
  stockDDL,
  values,
}) => {
  return (
    <div>
      {rowDto?.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Ref. Qty.</th>
                  <th>Rest Qty.</th>
                  <th>Location</th>
                  <th>Stock Type</th>
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
                    <td className="text-center align-middle">
                      {item?.itemName}
                    </td>
                    <td className="text-center align-middle">{item?.refQty}</td>
                    <td className="text-center align-middle">
                      {" "}
                      {item?.restQty || 0}{" "}
                    </td>
                    <td className="text-center align-middle">
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
                        value={item?.location || ""}
                        isSearchable={true}
                        styles={customStyles}
                        options={locationTypeDDL}
                        placeholder="Location"
                      />
                    </td>
                    <td className="disabled-feedback disable-border">
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
                        defaultValue={item?.stockType || ""}
                        isSearchable={true}
                        styles={customStyles}
                        options={stockDDL}
                        placeholder="Stock"
                      />
                    </td>
                    <td
                      style={{ width: "100px" }}
                      className="disabled-feedback disable-border"
                    >
                      <IInput
                        value={rowDto[index]?.quantity}
                        name="quantity"
                        type="number"
                        min="0"
                        placeholder="Quantity"
                        required
                        onChange={(e) => {
                          rowDtoHandler("quantity", e.target.value, index);
                        }}
                      />
                    </td>
                    <td className="text-center align-middle">
                      <IDelete remover={remover} id={item?.itemId} />
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
