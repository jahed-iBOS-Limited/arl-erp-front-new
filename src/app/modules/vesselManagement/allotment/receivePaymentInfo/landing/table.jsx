/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const headers = [
  "SL",
  "Program No",
  "Mother Vessel",
  "Buffer",
  "Delivery Code",
  "Delivery Date",
  "Item",
  "Quantity (bag)",
  "Quantity (ton)",
  "Status",
  "JV Code",
];

const ReceivePaymentInfoLandingTable = ({ obj }) => {
  const { gridData, values, setGridData } = obj;

  return (
    <>
      {gridData?.length > 0 && (
        <div className="table-responsive">
          <table
            id="table-to-xlsx"
            className={
              "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
            }
          >
            <thead>
              <tr className="cursor-pointer">
                {[0, 1, 2].includes(values?.status?.value) && (
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        gridData?.length > 0
                          ? gridData?.every((item) => item?.isSelected)
                          : false
                      }
                      onChange={(e) => {
                        setGridData(
                          gridData?.map((item) => {
                            return {
                              ...item,
                              isSelected: e?.target?.checked,
                            };
                          })
                        );
                      }}
                    />
                  </th>
                )}
                {headers?.map((th, index) => {
                  return <th key={index}> {th} </th>;
                })}
              </tr>
            </thead>
            <tbody>
              {gridData?.map((item, index) => {
                return (
                  <tr key={index}>
                    {" "}
                    {[0, 1, 2].includes(values?.status?.value) && (
                      <td className="text-center align-middle">
                        <input
                          type="checkbox"
                          checked={item?.isSelected}
                          onChange={(e) => {
                            item["isSelected"] = e.target.checked;
                            setGridData([...gridData]);
                          }}
                        />
                      </td>
                    )}
                    <td> {item?.SL}</td>
                    <td> {item?.ProgramNo}</td>
                    <td>{item?.MotherVesselName}</td>
                    <td>{item?.ShipToPartnerName}</td>
                    <td> {item?.DeliveryCode}</td>
                    <td>{_dateFormatter(item?.DeliveryDate)}</td>
                    <td>{item?.ItemName}</td>
                    <td className="text-right">{item?.QuantityBag}</td>
                    <td className="text-right">{item?.QuantityTon}</td>
                    <td>
                      {item?.PaymentReceiveStatusName || values?.status?.label}
                    </td>
                    <td>{item?.JvCode}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ReceivePaymentInfoLandingTable;
