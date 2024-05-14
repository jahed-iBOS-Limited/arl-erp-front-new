/* eslint-disable no-useless-concat */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Formik, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import ReactToPrint from 'react-to-print';
// import printIcon from "../../../../../helper/assets/images/print/print-icon.png";
import './parchaseReport.css';
import { _todayDate } from '../../../../_helper/_todayDate';
import { useHistory } from 'react-router-dom';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import { getReportPurchaseOrder } from '../helper';
//import { convertNumberToWords } from "./../../../../../helper/_convertMoneyToWord";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { amountToWords } from '../../../../_helper/_ConvertnumberToWord';
import IViewModal from '../../../../_helper/_viewModal';
import ViewForm from './viewForm';
import iMarineIcon from '../../../../_helper/images/imageakijpoly.png';
import ICustomCard from '../../../../_helper/_customCard';
import { APIUrl } from '../../../../../App';
import { ReceivePoReportView } from './recievePoReportView';
import { PrModal } from './PrModal';
const html2pdf = require('html2pdf.js');

let imageObj = {
   8: iMarineIcon,
};

const initData = {};
const validationSchema = Yup.object().shape({});

// this component is used from multiple place, do not change existing props name and existing code which is related to this props,
export function PurchaseOrderViewTableRow({
   poId,
   purchaseOrderTypeId,
   orId,
   isHiddenBackBtn,
   formValues,
}) {
   const [purchaseOrderReport, setPurchaseOrderReport] = useState('');
   const [isShowModal, setIsShowModal] = useState(false);
   const [isReceivePoModal, setIsReceivePoModal] = useState(false);
   const [currentItem, setCurrentItem] = useState('');
   const [showPRModel, setShowPRModel] = useState(false);

   const profileData = useSelector(state => {
      return state.authData.profileData;
   }, shallowEqual);

   // get selected business unit from store
   const selectedBusinessUnit = useSelector(state => {
      return state.authData.selectedBusinessUnit;
   }, shallowEqual);

   useEffect(() => {
      getReportPurchaseOrder(
         poId,
         purchaseOrderTypeId ? purchaseOrderTypeId : orId,
         selectedBusinessUnit?.value,
         setPurchaseOrderReport
      );
   }, [poId, orId]);

   let totalSum = purchaseOrderReport?.objRowListDTO?.reduce(
      (acc, sum) => sum?.totalValue + acc,
      0
   );

   const printRef = useRef();
   const history = useHistory();

   const initDataforEmail = {
      toMail: purchaseOrderReport?.objHeaderDTO?.supplierEmail,
      toCC: '',
      toBCC: '',
      subject: `Purchase Order No: ${purchaseOrderReport?.objHeaderDTO?.purchaseOrderNo}`,
      message: `Dear ${purchaseOrderReport?.objHeaderDTO?.supplierName}
    A Purchase Order has been sent from ${purchaseOrderReport?.objHeaderDTO?.billToName}Purchase Order No:   ${purchaseOrderReport?.objHeaderDTO?.purchaseOrderNo}
    Please take the necessary action
    `,
      attachment: '',
   };

   const pdfExport = fileName => {
      var element = document.getElementById('pdf-section');
      var opt = {
         margin: 1,
         filename: `${fileName}.pdf`,
         image: { type: 'jpeg', quality: 0.98 },
         html2canvas: {
            scale: 5,
            dpi: 300,
            letterRendering: true,
            scrollX: 0,
            scrollY: 0,
         },
         jsPDF: { unit: 'px', hotfixes: ['px_scaling'], orientation: 'p' },
      };
      html2pdf()
         .set(opt)
         .from(element)
         .save();
   };

   let grandTotal =
      totalSum +
      purchaseOrderReport?.objHeaderDTO?.numFreight +
      purchaseOrderReport?.objHeaderDTO?.numCommission +
      purchaseOrderReport?.objHeaderDTO?.othersCharge -
      purchaseOrderReport?.objHeaderDTO?.numGrossDiscount;

   return (
      <>
         <ICustomCard
            title=""
            renderProps={() => (
               <>
                  <ReactToPrint
                     pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
                     trigger={() => (
                        <button className="btn btn-primary">
                           {/* <img
                style={{ width: "25px", paddingRight: "5px" }}
                src={printIcon}
                alt="print-icon"
              /> */}
                           Print
                        </button>
                     )}
                     content={() => printRef.current}
                  />
                  {/* <ReactToPrint
              pageStyle='@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }'
              trigger={() => (
                <button className="btn btn-primary ml-2">
                  PDF
                </button>
              )}
              content={() => printRef.current}
            /> */}
                  <button
                     className="btn btn-primary ml-2"
                     onClick={e =>
                        pdfExport(
                           `${purchaseOrderReport?.objHeaderDTO?.purchaseOrderNo}`
                        )
                     }
                  >
                     PDF
                  </button>
                  <ReactHTMLTableToExcel
                     id="test-table-xls-button"
                     className="download-table-xls-button btn btn-primary ml-2"
                     table="table-to-xlsx"
                     filename="tablexls"
                     sheet="tablexls"
                     buttonText="Export Excel"
                  />
                  <button
                     type="button"
                     onClick={() => setIsShowModal(true)}
                     className="btn btn-primary back-btn ml-2"
                  >
                     Mail
                  </button>
                  {!isHiddenBackBtn && (
                     <button
                        type="button"
                        onClick={() => history.goBack()}
                        className="btn btn-secondary back-btn ml-2"
                     >
                        <i className="fa fa-arrow-left mr-1"></i>
                        Back
                     </button>
                  )}
               </>
            )}
         >
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
                        <div id="pdf-section">
                           <div className="mx-5">
                              <div ref={printRef}>
                                 <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex justify-content-center align-items-center">
                                       {selectedBusinessUnit?.value !== 8 ? (
                                          <img
                                             style={{
                                                width: '100px',
                                             }}
                                             src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
                                             alt="logo"
                                          />
                                       ) : (
                                          <img
                                             style={{ width: '150px' }}
                                             class=""
                                             src={
                                                imageObj[
                                                   selectedBusinessUnit?.value
                                                ]
                                             }
                                             alt="img"
                                          />
                                       )}
                                    </div>
                                    {/* <div className="d-flex justify-content-center align-items-center">
                          {selectedBusinessUnit?.value === 8 && (

                          )}
                        </div> */}

                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                       <h3 className="my-2">
                                          {
                                             purchaseOrderReport?.objHeaderDTO
                                                ?.billToName
                                          }
                                       </h3>
                                       <h6>
                                          {
                                             purchaseOrderReport?.objHeaderDTO
                                                ?.billToAddress
                                          }
                                       </h6>
                                       <h4>
                                          {+orId === 8
                                             ? 'Purchase Return'
                                             : 'Purchase Order'}
                                       </h4>
                                    </div>
                                    <div></div>
                                 </div>
                                 <div className="my-2">
                                    <b>Purchase Order No: </b>
                                    <span
                                       className="text-primary font-weight-bold cursor-pointer mr-2"
                                       style={{ textDecoration: 'underline' }}
                                       onClick={() => {
                                          setIsReceivePoModal(true);
                                       }}
                                    >
                                       {
                                          purchaseOrderReport?.objHeaderDTO
                                             ?.purchaseOrderNo
                                       }{' '}
                                       (
                                       {
                                          purchaseOrderReport?.objHeaderDTO
                                             ?.purchaseOrganizationName
                                       }
                                       )
                                    </span>
                                    <b>Order Date: </b>
                                    <span className="mr-2">
                                       {_dateFormatter(
                                          purchaseOrderReport?.objHeaderDTO
                                             ?.purchaseOrderDateTime
                                       )}
                                    </span>
                                    <b>Status: </b>
                                    <span className="mr-2">
                                       {purchaseOrderReport?.objHeaderDTO
                                          ?.isApproved
                                          ? 'Approved'
                                          : 'Pending'}
                                    </span>
                                    <b>Warehouse: </b>
                                    <span className="mr-2">
                                       {
                                          purchaseOrderReport?.objHeaderDTO
                                             ?.warehouseName
                                       }
                                    </span>
                                 </div>
                                 <div className="parchaseReport">
                                    <div className="reportInfo">
                                       <div className="reportInfo1">
                                          <p>
                                             {' '}
                                             Supplier:{' '}
                                             {
                                                purchaseOrderReport
                                                   ?.objHeaderDTO?.supplierName
                                             }
                                          </p>
                                          <p>
                                             {' '}
                                             Email:{' '}
                                             {
                                                purchaseOrderReport
                                                   ?.objHeaderDTO?.supplierEmail
                                             }
                                          </p>
                                          <p>
                                             Attn:{' '}
                                             {
                                                purchaseOrderReport
                                                   ?.objHeaderDTO?.strPropitor
                                             }
                                          </p>
                                          <p>
                                             Phone:{' '}
                                             {
                                                purchaseOrderReport
                                                   ?.objHeaderDTO
                                                   ?.supplierContactNo
                                             }
                                          </p>
                                          <p>
                                             Address:{' '}
                                             {
                                                purchaseOrderReport
                                                   ?.objHeaderDTO
                                                   ?.supplierAddress
                                             }
                                          </p>
                                       </div>
                                       <div className="reportInfo2">
                                          <p>
                                             Ship To:{' '}
                                             {
                                                purchaseOrderReport
                                                   ?.objHeaderDTO?.shipToName
                                             }
                                          </p>
                                          <p>
                                             Bin No.{' '}
                                             {
                                                purchaseOrderReport
                                                   ?.objHeaderDTO?.companyBinNo
                                             }{' '}
                                          </p>
                                          <p>
                                             {' '}
                                             PR No.{' '}
                                             <span
                                                onClick={() =>
                                                   setShowPRModel(true)
                                                }
                                                className="text-primary font-weight-bold cursor-pointer"
                                             >
                                                {
                                                   purchaseOrderReport
                                                      ?.objHeaderDTO?.prNo
                                                }
                                             </span>
                                          </p>
                                          <p
                                             style={{
                                                wordWrap: 'break-word',
                                             }}
                                          >
                                             {' '}
                                             Bank Name:{' '}
                                             {purchaseOrderReport?.objHeaderDTO
                                                ?.bankName || ''}
                                          </p>
                                          <p>
                                             {' '}
                                             Account Name:{' '}
                                             {purchaseOrderReport?.objHeaderDTO
                                                ?.accountName || ''}
                                          </p>
                                       </div>
                                       <div className="reportInfo3">
                                          <p>
                                             Bill To:{' '}
                                             {
                                                purchaseOrderReport
                                                   ?.objHeaderDTO?.billToName
                                             }
                                          </p>
                                          <div>
                                             <p
                                                style={{
                                                   wordWrap: 'break-word',
                                                }}
                                             >
                                                {
                                                   purchaseOrderReport
                                                      ?.objHeaderDTO
                                                      ?.billToAddress
                                                }
                                             </p>
                                          </div>
                                          <p>
                                             {' '}
                                             Account No:{' '}
                                             {purchaseOrderReport?.objHeaderDTO
                                                ?.accountNo || ''}
                                          </p>
                                          <p>
                                             {' '}
                                             Branch Name:{' '}
                                             {purchaseOrderReport?.objHeaderDTO
                                                ?.bankBranchName || ''}
                                          </p>
                                       </div>
                                    </div>
                                 </div>

                                <div className='table-responsive'>
                                <table
                                    className="global-table table mt-5 mb-5"
                                    id="table-to-xlsx"
                                 >
                                    <thead className="tableHead">
                                       <tr>
                                          <th>SL</th>
                                          <th>ITEM</th>
                                          <th>REFERENCE CODE</th>
                                          <th>DESCRIPTION</th>
                                          <th>UoM</th>
                                          <th>QTY.</th>
                                          <th>RATE</th>
                                          <th>VAT (%)</th>
                                          <th style={{ maxWidth: '40px' }}>
                                             VAT AMOUNT
                                          </th>
                                          <th>TOTAL</th>
                                       </tr>
                                    </thead>
                                    <tbody className="tableHead">
                                       {purchaseOrderReport?.objRowListDTO?.map(
                                          (data, i) => (
                                             <tr>
                                                <td className="text-center">
                                                   {i + 1}
                                                </td>
                                                <td>{data?.itemName}</td>
                                                <td>{data?.referenceCode}</td>
                                                <td>
                                                   {data?.purchaseDescription}
                                                </td>
                                                <td>{data?.uomName}</td>
                                                <td className="text-right">
                                                   {data?.orderQty}
                                                </td>
                                                <td className="text-right">
                                                   {data?.itemRate}
                                                </td>
                                                <td className="text-right">
                                                   {data?.numVatPercentage || 0}
                                                </td>
                                                <td
                                                   style={{ maxWidth: '40px' }}
                                                   className="text-right"
                                                >
                                                   {data?.numVatAmount || 0}
                                                </td>
                                                <td className="text-right">
                                                   {data?.totalValue}
                                                </td>
                                             </tr>
                                          )
                                       )}
                                       <tr>
                                          {/* <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td> */}
                                          <td
                                             className="font-weight-bold text-right"
                                             colspan="9"
                                          >
                                             Total
                                          </td>
                                          {/* <td className="font-weight-bold text-right">0</td>
                          <td className="font-weight-bold text-right">0</td> */}
                                          <td className="font-weight-bold text-right">
                                             {totalSum}
                                          </td>
                                       </tr>
                                    </tbody>
                                 </table>
                                </div>
                                 <div className="row otherspoinfo mt-5">
                                    <div className="col-lg-8">
                                       <table className="table custom-table">
                                          <tr>
                                             <td>
                                                <span className="pl-2">
                                                   Partial Shipment
                                                </span>
                                                {/* <div className="pl-1">Payroll Group</div> */}
                                             </td>
                                             <td>
                                                {purchaseOrderReport
                                                   ?.objHeaderDTO
                                                   ?.partialShipment === 'true'
                                                   ? 'Yes'
                                                   : 'No'}
                                             </td>
                                             <td>
                                                <span className="pl-2">
                                                   Freight
                                                </span>
                                                {/* <div className="pl-1">Calender Type</div> */}
                                             </td>
                                             <td
                                                className="text-right"
                                                style={{ width: '100px' }}
                                             >
                                                {purchaseOrderReport
                                                   ?.objHeaderDTO?.numFreight ||
                                                   0}
                                             </td>
                                          </tr>
                                          <tr>
                                             <td>
                                                <span className="pl-2">
                                                   No of Shipment
                                                </span>
                                             </td>
                                             <td>
                                                {
                                                   purchaseOrderReport
                                                      ?.objHeaderDTO
                                                      ?.numberOfShipment
                                                }
                                             </td>
                                             <td>
                                                <span className="pl-2">
                                                   {' '}
                                                   Others Charge
                                                </span>
                                             </td>
                                             <td className="text-right">
                                                {purchaseOrderReport
                                                   ?.objHeaderDTO
                                                   ?.othersCharge || 0}
                                             </td>
                                          </tr>
                                          <tr>
                                             <td>
                                                <span className="pl-2">
                                                   {' '}
                                                   Last Shipment Date
                                                </span>
                                             </td>
                                             <td>
                                                {_dateFormatter(
                                                   purchaseOrderReport
                                                      ?.objHeaderDTO
                                                      ?.lastShipmentDate
                                                )}
                                             </td>
                                             <td>
                                                <span className="pl-2">
                                                   {' '}
                                                   Gross Discount
                                                </span>
                                             </td>
                                             <td className="text-right">
                                                {purchaseOrderReport
                                                   ?.objHeaderDTO
                                                   ?.numGrossDiscount || 0}
                                             </td>
                                          </tr>
                                          <tr>
                                             <td>
                                                <span className="pl-2">
                                                   {' '}
                                                   Payment terms
                                                </span>
                                             </td>
                                             <td>
                                                {
                                                   purchaseOrderReport
                                                      ?.objHeaderDTO
                                                      ?.paymentTerms
                                                }
                                             </td>
                                             <td>
                                                <span className="pl-2">
                                                   {' '}
                                                   Commission
                                                </span>
                                             </td>
                                             <td className="text-right">
                                                {purchaseOrderReport
                                                   ?.objHeaderDTO
                                                   ?.numCommission || 0}
                                             </td>
                                          </tr>
                                          <tr>
                                             <td>
                                                <span className="pl-2">
                                                   {' '}
                                                   Payment days after MRR
                                                </span>
                                             </td>
                                             <td>
                                                {
                                                   purchaseOrderReport
                                                      ?.objHeaderDTO
                                                      ?.paymentDaysAfterDelivery
                                                }
                                             </td>
                                             <td>
                                                <span className="pl-2">
                                                   <b>Grand Total</b>
                                                </span>
                                             </td>
                                             <td className="text-right">
                                                <b>
                                                   {totalSum +
                                                      purchaseOrderReport
                                                         ?.objHeaderDTO
                                                         ?.numFreight +
                                                      purchaseOrderReport
                                                         ?.objHeaderDTO
                                                         ?.numCommission +
                                                      purchaseOrderReport
                                                         ?.objHeaderDTO
                                                         ?.othersCharge -
                                                      purchaseOrderReport
                                                         ?.objHeaderDTO
                                                         ?.numGrossDiscount}
                                                </b>
                                             </td>
                                          </tr>
                                          <tr>
                                             <td>
                                                <span className="pl-2">
                                                   {' '}
                                                   No of Installment
                                                </span>
                                             </td>
                                             <td>{0}</td>
                                          </tr>
                                          <tr>
                                             <td>
                                                <span className="pl-2">
                                                   {' '}
                                                   Installment Interval (Days)
                                                </span>
                                             </td>
                                             <td>{0}</td>
                                          </tr>
                                          {/* <tr>
                            <td>
                              <span className="pl-2"> Warrenty after delivery (months)</span>
                            </td>
                            <td>{0}</td>
                          </tr> */}
                                       </table>
                                    </div>
                                 </div>
                                 {/* <div className="mt-2">
                      <span className="font-weight-bold">In Word : {amountToWords(totalSum ? totalSum : 0)}</span>
                      </div> */}
                                 <div className="mt-3">
                                    <p className="text-uppercase font-weight-bold">
                                       Total (In Word):{' '}
                                       {amountToWords(grandTotal)}{' '}
                                       {formValues?.purchaseOrg?.value === 12
                                          ? purchaseOrderReport?.objHeaderDTO
                                               ?.currencyCode
                                          : 'TK'}{' '}
                                       only
                                    </p>
                                    <p style={{ wordWrap: 'break-word' }}>
                                       Other terms:{' '}
                                       {purchaseOrderReport?.objHeaderDTO
                                          ?.otherTerms || 'NA'}
                                    </p>
                                    <p style={{ wordWrap: 'break-word' }}>
                                       Other charges:{' '}
                                       {purchaseOrderReport?.objHeaderDTO
                                          ?.othersCharge || 'NA'}
                                    </p>
                                    <p>
                                       Prepared By:{' '}
                                       {`${purchaseOrderReport?.objHeaderDTO
                                          ?.preparedBy || 'NA'}` +
                                          `${
                                             purchaseOrderReport?.objHeaderDTO
                                                ?.designation
                                                ? ' (' +
                                                  purchaseOrderReport
                                                     ?.objHeaderDTO
                                                     ?.designation +
                                                  ')'
                                                : ''
                                          }`}
                                    </p>
                                 </div>
                                 <p className="text-left">
                                    Approved By:{' '}
                                    {`${purchaseOrderReport?.objHeaderDTO
                                       ?.approvedBy || 'NA'}` +
                                       `${
                                          purchaseOrderReport?.objHeaderDTO
                                             ?.abDesignation
                                             ? ' (' +
                                               purchaseOrderReport?.objHeaderDTO
                                                  ?.abDesignation +
                                               ')'
                                             : ''
                                       }`}
                                 </p>
                                 <p className="text-left">
                                    This is computer generated Purchase Order
                                    and does not required any signature.
                                 </p>
                              </div>
                           </div>
                           <div>
                              <IViewModal
                                 title="Send Email"
                                 show={isShowModal}
                                 onHide={() => setIsShowModal(false)}
                              >
                                 <ViewForm initData={initDataforEmail} />
                              </IViewModal>
                           </div>
                        </div>
                        {+orId === 8 ? null : +orId === 2 ? null : (
                           <table className="global-table table mt-5 mb-5 mx-5 printSectionNone">
                              <thead className="tableHead">
                                 <tr>
                                    <th>SL</th>
                                    <th>User Name</th>
                                    <th>Group Name</th>
                                    <th>Any User</th>
                                    <th>Sequence ID</th>
                                    <th>Status</th>
                                 </tr>
                              </thead>
                              <tbody className="tableHead">
                                 {purchaseOrderReport?.objEmpListDTO?.map(
                                    (data, i) => (
                                       <tr key={`${i}-${data.groupName}`}>
                                          <td className="text-center">
                                             {i + 1}
                                          </td>
                                          <td>
                                             {data?.userNameDesignationName}
                                          </td>
                                          <td>{data?.groupName}</td>
                                          <td className="text-center">
                                             {data?.anyUser}
                                          </td>
                                          <td className="text-center">
                                             {data?.sequenceId}
                                          </td>
                                          <td>
                                             {data?.isApprove
                                                ? 'Approved'
                                                : 'Pending'}
                                          </td>
                                       </tr>
                                    )
                                 )}
                              </tbody>
                           </table>
                        )}
                        <IViewModal
                           show={isReceivePoModal}
                           onHide={() => setIsReceivePoModal(false)}
                           title="Receive Purchase Order"
                        >
                           <ReceivePoReportView
                              poId={
                                 purchaseOrderReport?.objHeaderDTO
                                    ?.purchaseOrderId
                              }
                              isHiddenBackBtn={true}
                              values={values}
                           />
                        </IViewModal>
                     </FormikForm>
                  </>
               )}
            </Formik>
         </ICustomCard>
         <div>
            <IViewModal
               title="Purchase Request Details"
               show={showPRModel}
               onHide={() => setShowPRModel(false)}
            >
               <PrModal prId={purchaseOrderReport?.objHeaderDTO?.prId} />
            </IViewModal>
         </div>
      </>
   );
}
