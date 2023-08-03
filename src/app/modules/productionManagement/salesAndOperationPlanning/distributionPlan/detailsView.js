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
              <th>Plan Qty(Direct)</th>
              <th>Plan Rate(Direct)</th>
              <th>Plan Rate(Via Transshipment)</th>
              <th>Plan Rate(Via Transshipment)</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.length > 0 &&
              rowData?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.itemCode}</td>
                  <td>{item?.itemName}</td>
                  <td>{item?.itemUoMName}</td>
                  <td className='text-center'>{item?.planQty}</td>
                  <td className='text-center'>{item?.planRate}</td>
                  <td className='text-center'>{item?.planTransQty}</td>
                  <td className='text-center'>{item?.planTransRate}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
