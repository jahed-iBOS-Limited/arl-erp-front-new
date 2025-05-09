// import React, { useRef } from "react";
// import numberWithCommas from "../../_helper/_numberWithCommas";
// // import moment from "moment";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
// import ReactToPrint from "react-to-print";
// import { dateFormatWithMonthName } from "../../_helper/_dateFormate";

// export default function ProjectedCashflowStatementIndirect({
//   rowData,
//   values,
//   selectedBusinessUnit,
// }) {
//   const printRef = useRef();

//   return (
//     <>
//       <div className="projectedCashflowStatementIndirect">
//         {rowData.length > 0 && (
//           <>
//             <div>
//               <div
//                 className="d-flex justify-content-end"
//                 style={{ marginTop: "25px" }}
//               >
//                 <ReactHTMLTableToExcel
//                   id="test-table-xls-button"
//                   className="download-table-xls-button btn btn-primary"
//                   table="table-to-xlsx"
//                   filename="tablexls"
//                   sheet="tablexls"
//                   buttonText="Export Excel"
//                 />
//                 <ReactToPrint
//                   pageStyle={
//                     "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
//                   }
//                   trigger={() => (
//                     <button
//                       type="button"
//                       className="btn btn-sm btn-primary sales_invoice_btn ml-3"
//                     >
//                       Print
//                     </button>
//                   )}
//                   content={() => printRef.current}
//                 />
//               </div>
//             </div>
//             <div ref={printRef}>
//               <div className="row mt-4">
//                 <div className="col-12 text-center">
//                   <h2>{selectedBusinessUnit}</h2>
//                   <h4 className="text-primary">Projected Cash Flow Indirect</h4>
//                   <p>
//                     <strong>
//                       For the period from :{" "}
//                       <span>{dateFormatWithMonthName(values?.fromDate)}</span>{" "}
//                       To <span>{dateFormatWithMonthName(values?.toDate)}</span>
//                     </strong>
//                   </p>
//                 </div>

//                 {/* <div className="col-12">
//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "10px",
//                       }}
//                     >
//                       <p className="m-0">
//                         <b>Opening: </b>

//                         {numberWithCommas(
//                           Math.round(rowData?.[0]?.numOpen || 0)
//                         )}
//                       </p>
//                       <p className="m-0">
//                         <b>Closing: </b>
//                         {numberWithCommas(
//                           Math.round(rowData?.[0]?.numClose || 0)
//                         )}
//                       </p>
//                     </div>
//                   </div> */}
//               </div>
//               <div className="table-responsive">
//                 <table
//                   id="table-to-xlsx"
//                   className="table table-striped table-bordered global-table table-font-size-sm projectedCashflowStatementIndirectTable"

//                 >
//                   <thead>
//                     <tr>
//                       {/* <th>SL</th> */}
//                       <th>Particulars</th>
//                       <th>Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {rowData?.map((data, index) => (
//                       <tr
//                         key={index}
//                         className={data?.isSum ? "group-total" : ""}
//                       >
//                         {/* <td>
//                           <div className="text-center pr-2">{index + 1}</div>
//                         </td> */}
//                         <td>
//                           <div className="text-left pr-2">
//                             {data?.strFSComName}
//                           </div>
//                         </td>
//                         <td className="text-right">
//                           <div className="pl-2">
//                             {numberWithCommas(Math.round(data?.numAmount || 0))}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   );
// }

import React from 'react';
import PowerBIReport from '../../_helper/commonInputFieldsGroups/PowerBIReport';
export default function ProjectedCashflowStatementIndirect({
  rowData,
  values,
  showReport,
}) {
  const groupId = 'e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a';
  const reportId = '0fe4c9ea-5735-471f-a7ec-00a07af4657c';
  const parameterValues = (values) => {
    // dteDate, ReportType, businessUnitId
    return [
      { name: 'strUnitGroup', value: `${values?.enterpriseDivision?.value}` },
      { name: 'strSubGroup', value: `${values?.subDivision?.label}` },
      { name: 'intUnit', value: `${values?.businessUnit?.value}` },
      { name: 'dteFromDate', value: `${values?.fromDate}` },
      { name: 'dteToDate', value: `${values?.toDate}` },
      { name: 'ConvertionRate', value: `${values?.conversionRate}` },
      { name: 'isForecast', value: `${values?.isForecast?.value}` },
      {
        name: 'intType',
        value: `${values?.reportTypeCashFlowIndirect?.value}`,
      },
    ];
  };
  console.log(parameterValues(values), 'parameterValues(values)');
  return (
    <>
      {showReport && (
        <PowerBIReport
          reportId={reportId}
          groupId={groupId}
          parameterValues={parameterValues(values)}
          parameterPanel={false}
        />
      )}
    </>
  );
}
