// import React, { useEffect, useState } from "react";
// import ICustomCard from "../../../_helper/_customCard";
// import { Formik, Form } from "formik";
// import InputField from "../../../_helper/_inputField";
// import NewSelect from "../../../_helper/_select";
// import IView from "../../../_helper/_helperIcons/_view";
// import { useHistory } from "react-router-dom";
// import {
//   checkUpdateDeletePermission,
//   deleteTheVehicleLog,
//   getOwnVehicleNo,
//   getVehicleLogBookLanding,
//   getVehicleNoDDL,
// } from "./helper";
// import { shallowEqual, useSelector } from "react-redux";
// import { _dateFormatter } from "../../../_helper/_dateFormate";
// import { _todayDate } from "../../../_helper/_todayDate";
// import Loading from "../../../_helper/_loading";
// import PaginationTable from "../../../_helper/_tablePagination";
// import IViewModal from "../../../_helper/_viewModal";
// import VehicleLogBook from "./view/addEditForm";
// import { toast } from "react-toastify";
// import IEdit from "../../../_helper/_helperIcons/_edit";
// import VehicleEditForm from "./Form/formForEdit";
// import IDelete from "../../../_helper/_helperIcons/_delete";
// import IConfirmModal from "../../../_helper/_confirmModal";

// const initData = {
//   vehicleNo: "",
//   travelDateFrom: _todayDate(),
//   travelDateTo: _todayDate(),
//   entryBy: "own",
// };

// const VehicleLogLanding = () => {
//   const history = useHistory();
//   const [loading, setLoading] = useState(false);

//   // state
//   const [vehicleNoList, setVehicleNoList] = useState([]);
//   const [landingData, setLandingData] = useState([]);

//   const [pageNo, setPageNo] = React.useState(0);
//   const [pageSize, setPageSize] = React.useState(15);

//   // Modal State
//   const [showModal, setShowModal] = useState(false);
//   const [id, setId] = useState("");
//   const [open, setOpen] = useState(false);
//   const [singleItem, setSingleItem] = useState({});
//   const [permitted, setPermitted] = useState(false);

//   // Redux store data
//   const {
//     profileData: { accountId: accId, userId, employeeId },
//     selectedBusinessUnit: { value: buId },
//   } = useSelector((state) => state?.authData, shallowEqual);

//   // get initial data
//   useEffect(() => {
//     getOwnVehicleNo(employeeId, setVehicleNoList);
//     checkUpdateDeletePermission(userId, setPermitted, setLoading);
//   }, [accId, buId, userId, employeeId]);

//   const getGridData = (values, pageNo, pageSize) => {
//     getVehicleLogBookLanding(
//       values?.travelDateFrom,
//       values?.travelDateTo,
//       accId,
//       buId,
//       pageNo,
//       pageSize,
//       values?.vehicleNo?.value,
//       setLandingData,
//       setLoading
//     );
//   };

//   const setPositionHandler = (pageNo, pageSize, values) => {
//     getGridData(values, pageNo, pageSize);
//   };

//   const deleteVehicleLog = (id, values) => {
//     const payload = [
//       {
//         vehicleLogId: id,
//         userId: userId,
//         permissionFor: 3,
//         accountId: accId,
//         businessUnitId: buId,
//       },
//     ];

//     const confirmationObj = {
//       title: "Delete Vehicle Log",
//       message: "Are you sure you want to delete this vehicle log?",
//       yesAlertFunc: () => {
//         deleteTheVehicleLog(payload, setLoading, () => {
//           getGridData(values, pageNo, pageSize);
//         });
//       },
//       noAlertFunc: () => {},
//     };
//     IConfirmModal(confirmationObj);
//   };

//   return (
//     <Formik
//       enableReinitialize={true}
//       initialValues={{
//         ...initData,
//       }}
//       onSubmit={() => {}}
//     >
//       {({ values, errors, touched, setFieldValue }) => (
//         <>
//           <ICustomCard
//             createHandler={() => {
//               if (values?.type) {
//                 if (values?.type?.value === 2) {
//                   history.push({
//                     pathname:
//                       "/transport-management/routecostmanagement/routestandardcost/vehicleProblem",
//                   });
//                 } else if (values?.vehicleNo?.value) {
//                   history.push({
//                     pathname:
//                       "/transport-management/routecostmanagement/routestandardcost/create",
//                     state: {
//                       values,
//                     },
//                   });
//                 } else {
//                   toast.warn("Please select vehicle no");
//                 }
//               } else {
//                 toast.warn("Please Select a Type");
//               }
//             }}
//             title="Vehicle Log Book for (Credit)"
//           >
//             {loading && <Loading />}
//             <Form className="form form-label-right">
//               <div className="global-form">
//                 {/* Row */}
//                 <div className="row">
//                   <div className="col-lg-3">
//                     <NewSelect
//                       name="type"
//                       options={[
//                         { value: 1, label: "Vehicle Log Book for (Credit)" },
//                         { value: 2, label: "Vehicle Problem Entry" },
//                       ]}
//                       value={values?.type}
//                       label="Type"
//                       onChange={(valueOption) => {
//                         setFieldValue("type", valueOption);
//                       }}
//                       placeholder="Type"
//                     />
//                   </div>

//                   <div className="col-lg-12"></div>

