/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import PaginationTable from "../../../../_helper/_tablePagination";

const headers = [
  "SL",
  "Ghat Name",
  "Lighter Name",
  "Supplier Name",
  "Direct Qty",
  "Dam Qty",
  "Dam Rate",
  "Remaining Dam Qty",
  "Other Labor Qty",
  "Other Labor Rate",
  "Other Cost",
  "Bill Amount",
  // "Action",
];

const DumpToTruckDeliveryLandingTable = ({ obj }) => {
  const {
    values,
    pageNo,
    rowData,
    pageSize,
    setPageNo,
    setPageSize,
    setPositionHandler,
  } = obj;

  let totalDirectQty = 0,
    totalDamQty = 0,
    totalDamRemainingQty = 0,
    totalOtherLaborQty = 0,
    totalOtherCost = 0,
    totalBillAmount = 0;

  return (
    <>
      {rowData?.length > 0 && (
        <div>
          <div className="table-responsive">
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
                {rowData?.map((item, index) => {
                  totalDirectQty += item?.directQnt;
                  totalDamQty += item?.dumpQnt;
                  totalDamRemainingQty += item?.remainingDumpQnt;
                  totalOtherLaborQty += item?.dailyLaboureQnt;
                  totalOtherCost += item?.othersCostRate;
                  totalBillAmount += item?.billAmount;
                  return (
                    <tr key={index}>
                      <td style={{ width: "40px" }} className="text-center">
                        {index + 1}
                      </td>
                      <td>{item?.shipPointName}</td>
                      <td>{item?.lighterVesselName}</td>
                      <td>{item?.supplierName}</td>
                      <td className="text-right">{item?.directQnt}</td>
                      <td className="text-right">{item?.dumpQnt}</td>
                      <td className="text-right">{item?.dumpRate}</td>
                      <td className="text-right">{item?.remainingDumpQnt}</td>
                      <td className="text-right">{item?.dailyLaboureQnt}</td>
                      <td className="text-right">{item?.dailyLaboureRate}</td>
                      <td className="text-right">{item?.othersCostRate}</td>
                      <td className="text-right">{item?.billAmount || 0}</td>
                      {/* <td style={{ width: "80px" }} className="text-center"></td> */}
                    </tr>
                  );
                })}

                <tr style={{ fontWeight: "bold", textAlign: "right" }}>
                  <td colSpan={4} className="text-right">
                    Total
                  </td>
                  <td>{totalDirectQty}</td>
                  <td>{totalDamQty}</td>
                  <td></td>
                  <td>{totalDamRemainingQty}</td>
                  <td>{totalOtherLaborQty}</td>
                  <td></td>
                  <td>{totalOtherCost}</td>
                  <td>{totalBillAmount || 0}</td>
                  {/* <td></td> */}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {rowData?.data?.length > 0 && (
        <PaginationTable
          count={rowData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{
            pageNo,
            setPageNo,
            pageSize,
            setPageSize,
          }}
          values={values}
        />
      )}
    </>
  );
};

export default DumpToTruckDeliveryLandingTable;
