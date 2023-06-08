import React from "react";
import IDelete from './../../../_helper/_helperIcons/_delete';

export default function HoldInvoice({
  customerName,
  total,
  rowDto,
  holdingInvoice,
  setHoldingInvoice,
  id,
  saveHandler,
  values,
  setId,
  voucherCode,
  deleteHoldingDataHandler
}) {

  return (
    <table className="table table-striped table-bordered global-table">
      <thead>
        <tr>
          <th>SL</th>
          <th>Customer Name</th>
          <th>Total Item Qty</th>
          <th>Total Amount</th>
          <th style={{ width: "80px" }}>Action</th>
        </tr>
      </thead>
      <tbody className="itemList">
        {customerName && rowDto.length > 0 && !voucherCode && (
          <tr>
            <td>{0}</td>
            <td className="text-left">{customerName}</td>
            <td>{rowDto.length}</td>
            <td>{total}</td>
            <td className="text-center">
              <button
                type="button"
                className="btn btn-outline-dark mr-1 pointer"
                style={{ padding: "1px 10px", fontSize: "11px" }}
                onClick={() => saveHandler(values, true)}
              >
                Hold
              </button>
            </td>
          </tr>
        )}
        {holdingInvoice?.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td className="text-left">{item?.soldToPartnerName}</td>
            <td>{item?.itemCount}</td>
            <td className="text-center">{item?.totalNetAmount}</td>
            <td className="d-flex text-center">
              <button
                type="button"
                className="btn btn-outline-dark mr-1 pointer"
                style={{ padding: "1px 10px", fontSize: "11px" }}
                disabled={id===item?.deliveryId}
                onClick={() =>{
                  setId(item?.deliveryId)
                  setHoldingInvoice()
                }}
              >
                Recall
              </button>
              <IDelete
                remover={deleteHoldingDataHandler}
                id={item?.deliveryId}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
