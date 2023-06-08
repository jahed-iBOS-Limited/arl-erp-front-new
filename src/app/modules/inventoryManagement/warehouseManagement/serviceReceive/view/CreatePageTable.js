import React from "react";
import ICustomTable from "../../../../_helper/_customTable";

const headers = [
  "SL",
  "Item Code",
  "Item Name",
  "Item Description",
  "PO Qty",
  // "Rest Qty",
  "Net Value",
  "Receive Qty",
];

const TBody = ({ rowDto }) => {
  return (
    <>
      {rowDto &&
        rowDto.length > 0 &&
        rowDto.map((item, index) => {
          return (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{index + 1}</td>
              <td style={{ textAlign: "center" }}>{item.itemCode}</td>
              <td style={{ textAlign: "center" }}>{item.itemName}</td>
              <td style={{ textAlign: "center" }}>{item.itemDescription}</td>
              <td style={{ textAlign: "center" }}>{item.poQuantity}</td>
              {/* <td style={{ textAlign: "center" }}>{item?.poQuantity - item?.quantity}</td> */}
              <td style={{ textAlign: "center" }}>{item?.monTransactionValue}</td>
              <td style={{ textAlign: "center" }}>{item?.quantity}</td>
            </tr>
          );
        })}
    </>
  );
};

function CreatePageTable({ rowDto, rowDtoHandler }) {
  return <ICustomTable ths={headers} children={<TBody rowDto={rowDto} />} />;
}

export default CreatePageTable;
