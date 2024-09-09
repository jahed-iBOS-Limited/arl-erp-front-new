// import { Form, Formik } from "formik";
// import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
// import IForm from "../../../_helper/_form";
// import Loading from "../../../_helper/_loading";
// import { _dateFormatter } from "../../../_helper/_dateFormate";
// import ReactQuill from "react-quill";
// import ReactToPrint from "react-to-print";

// const initData = {
//   item: "",
//   remarks: "",
//   amount: "",
//   date: "",
//   strAuditObjective: "",
//   strScopeOfAudit: "",
//   strActionPlan: "",
// };

// export default function AuditSchedulesView() {
//   const [objProps, setObjprops] = useState({});
//   const [isPrintView, setIsPrintView] = useState(false); // State to toggle between views
//   const { state: viewData } = useLocation();
//   const printRef = React.useRef();

//   const saveHandler = async (values, cb) => {
//     console.log(values);
//     alert("Submitted Successfully");
//   };

//   const styles = {
//     container: {
//       fontFamily: "Arial, sans-serif",
//       margin: "0 auto",
//       padding: "20px",
//       border: "1px solid #ddd",
//       maxWidth: "800px",
//       lineHeight: "1.6",
//       fontSize: "14px",
//     },
//     heading: {
//       textAlign: "center",
//       marginBottom: "20px",
//     },
//     paragraph: {
//       margin: "8px 0",
//     },
//     highlight: {
//       fontWeight: "bold",
//     },
//     quillContainer: {
//       marginBottom: "20px",
//     },
//     buttonContainer: {
//       marginBottom: "20px",
//       textAlign: "right",
//     },
//   };

//   return (
//     <IForm
//       title="Create Audit Plan Template"
//       getProps={setObjprops}
//       isHiddenReset={true}
//     >
//       {false && <Loading />}

//       {/* Button to Toggle View */}
//       <div className="mt-5" style={styles.buttonContainer}>
//         <button
//           className="btn btn-primary mr-2"
//           onClick={() => setIsPrintView(false)}
//         >
//           Create View
//         </button>
//         <button
//           className="btn btn-primary mr-2"
//           onClick={() => setIsPrintView(true)}
//         >
//           Print View
//         </button>
//         {isPrintView && (
//           <ReactToPrint
//             trigger={() => <button className="btn btn-primary">Print</button>}
//             content={() => printRef.current}
//           />
//         )}
//       </div>

//       {/* Conditionally Render View */}
//       {!isPrintView ? (
//         <Formik
//           enableReinitialize={true}
//           initialValues={initData}
//           onSubmit={(values, { setSubmitting, resetForm }) => {
//             saveHandler(values, () => {
//               resetForm(initData);
//             });
//           }}
//         >
//           {({
//             handleSubmit,
//             resetForm,
//             values,
//             setFieldValue,
//             isValid,
//             errors,
//             touched,
//           }) => (
//             <>
//               <Form className="form form-label-right">
//                 {false && <Loading />}
//                 <div className="form-group global-form row">
//                   <div style={styles.container}>
//                     <h2 style={styles.heading}>Audit Plan Template</h2>
//                     <p style={styles.paragraph}>
//                       <span style={styles.highlight}>Name of assignment:</span>{" "}
//                       {viewData.strAuditEngagementName}
//                     </p>
//                     <p style={styles.paragraph}>
//                       <span style={styles.highlight}>
//                         Audit scope of duration:
//                       </span>{" "}
//                       For the year ***
//                     </p>
//                     <p style={styles.paragraph}>
//                       <span style={styles.highlight}>Name of company:</span>{" "}
//                       {viewData.strBusinessUnitName}
//                     </p>
//                     <p style={styles.paragraph}>
//                       <span style={styles.highlight}>Name of Auditor:</span>{" "}
//                       {viewData.strAuditorName} (Lead)
//                     </p>
//                     <p style={styles.paragraph}>
//                       <span style={styles.highlight}>Additional Members:</span>
//                     </p>
//                     <ul>
//                       <li>Mr. YY (Member)</li>
//                       <li>Mr. CC (Member)</li>
//                     </ul>
//                     <p style={styles.paragraph}>
//                       <span style={styles.highlight}>Budgeted time:</span> ****
//                     </p>
//                     <p style={styles.paragraph}>
//                       <span style={styles.highlight}>Work starting date:</span>{" "}
//                       {_dateFormatter(viewData.dteStartDate)}
//                     </p>
//                     <p style={styles.paragraph}>
//                       <span style={styles.highlight}>
//                         Fieldwork completion date:
//                       </span>{" "}
//                       {_dateFormatter(viewData.dteEndDate)}
//                     </p>
//                     <p style={styles.paragraph}>
//                       <span style={styles.highlight}>
//                         Draft report submission date:
//                       </span>{" "}
//                       ***
//                     </p>
//                   </div>

