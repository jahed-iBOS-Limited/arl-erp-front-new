import React from "react";
import Select from "react-select";
import customStyles from "../../../../../selectCustomStyle";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import { IInput } from "../../../../../_helper/_input";

const RowDtoTable = ({
  rowDto,
  remover,
  rowDtoHandler,
  setRowDto,
  //locationTypeDDL,
  stockDDL,
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
                  {values?.refType?.label === "PO (Purchase Order)" && (
                    <>
                      <th>Ref. Qty.</th>
                      <th>Rest Qty.</th>
                      <th>Vat</th>
                    </>
                  )}
                  {values?.refType?.label === "Inventory Request" && (
                    <>
                      <th>Request Qty.</th>
                      <th>Issue Qty.</th>
                      {/* <th>Return Qty</th> */}
                    </>
                  )}

                  <th>Location</th>
                  {/* <th>Bin Number</th> */}
                  {/* <th>Stock Type</th> */}
                  <th>Quantity</th>
                  {values?.refType?.label === "NA (Without Reference)" && (
                    <>
                      <th>Rate</th>
                      <th>Amount</th>{" "}
                    </>
                  )}
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
                    {values?.refType?.label === "PO (Purchase Order)" && (
                      <>
                        <td className="text-center align-middle">
                          {item?.refQty}
                        </td>
                        <td className="text-center align-middle">
                          {" "}
                          {item?.restQty || 0}{" "}
                        </td>
                        <td className="text-center align-middle">
                          {" "}
                          {item?.vatValue || 0}{" "}
                        </td>
                      </>
                    )}
                    {values?.refType?.label === "Inventory Request" && (
                      <>
                        <td className="text-center align-middle">
                          {item?.requestQty}
                        </td>
                        <td className="text-center align-middle">
                          {" "}
                          {item?.issueQuantity || 0}{" "}
                        </td>
                        {/* <td className="text-center align-middle">
                        {" "}
                        {item?.returnQuntity || 0}{" "}
                      </td>                       */}
                      </>
                    )}
                    <td
                      className="text-center align-middle"
                      style={{ width: "150px" }}
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
                        }}
                        value={item?.location || ""}
                        isSearchable={true}
                        styles={customStyles}
                        options={item.location}
                        placeholder="Location"
                      />
                    </td>
                    {/* <td className="text-center align-middle">
                    {" "}
                    {item?.location?.binNumber}
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
                        item?.stockType || ""
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
                        value={item?.quantity}
                        name="quantity"
                        type="number"
                        placeholder="Quantity"
                        required
                        onChange={(e) => {
                          rowDtoHandler("quantity", e?.target?.value, index);
                        }}
                        min={0.1}
                        step="any"
                        max={
                          values.refType.label === "NA (Without Reference)"
                            ? item.quantity
                            : values.refType.label === "Inventory Request"
                            ? item?.issueQuantity - item?.returnQuntity
                            : item?.restQty
                        }
                      />
                    </td>
                    {values.refType.label === "NA (Without Reference)" && (
                      <>
                        <td
                          style={{ width: "100px" }}
                          className="disabled-feedback disable-border"
                        >
                          <IInput
                            value={rowDto[index]?.baseValue}
                            name="baseValue"
                            type="number"
                            placeholder="Base Value"
                            step="any"
                            required
                            onChange={(e) => {
                              rowDtoHandler("baseValue", e.target.value, index);
                            }}
                            min="0"
                            //max={item?.restQty}
                          />
                        </td>
                        <td className="text-center align-middle">
                          {item?.quantity * item?.baseValue}
                        </td>{" "}
                      </>
                    )}
                    <td className="text-center align-middle">
                      <IDelete remover={remover} id={index} />
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
