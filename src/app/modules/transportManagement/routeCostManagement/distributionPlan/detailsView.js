import React from 'react';

export default function DetailsDistributionView({ rowData }) {
  return (
    <div className="row">
      <div className="col-lg-12">
        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
          <thead>
            <tr>
              <th>SL</th>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Item UoM Name</th>
              <th>Plan Qty</th>
              <th>Plan Rate</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.length > 0 &&
              rowData?.map((item, index) => (
                <tr key={index}>
                  <td>{item?.sl}</td>
                  <td>{item?.itemCode}</td>
                  <td>{item?.itemName}</td>
                  <td>{item?.itemUoMName}</td>
                  <td>{item?.planQty}</td>
                  <td>{item?.planRate}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
