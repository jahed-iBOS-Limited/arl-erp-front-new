/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const headers = ["SL", "Date", "Item Name", "Warehouse", "Quantity", "Action"];

const ReceivePaymentInfoLandingTable = ({ obj }) => {
  const { gridData } = obj;

  return (
    <>
      {gridData?.length > 0 && (
        <table
          id="table-to-xlsx"
          className={
            "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
          }
        >
          <thead>
            <tr className="cursor-pointer">
              {headers?.map((th, index) => {
                return <th key={index}> {th} </th>;
              })}
            </tr>
          </thead>
          <tbody>
            {gridData?.map((item, index) => {
              return (
                <tr key={index}>
                  <td> {item?.sl}</td>
                  <td>{_dateFormatter(item?.transactionDate)}</td>
                  <td>{item?.itemName}</td>
                  <td>{item?.warehouseName}</td>
                  <td className="text-right">
                    {_fixedPoint(item?.transactionQuantity, true)}
                  </td>
                  <td>
                    <div className="d-flex justify-content-around">
                      {/* <span className="text-center">
                        <IView clickHandler={() => {}} />
                      </span>
                      <span className="edit" onClick={() => {}}>
                        <IEdit title={"Rate Entry"} />
                      </span> */}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
};

export default ReceivePaymentInfoLandingTable;
