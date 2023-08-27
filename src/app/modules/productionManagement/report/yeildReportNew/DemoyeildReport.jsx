// import React from "react";
// import "./style.scss";
// import { _fixedPoint } from "../../../_helper/_fixedPoint";
// function YeildReport({ tableData }) {
//   if (tableData?.length === 0) return <></>;

//   return (
//     <>
//       <div className='row YeildReport'>
//         <div className='col-lg-12'>
//           <div className='sta-scrollable-table scroll-table-auto'>
//             <div
//               style={{ maxHeight: "500px" }}
//               className='scroll-table _table scroll-table-auto'
//             >
//               <table className='table table-striped table-bordered global-table'>
//                 <>
//                   <thead>
//                     <tr>
//                       <th></th>
//                       <th style={{ minWidth: "80px" }}>Item Name</th>
//                       <th style={{ minWidth: "80px" }}>Productin Qty Bag</th>
//                       <th style={{ minWidth: "80px" }}>Production Qty</th>
//                       <th style={{ minWidth: "80px" }}>Consumption</th>
//                       <th style={{ minWidth: "80px" }}>By Production Qty</th>
//                       <th style={{ minWidth: "80px" }}>Yield Per</th>
//                       <th style={{ minWidth: "80px" }}>By Product</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {tableData?.map((item, index) => {
//                       return item?.rows?.map((row, index) => {
//                         return (
//                           <tr key={index}>
//                             {index === 0 && (
//                               <td rowSpan={item?.rows?.length}>
//                                 {item?.title}
//                               </td>
//                             )}
//                             <td className="text-left">{row?.itemName}</td>
//                             <td className='text-right'>
//                               {_fixedPoint(row?.productinQtyBag)}
//                             </td>
//                             <td className='text-right'>{_fixedPoint(row?.productionQty)}</td>
//                             <td className='text-right'>{_fixedPoint(row?.consumption)}</td>
//                             <td className='text-right'>
//                               {_fixedPoint(row?.byProductionQty)}
//                             </td>
//                             <td className='text-right'>{_fixedPoint(row?.yieldPer)}</td>
//                             <td className='text-right'>{_fixedPoint(row?.byProduct)}</td>
//                           </tr>
//                         );
//                       });
//                     })}
//                   </tbody>
//                 </>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default YeildReport;

// import React from "react";
// import './style.scss'
// function YeildReport({ tableData }) {
//   if (tableData?.length === 0) return <></>

//   const tableDataBodyRender = (tableData) => {

//     // tableData rows  max length
//     let maxRowLength = 0;
//     for (let i = 0; i < tableData.length; i++) {
//       const rows = tableData[i].rows;
//       if (rows.length > maxRowLength) {
//         maxRowLength = rows.length;
//       }
//     }

//     // tr generate
//     let tr = [];
//     for (let i = 0; i < maxRowLength; i++) {
//       tr.push(<tr key={i}>
//         <td>{i + 1}</td>
//         {tableData?.map((item, index) => (
//           <>
//             <td>{item?.rows[i]?.itemName}</td>
//             <td className="text-right">{item?.rows[i]?.productinQtyBag}</td>
//             <td className="text-right">{item?.rows[i]?.productionQty}</td>
//             <td className="text-right">{item?.rows[i]?.consumption}</td>
//             <td className="text-right">{item?.rows[i]?.byProductionQty}</td>
//             <td className="text-right">{item?.rows[i]?.yieldPer}</td>
//             <td className="text-right">{item?.rows[i]?.byProduct}</td>
//           </>
//         ))}
//       </tr>)
//     }

//     return tr;

//   }

