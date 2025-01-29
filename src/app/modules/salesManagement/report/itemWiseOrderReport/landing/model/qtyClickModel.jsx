import React, { useEffect, useState } from "react";
import Loading from "./../../../../../_helper/_loading";
import { GetSalesOrderReportInfoByItemWise_api } from "../../helper";
import SalesOrderView from "../../../../orderManagement/salesOrder/View/viewModal";
function QtyClickModel({ viewClickRowData }) {
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOrderModel, setIsOrderModel] = useState(false);
  const [rowDataClick, setRowDataClick] = useState("");
  useEffect(() => {
    if (viewClickRowData) {
      GetSalesOrderReportInfoByItemWise_api(
        viewClickRowData,
        setRowDto,
        setLoading
      );
    }
  }, [viewClickRowData]);
  return (
    <>
      {loading && <Loading />}
      <div className="table-responsive itemWiseOrderWrapper">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Order Code</th>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {rowDto?.map((item, i) => (
              <tr key={i + 1}>
                <td>{i + 1}</td>
                <td
                  className="itemWiseOrderQtyModel pointer"
                  onClick={() => {
                    setIsOrderModel(true);
                    setRowDataClick(item);
                  }}
                >
                  {item?.orderCode}
                </td>
                <td>{item?.itemCode}</td>
                <td>{item?.itemName}</td>
                <td className="text-right">{item?.quantity}</td>
                <td className="text-right">{item?.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <SalesOrderView
          id={rowDataClick?.orderId}
          show={isOrderModel}
          onHide={() => setIsOrderModel(false)}
        />
      </div>
    </>
  );
}

export default QtyClickModel;
