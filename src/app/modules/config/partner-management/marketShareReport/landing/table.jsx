/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
// import { monthDDL } from "../../../../inventoryManagement/warehouseManagement/liftingEntry/form/addEditForm";

const headers = [
  "SL",
  "Region",
  "Area",
  "Territory",
  "Company Name",
  "Sales Qty",
  //   "Month",
  //   "Year",
  "Total Outlet",
  "Akij Outlet",
  "Outlet Coverage(%)",
  "Share Percentage",
];

const GridView = ({ rowData }) => {
  return (
    <>
      {rowData?.length > 0 && (
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
              return (
                <tr key={index}>
                  <td style={{ width: "40px" }} className="text-center">
                    {index + 1}
                  </td>
                  <td>{item?.strRegion}</td>
                  <td>{item?.strArea}</td>
                  <td>{item?.strTerriotry}</td>
                  <td>{item?.strCompanyName}</td>
                  <td className="text-right">
                    {_fixedPoint(item?.decQnt, true, 0)}
                  </td>
                  {/* <td>{monthDDL[item?.intMonthId - 1]?.label}</td>
                  <td>{item?.intYearId}</td> */}
                  <td className="text-right">{item?.intTotalOutlet}</td>
                  <td className="text-right">{item?.intAkijOutlet}</td>
                  <td className="text-right">{item?.decCoverage}</td>
                  <td className="text-right">{item?.decSharePerCentage}%</td>
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

export default GridView;
