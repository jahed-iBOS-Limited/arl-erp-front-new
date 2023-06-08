import React from "react";

function GridTable({ rowDto, values }) {
  // report 01
  let totalAllotment = 0;
  let totalDqty = 0;
  let totalResidual = 0;

  //   report 02
  let totalADeliveryQty = 0;
  let totalaavgrate = 0;
  let totalAAmount = 0;

  let totalRDeliveryQty = 0;
  let totalravgRate = 0;
  let totalRAmount = 0;
  return (
    <>
      {values?.internalType?.value === 1 ? (
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Sales Center</th>
                <th>District</th>
                <th>Allotment (MT)</th>
                <th>Sold (MT)</th>
                <th>Residual (MT)</th>
              </tr>
            </thead>
            {rowDto?.length > 0 && (
              <tbody>
                {rowDto?.map((item, i) => {
                  totalAllotment += +item?.Allotment || 0;
                  totalDqty += +item?.Dqty || 0;
                  totalResidual += +item?.Residual || 0;
                  return (
                    <tr key={i + 1}>
                      <td>{i + 1}</td>
                      <td>{item.shippointName}</td>
                      <td>{item.District}</td>
                      <td className="text-right">{item.Allotment}</td>
                      <td className="text-right"> {item.Dqty}</td>
                      <td className="text-right">{item.Residual}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="text-right font-weight-bold" colspan="3">
                    Total
                  </td>
                  <td className="text-right font-weight-bold">
                    {Math.round(totalAllotment)}
                  </td>
                  <td className="text-right font-weight-bold">
                    {Math.round(totalDqty)}
                  </td>
                  <td className="text-right font-weight-bold">
                    {Math.round(totalResidual)}
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th rowspan="2">SL</th>
                <th colspan="4">Purchase </th>
                <th colspan="4">Re-sell </th>
                <th colspan="2">Difference</th>
              </tr>
              <tr>
                <th>Customer Name </th>
                <th>Quantity Bought (MT) </th>
                <th>Rate (per MT) </th>
                <th>Total Amount (BDT)</th>
                <th>Customer Name</th>
                <th>Quantity Sold (MT)</th>
                <th>Rate (per MT)</th>
                <th>Total Amount (BDT)</th>
                <th>Residual Quantity (MT)</th>
                <th>Avg. Rate (per MT)</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.map((item, i) => {
                totalADeliveryQty += +item?.ADeliveryQty || 0;
                totalaavgrate += +item?.aavgrate || 0;
                totalAAmount += +item?.AAmount || 0;

                totalRDeliveryQty += +item?.RDeliveryQty || 0;
                totalravgRate += +item?.ravgRate || 0;
                totalRAmount += +item?.RAmount || 0;
                return (
                  <tr key={i + 1}>
                    <td>{i + 1}</td>
                    <td>{item.Acustname}</td>
                    <td className="text-right">{item.ADeliveryQty}</td>
                    <td className="text-right">{item.aavgrate}</td>
                    <td className="text-right">{item.AAmount}</td>
                    <td>{item.Rcustname}</td>
                    <td className="text-right">{item.RDeliveryQty}</td>
                    <td className="text-right">{item.ravgRate}</td>
                    <td className="text-right">{item.RAmount}</td>
                    {i === 0 && <td colspan="2" rowspan={rowDto?.length}></td>}
                  </tr>
                );
              })}
              <tr>
                <td colspan="2" className="text-right font-weight-bold">
                  {" "}
                  Total
                </td>

                <td className="text-right font-weight-bold">
                  {Math.round(totalADeliveryQty)}
                </td>
                <td className="text-right font-weight-bold">
                  {Math.round(totalaavgrate)}
                </td>
                <td className="text-right font-weight-bold">
                  {Math.round(totalAAmount)}
                </td>
                <td></td>
                <td className="text-right font-weight-bold">
                  {Math.round(totalRDeliveryQty)}
                </td>
                <td className="text-right font-weight-bold">
                  {Math.round(totalravgRate)}
                </td>
                <td className="text-right font-weight-bold">
                  {Math.round(totalRAmount)}
                </td>

                <td className="text-right font-weight-bold">
                  {Math.round((totalADeliveryQty - totalRDeliveryQty))}
                </td>
                <td className="text-right font-weight-bold">
                  {Math.round((totalaavgrate - totalravgRate))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default GridTable;
