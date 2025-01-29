import { Form as FormikForm, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { shallowEqual, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { getQuotationEntryItemList } from '../helper';

const initData = {};
const validationSchema = Yup.object().shape({});

// this component is used from multiple place, do not change existing props name and existing code which is related to this props,
export function QuotationEntryDetails({ currentItem, isHiddenBackBtn }) {
   const [rowDto, setRowDto] = useState();

   const profileData = useSelector(state => {
      return state.authData.profileData;
   }, shallowEqual);

   // get selected business unit from store
   // eslint-disable-next-line no-unused-vars
   const selectedBusinessUnit = useSelector(state => {
      return state.authData.selectedBusinessUnit;
   }, shallowEqual);
   useEffect(() => {
      getQuotationEntryItemList(
         currentItem?.intRequestForQuotationId,
         profileData?.userId,
         setRowDto
      );
   }, [currentItem, profileData]);

   const subTotal = rowDto?.objRow?.reduce(
      (acc, b) =>
         (acc +=
            b?.numNegotiationRate > 0
               ? +b?.numNegotiationRate * b?.numRfqquantity || 0
               : +b?.numRate * b?.numRfqquantity || 0),
      0
   );
   // const negotiationSubTotal = rowDto?.objRow?.reduce(
   //   (acc, b) =>
   //     (acc += +b?.numNegotiationRate * b?.numRfqquantity || 0),
   //   0
   // )

   const getPercentageValue = (discount, subTotal) => {
      if (!+discount) {
         return 0;
      }
      return (+discount / 100) * subTotal || 0;
   };

   return (
      <>
         <Formik
            enableReinitialize={true}
            initialValues={initData}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {}}
         >
            {({
               handleSubmit,
               resetForm,
               values,
               errors,
               touched,
               isValid,
            }) => (
               <>
                  <FormikForm>
                     <div className="row">
                        <div className="col-lg-10"></div>
                        <div className="col-lg-2 d-flex justify-content-end">
                           <ReactHtmlTableToExcel
                              id="test-table-xls-button"
                              className="download-table-xls-button btn btn-primary"
                              table="table-to-xlsx"
                              filename="tablexls"
                              sheet="tablexls"
                              buttonText="Export Excel"
                           />
                        </div>
                     </div>
                     <div id="pdf-section">
                        <div className="mx-5">
                           <div>
                              <table
                                 className="global-table table py-5 report-container"
                                 id="table-to-xlsx"
                              >
                                 <thead className="tableHead">
                                    <tr>
                                       <th>SL.</th>
                                       <th>Item Code</th>
                                       <th>Item Name</th>
                                       {rowDto?.objRow[0]?.intItemCategoryId === 624 ? 
                                       <>
                                          <th>Part No</th>
                                          <th>Drawing No</th>
                                       </> : null
                                       }
                                       <th>Item Remarks</th>
                                       <th>UOM</th>
                                       <th>Request QTY</th>
                                       <th>Rate</th>
                                       <th>Negotiation Rate</th>
                                       <th>Amount</th>
                                    </tr>
                                 </thead>
                                 <tbody className="tableHead">
                                    {rowDto &&
                                       rowDto?.objRow?.map((data, i) => (
                                          <>
                                             {(i === 0 || data.strShippingItemSubHead !== rowDto?.objRow[i - 1].strShippingItemSubHead) && data?.strShippingItemSubHead ? (
                                                <tr style={{background:'#ADD8E6', paddingTop: '5px', paddingBottom: '5px' }}>
                                                    <td colSpan={rowDto?.objRow[0]?.intItemCategoryId === 624 ? '11' : '9'}>
                                                        <div style={{fontSize: '20'}} className="text-bold text-center">
                                                            {data.strShippingItemSubHead}
                                                        </div>
                                                    </td>
                                                </tr>
                                             ) : null}
                                             <tr key={i}>
                                                <td className="text-center">
                                                   {i + 1}
                                                </td>
                                                <td>{data?.strItemCode}</td>
                                                <td>{data?.strItemName}</td>
                                                {data?.intItemCategoryId === 624 ? 
                                                <>
                                                   <td>{data?.strPartNo}</td>
                                                   <td>{data?.strDrawingNo}</td>
                                                </> : null
                                                }
                                                <td>{data?.strDescription}</td>
                                                <td>{data?.strUoMname}</td>
                                                <td>{data?.numRfqquantity}</td>
                                                <td className="text-right font-weight-bold">
                                                   {data?.numRate}
                                                </td>
                                                <td className="text-right">
                                                   {data?.numNegotiationRate}
                                                </td>
                                                <td className="text-right">
                                                   {data?.numNegotiationRate > 0
                                                      ? (data?.numNegotiationRate *
                                                           data?.numRfqquantity ||
                                                        0).toFixed(2)
                                                      : (data?.numRate *
                                                           data?.numRfqquantity ||
                                                        0).toFixed(2)}
                                                </td>
                                             </tr>
                                          </>
                                       ))}
                                    <tr>
                                       <td
                                          colSpan={rowDto?.objRow[0]?.intItemCategoryId === 624 ? 10 : 8}
                                          className="text-right font-weight-bold "
                                          
                                       >
                                          Sub Total
                                       </td>
                                       <td
                                          className="text-right font-weight-bold "
                                       >
                                          {(subTotal || 0).toFixed(2)}
                                       </td>
                                    </tr>
                                    <tr>
                                       <td
                                          colSpan={rowDto?.objRow[0]?.intItemCategoryId === 624 ? 10 : 8}
                                          className="text-right font-weight-bold "
                                       >
                                          Discount
                                       </td>
                                       <td
                                          className="text-right font-weight-bold "
                                       >
                                          {`${(getPercentageValue(
                                             rowDto?.objHeader
                                                ?.numDiscountPercentage,
                                             subTotal
                                          )).toFixed(2)} (${rowDto?.objHeader
                                             ?.numDiscountPercentage || 0}%)`}
                                       </td>
                                    </tr>
                                    <tr>
                                       <td
                                          colSpan={rowDto?.objRow[0]?.intItemCategoryId === 624 ? 10 : 8}
                                          className="text-right font-weight-bold "
                                       >
                                          Total After Discount
                                       </td>
                                       <td
                                          className="text-right font-weight-bold "
                                       >
                                          {((subTotal || 0) -
                                             (getPercentageValue(
                                                rowDto?.objHeader
                                                   ?.numDiscountPercentage,
                                                subTotal
                                             ) || 0)).toFixed(2)}
                                       </td>
                                    </tr>
                                    <tr>
                                       <td
                                          colSpan={rowDto?.objRow[0]?.intItemCategoryId === 624 ? 10 : 8}
                                          className="text-right font-weight-bold "
                                       >
                                          Transportation
                                       </td>
                                       <td
                                          className="text-right font-weight-bold "
                                       >
                                          {rowDto?.objHeader
                                             ?.numTransportCost || 0}
                                       </td>
                                    </tr>
                                    <tr>
                                       <td
                                          colSpan={rowDto?.objRow[0]?.intItemCategoryId === 624 ? 10 : 8}
                                          className="text-right font-weight-bold "
                                       >
                                          Other Cost
                                       </td>
                                       <td
                                          className="text-right font-weight-bold "
                                       >
                                          {rowDto?.objHeader?.numOthersCost ||
                                             0}
                                       </td>
                                    </tr>
                                    <tr>
                                       <td
                                          colSpan={rowDto?.objRow[0]?.intItemCategoryId === 624 ? 10 : 8}
                                          className="text-right font-weight-bold "
                                       >
                                          Grand Total
                                       </td>
                                       <td
                                          className="text-right font-weight-bold "
                                       >
                                          {((subTotal || 0) -
                                             (getPercentageValue(
                                                rowDto?.objHeader
                                                   ?.numDiscountPercentage,
                                                subTotal
                                             ) || 0) +
                                             (rowDto?.objHeader
                                                ?.numTransportCost || 0) +
                                             (rowDto?.objHeader
                                                ?.numOthersCost || 0)).toFixed(2)}
                                       </td>
                                    </tr>
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </div>
                  </FormikForm>
               </>
            )}
         </Formik>
      </>
   );
}
