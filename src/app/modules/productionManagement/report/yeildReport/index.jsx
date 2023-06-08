import { Form, Formik } from "formik";
import React, { useState } from "react";
// import { shallowEqual, useSelector } from "react-redux";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
// import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../_helper/iButton";
import ICard from "../../../_helper/_card";
// import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
const initialValues = {
  item: null,
  month: "",
};
export default function YeildReport() {
  const [showReport, setShowReport] = useState(false);
  // const [items, getItems, loadingOnGetItems] = useAxiosGet();
  // const {
  //   selectedBusinessUnit,
  //   profileData: { accountId },
  // } = useSelector((state) => state.authData, shallowEqual);
  const reportId = null;
  const groupId = ``;
  const parameterValues = [
    // { name: "BusinessUnitId", value: `${buId}` },
  ];
  return (
    <Formik>
      <>
        {/* {loadingOnGetItems && <Loading />} */}
        <ICard title="Sales Details">
          <div>
            <div className="mx-auto">
              <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                onSubmit={(values, { resetForm }) => {
                  resetForm();
                }}
              >
                {({ values, setFieldValue, handleSubmit }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form">
                        <div className="col-md-3">
                          <NewSelect
                            name="item"
                            options={[]}
                            value={values?.item}
                            label="Select Item"
                            onChange={(valueOption) => {
                              setFieldValue("item", valueOption);
                            }}
                            placeholder="Select Item"
                          />
                        </div>
                        <div className="col-md-3 d-flex flex-column">
                          <label>Select Month</label>
                          <input
                            className="trans-date cj-landing-date w-100 form-control"
                            style={{ minHeight: "22px" }}
                            value={values?.month}
                            name="month"
                            onChange={(e) => {
                              setFieldValue("month", e.target.value);
                            }}
                            type="month"
                          />
                        </div>
                        <div className="col-md-3">
                          <IButton
                            disabled={!(values?.item && values?.month)}
                            onClick={() => {
                              setShowReport(true);
                              handleSubmit();
                            }}
                          />
                        </div>
                      </div>
                    </Form>
                    {showReport && (
                      <PowerBIReport
                        reportId={reportId}
                        groupId={groupId}
                        parameterValues={parameterValues}
                        parameterPanel={false}
                      />
                    )}
                  </>
                )}
              </Formik>
            </div>
          </div>
        </ICard>
      </>
    </Formik>
  );
}

// import { useFormik } from "formik";
// import React, { useRef, useState } from "react";
// import ReactToPrint from "react-to-print";
// import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
// import ICustomCard from "../../../_helper/_customCard";
// import Loading from "../../../_helper/_loading";
// import NewSelect from "../../../_helper/_select";
// import printIcon from "../../../_helper/images/print-icon.png";
// import { shallowEqual, useSelector } from "react-redux";
// import moment from "moment";
// const initialValues = {
//   item: null,
//   month: "",
//   monthLength: null,
//   monthDayList: [],
// };

// const YeildReport = () => {
//   const {
//     profileData: { userId, accountId },
//     selectedBusinessUnit,
//   } = useSelector((state) => state?.authData, shallowEqual);
//   const printRef = useRef();
//   const {
//     values,
//     setFieldValue,
//     setValues,
//     handleSubmit,
//     resetForm,
//   } = useFormik({
//     initialValues,
//     onSubmit: (formValues) => {
//       getYeildReportInfo(``);
//     },
//   });
//   const [
//     yeildReportInfo,
//     getYeildReportInfo,
//     loadingOnGetYeildReport,
//   ] = useAxiosGet();

//   const [demoData, setDemoData] = useState([]);
//   return (
//     <ICustomCard title="Monthly Production Report">
//       {loadingOnGetYeildReport && <Loading />}

