import React from "react";
import InputField from "../../../_helper/_inputField";
import { modifyRowDto } from "./helper";

export default function EntryTable({ tableData, setTableData }) {
  // getAbsoluteValue
  const getAbsoluteValue = (e) => {
    let newValue = e?.target?.value;
    newValue = newValue < 0 ? Math?.abs(newValue) : newValue;
    return newValue;
  };

  return (
    <div className="table-responsive">
<table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
      <thead>
        <tr>
          <th>SL</th>
          <th>Item Code</th>
          <th>Item Name</th>
          <th>UoM</th>
          <th>Plant</th>
          <th>Warehouse</th>
          <th>Sales Plant Qty</th>
          <th>Distribution Plan Rest Qty</th>
          <th>Plan Qty</th>
          <th>Plan Rate</th>
        </tr>
      </thead>
      <tbody>
        {tableData?.itemList?.length > 0 &&
          tableData?.itemList?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item?.itemCode}</td>
              <td>{item?.itemName}</td>
              <td>{item?.itemUoMName}</td>
              <td>{item?.strPlantHouseName}</td>
              <td>{item?.strWareHouseName}</td>
              <td className="text-center">{item?.salesPlanQty}</td>
              <td className="text-center">{+item?.intRestQty}</td>
              <td>
                <InputField
                  name="planQty"
                  type="number"
                  value={item?.planQty || ""}
                  onChange={(e) => {
                    const data = [...tableData?.itemList];
                    data[index] = {
                      ...item,
                      planQty: getAbsoluteValue(e),
                    };
                    const modifyItemList = modifyRowDto(data);
                    console.log(modifyItemList);
                    setTableData((prev) => ({
                      ...prev,
                      itemList: modifyItemList,
                    }));
                  }}
                />
              </td>
              <td>
                <InputField
                  name="planRate"
                  type="number"
                  value={item?.planRate || ""}
                  onChange={(e) => {
                    const data = [...tableData?.itemList];
                    data[index] = { ...item, planRate: getAbsoluteValue(e) };
                    setTableData((prev) => ({
                      ...prev,
                      itemList: data,
                    }));
                  }}
                />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
    </div>
    
  );
}