//                   <div className="col-lg-2">
//                     <label>
//                       <b>Entry By</b>
//                     </label>
//                     <div
//                       role="group"
//                       aria-labelledby="my-radio-group"
//                       className="d-flex align-items-center mt-1"
//                     >
//                       <div className="d-flex align-items-center">
//                         <input
//                           type="radio"
//                           name="entryBy"
//                           value="own"
//                           checked={values?.entryBy === "own"}
//                           className="mr-1 pointer"
//                           onChange={(e) => {
//                             setFieldValue("entryBy", e?.target?.value);
//                             setFieldValue("vehicleNo", "");
//                             setLandingData([]);
//                             getOwnVehicleNo(employeeId, setVehicleNoList);
//                           }}
//                         />
//                         <p className="mr-3 mb-0 pointer">Own</p>
//                       </div>
//                       <input
//                         id="other"
//                         type="radio"
//                         name="entryBy"
//                         value="other"
//                         checked={values?.entryBy === "other"}
//                         className="mr-1 pointer"
//                         onChange={(e) => {
//                           setFieldValue("entryBy", e?.target?.value);
//                           setFieldValue("vehicleNo", "");
//                           setLandingData([]);
//                           getVehicleNoDDL(accId, buId, setVehicleNoList);
//                         }}
//                       />
//                       <p className="pr-0 mb-0" htmlFor="other">
//                         Other
//                       </p>
//                     </div>
//                   </div>
//                   <div className="col-lg-3">
//                     <NewSelect
//                       name="vehicleNo"
//                       options={vehicleNoList}
//                       value={values?.vehicleNo}
//                       label="Vehicle No."
//                       onChange={(valueOption) => {
//                         setFieldValue("vehicleNo", valueOption);
//                       }}
//                       placeholder="Vehicle No."
//                       errors={errors}
//                       touched={touched}
//                     />
//                   </div>
//                   <div className="col-lg-2">
//                     <label>Travel Date From</label>
//                     <InputField
//                       value={values?.travelDateFrom}
//                       name="travelDateFrom"
//                       placeholder="Travel Date From"
//                       type="date"
//                     />
//                   </div>
//                   <div className="col-lg-2">
//                     <label>Travel Date To</label>
//                     <InputField
//                       value={values?.travelDateTo}
//                       name="travelDateTo"
//                       placeholder="Travel Date To"
//                       type="date"
//                     />
//                   </div>
//                   <div className="col-lg-3" style={{ marginTop: "19px" }}>
//                     <button
//                       onClick={() => getGridData(values, pageNo, pageSize)}
//                       type="button"
//                       className="btn btn-primary mr-2"
//                       disabled={
//                         !values?.vehicleNo ||
//                         !values?.travelDateFrom ||
//                         !values?.travelDateTo
//                       }
//                     >
//                       View
//                     </button>

//                     <button
//                       type="button"
//                       className="btn btn-primary"
//                       disabled={
//                         values?.travelDateFrom === "" ||
//                         values?.travelDateTo === "" ||
//                         values?.vehicleNo === ""
//                       }
//                       onClick={() =>
//                         history.push({
//                           pathname:
//                             "/transport-management/routecostmanagement/routestandardcost/vehicleLogExpense/create",
//                           state: {
//                             values,
//                           },
//                         })
//                       }
//                     >
//                       Create Expense
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Table */}
//               {landingData?.data?.length > 0 && (
//                 <table className="table table-striped table-bordered global-table">
//                   <thead>
//                     <tr>
//                       <th>SL</th>
//                       <th>Date</th>
//                       <th>Code</th>
//                       <th>From</th>
//                       <th>To</th>
//                       <th>Consumed Mileage</th>
//                       <th>Usage Type</th>
//                       <th>Fuel Purchased?</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {landingData?.data?.length &&
//                       landingData?.data?.map((data, i) => (
//                         <tr key={i + 1}>
//                           <td>{i + 1}</td>
//                           <td>{_dateFormatter(data.travelDate)}</td>
//                           <td>{data.travelCode}</td>
//                           <td>{data.fromAddress}</td>
//                           <td>{data.toAddress}</td>
//                           <td>{data.vehicleConsumedMileage}</td>
//                           <td>
//                             {data.isPersonalUsage === true
//                               ? "Personal"
//                               : "Official"}
//                           </td>
//                           <td>
//                             {data.isFuelPurchased === true ? "Yes" : "No"}
//                           </td>
//                           <td className="text-center d-flex justify-content-around">
//                             <IView
//                               clickHandler={() => {
//                                 setShowModal(true);
//                                 setId(data?.vehicleLogId);
//                               }}
//                             />
//                             {permitted && (
//                               <>
//                                 <IEdit
//                                   title="Vehicle Update"
//                                   onClick={() => {
//                                     setSingleItem(data);
//                                     setOpen(true);
//                                   }}
//                                 />
//                                 <span
//                                   onClick={() => {
//                                     deleteVehicleLog(
//                                       data?.vehicleLogId,
//                                       values
//                                     );
//                                   }}
//                                 >
//                                   <IDelete />
//                                 </span>
//                               </>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               )}
//               {landingData?.data?.length > 0 && (
//                 <PaginationTable
//                   count={landingData?.totalCount}
//                   setPositionHandler={setPositionHandler}
//                   paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
//                   values={values}
//                 />
//               )}
//             </Form>

//             {/* View Modal */}
//             <IViewModal show={showModal} onHide={() => setShowModal(false)}>
//               <VehicleLogBook id={id} />
//             </IViewModal>

//             {/* Edit Modal */}
//             <IViewModal show={open} onHide={() => setOpen(false)}>
//               <VehicleEditForm
//                 singleItem={singleItem}
//                 setOpen={setOpen}
//                 getGridData={getGridData}
//                 value={values}
//                 pageNo={pageNo}
//                 pageSize={pageSize}
//               />
//             </IViewModal>
//           </ICustomCard>
//         </>
//       )}
//     </Formik>
//   );
// };

// export default VehicleLogLanding;
