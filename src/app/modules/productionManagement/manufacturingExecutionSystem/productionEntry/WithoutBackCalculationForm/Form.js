// import React, { useEffect } from "react";
// import { Formik, Form, Field } from "formik";
// import NewSelect from "../../../../_helper/_select";
// import InputField from "../../../../_helper/_inputField";
// import { useState } from "react";
// import { shallowEqual, useSelector } from "react-redux";
// import {
//   getOrderQuantityDDL,
//   getOtherOutputItemDDL,
//   getProductionOrderDDL,
//   getShopFloorDDL,
//   getProductionItemQuantity,
//   getWorkCenterDDL,
// } from "../helper";
// import { toast } from "react-toastify";
// import CreateTableRow from "../Table/CreateTableRow";
// import BackCalculationForm from './BackCalculationForm';
// import WithOutBackCalculationForm from './WithoutBackCalculationForm';

// export default function _Form({
//   initData,
//   btnRef,
//   saveHandler,
//   resetBtnRef,
//   isEdit,
//   // disableHandler,
//   plantNameDDL,
//   shiftDDL,
//   rowData,
//   setRowData,
//   dataHandler,
// }) {
//   const [othersOutputItemDDL, setOthersOutputItemDDL] = useState([]);
//   const [productionOrderDDL, setProductionOrderDDL] = useState([]);
//   const [shopFloorDDL, setShopFloorDDL] = useState([]);
//   const [workCenterDDL, setWorkCenterDDL] = useState([]);
//   const [orderQuantity, setGetOrderQuantity] = useState("");
//   const [productionItemQuantity, setProductionQuantity] = useState("");

//   // console.log("orderQuantity", orderQuantity);
//   const profileData = useSelector((state) => {
//     return state.authData.profileData;
//   }, shallowEqual);

//   const selectedBusinessUnit = useSelector((state) => {
//     return state.authData.selectedBusinessUnit;
//   }, shallowEqual);

//   useEffect(() => {
//     // console.log("Init Data => ", initData);
//     if (initData?.plantId) {
//       getOtherOutputItemDDL(
//         profileData?.accountId,
//         selectedBusinessUnit?.value,
//         initData.plantId,
//         setOthersOutputItemDDL
//       );
//       getOrderQuantityDDL(
//         profileData?.accountId,
//         selectedBusinessUnit.value,
//         initData?.plantName?.value,
//         initData?.productionOrder?.value,
//         setGetOrderQuantity
//       );
//       getProductionItemQuantity(
//         initData?.productionOrder?.value,
//         initData?.objHeader?.itemId,
//         setProductionQuantity
//       );
//     }
//   }, [initData, profileData.accountId, selectedBusinessUnit.value]);

 
//   const [backCalculation] = useState(true);

//   return (
//     <>
//       <Formik
//         enableReinitialize={true}
//         initialValues={{
//           ...initData,
//         }}
//         // validationSchema={validationSchema}
//         onSubmit={(values, { setSubmitting, resetForm }) => {
//           saveHandler(values, () => {
//             resetForm(initData);
//           });
//         }}
//       >
//         {({
//           handleSubmit,
//           resetForm,
//           values,
//           errors,
//           touched,
//           setFieldValue,
//           isValid,
//         }) => (
//           <>
//             {/* {console.log(values)}
//              */}
//             {/* {disableHandler(!isValid)} */}
//             <Form>
//               {backCalculation ? (
//                 <BackCalculationForm saveHandler={saveHandler} plantNameDDL={plantNameDDL} shiftDDL={shiftDDL} workCenterDDL={workCenterDDL} shopFloorDDL={shopFloorDDL} setShopFloorDDL={setShopFloorDDL} setWorkCenterDDL={setWorkCenterDDL}/>
//               ) : (
//                 <WithOutBackCalculationForm />
//               )}
//               <button
//                 type="submit"
//                 style={{ display: "none" }}
//                 ref={btnRef}
//                 onClick={() => handleSubmit}
//               ></button>
//               <button
//                 type="reset"
//                 style={{ display: "none" }}
//                 ref={resetBtnRef}
//                 onSubmit={() => resetForm(initData)}
//               ></button>
//             </Form>
//             <br />
//           </>
//         )}
//       </Formik>
//     </>
//   );
// }
