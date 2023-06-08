import React, { useEffect, useState } from "react";
import { GetSalesReportDateRangeByItem } from "./../../helper";
import { _dateFormatter } from "./../../../../../_helper/_dateFormate";
import Loading from "./../../../../../_helper/_loading";
import IViewModal from "./../../../../../_helper/_viewModal";
import DeliveryReportTable from "./../../../../../inventoryManagement/warehouseManagement/delivery/View/Table/table";
import SalesOrderReportModel from "./salesOrderReportModel";

function QtyClickModel({ viewClickRowData }) {
  const [salesReport, setSalesReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [
    rowDataDeliveryDetailsClick,
    setRowDataDeliveryDetailsClick,
  ] = useState("");
  const [isDeliveryCodeClickModel, setIsDeliveryCodeClickModel] = useState(
    false
  );
  const [isDeliveryDtsClickModel, setIsDeliveryDtsClickModel] = useState(false);

  useEffect(() => {
    if (viewClickRowData) {
      GetSalesReportDateRangeByItem(
        viewClickRowData,
        setSalesReport,
        setLoading
      );
    }
  }, [viewClickRowData]);
  return (
    <>
      {loading && <Loading />}
      <div className="table-responsive salesReportTableWrapper">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Delivery Code</th>
              <th>Delivery Date</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {salesReport?.map((item, i) => (
              <tr key={i + 1}>
                <td>{i + 1}</td>
                <td
                  onClick={() => {
                    setIsDeliveryCodeClickModel(true);
                    setRowDataDeliveryDetailsClick(item);
                  }}
                  className="pointer salesReportQtyModel"
                >
                  {item?.deliveryCode}
                </td>
                <td>{_dateFormatter(item?.deliveryDate)}</td>
                <td>{item?.itemName}</td>
                <td
                  className="text-right salesReportQtyModel pointer"
                  onClick={() => {
                    setIsDeliveryDtsClickModel(true);
                    setRowDataDeliveryDetailsClick(item);
                  }}
                >
                  {item?.quantity}
                </td>
                <td className="text-right">{item?.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <IViewModal
        show={isDeliveryCodeClickModel}
        onHide={() => setIsDeliveryCodeClickModel(false)}
        // title="Delivery Details"
      >
        <DeliveryReportTable id={rowDataDeliveryDetailsClick?.deliveryId} />
      </IViewModal>

      <IViewModal
        show={isDeliveryDtsClickModel}
        onHide={() => setIsDeliveryDtsClickModel(false)}
      >
        <SalesOrderReportModel
          rowDataDeliveryDetailsClick={rowDataDeliveryDetailsClick}
        />
      </IViewModal>
    </>
  );
}

export default QtyClickModel;