//   return (
//     <>
//       <div className='row YeildReport'>
//         <div className='col-lg-12'>
//           <div className='sta-scrollable-table scroll-table-auto'>
//             <div
//               style={{ maxHeight: "500px" }}
//               className='scroll-table _table scroll-table-auto'
//             >
//               <table className='table table-striped table-bordered global-table'>
//                 <>
//                   <thead>
//                     <tr>
//                       <th rowSpan={2}>SL</th>
//                       {tableData?.map((item, index) => (
//                         <th key={index} colSpan={7} className={index % 2 ? 'tableThBGOne' : 'tableThBGTwo'}>{item?.title}</th>
//                       ))}
//                     </tr>
//                     <tr>
//                       {tableData?.map((item, index) => (
//                         <>
//                           <th style={{ minWidth: '80px' }}>Item Name</th>
//                           <th style={{ minWidth: '80px' }}>Productin Qty Bag</th>
//                           <th style={{ minWidth: '80px' }}>Production Qty</th>
//                           <th style={{ minWidth: '80px' }}>Consumption</th>
//                           <th style={{ minWidth: '80px' }}>By Production Qty</th>
//                           <th style={{ minWidth: '80px' }}>Yield Per</th>
//                           <th style={{ minWidth: '80px' }}>By Product</th>

//                         </>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {tableDataBodyRender(tableData)}

//                   </tbody>
//                 </>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default YeildReport;

// import React from "react";
// import "./style.scss";
// import { _fixedPoint } from "../../../_helper/_fixedPoint";
// function YeildReport({ tableData }) {
//   if (tableData?.length === 0) return <></>;

//   const emptyTHGenearte = (row) => {
//     let maxRowLength = 0;
//     for (let i = 0; i < tableData.length; i++) {
//       const rows = tableData[i].rows;
//       if (rows.length > maxRowLength) {
//         maxRowLength = rows.length;
//       }
//     }
//     // empty th generate

//     let TrGenerateNumber = maxRowLength - row?.length;

//     let th = [];
//     for (let i = 0; i < TrGenerateNumber; i++) {
//       th.push(<th></th>);
//     }
//     return th;
//   };
//   const emptyTDGenearte = (row) => {
//     let maxRowLength = 0;
//     for (let i = 0; i < tableData.length; i++) {
//       const rows = tableData[i].rows;
//       if (rows.length > maxRowLength) {
//         maxRowLength = rows.length;
//       }
//     }
//     // empty td generate

//     let TdGenerateNumber = maxRowLength - row?.length;

//     let td = [];
//     for (let i = 0; i < TdGenerateNumber; i++) {
//       td.push(<td></td>);
//     }
//     return td;
//   };
//   return (
//     <>
//       <div className='row YeildReport'>
//         <div className='col-lg-12'>
//           <div className='sta-scrollable-table scroll-table-auto'>
//             <div
//               style={{ maxHeight: "500px" }}
//               className='scroll-table _table scroll-table-auto'
//             >
//               <table className='table table-striped table-bordered global-table'>
//                 {tableData?.map((itm) => {
//                   return (
//                     <>
//                       <thead>
//                         <tr>
//                           <th
//                             style={{
//                               minWidth: "120px",
//                               background: "#c9f7f5",
//                             }}
//                             className='tableThBGOne'
//                           >
//                             {itm?.title}
//                           </th>
//                           {itm?.rows?.map((row, index) => {
//                             return (
//                               <th style={{ minWidth: "100px" }}>
//                                 {row?.itemName}
//                               </th>
//                             );
//                           })}
//                           {emptyTHGenearte(itm?.rows)}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         <tr>
//                           <td className='text-left'>
//                             <b>Yield Per:</b>
//                           </td>
//                           {itm?.rows?.map((row, index) => {
//                             return (
//                               <td className='text-right'>
//                                 {_fixedPoint(row?.yieldPer)}
//                               </td>
//                             );
//                           })}
//                           {emptyTDGenearte(itm?.rows)}
//                         </tr>

//                         <tr>
//                           <td className='text-left'>
//                             <b>Production Qty Bag:</b>{" "}
//                           </td>
//                           {itm?.rows?.map((row, index) => {
//                             return (
//                               <td className='text-right'>
//                                 {_fixedPoint(row?.productinQtyBag)}
//                               </td>
//                             );
//                           })}
//                           {emptyTDGenearte(itm?.rows)}
//                         </tr>

