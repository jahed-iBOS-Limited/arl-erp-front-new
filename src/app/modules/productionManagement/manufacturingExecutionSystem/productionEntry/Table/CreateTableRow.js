import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import IDelete from "../../../../_helper/_helperIcons/_delete";

const tableHeader = ["SL", "Item Code", "Output item", "Output UoM", "Output Qty", "Action"];

export default function CreateTableRow({
  rowData,
  isEdit,
  deleteHandler,
  dataHandler,
  values,
}) {

  return (
    <ICustomTable ths={tableHeader}>
      <>{
        console.log("rowData", rowData)
      }
        {rowData &&
          rowData?.map((item, index) => (

            <>

              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td>
                  <div style={{ textAlign: "left" }} className="pl-2">
                    {item?.code ? item?.code : item?.strItemCode}
                  </div>
                </td>
                <td>
                  <div style={{ textAlign: "left" }} className="pl-2">
                    {item?.itemName}
                  </div>
                </td>
                <td>
                  <div style={{ textAlign: "left" }} className="pl-2">
                    {item?.uomName}
                  </div>
                </td>
                <td style={{ textAlign: "center", width: "80px" }}>
                  <input
                    style={{ width: "80px" }}
                    onChange={(e) => {
                      dataHandler(
                        "numQuantity",
                        e?.target?.value,
                        index
                      );
                    }}
                    required
                    className="form-control"
                    type="number"
                    name="numQuantity"
                    step="any"
                    defaultValue={
                      item?.numQuantity >= 0 ? item?.numQuantity : ""
                    }
                  // disabled={item?.numQuantity === 0 ? true : false}
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  <span onClick={() => deleteHandler(index)}>
                    <IDelete />
                  </span>
                </td>
              </tr>
            </>
          ))}
      </>
    </ICustomTable>
  );
}
