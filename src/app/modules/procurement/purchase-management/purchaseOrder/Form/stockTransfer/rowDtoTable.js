import React from "react";
import Select from "react-select";
import customStyles from "../../../../../selectCustomStyle";
import { validateDigit } from "../../../../../_helper/validateDigit";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import { IInput } from "../../../../../_helper/_input";
import InputField from "../../../../../_helper/_inputField";

const RowDtoTable = ({
  isWithoutRef,
  rowDto,
  remover,
  rowDtoHandler,
  uomDDL,
  setRowDto,
  values,
}) => {
  return (
    <div>
      {rowDto.length > 0 && (
        <>
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table mt-3">
            <thead>
              <tr>
                <th>SL</th>
                {isWithoutRef && <th>Ref No.</th>}
                <th style={{ width: "150px" }}>Item Code</th>
                <th style={{ width: "150px" }}>Item Name</th>
                <th style={{ width: "70px" }}>UoM</th>
                {isWithoutRef && <th>Ref. Qty.</th>}
                <th className="po_custom_width">Order Qty.</th>
                <th className="po_custom_width">Basic Price</th>
                <th>Net Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.map((item, index) => (
                <tr key={index}>
                  <td className="text-center align-middle"> {index + 1} </td>
                  {isWithoutRef && (
                    <td className="align-middle">
                      {item?.referenceNo?.label || "NA"}
                    </td>
                  )}
                  <td className="align-middle"> {item?.item?.code} </td>
                  <td className="align-middle"> {item?.item?.label} </td>
                  <td style={{ width: "100px" }}>
                    <Select
                      onChange={(valueOption) => {
                        rowDtoHandler(
                          "selectedUom",
                          {
                            value: valueOption?.value,
                            label: valueOption?.label,
                          },
                          index
                        );
                      }}
                      defaultValue={
                        item?.selectedUom || { value: "", label: "" }
                      }
                      isSearchable={true}
                      styles={customStyles}
                      // options={uomDDL}
                      options={item?.item?.convertedUomName}
                      placeholder="UoM"
                    />
                  </td>
                  {isWithoutRef && (
                    <td className="text-center align-middle">
                      {item?.refQty || 0}
                    </td>
                  )}

                  <td className="disabled-feedback disable-border">
                    <InputField
                      value={rowDto[index]?.orderQty}
                      name="orderQty"
                      type="tel"
                      min="0"
                      required
                      onChange={(e) => {
                        const validNum = validateDigit(e.target.value);

                        rowDtoHandler("orderQty", validNum, index);
                        rowDtoHandler(
                          "netValue",
                          validNum * item?.basicPrice,
                          index
                        );
                      }}
                    />
                  </td>
                  <td className="disabled-feedback disable-border">
                    <IInput
                      value={rowDto[index]?.basicPrice}
                      name="basicPrice"
                      type="tel"
                      min="0"
                      required
                      onChange={(e) => {
                        const validNum = validateDigit(e.target.value);

                        rowDtoHandler("basicPrice", validNum, index);
                        rowDtoHandler(
                          "netValue",
                          validNum * item?.orderQty,
                          index
                        );
                      }}
                    />
                  </td>

                  <td className="text-center align-middle">{item?.netValue}</td>
                  <td className="text-center align-middle">
                    <IDelete
                      remover={remover}
                      // id={item?.item?.value}
                      id={item}
                    />
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
