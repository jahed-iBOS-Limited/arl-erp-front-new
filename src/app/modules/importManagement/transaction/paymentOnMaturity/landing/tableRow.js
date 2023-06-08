// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useState } from "react";
// import Loading from "../../../../_helper/_loading";
// import PaginationTable from "../../../../_helper/_tablePagination";
// import InputField from "../../../../_helper/_inputField";
// import {
//   Card,
//   CardHeader,
//   ModalProgressBar,
//   CardBody,
// } from "../../../../../../_metronic/_partials/controls";
// import { useLocation } from "react-router-dom";
// import { Formik, Form } from "formik";
// import { shallowEqual, useSelector } from "react-redux";
// import { _dateFormatter } from "../../../../_helper/_dateFormate";
// import ICustomTable from "../../../../_helper/_customTable";
// import { getPaymentOnMaturity } from "../helper";

// export default function TableRow() {
//   const [gridData, setGridData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   //paginationState
//   // const [pageNo, setPageNo] = useState(0);
//   // const [pageSize, setPageSize] = useState(15);

//   const location = useLocation();
//   // console.log(location?.state);

//   const { profileData, selectedBusinessUnit } = useSelector((state) => {
//     return state.authData;
//   }, shallowEqual);

//   // const selectedBusinessUnit = useSelector((state) => {
//   //   return state.authData.selectedBusinessUnit;
//   // }, shallowEqual);

//   const header = [
//     "SL",
//     "Payment Schedule",
//     "PG Amount",
//     "Due Date",
//     "Invoice Amount",
//     "Payment Date",
//     "Payment Status",
//     // "Action",
//   ];

//   useEffect(() => {
//     getPaymentOnMaturity(
//       profileData?.accountId,
//       selectedBusinessUnit?.value,
//       setGridData,
//       setLoading,
//       location?.state?.poNumber,
//       location?.state?.shipmentId
//     );
//   }, [location?.state?.poNumber, location?.state?.shipmentCode]);
//   // console.log(gridData, "gridData");
//   return (
//     <>
//       <Formik
//         enableReinitialize={true}
//         initialValues={{
//           packingCharge: "",
//           freightCharge: "",
//           shipment: "",
//           shipBy: "",
//           blAwbTrNo: "",
//           blAwbTrDate: _dateFormatter(new Date()),
//           invoiceDate: _dateFormatter(new Date()),
//           docReceiveByBank: "",
//         }}
//         // validationSchema={validationSchema}
//         onSubmit={(values, { setSubmitting, resetForm }) => {}}
//       >
//         {({ errors, touched, setFieldValue, isValid, values }) => (
//           <>
//             <Card>
//               {true && <ModalProgressBar />}
//               <CardHeader title="Payment On Maturity">
//                 {/* <CardHeaderToolbar>
//                   <button
//                     onClick={() => {
//                       history.push({
//                         pathname: `/import-management/transaction/payment-on-maturity/create`,
//                         state: {
//                           poSlashLc: values?.poNo,
//                           initialValues: {
//                             ponumber: values?.poLcDDL?.poNumber,
//                             lcnumber: values?.poLcDDL?.lcNumber,
//                             shipmentId: values?.shipmentDDL?.value,
//                             shipmentLabel: values?.shipmentDDL?.label,
//                           },
//                           routeState: "create"
//                         },
//                       });
//                     }}
//                     className="btn btn-primary"
//                     disabled={!(values?.shipmentDDL && values?.poLcDDL)}
//                   >
//                     Create
//                   </button>
//                 </CardHeaderToolbar> */}
//               </CardHeader>

//               <CardBody>
//                 <Form className="form form-label-right">
//                   <div className="row">
//                     <div className="col-lg-12 d-flex justify-content-center align-items-center">
//                       <div style={{ fontWeight: "900" }}>
//                         PO : {location?.state?.poNumber}
//                       </div>
//                       <div style={{ fontWeight: "900", marginLeft: "30px" }}>
//                         {" "}
//                         LC : {location?.state?.lcNumber}
//                       </div>
//                       <div style={{ fontWeight: "900", marginLeft: "30px" }}>
//                         {" "}
//                         Shipment : {location?.state?.shipmentCode}
//                       </div>
//                     </div>

