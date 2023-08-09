import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";

export default function TableOne({ obj }) {
  const {
    values,
    gridData,
    setDetails,
    setModalShow,
    getSummaryReportData,
  } = obj;

  let totalOrderQty = 0;
  let totalOrderValue = 0;
  let totalDeliveryQty = 0;
  let totalDeliveryValue = 0;
  let totalPendingQty = 0;
  return (
    <>
      {gridData?.length > 0 && (
        <div className="loan-scrollable-table">
          <div className="scroll-table _table" style={{ maxHeight: "400px" }}>
            <table className="table table-striped table-bordered bj-table bj-table-landing text-center">
              <thead>
                <tr>
                  <th style={{ minWidth: "50px" }}>SL</th>
                  {values?.reportType?.value !== 1 && (
                    <>
                      <th style={{ minWidth: "75px" }}>Order Date</th>
                      <th style={{ minWidth: "95px" }}>Order Code</th>
                    </>
                  )}

                  <th style={{ minWidth: "100px" }}>Customer Name</th>
                  <th style={{ minWidth: "100px" }}>Customer Address</th>
                  <th style={{ minWidth: "75px" }}>Order Quantity</th>
                  <th style={{ minWidth: "75px" }}>Order Value</th>

                  <th style={{ minWidth: "100px" }}>Delivery Quantity</th>
                  <th style={{ minWidth: "100px" }}>Delivery Value</th>
                  <th style={{ minWidth: "100px" }}>Pending Delivery</th>

                  <th style={{ minWidth: "50px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.map((item, index) => {
                  totalOrderQty += item?.orderQty;
                  totalOrderValue += item?.orderValue;
                  totalDeliveryQty += item?.deliveryQty;
                  totalDeliveryValue += item?.deliveryValue;
                  totalPendingQty += item?.orderQty - item?.deliveryQty;

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      {values?.reportType?.value !== 1 && (
                        <>
                          <td>{_dateFormatter(item?.orderdate)}</td>
                          <td>{item?.orderCode}</td>
                        </>
                      )}
                      <td>{item?.soldToPartner}</td>
                      <td>{item?.soldToPartnerAddress}</td>
                      <td className="text-right">
                        {_fixedPoint(item?.orderQty, true, 4)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.orderValue, true, 0)}
                      </td>

                      <td className="text-right">
                        {_fixedPoint(item?.deliveryQty, true, 4)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.deliveryValue, true, 0)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(
                          item?.orderQty - item?.deliveryQty,
                          true,
                          4
                        )}
                      </td>

                      <td className="action-att-report-print-disabled">
                        <div className="d-flex justify-content-around">
                          <span className="view">
                            <IView
                              clickHandler={() => {
                                setModalShow(true);
                                getSummaryReportData(item?.orderId, setDetails);
                              }}
                              classes="text-primary"
                            />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                <tr style={{ fontWeight: "bold", textAlign: "right" }}>
                  <td
                    colSpan={values?.reportType?.value !== 1 ? 5 : 3}
                    className="text-right"
                  >
                    <b>Total</b>
                  </td>
                  <td>{_fixedPoint(totalOrderQty, true, 0)}</td>
                  <td>{_fixedPoint(totalOrderValue, true, 0)}</td>
                  <td>{_fixedPoint(totalDeliveryQty, true, 0)}</td>
                  <td>{_fixedPoint(totalDeliveryValue, true, 0)}</td>
                  <td>{_fixedPoint(totalPendingQty, true, 0)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
