import React from "react";
import InputField from "../../../_helper/_inputField";

export default function EntryTable({ rowDto, setRowDto }) {
  // getAbsoluteValue
  const getAbsoluteValue = (e) => {
    let newValue = e?.target?.value;
    newValue = newValue < 0 ? Math?.abs(newValue) : newValue;
    return newValue;
  };

  return (
    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
      <thead>
        <tr>
          <th>SL</th>
          <th>Item Code</th>
          <th>Item Name</th>
          <th>UoM</th>
          <th>Sales Plant Qty</th>
          <th>Distribution Plant Qty</th>
          <th>Plan Qty(Direct)</th>
          <th>Plan Rate(Direct)</th>
          <th>Plan Qty(Via Transshipment)</th>
          <th>Plan Rate(Via Transshipment)</th>
        </tr>
      </thead>
      <tbody>
        {rowDto?.itemList?.length > 0 &&
          rowDto?.itemList?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item?.itemCode}</td>
              <td>{item?.itemName}</td>
              <td>{item?.itemUoMName}</td>
              <td className="text-center">{item?.salesPlanQty}</td>
              <td className="text-center">{item?.distributionPlanQty}</td>
              <td>
                <InputField
                  name="planQty"
                  type="number"
                  value={item?.planQty || ""}
                  onChange={(e) => {
                    setRowDto((prev) => {
                      const data = [...prev?.itemList];
                      data[index] = { ...item, planQty: getAbsoluteValue(e) };
                      return { ...prev, itemList: data };
                    });
                  }}
                />
              </td>
              <td>
                <InputField
                  name="planRate"
                  type="number"
                  value={item?.planRate || ""}
                  onChange={(e) => {
                    setRowDto((prev) => {
                      const data = [...prev?.itemList];
                      data[index] = { ...item, planRate: getAbsoluteValue(e) };
                      return { ...prev, itemList: data };
                    });
                  }}
                />
              </td>
              <td>
                <InputField
                  name="planTransQty"
                  type="number"
                  value={item?.planTransQty || ""}
                  onChange={(e) => {
                    setRowDto((prev) => {
                      const data = [...prev?.itemList];
                      data[index] = { ...item, planTransQty: getAbsoluteValue(e) };
                      return { ...prev, itemList: data };
                    });
                  }}
                />
              </td>
              <td>
                <InputField
                  name="planTransRate"
                  type="number"
                  value={item?.planTransRate || ""}
                  onChange={(e) => {
                    setRowDto((prev) => {
                      const data = [...prev?.itemList];
                      data[index] = { ...item, planTransRate: getAbsoluteValue(e) };
                      return { ...prev, itemList: data };
                    });
                  }}
                />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