//                     {/* <div className="col-lg-12 d-flex justify-content-center">
//                     <span>
//                       <span style={{ fontWeight: 'bold', marginRight: "5px" }}>PO Number:</span>
//                       <span>{location?.state?.poNumber}</span>
//                     </span>
//                     <span>
//                       <span className="ml-5" style={{ fontWeight: 'bold', marginRight: "5px" }}>LC Number:</span>
//                       <span>{location?.state?.lcNumber}</span>
//                     </span>
//                     <span>
//                       <span style={{ fontWeight: 'bold', marginRight: "5px", marginLeft: "10px" }}>Shipment:</span>
//                       <span>{location?.state?.shipmentCode}</span>
//                     </span>
//                   </div> */}
//                     {/* <div className="col-md-3 col-lg-3">
//                       <label>PO/LC</label>
//                       <SearchAsyncSelect
//                         selectedValue={values?.poLcDDL}
//                         isSearchIcon={true}
//                         handleChange={(valueOption) => {
//                           setFieldValue("poLcDDL", valueOption);
//                           setFieldValue("shipmentDDL", "");
//                           if (valueOption) {
//                             getShipmentDDL(profileData.accountId, selectedBusinessUnit.value, valueOption.label, setShipmentDDL);
//                           }
//                         }}
//                         loadOptions={polcList}
//                         placeholder="Search by PO/LC Id"
//                       />
//                     </div>
//                     <div className="col-lg-3">
//                       <NewSelect
//                         name="shipmentDDL"
//                         options={shipmentDDL}
//                         label="Shipment"
//                         value={values?.shipmentDDL}
//                         onChange={(valueOption) => {
//                           setFieldValue("shipmentDDL", valueOption);
//                           if(valueOption){
//                             getLandingData(
//                               profileData?.accountId,
//                               selectedBusinessUnit.value,
//                               valueOption.value,
//                               pageSize,
//                               pageNo,
//                               setGridData,
//                               setLoading,
  
//                             );
//                           }
//                         }}
//                         placeholder="Shipment"
//                         errors={errors}
//                         touched={touched}
//                       />
//                     </div> */}

//                     {/* <div className="col-lg-2 d-flex align-items-end">
//                       <button
//                         className="btn btn-sm btn-primary"
//                         disabled={!(values?.poLcDDL && values.shipmentDDL.value)}
//                         type="button"
//                         onClick={() => {
//                           getLandingData(
//                             profileData?.accountId,
//                             selectedBusinessUnit.value,
//                             values.shipmentDDL.value,
//                             pageSize,
//                             pageNo,
//                             setGridData,
//                             setLoading,

//                           );
//                         }}
//                       >
//                         View
//                     </button>
//                     </div> */}
//                   </div>
//                   <div className="row">
//                     {loading && <Loading />}
//                     {/* {console.log(gridData)} */}
//                     <ICustomTable ths={header}>
//                       {gridData?.length > 0 &&
//                         gridData?.map((item, index) => {
//                           return (
//                             <tr key={index}>
//                               <td
//                                 style={{ width: "30px" }}
//                                 className="text-center"
//                               >
//                                 {index + 1}
//                               </td>
//                               <td className="text-center">
//                                 {item?.paymentScheduleCode}
//                               </td>
//                               <td className="text-center">
//                                 {item?.numPgamount}
//                               </td>
//                               <td  className="text-center">{_dateFormatter(item?.dteMatureDate)}</td>
//                               <td  className="text-center">{item?.totalPayable}</td>
//                               <td  className="text-center">{_dateFormatter(item?.paymentDate)}</td>
//                               <td  className="text-center">
//                                 <span className="text-center">
//                                   <button
//                                     // style={{ width: "7rem" }}
//                                     style={{
//                                       padding: "1px 5px",
//                                       fontSize: "11px",
//                                       width: "85px",
//                                     }}
//                                     className="btn btn-outline-dark mr-1 pointer"
//                                     type="button"
//                                     disabled={item?.isSent === false}
//                                     onClick={() => {}}
//                                   >
//                                     Sent
//                                   </button>
//                                 </span>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                     </ICustomTable>

//                     {/* {gridData?.length > 0 && (
//                       <PaginationTable
//                         count={gridData?.totalCount}
//                         setPositionHandler={() => {
//                           getLandingData(
//                             profileData?.accountId,
//                             selectedBusinessUnit.value,
//                             values.shipmentDDL.value,
//                             pageSize,
//                             pageNo,
//                             setGridData,
//                             setLoading
//                           );
//                         }}
//                         paginationState={{
//                           pageNo,
//                           setPageNo,
//                           pageSize,
//                           setPageSize,
//                         }}
//                       />
//                     )} */}
//                   </div>
//                 </Form>
//               </CardBody>
//             </Card>
//           </>
//         )}
//       </Formik>
//     </>
//   );
// }
