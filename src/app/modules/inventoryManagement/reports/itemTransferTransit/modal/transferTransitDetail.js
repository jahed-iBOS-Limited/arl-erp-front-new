import React, { useEffect, useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { getItemTransferTransitByInvTransactionId } from "../helper";

export function TransferTransitDetail({ currentItem }) {
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState({});

  useEffect(() => {
    // if()
    getItemTransferTransitByInvTransactionId(
      currentItem?.referenceId,
      setDetailData,
      setLoading
    );
  }, [currentItem]);

  let totalTransfer = 0;
  let totalReceive = 0;

  return (
    <>
      <ICustomCard title="Item Transfer Transit">
        <form className="form form-label-left">
          <div className="row global-form">
            <div className="col-lg-4">
              <InputField
                value={detailData?.objHeader?.fromWarehouseName}
                label="From Warehouse"
                placeholder="From Warehouse"
                disabled={true}
                name="fromWarehouse"
              />
            </div>
            <div className="col-lg-4">
              <InputField
                value={detailData?.objHeader?.referenceNo}
                label="Reference No"
                placeholder="Reference No"
                disabled={true}
                name="referenceNo"
              />
            </div>
            <div className="col-lg-4">
              <InputField
                value={_dateFormatter(detailData?.objHeader?.transferDate)}
                label="Transfer Date"
                placeholder="Transfer Date"
                disabled={true}
                name="transferDate"
              />
            </div>
            <div className="col-lg-4">
              <InputField
                value={detailData?.objHeader?.toWarehouseName}
                label="To Warehouse"
                placeholder="To Warehouse"
                disabled={true}
                name="toWarehouse"
              />
            </div>
            {/* <div className="col-lg-4">
              <InputField
                value={detailData?.objHeader?.receiveStatus}
                label="Receive Status"
                placeholder="Receive Status"
                disabled={true}
                name="receiveStatus"
              />
            </div> */}
          </div>
        </form>
        <div className="row">
          <div className="col-lg-12">
            {loading && <Loading />}
            <div className="table-responsive">
              <table className="table table-striped table-bordered global-table table-font-size-sm">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Item</th>
                    <th>UoM</th>
                    <th>Transfer Quantity</th>
                    <th>Total Receive Quantity</th>
                    <th>Last Receive Date</th>
                  </tr>
                </thead>
                <tbody>
                  {detailData?.objRow?.map((item, index) => {
                    totalTransfer += item?.transferQty;
                    totalReceive += item?.receiveQty;
                    return (
                      <tr key={index}>
                        <td style={{ width: "30px" }} className="text-center">
                          {index + 1}
                        </td>
                        <td>{item?.itemName}</td>
                        <td>{item?.uomName}</td>
                        <td className="text-right">{item?.transferQty}</td>
                        <td className="text-right">{item?.receiveQty}</td>
                        <td>{_dateFormatter(item?.lastReceiveDate)}</td>
                      </tr>
                    );
                  })}
                  {detailData?.objRow?.length > 0 && (
                    <tr style={{ textAlign: "right", fontWeight: "bold" }}>
                      <td colSpan={3} className="text-right">
                        Total
                      </td>
                      <td>{totalTransfer}</td>
                      <td>{totalReceive}</td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ICustomCard>
    </>
  );
}
