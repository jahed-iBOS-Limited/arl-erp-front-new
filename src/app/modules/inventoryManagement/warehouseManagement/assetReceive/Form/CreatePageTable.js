import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { IInput } from "../../../../_helper/_input";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import IDelete from "../../../../_helper/_helperIcons/_delete";

const headers = [
  "SL",
  "Item Name",
  "Item Description",
  "Net Value",
  "PO Qty",
  "Vat",
  "Rest Qty",
  "Previous Receive",
  "Location",
  "Current Stock",
  "Receive Qty",
  "Receive Amount",
  "Action",
];

const TBody = ({ rowDto, rowDtoHandler, isEdit,remover }) => {
  return (
    <>
      {rowDto &&
        rowDto?.length > 0 &&
        rowDto?.map((item, index) => {
          return (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{index + 1}</td>
              <td style={{ textAlign: "center" }}>{item?.itemName}</td>
              <td style={{ textAlign: "center" }}>{item?.itemDescription}</td>
              <td style={{ textAlign: "center" }}>{item?.netValue}</td>
              <td style={{ textAlign: "center" }}>{item?.poQuantity}</td>
              <td style={{ textAlign: "center" }}>{item?.vatValue}</td>
              <td style={{ textAlign: "center" }}>{item?.restQty}</td>
              <td style={{ textAlign: "center" }}>{item?.receiveQuantity}</td>
              <td className="text-center align-middle" 
                style={{ width: "220px"}}
              >
                  <Select
                      onChange={(valueOption) => {
                        rowDtoHandler(
                          "location",
                          valueOption,
                          index
                        );
                        // rowDtoHandler(
                        //   "availableStock",valueOption?.currentStock,
                        //   index
                        // );
                      }}
                      value={
                        item?.location || ""
                      }
                      menuPosition="fixed"
                      isSearchable={true}
                      name="location"
                      styles={customStyles}
                      options={item?.locationddl}
                      placeholder="Location"
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>{item?.location?.currentStock}</td>
              <td
                style={{ width: "150px" }}
                className="disabled-feedback disable-border"
              >
                <IInput
                  value={rowDto[index]?.quantity}
                  name="quantity"
                  type="number"
                  placeholder="Quantity"
                  required
                  onChange={(e) => {
                    rowDtoHandler("quantity", e?.target?.value, index);
                  }}
                  step="any"
                  min={0.1}
                  max={
                    isEdit
                      ? item?.poQuantity === item?.receiveQuantity
                        ? item?.numTransactionQuantity
                        : item?.poQuantity -
                          item?.receiveQuantity +
                          item?.receiveQuantity
                      : item?.poQuantity - item?.receiveQuantity
                  }
                />
              </td>
              <td style={{ textAlign: "center" }}>{item?.receiveAmount.toFixed(4)}</td>
              <td className="text-center align-middle">
                    <IDelete remover={remover} id={index} />
                  </td>
            </tr>
          );
        })}
    </>
  );
};

function CreatePageTable({ rowDto, rowDtoHandler, isEdit , remover}) {
  return (
    <ICustomTable
      ths={headers}
      children={
        <TBody rowDto={rowDto} rowDtoHandler={rowDtoHandler} isEdit={isEdit} remover={remover} />
      }
    />
  );
}

export default CreatePageTable;
