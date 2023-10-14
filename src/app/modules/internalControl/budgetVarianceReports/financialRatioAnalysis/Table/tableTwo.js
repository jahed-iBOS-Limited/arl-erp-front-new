import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { _formatMoney } from "../../../../_helper/_formatMoney";

const TableTow = ({ rowDto }) => {
  const headers = ["Com. Name", "Budget Amount" ,"Actual Amount"];
  return (
    <div>
       <h6 className="m-0 p-0 mt-2">Financial Ratio Component</h6>
      <ICustomTable ths={headers} className="table-font-size-sm">
        {rowDto?.map((item, index) => {
          return (
            <tr key={index}>
              <>
                <td className="text-left">{item?.strComName}</td>
                <td className="text-right">
                  {_formatMoney(Math.round(item?.budgetAmount), 0)}
                </td>
                <td className="text-right">
                  {_formatMoney(Math.round(item?.numAmount), 0)}
                </td>
              </>
            </tr>
          );
        })}
      </ICustomTable>
    </div>
  );
};

export default TableTow;
