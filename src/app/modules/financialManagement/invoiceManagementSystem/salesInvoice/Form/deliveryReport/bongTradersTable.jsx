import React from 'react';

function BongTradersTable({
  deliveryOrderReportData,
  totalQuantity,
  totalRate,
}) {
  return (
    <>
      <div className="my-8">
        {deliveryOrderReportData?.rows?.length >= 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-bordered  global-table">
              <thead>
                <tr>
                  <th style={{ width: '35px' }}>SL</th>
                  <th>PRODUCT DESCRIPTION</th>
                  <th>UOM</th>
                  <th>QNT.(TON)</th>
                  <th>QNT.(BAG)</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {deliveryOrderReportData?.rows
                  ?.filter((itm) => !itm?.isTradeFreeItem)
                  ?.map((td, index) => {
                    return <CommonTR td={td} index={index} />;
                  })}
                {/* offer item show start */}
                {deliveryOrderReportData?.rows?.filter(
                  (itm) => itm?.isTradeFreeItem
                )?.length > 0 && (
                  <tr>
                    <td colSpan={2} className="text-left">
                      <b>Offer Item</b>
                    </td>
                  </tr>
                )}
                {deliveryOrderReportData?.rows
                  ?.filter((itm) => itm?.isTradeFreeItem)
                  ?.map((td, index) => {
                    return <CommonTR td={td} index={index} />;
                  })}
                {/* offer item show end */}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3">
                    <b>TOTAL</b>
                  </td>
                  <td className="text-right">
                    <b>{totalQuantity}</b>
                  </td>
                  <td className="text-right">
                    <b>{totalQuantity * 20}</b>
                  </td>
                  <td className="text-right">
                    <b>{totalRate}</b>
                  </td>
                  <td className="text-right">
                    <b>{totalQuantity * totalRate}</b>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

const CommonTR = ({ index, td }) => {
  return (
    <tr key={index}>
      <td> {index + 1} </td>
      <td>
        <div className="text-left pr-2">{td.prodcuctDescription}</div>
      </td>
      <td>
        <div className="pl-2">{td.uom}</div>
      </td>
      <td>
        <div className="text-right pl-2">{td.quantity}</div>
      </td>
      <td>
        <div className="text-right pl-2">{td.quantity * 20}</div>
      </td>
      <td>
        <div className="text-right pl-2">{td?.itemPrice}</div>
      </td>
      <td>
        <div className="text-right pl-2">
          {(+td.quantity || 0) * (+td?.itemPrice || 0)}
        </div>
      </td>
    </tr>
  );
};

export default BongTradersTable;
