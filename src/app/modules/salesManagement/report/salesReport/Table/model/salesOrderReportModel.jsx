import React, { useEffect, useState } from "react";
import { GetSalesOrderReportByItem } from "./../../helper";
import Loading from "./../../../../../_helper/_loading";
import { _dateFormatter } from "./../../../../../_helper/_dateFormate";
import SalesOrderView from "../../../../orderManagement/salesOrder/View/viewModal";
function SalesOrderReportModel({ rowDataDeliveryDetailsClick }) {
  const [salesOrderReport, setSalesOrderReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOrderModel, setIsOrderModel] = useState(false);
  const [rowDataClick, setRowDataClick] = useState("");
  useEffect(() => {
    if (rowDataDeliveryDetailsClick) {
      GetSalesOrderReportByItem(
        rowDataDeliveryDetailsClick,
        setSalesOrderReport,
        setLoading
      );
    }
  }, [rowDataDeliveryDetailsClick]);
  return (
    <>
      {loading && <Loading />}
      <div className="table-responsive salesReportTableWrapper">
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Order Code</th>
                <th>Order Date</th>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Order Quantity</th>
                <th>Order Amount</th>
              </tr>
            </thead>
            <tbody>
              {salesOrderReport?.map((item, i) => (
                <tr key={i + 1}>
                  <td>{i + 1}</td>
                  <td
                    className="salesReportQtyModel pointer"
                    onClick={() => {
                      setIsOrderModel(true);
                      setRowDataClick(item);
                    }}
                  >
                    {item?.orderCode}
                  </td>
                  <td>{_dateFormatter(item?.orderDate)}</td>
                  <td>{item?.itemCode}</td>
                  <td>{item?.itemName}</td>
                  <td className="text-right">{item?.orderQuantity}</td>
                  <td className="text-right">{item?.orderAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <SalesOrderView
        id={rowDataClick?.orderId}
        show={isOrderModel}
        onHide={() => setIsOrderModel(false)}
      />
    </>
  );
}

export default SalesOrderReportModel;
