import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";

export default function CommonTable({
  salesOrderData,
  printRef,
  buId,
  values,
}) {
  const [, updateSalesOrder, loading] = useAxiosGet();

  const salesOrderUpdate = (item) => {
    updateSalesOrder(
      `/oms/SalesInformation/GetSalesOrderPendingInformation?intsoldtopartnerid=${
        item?.intsoldtopartner
      }&intbusinessunitid=${buId}&SalesOrderCode=${item?.strsalesordercode ||
        "'"}&intpartid=${7}`
    );
  };

  let totalRequestQty = 0,
    totalOrderQty = 0,
    totalDeliveryQty = 0,
    totalUnDeliveryQty = 0,
    totalActualDeliveryQty = 0,
    totalActualUnDeliveryQty = 0,
    totalActualUnDeliveryAmount = 0;
  return (
    <>
      {loading && <Loading />}
      <div className="table-responsive">
        <table
          ref={printRef}
          className="table table-striped table-bordered global-table table-font-size-sm"
        >
          <thead>
            <tr>
              <th style={{ width: "30px" }}>SL</th>
              <th style={{ width: "100px" }}>Sold to Partner</th>
              <th style={{ width: "100px" }}>Channel Name</th>
              <th style={{ width: "100px" }}>Shippoint Name</th>
              <th style={{ width: "100px" }}>Item Name</th>
              <th style={{ width: "120px" }}>Sales Order Code</th>
              <th style={{ width: "120px" }}>Request Quantity</th>
              <th style={{ width: "120px" }}>Order Quantity</th>
              <th style={{ width: "120px" }}>Delivery Quantity</th>
              <th style={{ width: "120px" }}>Un Delivery Quantity</th>
              <th style={{ width: "120px" }}>Actual Delivery Quantity</th>
              <th style={{ width: "120px" }}>Actual Un Delivery Quantity</th>
              <th style={{ width: "120px" }}>Actual Un Delivery Amount</th>
              {[3].includes(values?.reportName?.value) && buId === 184 && (
                <th style={{ width: "50px" }}>Action</th>
              )}
            </tr>
          </thead>

          <tbody>
            {salesOrderData?.map((item, index) => {
              const minusValue =
                item?.numUndeliveryQuantity < 0 ||
                item?.numActualUndeliveryQuantity < 0;

              const lessDelivery =
                item?.numDeliveredQuantity < item?.numActualDeliveredQuantity;

              totalRequestQty += item?.numrequestquantity;
              totalOrderQty += item?.numorderquantity;
              totalDeliveryQty += item?.numDeliveredQuantity;
              totalUnDeliveryQty += item?.numUndeliveryQuantity;
              totalActualDeliveryQty += item?.numActualDeliveredQuantity;
              totalActualUnDeliveryQty += item?.numActualUndeliveryQuantity;
              totalActualUnDeliveryAmount += item?.actualUndelvAmount;
              return (
                <tr
                  key={index}
                  style={
                    lessDelivery
                      ? { backgroundColor: "#ff00007d" }
                      : minusValue
                      ? { backgroundColor: "#ffff0085" }
                      : {}
                  }
                >
                  <td className="text-center">{index + 1}</td>
                  <td>{item?.strsoldtopartner}</td>
                  <td className="text-center">{item?.strChannelName}</td>
                  <td className="text-center">{item?.strshippointname}</td>
                  <td className="text-center">{item?.itemname}</td>
                  <td>{item?.strsalesordercode}</td>
                  <td className="text-right">{item?.numrequestquantity}</td>
                  <td className="text-right">{item?.numorderquantity}</td>
                  <td className="text-right">{item?.numDeliveredQuantity}</td>
                  <td className="text-right">{item?.numUndeliveryQuantity}</td>
                  <td className="text-right">
                    {item?.numActualDeliveredQuantity}
                  </td>
                  <td className="text-right">
                    {item?.numActualUndeliveryQuantity}
                  </td>
                  <td className="text-right">{item?.actualUndelvAmount}</td>
                  {[3].includes(values?.reportName?.value) && buId === 184 && (
                    <td className="text-center">
                      <button
                        className="btn btn-primary btn-sm"
                        type="button"
                        onClick={() => {
                          salesOrderUpdate(item);
                        }}
                      >
                        Update
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            <tr style={{ textAlign: "right", fontWeight: "bold" }}>
              <td className="text-right" colSpan={6}>
                <b>Total</b>
              </td>
              <td>{_fixedPoint(totalRequestQty, true, 0)}</td>
              <td>{_fixedPoint(totalOrderQty, true, 0)}</td>
              <td>{_fixedPoint(totalDeliveryQty, true, 0)}</td>
              <td>{_fixedPoint(totalUnDeliveryQty, true, 0)}</td>
              <td>{_fixedPoint(totalActualDeliveryQty, true, 0)}</td>
              <td>{_fixedPoint(totalActualUnDeliveryQty, true, 0)}</td>
              <td>{_fixedPoint(totalActualUnDeliveryAmount, true, 0)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
