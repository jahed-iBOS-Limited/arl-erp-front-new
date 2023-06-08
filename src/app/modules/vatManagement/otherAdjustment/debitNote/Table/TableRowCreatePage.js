import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import IDelete from "../../../../_helper/_helperIcons/_delete";

const tableHeader = [
  "SL",
  "Item Name",
  "UoM",
  "Sales Qty",
  "Sales Amount",
  "Sales SD",
  "Sales Vat",
  "Increase Qty",
  "Increase Vat",
  "Increase SD",
  "Action",
];

export default function TableRowCreatePage({
  rowDto,
  rowDtoHandler,
  deleteHandler,
}) {
  return (
    <ICustomTable ths={tableHeader}>
      <>
        {rowDto.length > 0
          ? rowDto.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td style={{ textAlign: "left" }}>{item.itemName}</td>
                <td style={{ textAlign: "center" }}>{item.uom}</td>
                <td style={{ textAlign: "center" }}>{item.salesQty}</td>
                <td style={{ textAlign: "right" }}>{item.salesAmount}</td>
                <td style={{ textAlign: "right" }}>{item.salesSd}</td>
                <td style={{ textAlign: "right" }}>{item.salesVat}</td>
                <td style={{ width: "100px" }}>
                  <input
                    onChange={(e) =>
                      rowDtoHandler("increaseQty", e.target.value, index)
                    }
                    type="number"
                    name="increaseQty"
                    placeholder="Sales quantity"
                    className="form-control"
                    min="0"
                    required={true}
                    step="any"
                  />
                </td>
                <td style={{ width: "100px" }}>
                  <input
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        rowDtoHandler("increaseVat", e.target.value, index);
                      }
                    }}
                    type="number"
                    name="increaseVat"
                    placeholder="Sales vat"
                    className="form-control"
                    min="0"
                    required={true}
                    step="any"
                  />
                </td>
                <td style={{ width: "100px" }}>
                  <input
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        rowDtoHandler("increaseSd", e.target.value, index);
                      }
                    }}
                    type="number"
                    name="increaseSd"
                    placeholder="Sales SD"
                    className="form-control"
                    min="0"
                    required={true}
                    step="any"
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  <span onClick={() => deleteHandler(index)}>
                    <IDelete />
                  </span>
                </td>
              </tr>
            ))
          : null}
      </>
    </ICustomTable>
  );
}