//                         <tr>
//                           <td className='text-left'>
//                             <b>Production Qty</b>
//                           </td>
//                           {itm?.rows?.map((row, index) => {
//                             return (
//                               <td className='text-right'>
//                                 {_fixedPoint(row?.productionQty)}
//                               </td>
//                             );
//                           })}
//                           {emptyTDGenearte(itm?.rows)}
//                         </tr>

//                         <tr>
//                           <td className='text-left'>
//                             <b>Consumption</b>
//                           </td>
//                           {itm?.rows?.map((row, index) => {
//                             return (
//                               <td className='text-right'>
//                                 {_fixedPoint(row?.consumption)}
//                               </td>
//                             );
//                           })}
//                           {emptyTDGenearte(itm?.rows)}
//                         </tr>
//                         <tr>
//                           <td className='text-left'>
//                             <b>By Product</b>
//                           </td>
//                           {itm?.rows?.map((row, index) => {
//                             return (
//                               <td className='text-right'>
//                                 {_fixedPoint(row?.byProduct)}
//                               </td>
//                             );
//                           })}
//                           {emptyTDGenearte(itm?.rows)}
//                         </tr>
//                         <tr>
//                           <td className='text-left'>
//                             <b>By Production Qty</b>
//                           </td>
//                           {itm?.rows?.map((row, index) => {
//                             return (
//                               <td className='text-right'>
//                                 {_fixedPoint(row?.byProductionQty)}
//                               </td>
//                             );
//                           })}
//                           {emptyTDGenearte(itm?.rows)}
//                         </tr>
//                       </tbody>
//                     </>
//                   );
//                 })}

//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default YeildReport;

