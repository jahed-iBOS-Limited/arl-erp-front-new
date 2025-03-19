import React from "react";
import { IInput } from "../../../../../_helper/_input";

const RowDtoTable = ({
  rowDto,
  remover,
  stockDDL,
  locationTypeDDL,
  rowDtoHandler,
  setRowDto,
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
                  <th>Inv Trans Code</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Location</th>
                  <th>Rcv Qty</th>
                  <th>Rest Qty</th>
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
                      {item?.secondRefereneceCode}{" "}
                    </td>
                    <td className="text-center align-middle">
                      {" "}
                      {item?.itemCode}{" "}
                    </td>
                    <td className="">{item?.itemName}</td>
                    <td className="text-center align-middle">
                      {item?.location?.label}
                    </td>
                    <td className="text-center align-middle">
                      {" "}
                      {item?.receiveQty}{" "}
                    </td>
                    <td className="text-center align-middle">
                      {" "}
                      {item?.restQty}{" "}
                    </td>
                    <td
                      style={{ width: "100px" }}
                      className="disabled-feedback disable-border"
                    >
                      <IInput
                        value={rowDto[index]?.quantity}
                        name="quantity"
                        type="number"
                        max={item?.restQty}
                        placeholder="Quantity"
                        required
                        onChange={(e) => {
                          rowDtoHandler("quantity", e.target.value, index);
                        }}
                        min="0"
                      />
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