//                   {/* ReactQuill Editors in Separate Divs with col-12 */}
//                   <div className="col-12" style={styles.quillContainer}>
//                     <label style={styles.highlight}>Audit Objective</label>
//                     <ReactQuill
//                       placeholder="Write the audit objective here"
//                       value={values.strAuditObjective}
//                       onChange={(value) =>
//                         setFieldValue("strAuditObjective", value)
//                       }
//                     />
//                   </div>

//                   <div className="col-12" style={styles.quillContainer}>
//                     <label style={styles.highlight}>Scope of Audit</label>
//                     <ReactQuill
//                       placeholder="Write the scope of the audit here"
//                       value={values.strScopeOfAudit}
//                       onChange={(value) =>
//                         setFieldValue("strScopeOfAudit", value)
//                       }
//                     />
//                   </div>

//                   <div className="col-12" style={styles.quillContainer}>
//                     <label style={styles.highlight}>Action Plan</label>
//                     <ReactQuill
//                       placeholder="Write the action plan here"
//                       value={values.strActionPlan}
//                       onChange={(value) =>
//                         setFieldValue("strActionPlan", value)
//                       }
//                     />
//                   </div>
//                 </div>

//                 {/* Submit and Reset buttons */}
//                 <button
//                   type="submit"
//                   style={{ display: "none" }}
//                   ref={objProps?.btnRef}
//                   onSubmit={() => handleSubmit()}
//                 ></button>

//                 <button
//                   type="reset"
//                   style={{ display: "none" }}
//                   ref={objProps?.resetBtnRef}
//                   onSubmit={() => resetForm(initData)}
//                 ></button>
//               </Form>
//             </>
//           )}
//         </Formik>
//       ) : (
//         <div ref={printRef} style={styles.container}>
//           <h2 style={styles.heading}>Audit Plan Template - Print View</h2>
//           <p style={styles.paragraph}>
//             <span style={styles.highlight}>Name of assignment:</span>{" "}
//             {viewData.strAuditEngagementName}
//           </p>
//           <p style={styles.paragraph}>
//             <span style={styles.highlight}>Audit scope of duration:</span> For
//             the year ***
//           </p>
//           <p style={styles.paragraph}>
//             <span style={styles.highlight}>Name of company:</span>{" "}
//             {viewData.strBusinessUnitName}
//           </p>
//           <p style={styles.paragraph}>
//             <span style={styles.highlight}>Name of Auditor:</span>{" "}
//             {viewData.strAuditorName} (Lead)
//           </p>
//           <p style={styles.paragraph}>
//             <span style={styles.highlight}>Additional Members:</span>
//           </p>
//           <ul>
//             <li>Mr. YY (Member)</li>
//             <li>Mr. CC (Member)</li>
//           </ul>
//           <p style={styles.paragraph}>
//             <span style={styles.highlight}>Budgeted time:</span> ****
//           </p>
//           <p style={styles.paragraph}>
//             <span style={styles.highlight}>Work starting date:</span>{" "}
//             {_dateFormatter(viewData.dteStartDate)}
//           </p>
//           <p style={styles.paragraph}>
//             <span style={styles.highlight}>Fieldwork completion date:</span>{" "}
//             {_dateFormatter(viewData.dteEndDate)}
//           </p>
//           <p style={styles.paragraph}>
//             <span style={styles.highlight}>Draft report submission date:</span>{" "}
//             ***
//           </p>
//           <p style={styles.paragraph}>
//             <span style={styles.highlight}>Audit Objective:</span>{" "}
//             {viewData.strAuditObjective || "Not Provided"}
//           </p>
//           <p style={styles.paragraph}>
//             <span style={styles.highlight}>Scope of Audit:</span>{" "}
//             {viewData.strScopeOfAudit || "Not Provided"}
//           </p>
//           <p style={styles.paragraph}>
//             <span style={styles.highlight}>Action Plan:</span>{" "}
//             {viewData.strActionPlan || "Not Provided"}
//           </p>
//         </div>
//       )}
//     </IForm>
//   );
// }

