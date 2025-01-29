import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const ths1 = [
  "SL",
  "Delivery Code",
  "Delivery Quantity",
  "Load Amount",
  "Unload Amount",
];

const ths2 = [
  "SL",
  "Shipment Code",
  "Challan No",
  "Item Qty",
  // "Labour Qty",
  "Labour Rate",
  "Net Amount",
  "Bill Amount",
];

const ths3 = [
  "SL",
  "Supplier Name",
  "Shipment Code",
  "Challan No",
  "Item Qty",
  "Labour Rate",
  "Labour Bill Amount",
];

const Table = ({ rowData, buId, values }) => {
  const typeId = values?.reportType?.value;

  const headers = () => {
    if (buId === 4) {
      if (typeId === 1) {
        return ths2;
      } else if (typeId === 2) {
        return ths3;
      }
    } else {
      return ths1;
    }
  };

  let totalNetAmount = 0;
  let totalBillAmount = 0;
  let totalQty = 0;

  let totalLoadAmount = 0;
  let totalUnloadAmount = 0;
  let totalDeliveryQty = 0;

  let totalLabourBillAmount = 0;
  let totalItemQty = 0;
  
  return (
    <>
      <ICustomTable ths={headers()}>
        {buId === 4 ? (
          typeId === 1 ? (
            <>
              {rowData?.map((item, index) => {
                totalNetAmount += item?.labourBillAmount;
                totalBillAmount += item?.approvedAmount;
                totalQty += item?.totalItemQty;
                return (
                  <tr key={index}>
                    <td className="text-center align-middle">{index + 1}</td>
                    <td>{item?.shipmentCode}</td>
                    <td>{item?.challanNo}</td>
                    <td className="text-right">{item?.totalItemQty || 0}</td>
                    <td className="text-right">
                      {item?.labourRate || item?.handlingCostRate || 0}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.labourBillAmount, true, 0)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.approvedAmount, true, 0)}
                    </td>
                  </tr>
                );
              })}
              <tr style={{ fontWeight: "bold", textAlign: "right" }}>
                <td colSpan={3} className="text-right">
                  <b>Total</b>
                </td>
                <td>{_fixedPoint(totalQty, true, 0)}</td>
                <td></td>
                <td>{_fixedPoint(totalNetAmount, true, 0)}</td>
                <td>{_fixedPoint(totalBillAmount, true, 0)}</td>
              </tr>
            </>
          ) : (
            <>
              {rowData?.map((item, index) => {
                totalLabourBillAmount += item?.labourBillAmount;
                totalItemQty += item?.totalItemQty;
                return (
                  <tr key={index}>
                    <td className="text-center align-middle">{index + 1}</td>
                    <td>{item?.labourSupplierName}</td>
                    <td>{item?.shipmentCode}</td>
                    <td>{item?.challanNo}</td>
                    <td className="text-right">{item?.totalItemQty || 0}</td>
                    <td className="text-right">
                      {item?.labourRate || item?.handlingCostRate || 0}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.labourBillAmount, true, 0)}
                    </td>
                  </tr>
                );
              })}
              <tr style={{ fontWeight: "bold", textAlign: "right" }}>
                <td colSpan={4} className="text-right">
                  <b>Total</b>
                </td>
                <td>{_fixedPoint(totalItemQty, true, 0)}</td>
                <td></td>
                <td>{_fixedPoint(totalLabourBillAmount, true, 0)}</td>
              </tr>
            </>
          )
        ) : (
          <>
            {rowData?.map((item, index) => {
              totalDeliveryQty += item?.deliveryQty;
              totalLoadAmount += item?.loadAmount;
              totalUnloadAmount += item?.unLoadAmount;
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.deliveryCode}</td>
                  <td className="text-right">{item?.deliveryQty}</td>
                  <td className="text-right">{item?.loadAmount}</td>
                  <td className="text-right">{item?.unLoadAmount}</td>
                </tr>
              );
            })}
            <tr style={{ fontWeight: "bold", textAlign: "right" }}>
              <td colSpan={2} className="text-right">
                <b>Total</b>
              </td>
              <td>{_fixedPoint(totalDeliveryQty, true, 0)}</td>
              <td></td>
              <td>{_fixedPoint(totalLoadAmount, true, 0)}</td>
              <td>{_fixedPoint(totalUnloadAmount, true, 0)}</td>
            </tr>
          </>
        )}
      </ICustomTable>
    </>
  );
};

export default Table;
