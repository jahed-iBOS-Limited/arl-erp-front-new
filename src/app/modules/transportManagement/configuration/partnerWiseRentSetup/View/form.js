// import React from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import NewSelect from "../../../../_helper/_select";
// import InputField from "../../../../_helper/_inputField";

// // Validation schema
// const validationSchema = Yup.object().shape({});

// export default function _Form({ initData, btnRef, saveHandler, resetBtnRef }) {
//   return (
//     <>
//       <Formik
//         enableReinitialize={true}
//         initialValues={initData}
//         validationSchema={validationSchema}
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
//             <Form className='form form-label-right'>
//               <div className=''>
//                 <div className='form-group row global-form'>
//                   <div className='col-lg-3'>
//                     <NewSelect
//                       name='transportOrganizationName'
//                       options={[]}
//                       value={values?.transportOrganizationName}
//                       label='Transport Organization Name'
//                       onChange={(valueOption) => {
//                         setFieldValue("transportOrganizationName", valueOption);
//                       }}
//                       placeholder='Transport Organization Name'
//                       errors={errors}
//                       touched={touched}
//                       isDisabled={true}
//                     />
//                   </div>
//                   <div className='col-lg-2'>
//                     <NewSelect
//                       name='routeName'
//                       options={[]}
//                       value={values?.routeName}
//                       label='Route Name'
//                       onChange={(valueOption) => {
//                         setFieldValue("routeName", valueOption);
//                       }}
//                       placeholder='Route Name'
//                       errors={errors}
//                       touched={touched}
//                       isDisabled={true}
//                     />
//                   </div>
//                 </div>
//                 {values?.itemLists?.length >= 0 && (
//                   <table className='table table-striped table-bordered global-table'>
//                     <thead>
//                       <tr>
//                         <th style={{ width: "35px" }}>SL</th>
//                         <th>Component Name</th>
//                         <th style={{ width: "400px" }}>Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {values?.itemLists.map((itm, index) => (
//                         <tr key={itm.itemId}>
//                           <td className='text-center'>{index + 1}</td>
//                           <td className='pl-2'>
//                             {itm.transportRouteCostComponentName}
//                           </td>

//                           <td className='pr-2'>
//                             <InputField
//                               value={values?.itemLists[index]?.amount}
//                               name={`itemLists.${index}.amount`}
//                               placeholder='Amount'
//                               type='number'
//                               onChange={(e) => {
//                                 setFieldValue(e.target.name, e.target.value);
//                               }}
//                               errors={errors}
//                               touched={touched}
//                               disabled={true}
//                             />
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}
//               </div>

//               <button
//                 type='submit'
//                 style={{ display: "none" }}
//                 ref={btnRef}
//                 onSubmit={() => handleSubmit()}
//               ></button>

//               <button
//                 type='reset'
//                 style={{ display: "none" }}
//                 ref={resetBtnRef}
//                 onSubmit={() => resetForm(initData)}
//               ></button>
//             </Form>
//           </>
//         )}
//       </Formik>
//     </>
//   );
// }
