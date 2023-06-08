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

export default function TableRowEditPage({
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
                <td style={{ textAlign: "center" }}>{index+1}</td>
                <td>{item.taxItemGroupName}</td>
                <td style={{ textAlign: "center" }}>{item.uomname}</td>
                <td style={{ textAlign: "center" }}>{item.increaseQuantity}</td>
                <td style={{ textAlign: "right" }}>{item.grandTotal}</td>
                <td style={{ textAlign: "right" }}>{item.increaseSdtotal}</td>
                <td style={{ textAlign: "right" }}>{item.increaseVatTotal}</td>
                <td style={{ width: "100px" }}>
                  <input
                    onChange={(e) =>
                      rowDtoHandler("increaseQty", e.target.value, index)
                    }
                    type="number"
                    name="increaseQty"
                    placeholder="Sales quantity"
                    className="form-control"
                    step="any"
                  />
                </td>
                <td style={{ width: "100px" }}>
                  <input
                    onChange={(e) =>
                      rowDtoHandler("increaseVat", e.target.value, index)
                    }
                    type="number"
                    name="increaseVat"
                    placeholder="Sales vat"
                    className="form-control"
                    step="any"
                  />
                </td>
                <td style={{ width: "100px" }}>
                  <input
                    onChange={(e) =>
                      rowDtoHandler("increaseSd", e.target.value, index)
                    }
                    type="number"
                    name="increaseSd"
                    placeholder="Sales SD"
                    className="form-control"
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