import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import ReactQuill from "react-quill";
import ReactToPrint from "react-to-print";

const initData = {
  item: "",
  remarks: "",
  amount: "",
  date: "",
  strAuditObjective: "",
  strScopeOfAudit: "",
  strActionPlan: "",
};

export default function AuditSchedulesView() {
  const [objProps, setObjprops] = useState({});
  const [isPrintView, setIsPrintView] = useState(false); // State to toggle between views
  const { state: viewData } = useLocation();
  const printRef = React.useRef();

  const saveHandler = async (values, cb) => {
    console.log(values);
    alert("Submitted Successfully");
  };

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      margin: "0 auto",
      padding: "20px",
      border: "1px solid #ddd",
      maxWidth: "800px",
      lineHeight: "1.6",
      fontSize: "14px",
    },
    heading: {
      textAlign: "center",
      marginBottom: "20px",
    },
    paragraph: {
      margin: "8px 0",
    },
    highlight: {
      fontWeight: "bold",
    },
    quillContainer: {
      marginBottom: "20px",
    },
    buttonContainer: {
      marginBottom: "20px",
      textAlign: "right",
    },
  };

  return (
    <IForm
      title="Create Audit Plan Template"
      getProps={setObjprops}
      isHiddenReset={true}
    >
      {false && <Loading />}

      {/* Button to Toggle View */}
      <div className="mt-5" style={styles.buttonContainer}>
        <button
          className="btn btn-primary mr-2"
          onClick={() => setIsPrintView(false)}
        >
          Create View
        </button>
        <button
          className="btn btn-primary mr-2"
          onClick={() => setIsPrintView(true)}
        >
          Print View
        </button>
        {isPrintView && (
          <ReactToPrint
            trigger={() => <button className="btn btn-primary">Print</button>}
            content={() => printRef.current}
          />
        )}
      </div>

      {/* Conditionally Render View */}
      {!isPrintView ? (
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
            });
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            setFieldValue,
            isValid,
            errors,
            touched,
          }) => (
            <>
              <Form className="form form-label-right">
                {false && <Loading />}
                <div className="form-group global-form row">
                  <div style={styles.container}>
                    <h2 style={styles.heading}>Audit Plan Template</h2>
                    <p style={styles.paragraph}>
                      <span style={styles.highlight}>Name of assignment:</span>{" "}
                      {viewData.strAuditEngagementName}
                    </p>
                    <p style={styles.paragraph}>
                      <span style={styles.highlight}>
                        Audit scope of duration:
                      </span>{" "}
                      For the year ***
                    </p>
                    <p style={styles.paragraph}>
                      <span style={styles.highlight}>Name of company:</span>{" "}
                      {viewData.strBusinessUnitName}
                    </p>
                    <p style={styles.paragraph}>
                      <span style={styles.highlight}>Name of Auditor:</span>{" "}
                      {viewData.strAuditorName} (Lead)
                    </p>
                    <p style={styles.paragraph}>
                      <span style={styles.highlight}>Additional Members:</span>
                    </p>
                    <ul>
                      <li>Mr. YY (Member)</li>
                      <li>Mr. CC (Member)</li>
                    </ul>
                    <p style={styles.paragraph}>
                      <span style={styles.highlight}>Budgeted time:</span> ****
                    </p>
                    <p style={styles.paragraph}>
                      <span style={styles.highlight}>Work starting date:</span>{" "}
                      {_dateFormatter(viewData.dteStartDate)}
                    </p>
                    <p style={styles.paragraph}>
                      <span style={styles.highlight}>
                        Fieldwork completion date:
                      </span>{" "}
                      {_dateFormatter(viewData.dteEndDate)}
                    </p>
                    <p style={styles.paragraph}>
                      <span style={styles.highlight}>
                        Draft report submission date:
                      </span>{" "}
                      ***
                    </p>
                  </div>

                  {/* ReactQuill Editors in Separate Divs with col-12 */}
                  <div className="col-12" style={styles.quillContainer}>
                    <label style={styles.highlight}>Audit Objective</label>
                    <ReactQuill
                      placeholder="Write the audit objective here"
                      value={values.strAuditObjective}
                      onChange={(value) =>
                        setFieldValue("strAuditObjective", value)
                      }
                    />
                  </div>

                  <div className="col-12" style={styles.quillContainer}>
                    <label style={styles.highlight}>Scope of Audit</label>
                    <ReactQuill
                      placeholder="Write the scope of the audit here"
                      value={values.strScopeOfAudit}
                      onChange={(value) =>
                        setFieldValue("strScopeOfAudit", value)
                      }
                    />
                  </div>

                  <div className="col-12" style={styles.quillContainer}>
                    <label style={styles.highlight}>Action Plan</label>
                    <ReactQuill
                      placeholder="Write the action plan here"
                      value={values.strActionPlan}
                      onChange={(value) =>
                        setFieldValue("strActionPlan", value)
                      }
                    />
                  </div>
                </div>

                {/* Submit and Reset buttons */}
                <div className="form-group global-form row">
                  <div className="col-12 text-right">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onSubmit={() => handleSubmit()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      ) : (
        <div ref={printRef} style={styles.container}>
          <h2 style={styles.heading}>Audit Plan Template - Print View</h2>
          <p style={styles.paragraph}>
            <span style={styles.highlight}>Name of assignment:</span>{" "}
            {viewData.strAuditEngagementName}
          </p>
          <p style={styles.paragraph}>
            <span style={styles.highlight}>Audit scope of duration:</span> For
            the year ***
          </p>
          <p style={styles.paragraph}>
            <span style={styles.highlight}>Name of company:</span>{" "}
            {viewData.strBusinessUnitName}
          </p>
          <p style={styles.paragraph}>
            <span style={styles.highlight}>Name of Auditor:</span>{" "}
            {viewData.strAuditorName} (Lead)
          </p>
          <p style={styles.paragraph}>
            <span style={styles.highlight}>Additional Members:</span>
          </p>
          <ul>
            <li>Mr. YY (Member)</li>
            <li>Mr. CC (Member)</li>
          </ul>
          <p style={styles.paragraph}>
            <span style={styles.highlight}>Budgeted time:</span> ****
          </p>
          <p style={styles.paragraph}>
            <span style={styles.highlight}>Work starting date:</span>{" "}
            {_dateFormatter(viewData.dteStartDate)}
          </p>
          <p style={styles.paragraph}>
            <span style={styles.highlight}>Fieldwork completion date:</span>{" "}
            {_dateFormatter(viewData.dteEndDate)}
          </p>
          <p style={styles.paragraph}>
            <span style={styles.highlight}>Draft report submission date:</span>{" "}
            ***
          </p>
          <p style={styles.paragraph}>
            <span style={styles.highlight}>Audit Objective:</span>{" "}
            {viewData.strAuditObjective || "Not Provided"}
          </p>
          <p style={styles.paragraph}>
            <span style={styles.highlight}>Scope of Audit:</span>{" "}
            {viewData.strScopeOfAudit || "Not Provided"}
          </p>
          <p style={styles.paragraph}>
            <span style={styles.highlight}>Action Plan:</span>{" "}
            {viewData.strActionPlan || "Not Provided"}
          </p>
        </div>
      )}
    </IForm>
  );
}

