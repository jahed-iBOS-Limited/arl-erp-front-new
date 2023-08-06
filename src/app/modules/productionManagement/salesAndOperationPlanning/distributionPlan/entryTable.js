import React from 'react';
import InputField from '../../../_helper/_inputField';

export default function EntryTable({ rowDto, setRowDto }) {
  return (
    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
      <thead>
        <tr>
          <th>SL</th>
          <th className="text-left">Item Code </th>
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
              <td>{item?.salesPlanQty}</td>
              <td>{item?.distributionPlanQty}</td>
              <td>
                <InputField
                  name="planQty"
                  type="number"
                  value={item?.planQty || ""}
                  onChange={(e) => {
                    const newItem = { ...item };
                    newItem.planQty = e?.target?.value < 0 ? '' : e?.target?.value;
                    const newRowDto = rowDto?.itemList?.map((itm) => {
                      return itm?.itemId === newItem?.itemId ? newItem : itm;
                    });
                    setRowDto({
                      itemList: newRowDto
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
                    const newItem = { ...item };
                    newItem.planRate = e?.target?.value < 0 ? '' : e?.target?.value;
                    const newRowDto = rowDto?.itemList?.map((itm) => {
                      return itm?.itemId === newItem?.itemId ? newItem : itm;
                    });
                    setRowDto({
                      itemList: newRowDto
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
                    const newItem = { ...item };
                    newItem.planTransQty = e?.target?.value < 0 ? '' : e?.target?.value;
                    const newRowDto = rowDto?.itemList?.map((itm) => {
                      return itm?.itemId === newItem?.itemId ? newItem : itm;
                    });
                    setRowDto({
                      itemList: newRowDto
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
                    const newItem = { ...item };
                    newItem.planTransRate = e?.target?.value < 0 ? '' : e?.target?.value;
                    const newRowDto = rowDto?.itemList?.map((itm) => {
                      return itm?.itemId === newItem?.itemId ? newItem : itm;
                    });
                    setRowDto({
                      itemList: newRowDto
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
