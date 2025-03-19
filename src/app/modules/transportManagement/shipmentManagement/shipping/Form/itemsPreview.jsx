import React from "react";

const ChallanItemsPreview = ({ rowData }) => {
  const header = ["SL", "Item Name", "Item Qty"];
  return (
    <div className="table-responsive">
      <table
        className={
          "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
        }
      >
        <thead>
          <tr className="cursor-pointer">
            {header.map((th, index) => {
              return <th key={index}> {th} </th>;
            })}
          </tr>
        </thead>
        {rowData?.map((item, index) => {
          return (
            <tr className="cursor-pointer" key={index}>
              <td style={{ width: "40px" }} className="text-center">
                {index + 1}
              </td>
              <td>{item?.itemName}</td>
              <td className="text-right">{item?.quantity}</td>
            </tr>
          );
        })}
        <tr style={{ fontWeight: "bold", textAlign: "right" }}>
          <td colSpan={2}>Total</td>
          <td>
            {rowData?.reduce((acc, curr) => {
              return acc + Number(curr?.quantity);
            }, 0)}
          </td>
        </tr>
      </table>
    </div>
  );
};

export default ChallanItemsPreview;
