import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import { toast } from "react-toastify";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

export default function PartialChallanTable({ obj }) {
  const { gridData, allSelect, selectedAll, setGridData } = obj;

  const dataChangeHandler = (headerIndex, rowIndex, key, value) => {
    let _data = [...gridData];

    _data[headerIndex]["rowData"][rowIndex][key] = +value;
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
                  onChange={() => {}}
                />
              </th>
              <th>SL</th>
              <th>Challan No</th>
              <th>Delivery Date</th>
              <th>Item SL</th>
              <th>Item Name</th>
              <th>Item Price</th>
              <th>Delivery Quantity</th>
              <th>Amount</th>
              <th style={{ width: "120px" }}>Return Qty</th>
              <th>Remaining Qty</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.map((item, index) => {
              return (
                <>
                  <tr key={index}>
                    <td
                      rowSpan={item?.rowData?.length + 1}
                      onClick={() => {
                        let _data = [...gridData];
                        _data[index]["isSelected"] = !item.isSelected;
                        setGridData(_data);
                      }}
                      className="text-center"
                    >
                      <input
                        type="checkbox"
                        value={item?.isSelected}
                        checked={item?.isSelected}
                        onChange={() => {}}
                      />
                    </td>
                    <td rowSpan={item?.rowData?.length + 1}> {index + 1}</td>
                    <td rowSpan={item?.rowData?.length + 1}>
                      {" "}
                      {item?.deliveryCode}
                    </td>
                    <td rowSpan={item?.rowData?.length + 1}>
                      {" "}
                      {_dateFormatter(item?.deliveryDate)}
                    </td>
                  </tr>
                  {item?.rowData?.map((element, rowIndex) => {
                    totalDeliveryQty += element?.quantity;
                    totalAmount += element?.amount;
                    totalDamage += +element?.returnQty;
                    return (
                      <tr>
                        <td>{rowIndex + 1}</td>
                        <td>{element?.itemName}</td>
                        <td className="text-right">
                          {_fixedPoint(element?.itemPrice, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(element?.quantity, true)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(element?.amount, true)}
                        </td>
                        <td className="text-right">
                          {item?.isSelected ? (
                            <InputField
                              value={item?.returnQty}
                              name="returnQty"
                              placeholder="Return qty"
                              type="number"
                              onChange={(e) => {
                                dataChangeHandler(
                                  index,
                                  rowIndex,
                                  "returnQty",
                                  +e?.target?.value
                                );
                              }}
                              onBlur={(e) => {
                                if (+e?.target?.value > element?.quantity) {
                                  toast.warn(
                                    "Return qty can not be greater than delivery qty"
                                  );
                                }
                              }}
                            />
                          ) : (
                            item?.returnQty
                          )}
                        </td>
                        <td className="text-right">
                          {element?.quantity - element?.returnQty}
                        </td>
                      </tr>
                    );
                  })}
                </>
              );
            })}
            <tr style={{ textAlign: "right", fontWeight: "bold" }}>
              <td colSpan={7} className="text-right">
                <b>Total</b>
              </td>
              <td>{_fixedPoint(totalDeliveryQty, true)}</td>
              <td>{_fixedPoint(totalAmount, true)}</td>
              <td>{_fixedPoint(totalDamage, true, 0)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
