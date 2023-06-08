// import React, { useState, useEffect } from "react";
// import { useSelector, shallowEqual } from "react-redux";
// import { useHistory } from "react-router-dom";
// import { _dateFormatter } from "../../../../_helper/_dateFormate";
// import IConfirmModal from "../../../../_helper/_confirmModal";
// import {
//   getLoanApplicationLandingPasignation,
//   removeLoanApplication,
// } from "../helper";
// import IEdit from "../../../../_helper/_helperIcons/_edit";
// import Loading from "../../../../_helper/_loading";
// import PaginationTable from "../../../../_helper/_tablePagination";

// export function TableRow() {
//   const history = useHistory();
//   const [rowDto, setRowDto] = useState([]);
//   const [loader, setLoader] = useState(false);
//   const [pageNo, setPageNo] = React.useState(0);
//   const [pageSize, setPageSize] = React.useState(15);

//   // get user profile data from store
//   const profileData = useSelector((state) => {
//     return state.authData.profileData;
//   }, shallowEqual);

//   // get selected business unit from store
//   const selectedBusinessUnit = useSelector((state) => {
//     return state.authData.selectedBusinessUnit;
//   }, shallowEqual);

//   //Dispatch Get getEmpDDLAction
//   useEffect(() => {
//     if (selectedBusinessUnit?.value && profileData?.accountId) {
//       getLoanApplicationLandingPasignation(
//         profileData?.accountId,
//         selectedBusinessUnit?.value,
//         pageNo,
//         pageSize,
//         setRowDto,
//         setLoader
//       );
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedBusinessUnit, profileData]);

//   const setPositionHandler = (pageNo, pageSize) => {
//     getLoanApplicationLandingPasignation(
//       profileData?.accountId,
//       selectedBusinessUnit?.value,
//       pageNo,
//       pageSize,
//       setRowDto,
//       setLoader
//     );
//   };

//   const singleCheckoutHandler = (index) => {
//     // setDisabled(true);
//     if (index && profileData?.accountId && selectedBusinessUnit?.value) {
//       const loanObj = rowDto?.data?.filter((itm) => itm?.loanApplicationId === index);
//       let confirmObject = {
//         title: "Are you sure?",
//         message: `Do you want to remove  ${loanObj[0]?.loanType} loan of ${loanObj[0]?.employeeId}?`,
//         yesAlertFunc: async () => {
//           if (loanObj) {
//             const modifyFilterRowDto = rowDto?.data?.filter(
//               (itm) => itm?.loanApplicationId !== index
//             );
//             removeLoanApplication(index, {...rowDto,data:modifyFilterRowDto}, setRowDto);
//           }
//         },
//         noAlertFunc: () => {
//           history.push("/human-capital-management/loan/loanapplication");
//         },
//       };
//       IConfirmModal(confirmObject);
//     } else {
//       console.log(" ");
//       // setDisabled(false);
//     }
//   };

//   return (
//     <>
//     {loader && <Loading />}
//       <div>
//         {rowDto?.data?.length >= 0 && (
//           <table className="table table-striped table-bordered global-table">
//             <thead>
//               <tr>
//                 <th style={{ width: "35px" }}>SL</th>
//                 <th style={{ width: "80px" }}>Employee Id</th>
//                 <th style={{ width: "80px" }}>Application Id</th>
//                 <th>Loan Type</th>
//                 <th>Total Loan Amount</th>
//                 <th>Remaining Loan Amount</th>
//                 <th>Total Installment</th>
//                 <th>Remaining Installment</th>
//                 <th>Application Date</th>
//                 <th>Approval Status</th>
//                 <th>Loan Installment Status</th>
//                 <th style={{width: "50px" }}>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rowDto?.data?.map((td, index) => (
//                 <tr key={index}>
//                   <td> {td?.sl} </td>
//                   <td>
//                     <div className="text-center">{td?.employeeId}</div>
//                   </td>
//                   <td>
//                     <div className="text-center">{td?.loanApplicationId}</div>
//                   </td>
//                   <td>
//                     <div className="pl-2">{td?.loanType}</div>
//                   </td>
//                   <td>
//                     <div className="text-right pr-2">{td?.loanAmount}</div>
//                   </td>
//                   <td>
//                     <div className="text-right pr-2">{td?.remainigLoan}</div>
//                   </td>
//                   <td>
//                     <div className="text-right pr-2">
//                       {td?.numberOfInstallment}
//                     </div>
//                   </td>
//                   <td>
//                     <div className="text-right pr-2">
//                       {td?.remainigInstallment}
//                     </div>
//                   </td>
//                   <td>
//                     <div className="text-right pr-2">
//                       {_dateFormatter(td?.dteApplicationDate)}
//                     </div>
//                   </td>
//                   <td>
//                     <div className="pl-2">
//                       {td?.isApprove ? "Approved" : "Pending"}
//                     </div>
//                   </td>
//                   <td>
//                     <div className="pl-2">
//                       {td?.isLoanStatus ? "Completed" : "Not Complete"}
//                     </div>
//                   </td>
//                   <td>
//                     <div className="d-flex justify-content-center">
//                       <button
//                         type="button"
//                         className="btn"
//                         onClick={() => {
//                           history.push(
//                             `/human-capital-management/loan/loanapplication/edit/${td.employeeId}/${td?.loanApplicationId}`
//                           );
//                         }}
//                         disabled={td?.isApprove === true}
//                       >
//                         <span className="edit">
//                           <IEdit classes="loan-edit" />
//                         </span>
//                       </button>
//                       <button
//                         type="button"
//                         className="btn"
//                         onClick={() => {
//                           singleCheckoutHandler(td?.loanApplicationId);
//                         }}
//                         disabled={td?.isApprove === true}
//                       >
//                         <span>
//                           <i
//                             className="fa fa-trash text-danger"
//                             aria-hidden="true"
//                           ></i>
//                         </span>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//         {rowDto?.data?.length > 0 && (
//                   <PaginationTable
//                     count={rowDto?.totalCount}
//                     setPositionHandler={setPositionHandler}
//                     paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
//                   />
//                 )}
//       </div>
//     </>
//   );
// }
