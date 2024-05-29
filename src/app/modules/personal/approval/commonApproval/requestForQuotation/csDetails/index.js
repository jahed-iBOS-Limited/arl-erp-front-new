import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import './style.css';
import useAxiosGet from '../../../../../_helper/customHooks/useAxiosGet';
import {
   Card,
   CardBody,
   CardHeader,
   CardHeaderToolbar,
   ModalProgressBar,
} from '../../../../../../../_metronic/_partials/controls';
import { _dateFormatter } from '../../../../../_helper/_dateFormate';
import { dummyDataForCSDetails } from '../helper';
import IViewModal from '../../../../../_helper/_viewModal';
import { SupplierDetailsModal } from './supplierDetailsModal';
import { LastPurchaseInfoModal } from './lastPurchaseInfoModal';
import { ItemReferenceModal } from './itemReferenceModal';

const initData = {
   negotiationRate: '',
};
export default function CommonCSDetails() {
   // eslint-disable-next-line no-unused-vars
   const [loading, setLoading] = useState([]);
   const location = useLocation();
   const [
      csDetailsList,
      getCsDetailsList,
      // eslint-disable-next-line no-unused-vars
      getLoading,
      setCsDetailsList,
   ] = useAxiosGet([]);
   const history = useHistory();
   const [selectedItem, setSelectedItem] = useState({});
   const [selectedSupplier, setSelectedSupplier] = useState({});
   const [isSupplierDetailsModal, setIsSupplierDetailsModal] = useState(false);
   const [isLastPurchaseInfoModal, setIsLastPurchaseInfoModal] = useState(
      false
   );
   const [isItemReferenceModal, setIsItemReferenceModal] = useState(false);

   const backHandler = () => {
      history.goBack();
   };
   const dispatch = useDispatch();

   const { profileData } = useSelector(state => {
      return state.authData;
   }, shallowEqual);

   const selectedBusinessUnit = useSelector(state => {
      return state.authData.selectedBusinessUnit;
   }, shallowEqual);
   useEffect(() => {
      getCsDetailsList(
         `/procurement/RequestForQuotation/GetComparativeStatement?AccountId=1&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=0&RequestForQuotationId=${location?.state?.transectionId}`
      );
      // setCsDetailsList(dummyDataForCSDetails);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [location]);

   const saveHandler = async (values, cb) => {};

   const getPercentageValue = item => {
      if (!item?.numDiscountPercentage) {
         return 0;
      }
      return (item?.numDiscountPercentage / 100) * (item?.sumValue || 0);
   };
   return (
      <>
         <Formik
            enableReinitialize={true}
            initialValues={initData}
            onSubmit={(values, { setSubmitting, resetForm }) => {
               saveHandler(values, () => {
                  resetForm(initData);
                  setCsDetailsList([]);
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
                  <Card>
                     {true && <ModalProgressBar />}
                     <CardHeader title={'Comparative Statement Details'}>
                        <CardHeaderToolbar>
                           <button
                              type="button"
                              onClick={backHandler}
                              className={'btn btn-light'}
                           >
                              <i className="fa fa-arrow-left"></i>
                              Back
                           </button>
                        </CardHeaderToolbar>
                     </CardHeader>
                     <CardBody>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                           <h3 className="my-2">
                              {selectedBusinessUnit?.label || ''}
                           </h3>
                           <h6>{selectedBusinessUnit?.address || ''}</h6>
                           <h6>
                              {csDetailsList?.objHeder?.strWarehouseName}{' '}
                              Warehouse
                           </h6>
                           <h4>{'Comparative Statement'}</h4>
                        </div>
                        {/* <div className="form-group  global-form"> */}
                        <div
                           className=" mt-5"
                           style={{
                              display: 'flex',
                              gap: '0px 30px',
                              flexWrap: 'wrap',
                           }}
                        >
                           {/* <div className="col-lg-3">
                              User Name:{' '}
                              {location?.state?.strRequestForQuotationCode}
                           </div>
                           <div className="col-lg-3">User Department: </div>
                           <div className="col-lg-3">
                              Order Type:{' '}
                              {location?.state?.strCurrencyCode ||
                                 location?.state?.currencyCode}
                           </div>
                           <div className="col-lg-3">
                              Preparation Date:{' '}
                              {location?.state?.strDeliveryAddress ||
                                 location?.state?.deliveryAddress}
                           </div> */}
                           <div>
                              <b>RFQ Code:</b>{' '}
                              {
                                 csDetailsList?.objHeder
                                    ?.strRequestForQuotationCode
                              }
                           </div>
                           <div>
                              <b>RFQ Date:</b>{' '}
                              {csDetailsList?.objHeder?.dteRfqdate
                                 ? _dateFormatter(
                                      csDetailsList?.objHeder?.dteRfqdate
                                   )
                                 : ''}
                           </div>
                           <div>
                              <b>RFQ Type:</b>{' '}
                              {csDetailsList?.objHeder?.strRfqTypeName || ''}
                           </div>
                           <div>
                              <b>Currency:</b>{' '}
                              {csDetailsList?.objHeder?.strCurrencyCode || ''}
                           </div>
                           <div>
                              <b>Delivery Address:</b>{' '}
                              {csDetailsList?.objHeder?.strDeliveryAddress ||
                                 ''}
                           </div>
                           <div>
                              <b>Quotation Start Date:</b>{' '}
                              {csDetailsList?.objHeder?.quotationStartDateTime
                                 ? _dateFormatter(
                                      csDetailsList?.objHeder
                                         ?.quotationStartDateTime
                                   )
                                 : ''}
                           </div>
                           <div>
                              <b>Quotation End Date:</b>{' '}
                              {csDetailsList?.objHeder?.quotationEndDateTime
                                 ? _dateFormatter(
                                      csDetailsList?.objHeder
                                         ?.quotationEndDateTime
                                   )
                                 : ''}
                           </div>
                           <div>
                              <b>CS Type:</b>{' '}
                              {csDetailsList?.objHeder?.strCsType || ''}
                           </div>
                           <div>
                              <b>RFQ References:</b>{' '}
                              {
                                 csDetailsList?.objHeder
                                    ?.strConcatenatedReferenceCode
                              }
                           </div>

                           {/* <div className="col-lg-3">
                                 {csDetailsList?.objRow?.length > 0 && (
                                    <ReactHtmlTableToExcel
                                       id="test-table-xls-button-att-reports"
                                       className="btn btn-primary"
                                       table="table-to-xlsx"
                                       filename="CS_Details"
                                       sheet="Sheet1"
                                       buttonText="Export Excel"
                                    />
                                 )}
                              </div> */}
                        </div>
                        {/* </div> */}

                        <div className="row mt-3">
                           <div className="col-lg-12">
                              <div className="csDetailsTable employee-overall-status">
                                 <div
                                    style={{ maxHeight: '800px' }}
                                    className="scroll-table _table"
                                 >
                                    <table
                                       id="table-to-xlsx"
                                       className="table table-striped table-bordered bj-table bj-table-landing"
                                    >
                                       <thead>
                                          <tr>
                                             <th style={{ width: '50px' }}>
                                                SL No.
                                             </th>
                                             <th>Item Name</th>
                                             <th style={{ width: '70px' }}>
                                                UOM
                                             </th>
                                             <th style={{ width: '110px' }}>
                                                Description
                                             </th>
                                             <th style={{ width: '70px' }}>
                                                RFQ Quantity
                                             </th>
                                             <th style={{ width: '100px' }}>
                                                Last Purchase Rate
                                             </th>
                                             {csDetailsList?.objPartnerHead?.map(
                                                (itm, index) => (
                                                   <>
                                                      <th
                                                         colSpan={4}
                                                         onClick={() => {
                                                            setIsSupplierDetailsModal(
                                                               true
                                                            );
                                                            setSelectedSupplier(
                                                               itm
                                                            );
                                                         }}
                                                      >
                                                         <div>
                                                            <p
                                                               style={{
                                                                  color: 'blue',
                                                                  textDecoration:
                                                                     'underline',
                                                               }}
                                                            >
                                                               {
                                                                  itm?.strBusinessPartnerName
                                                               }
                                                            </p>
                                                         </div>
                                                      </th>
                                                   </>
                                                )
                                             )}
                                          </tr>
                                          <tr>
                                             <th></th>
                                             <th></th>
                                             <th></th>
                                             <th></th>
                                             <th></th>
                                             <th></th>
                                             {csDetailsList?.objPartnerHead?.map(
                                                (itm, index) => (
                                                   <>
                                                      <th>
                                                         <div>
                                                            {'Specification'}
                                                         </div>
                                                      </th>
                                                      <th>
                                                         <div>
                                                            {
                                                               'CS/Taken Quantity'
                                                            }
                                                         </div>
                                                      </th>
                                                      <th>
                                                         <div>
                                                            {'Neg. Rate'}
                                                         </div>
                                                      </th>
                                                      <th>
                                                         <div>
                                                            {'Total Amount'}
                                                         </div>
                                                      </th>
                                                   </>
                                                )
                                             )}
                                          </tr>
                                       </thead>
                                       <tbody>
                                          {csDetailsList?.objRow?.length > 0 &&
                                             csDetailsList?.objRow?.map(
                                                (item, index) => (
                                                   <tr
                                                      style={{
                                                         background:
                                                            item?.color,
                                                      }}
                                                      key={index}
                                                   >
                                                      <td>{index + 1}</td>
                                                      <td>
                                                         <p
                                                            style={{
                                                               color: 'blue',
                                                               textDecoration:
                                                                  'underline',
                                                            }}
                                                            onClick={() => {
                                                               setSelectedItem(
                                                                  item
                                                               );
                                                               setIsItemReferenceModal(
                                                                  true
                                                               );
                                                            }}
                                                         >
                                                            {item?.strItemName}
                                                         </p>
                                                      </td>
                                                      <td>
                                                         {item?.strUoMname}
                                                      </td>
                                                      <td>
                                                         {item?.strDescription}
                                                      </td>
                                                      <td className="text-center">
                                                         {item?.numRfqquantity}
                                                      </td>
                                                      <td>
                                                         <p
                                                            style={{
                                                               color: 'blue',
                                                               textDecoration:
                                                                  'underline',
                                                            }}
                                                            className="text-right"
                                                            onClick={() => {
                                                               setSelectedItem(
                                                                  item
                                                               );
                                                               setIsLastPurchaseInfoModal(
                                                                  true
                                                               );
                                                            }}
                                                         >
                                                            {
                                                               item?.numLastPurchaseRate
                                                            }
                                                         </p>
                                                      </td>
                                                      {item?.objPartnerHeader?.map(
                                                         partnerData => (
                                                            <>
                                                               <td>
                                                                  {partnerData
                                                                     ?.objPartnerRow
                                                                     ?.strNegotiationRemarks
                                                                     ? partnerData
                                                                          ?.objPartnerRow
                                                                          ?.strNegotiationRemarks
                                                                     : ''}
                                                               </td>
                                                               <td className="text-center">
                                                                  {partnerData
                                                                     ?.objPartnerRow
                                                                     ?.numCsOrTakenQuantity
                                                                     ? partnerData
                                                                          ?.objPartnerRow
                                                                          ?.numCsOrTakenQuantity
                                                                     : ''}
                                                               </td>
                                                               <td className="text-right">
                                                                  {partnerData
                                                                     ?.objPartnerRow
                                                                     ?.numNegotiationRate
                                                                     ? partnerData
                                                                          ?.objPartnerRow
                                                                          ?.numNegotiationRate
                                                                     : partnerData
                                                                          ?.objPartnerRow
                                                                          ?.numRate ||
                                                                       ''}
                                                               </td>
                                                               <td className="text-right">
                                                                  {partnerData
                                                                     ?.objPartnerRow
                                                                     ?.numTotalvalue
                                                                     ? partnerData
                                                                          ?.objPartnerRow
                                                                          ?.numTotalvalue
                                                                     : ''}
                                                               </td>
                                                            </>
                                                         )
                                                      )}
                                                   </tr>
                                                )
                                             )}
                                          <tr>
                                             <td
                                                colSpan={6}
                                                className="text-right font-weight-bold "
                                                style={{ fontSize: '12px' }}
                                             >
                                                Sub Total
                                             </td>
                                             {csDetailsList?.objPartnerHead?.map(
                                                (itm, index) => (
                                                   <>
                                                      <td>{''}</td>
                                                      <td>{''}</td>
                                                      <td>{''}</td>
                                                      <td
                                                         className="text-right font-weight-bold "
                                                         style={{
                                                            fontSize: '12px',
                                                         }}
                                                      >
                                                         {(
                                                            itm?.sumValue || 0
                                                         ).toFixed(2)}
                                                      </td>
                                                   </>
                                                )
                                             )}
                                          </tr>
                                          <tr>
                                             <td
                                                colSpan={6}
                                                className="text-right font-weight-bold "
                                                style={{ fontSize: '12px' }}
                                             >
                                                Discount Amount (if Any)
                                             </td>
                                             {csDetailsList?.objPartnerHead?.map(
                                                (itm, index) => (
                                                   <>
                                                      <td>{''}</td>
                                                      <td>{''}</td>
                                                      <td
                                                         className="text-right font-weight-bold "
                                                         style={{
                                                            fontSize: '12px',
                                                         }}
                                                      >
                                                         {`(${itm?.numDiscountPercentage ||
                                                            0}%)`}
                                                      </td>
                                                      <td>{`${getPercentageValue(
                                                         itm
                                                      ).toFixed(2) || ''}`}</td>
                                                   </>
                                                )
                                             )}
                                          </tr>
                                          <tr>
                                             <td
                                                colSpan={6}
                                                className="text-right font-weight-bold "
                                                style={{ fontSize: '12px' }}
                                             >
                                                Grand Total
                                             </td>
                                             {csDetailsList?.objPartnerHead?.map(
                                                (itm, index) => (
                                                   <>
                                                      <td>{''}</td>
                                                      <td>{''}</td>
                                                      <td>{''}</td>
                                                      <td
                                                         className="text-right font-weight-bold "
                                                         style={{
                                                            fontSize: '12px',
                                                         }}
                                                      >
                                                         {(
                                                            (itm?.sumValue ||
                                                               0) -
                                                            (getPercentageValue(
                                                               itm
                                                            ) || 0)
                                                         ).toFixed(2)}
                                                      </td>
                                                   </>
                                                )
                                             )}
                                          </tr>
                                          <tr>
                                             <td
                                                colSpan={6}
                                                className="text-right font-weight-bold "
                                                style={{ fontSize: '12px' }}
                                             >
                                                Delivery
                                             </td>
                                             {csDetailsList?.objPartnerHead?.map(
                                                (itm, index) => (
                                                   <>
                                                      <td
                                                         colSpan={4}
                                                         className="text-right font-weight-bold "
                                                         style={{
                                                            fontSize: '12px',
                                                         }}
                                                      >
                                                         {'Delivery need'}
                                                      </td>
                                                   </>
                                                )
                                             )}
                                          </tr>
                                          <tr>
                                             <td
                                                colSpan={6}
                                                className="text-right font-weight-bold "
                                                style={{ fontSize: '12px' }}
                                             >
                                                Unloading Service
                                             </td>
                                             {csDetailsList?.objPartnerHead?.map(
                                                (itm, index) => (
                                                   <>
                                                      <td
                                                         colSpan={4}
                                                         className="text-right font-weight-bold "
                                                         style={{
                                                            fontSize: '12px',
                                                         }}
                                                      >
                                                         {itm?.numOthersCost}
                                                      </td>
                                                   </>
                                                )
                                             )}
                                          </tr>
                                          <tr>
                                             <td
                                                colSpan={6}
                                                className="text-right font-weight-bold "
                                                style={{ fontSize: '12px' }}
                                             >
                                                Warranty/Guarantee
                                             </td>
                                             {csDetailsList?.objPartnerHead?.map(
                                                (itm, index) => (
                                                   <>
                                                      <td
                                                         colSpan={4}
                                                         className="text-right font-weight-bold "
                                                         style={{
                                                            fontSize: '12px',
                                                         }}
                                                      >
                                                         {
                                                            'Warenty/Gurantee need'
                                                         }
                                                      </td>
                                                      {/* <td
                                                         colSpan={3}
                                                         className="text-right font-weight-bold "
                                                         style={{
                                                            fontSize: '12px',
                                                         }}
                                                      >
                                                         {(
                                                            (itm?.sumValue ||
                                                               0) -
                                                            (getPercentageValue(
                                                               itm
                                                            ) || 0) +
                                                            (itm.numTransportCost ||
                                                               0) +
                                                            (itm.numOthersCost ||
                                                               0)
                                                         ).toFixed(2)}
                                                      </td> */}
                                                   </>
                                                )
                                             )}
                                          </tr>
                                          <tr>
                                             <td
                                                colSpan={6}
                                                className="text-right font-weight-bold "
                                                style={{ fontSize: '12px' }}
                                             >
                                                Payment Method
                                             </td>
                                             {/* <td
                                                colSpan={
                                                   csDetailsList?.objPartnerHead
                                                      ?.length > 0
                                                      ? csDetailsList
                                                           ?.objPartnerHead
                                                           ?.length
                                                      : 4
                                                }
                                                className=" "
                                                style={{
                                                   fontSize: '12px',
                                                }}
                                             >
                                                {csDetailsList?.objHeder
                                                   ?.strPaymentTermsName || ''}
                                             </td> */}
                                             {csDetailsList?.objPartnerHead?.map(
                                                (itm, index) => (
                                                   <>
                                                      <td
                                                         colSpan={4}
                                                         className=" "
                                                         style={{
                                                            fontSize: '12px',
                                                         }}
                                                      >
                                                         {csDetailsList
                                                            ?.objHeder
                                                            ?.strPaymentTermsName ||
                                                            ''}
                                                      </td>
                                                   </>
                                                )
                                             )}

                                             {/* {csDetailsList?.objPartnerHead?.map(
                                                (itm, index) => (
                                                   <>
                                                      <td
                                                         colSpan={3}
                                                         className=" "
                                                         style={{
                                                            fontSize: '12px',
                                                         }}
                                                      >
                                                         {itm?.strPaymentMethod}
                                                      </td>
                                                   </>
                                                )
                                             )} */}
                                          </tr>
                                          <tr>
                                             <td
                                                colSpan={6}
                                                className="text-right font-weight-bold "
                                                style={{ fontSize: '12px' }}
                                             >
                                                VAT / AIT
                                             </td>
                                             {csDetailsList?.objPartnerHead?.map(
                                                (itm, index) => (
                                                   <>
                                                      <td
                                                         colSpan={4}
                                                         className=" "
                                                         style={{
                                                            fontSize: '12px',
                                                         }}
                                                      >
                                                         {csDetailsList
                                                            ?.objHeder
                                                            ?.isVatAtiInclude
                                                            ? 'Included'
                                                            : 'Excluded'}
                                                      </td>
                                                   </>
                                                )
                                             )}
                                          </tr>
                                          <tr>
                                             <td
                                                colSpan={6}
                                                className="text-right font-weight-bold "
                                                style={{ fontSize: '12px' }}
                                             >
                                                Tax deducted at Source
                                             </td>
                                             {csDetailsList?.objPartnerHead?.map(
                                                (itm, index) => (
                                                   <>
                                                      <td
                                                         colSpan={4}
                                                         className=" "
                                                         style={{
                                                            fontSize: '12px',
                                                         }}
                                                      >
                                                         {csDetailsList
                                                            ?.objHeder
                                                            ?.isTdsInclude
                                                            ? 'Included'
                                                            : 'Excluded'}
                                                      </td>
                                                   </>
                                                )
                                             )}
                                          </tr>
                                          <tr>
                                             <td
                                                colSpan={6}
                                                className="text-right font-weight-bold "
                                                style={{ fontSize: '12px' }}
                                             >
                                                Transportation
                                             </td>
                                             {csDetailsList?.objPartnerHead?.map(
                                                (itm, index) => (
                                                   <>
                                                      <td
                                                         colSpan={4}
                                                         className=" "
                                                         style={{
                                                            fontSize: '12px',
                                                         }}
                                                      >
                                                         {csDetailsList
                                                            ?.objHeder
                                                            ?.isTransportCostInclude
                                                            ? 'Included'
                                                            : 'Excluded'}
                                                      </td>
                                                   </>
                                                )
                                             )}
                                          </tr>
                                          <tr>
                                             <td
                                                colSpan={6}
                                                className="text-right font-weight-bold "
                                                style={{ fontSize: '12px' }}
                                             >
                                                Others (if any)
                                             </td>
                                             {csDetailsList?.objPartnerHead?.map(
                                                (itm, index) => (
                                                   <>
                                                      <td
                                                         colSpan={4}
                                                         className=" "
                                                         style={{
                                                            fontSize: '12px',
                                                         }}
                                                      >
                                                         {itm?.strRemarks}
                                                      </td>
                                                   </>
                                                )
                                             )}
                                          </tr>
                                       </tbody>
                                    </table>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <IViewModal
                           show={isSupplierDetailsModal}
                           onHide={() => setIsSupplierDetailsModal(false)}
                        >
                           <SupplierDetailsModal
                              selectedSupplier={selectedSupplier}
                           />
                        </IViewModal>
                        <IViewModal
                           show={isLastPurchaseInfoModal}
                           onHide={() => setIsLastPurchaseInfoModal(false)}
                        >
                           <LastPurchaseInfoModal selectedItem={selectedItem} />
                        </IViewModal>
                        <IViewModal
                           show={isItemReferenceModal}
                           onHide={() => setIsItemReferenceModal(false)}
                        >
                           <ItemReferenceModal selectedItem={selectedItem} />
                        </IViewModal>
                     </CardBody>
                  </Card>
               </>
            )}
         </Formik>
      </>
   );
}
