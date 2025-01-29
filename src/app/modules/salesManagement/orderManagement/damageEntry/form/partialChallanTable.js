import React from "react";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";

export default function PartialChallanTable({ obj }) {
  const { gridData, allSelect, selectedAll, setGridData } = obj;

  const dataChangeHandler = (headerIndex, rowIndex, key, value) => {
    let _data = [...gridData];

    _data[headerIndex]["rowData"][rowIndex][key] = value;
    setGridData(_data);
  };

  let totalDeliveryQty = 0;
  let totalAmount = 0;
  let totalDamage = 0;
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th
                onClick={() => allSelect(!selectedAll())}
                className="text-center cursor-pointer"
                style={{ width: "40px" }}
              >
                <input
                  type="checkbox"
                  value={selectedAll()}
                  checked={selectedAll()}
                  onChange={() => { }}
                />
              </th>
              <th>SL</th>
              <th>Challan No</th>
              <th>Delivery Date</th>
              <th>Item Name</th>
              <th>Item Price</th>
              <th>Delivery Quantity</th>
              <th>Amount</th>
              <th style={{ width: "120px" }}>Return Qty</th>
              <th style={{ width: "120px" }}>Tolarance Qty</th>
              <th>Remaining Qty</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.map((item, index) => (
              <>
                {item?.rowData?.map((element, rowIndex) => {
                  totalDeliveryQty += element?.quantity;
                  totalAmount += element?.amount;
                  totalDamage += element?.returnQty;
                  return (
                    <tr key={`${index}-${rowIndex}`}>
                      {/* Merge SL, Challan No, and Delivery Date only in the first row of each item */}
                      {rowIndex === 0 && (
                        <>
                          <td rowSpan={item?.rowData?.length} className="text-center">
                            <input
                              type="checkbox"
                              checked={item?.isSelected}
                              onChange={() => {
                                let _data = [...gridData];
                                _data[index]["isSelected"] = !item.isSelected;
                                setGridData(_data);
                              }}
                            />
                          </td>
                          <td rowSpan={item?.rowData?.length}>{index + 1}</td>
                          <td rowSpan={item?.rowData?.length}>{item?.deliveryCode}</td>
                          <td rowSpan={item?.rowData?.length}>{_dateFormatter(item?.deliveryDate)}</td>
                        </>
                      )}

                      {/* These columns should appear correctly per row */}
                      <td>{element?.itemName}</td>
                      <td className="text-right">{_fixedPoint(element?.itemPrice, true, 0)}</td>
                      <td className="text-right">{_fixedPoint(element?.quantity, true)}</td>
                      <td className="text-right">{_fixedPoint(element?.amount, true)}</td>
                      <td className="text-right">
                        {item?.isSelected ? (
                          <InputField
                            value={element?.returnQty || ""}
                            name="returnQty"
                            placeholder="Return qty"
                            type="number"
                            min="0.2"
                            onChange={(e) => {
                              if (+e.target.value < 0) {
                                return toast.warn("Return qty cannot be negative");
                              }
                              dataChangeHandler(index, rowIndex, "returnQty", +e.target.value);
                            }}
                          />
                        ) : (
                          element?.returnQty
                        )}
                      </td>
                      <td className="text-right">{_fixedPoint(element?.quantity * (2 / 100), true)}</td>
                      <td className="text-right">{_fixedPoint(element?.quantity - element?.returnQty)}</td>
                    </tr>
                  )
                })}
              </>
            )
            )}

            <tr style={{ textAlign: "right", fontWeight: "bold" }}>
              <td colSpan={6} className="text-right">
                <b>Total</b>
              </td>
              <td>{_fixedPoint(totalDeliveryQty, true)}</td>
              <td>{_fixedPoint(totalAmount, true)}</td>
              <td>{_fixedPoint(totalDamage, true, 0)}</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
