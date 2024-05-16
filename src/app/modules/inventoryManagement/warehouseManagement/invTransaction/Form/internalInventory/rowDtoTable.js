import React from "react";
import IDelete from "../../../../../_helper/_helperIcons/_delete";

const RowDtoTable = ({ rowDto, remover }) => {
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
                  <th>Quantity</th>
                  <th>Current Stock</th>
                  <th>Present Location</th>
                  <th>Transfer Location</th>
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
                      {item?.numTransactionQuantity}
                    </td>
                    <td className="text-center align-middle">
                      {item?.avaiableStock}
                    </td>
                    <td className="text-center align-middle">
                      {item?.inventoryLocationName}
                    </td>
                    <td className="text-center align-middle">
                      {item?.toInventoryLocationName}
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