import React from "react";
import "./style.scss";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
function YeildReport({ tableData }) {
  if (tableData?.length === 0) return <></>;

  const tableDataBodyRender = (tableData) => {
    // all data flat
    let allData = [];
    for (let i = 0; i < tableData.length; i++) {
      const rows = tableData[i].rows;
      for (let j = 0; j < rows.length; j++) {
        const row = rows[j];
        allData.push({
          ...row,
          categoryName: tableData[i].title,
        });
      }
    }

    // unique category name
    let uniqueCategoryName = [];
    for (let i = 0; i < allData.length; i++) {
      const element = allData[i];
      if (!uniqueCategoryName.includes(element.categoryName)) {
        uniqueCategoryName.push(element.categoryName);
      }
    }

    // unique item name
    let uniqueItem = [];
    for (let i = 0; i < allData.length; i++) {
      const element = allData[i];
      const uniqueItemNameList = uniqueItem?.map((itm) => itm?.itemName)
      if (!uniqueItemNameList.includes(element.itemName)) {
        uniqueItem.push({
          itemName: element?.itemName,
          wip: element?.wip,
        });
      }
    }
    // const groupedData = allData.reduce((result, item) => {
    //   const key = `${item?.itemName || ""}-${item?.categoryName || ""}`;
    //   if (!result[key]) {
    //     result[key] = [];
    //   }
    //   result[key].push(item);
    //   return result;
    // }, {});

    // const modifyItemList = [];
    // for (const prop in groupedData) {
    //   const duplicatItemList = groupedData[prop] || [];
    //   // duplicatItemList reduce
    //   const result = duplicatItemList.reduce(
    //     (accumulator, item) => {
    //       accumulator.productinQtyBag += item?.productinQtyBag || 0;
    //       accumulator.productionQty += item?.productionQty || 0;
    //       accumulator.consumption += item?.consumption || 0;
    //       accumulator.byProductionQty += item?.byProductionQty || 0;
    //       accumulator.yieldPer += item?.yieldPer || 0;
    //       accumulator.byProduct += item?.byProduct || 0;
    //       accumulator.wip += item?.wip;

    //       return accumulator;
    //     },
    //     {
    //       productinQtyBag: 0,
    //       productionQty: 0,
    //       consumption: 0,
    //       byProductionQty: 0,
    //       yieldPer: 0,
    //       byProduct: 0,
    //       wip: 0,
    //     }
    //   );
    //   modifyItemList.push({
    //     categoryName: duplicatItemList?.[0]?.categoryName,
    //     itemName: duplicatItemList?.[0]?.itemName,
    //     ...result,
    //   });
    // }
    // Tr generate
    let tr = [];
    for (let i = 0; i < uniqueItem?.length; i++) {
      tr.push(
        <tr key={i}>
          <td>{i + 1}</td>
          <td>
            <b>{uniqueItem?.[i]?.itemName}</b>
          </td>
          <td>
            <b>{_fixedPoint(uniqueItem?.[i]?.wip)}</b>
          </td>
          {uniqueCategoryName.map((categoryName, index) => {
            // match Catagory
            let matchCatagory = allData?.find(
              (itm) =>
                itm.categoryName === categoryName &&
                itm.itemName === uniqueItem?.[i]?.itemName
            );
            let byProduct = (+matchCatagory?.byProductionQty || 0) / (+matchCatagory?.productionQty || 0)


            return (
              <>
                <td className='text-right'>
                  {matchCatagory?.productinQtyBag &&
                    _fixedPoint(matchCatagory?.productinQtyBag)}
                </td>
                <td className='text-right'>
                  {matchCatagory?.productionQty &&
                    _fixedPoint(matchCatagory?.productionQty)}
                </td>
                <td className='text-right'>
                  {matchCatagory?.consumption &&
                    _fixedPoint(matchCatagory?.consumption)}
                </td>
                <td className='text-right'>
                  {matchCatagory?.byProductionQty &&
                    _fixedPoint(matchCatagory?.byProductionQty)}
                </td>
                <td className='text-right'>
                  {matchCatagory?.yieldPer &&
                    _fixedPoint(matchCatagory?.yieldPer)}
                </td>
                <td className='text-right'>
                  {matchCatagory?.byProductionQty &&
                    _fixedPoint(isFinite(byProduct) ? byProduct : 0)}
                </td>
              </>
            );
          })}
        </tr>
      );
    }
    return tr;
  };

  return (
    <>
      <div className='row YeildReport'>
        <div className='col-lg-12'>
          <div className='sta-scrollable-table scroll-table-auto'>
            <div
              style={{ maxHeight: "500px" }}
              className='scroll-table _table scroll-table-auto'
            >
              <table className='table table-striped table-bordered global-table'>
                <>
                  <thead>
                    <tr>
                      <th rowSpan={2} style={{ minWidth: '30px' }} className="sl">SL</th>
                      <th rowSpan={2} style={{ minWidth: "150px" }} className="itemName">
                        Product
                      </th>
                      <th rowSpan={2} className="wip">
                        WIP
                      </th>
                      {tableData?.map((item, index) => (
                        <th
                          key={index}
                          colSpan={6}
                          className={
                            index % 2 ? "tableThBGOne" : "tableThBGTwo"
                          }
                        >
                          {item?.title}
                        </th>
                      ))}
                    </tr>
                    <tr>
                      {tableData?.map((item, index) => (
                        <>
                          <th style={{ minWidth: "80px" }}>
                            Production Qty Bag
                          </th>
                          <th style={{ minWidth: "80px" }}>Production Qty KG</th>
                          <th style={{ minWidth: "80px" }}>Consumption</th>
                          <th style={{ minWidth: "80px" }}>
                            By Production Qty
                          </th>
                          <th style={{ minWidth: "80px" }}>Yield %</th>
                          <th style={{ minWidth: "80px" }}>By Product %</th>
                        </>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{tableDataBodyRender(tableData)}</tbody>
                </>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default YeildReport;