//       <>
//         <div className="row global-form">
//           <div className="col-md-3">
//             <NewSelect
//               name="item"
//               options={[]}
//               value={values?.item}
//               label="Select Item"
//               onChange={(valueOption) => {
//                 setFieldValue("item", valueOption);
//               }}
//               placeholder="Select Item"
//             />
//           </div>
//           <div className="col-md-3 d-flex flex-column">
//             <label>Select Month</label>
//             <input
//               className="trans-date cj-landing-date w-100 form-control"
//               style={{ minHeight: "22px" }}
//               value={values?.month}
//               name="month"
//               onChange={(e) => {
//                 setFieldValue("month", e.target.value);
//                 if (e.target.value) {
//                   let monthDays = moment(
//                     e.target.value,
//                     "YYYY-MM"
//                   ).daysInMonth();
//                   setFieldValue("monthLength", monthDays);
//                   let monthDaysList = [];
//                   for (let day = 1; day <= monthDays; day++) {
//                     monthDaysList.push(day);
//                   }
//                   setFieldValue("monthDayList", monthDaysList);
//                   let totalRows = [];
//                   for (let start = 1; start <= 10; start++) {
//                     let row = {
//                       item: `item ${start}`,
//                       unit: "KG",
//                     };
//                     let itemsDaysQuantity = [];

//                     for (let d = 1; d <= monthDays; d++) {
//                       itemsDaysQuantity.push(d * 100);
//                     }
//                     row.itemsDaysQuantity = itemsDaysQuantity;
//                     totalRows.push(row);
//                   }
//                   setDemoData(totalRows);
//                 }
//               }}
//               type="month"
//             />
//           </div>

//           <div style={{ marginTop: "15px" }} className="col-md-3">
//             <button
//               type="button"
//               className="btn btn-primary"
//               onClick={() => {}}
//               disabled={!(values?.item && values?.month)}
//             >
//               View
//             </button>
//           </div>

//           {yeildReportInfo ? (
//             <div
//               style={{ marginTop: "15px" }}
//               className="col-lg-3 d-flex justify-content-end"
//             >
//               <div>
//                 <ReactToPrint
//                   trigger={() => (
//                     <button type="button" className="btn btn-primary px-4 py-1">
//                       <img
//                         style={{ width: "25px", paddingRight: "5px" }}
//                         src={printIcon}
//                         alt="print-icon"
//                       />
//                       Print
//                     </button>
//                   )}
//                   content={() => printRef.current}
//                 />
//               </div>
//             </div>
//           ) : (
//             <></>
//           )}
//         </div>
//         <div className="">
//           <div className="row">
//             <div className="col-lg-12 text-center">
//               <h4>{selectedBusinessUnit?.label}</h4>
//               <h5>
//                 Product Name :{" "}
//                 <b className="display-5">{values?.item?.label}</b>{" "}
//               </h5>
//               <h6>
//                 Monthly Production Report :{" "}
//                 <b className="display-5">
//                   {values?.month
//                     ? moment(values?.month, "YYYY-MM").format("MMM, YY")
//                     : ""}
//                 </b>
//               </h6>
//               <br />
//             </div>
//           </div>
//           <div className="">
//             <p className="m-0">Per Dryer Paddy (Avg)(AH8/AH9) : </p>
//             <p className="m-0">Daily WIP MT (AH8-AK13) : </p>
//             <p className="m-0">Cumilative Paddy Consumption (AM1*AH12) : </p>
//             <p className="m-0">WIP Dryer : </p>
//           </div>

//           <div className="loan-scrollable-table">
//             <div className="scroll-table _table" style={{ maxHeight: "540px" }}>
//               <table
//                 id="table-to-xlsx"
//                 className="table table-striped table-bordered global-table"
//               >
//                 <thead>
//                   <tr>
//                     <th style={{ minWidth: "120px", width: "120px" }}>Input</th>
//                     <th
//                       style={{
//                         minWidth: "100px",
//                         position: "sticky",
//                         left: "120px",
//                         zIndex: 999999,
//                       }}
//                     >
//                       Unit
//                     </th>
//                     {values?.monthDayList?.map((item) => (
//                       <th style={{ minWidth: "100px", textAlign:"left !important" }}>{item}</th>
//                     ))}
//                     <th rowSpan={demoData.length + 1} style={{height:"100%"}}>Per Bag Weight</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {demoData?.map((item) => (
//                     <tr>
//                       <td>{item?.item}</td>
//                       <td
//                         style={{
//                           minWidth: "100px",
//                           position: "sticky",
//                           left: "120px",
//                           zIndex: 999999,
//                           backgroundColor: "white",
//                         }}
//                       >
//                         {item?.unit}
//                       </td>
//                       {item?.itemsDaysQuantity?.map((nestedItem) => (
//                         <td>{nestedItem}</td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </>
//     </ICustomCard>
//   );
// };

// export default YeildReport;
