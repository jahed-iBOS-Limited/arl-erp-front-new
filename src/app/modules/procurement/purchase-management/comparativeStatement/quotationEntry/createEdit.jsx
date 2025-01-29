import { Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import IForm from '../../../../_helper/_form';
import IView from '../../../../_helper/_helperIcons/_view';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions';
import NewSelect from '../../../../_helper/_select';
import { _todayDate } from '../../../../_helper/_todayDate';
import {
   attachment_action,
   createQuotationEntry,
   getQuotationEntryItemList,
   getSupplierNameDDLAction,
} from './helper';
import QuotationCreateRowDtoTable from './quotationCreateTable';

const initData = {
   supplierQuotationNo: '',
   quotationDate: _todayDate(),
   supplierName: '',
   supplierContactNo: '',
   supplierEmail: '',
   numRate: '',
   transportCost: '',
   othersCost: '',
   discountPercentage: '',
   headerRemarks: '',
};
export default function ShippingQuotationCreate() {
   const dispatch = useDispatch()
   const [objProps, setObjprops] = useState({});
   const [rowDto, setRowDto] = useState([]);
   const { id } = useParams();
   const location = useLocation();
   const [supplierNameDDL, setsupplierNameDDL] = useState([]);
   const [loading, setLoading] = useState(false);
   const [headerAttachment, setHeaderAttachment] = useState("");

   const inputCVFile = useRef(null);
   const onButtonCVClick = e => {
      e.stopPropagation();
      inputCVFile.current.click();
   };

   const { profileData } = useSelector(state => {
      return state.authData;
   }, shallowEqual);

   const selectedBusinessUnit = useSelector(state => {
      return state.authData.selectedBusinessUnit;
   }, shallowEqual);

   useEffect(() => {
      getSupplierNameDDLAction(
         profileData?.accountId,
         selectedBusinessUnit?.value,
         location?.rowDetails?.intRequestForQuotationId,
         profileData?.userId,
         setsupplierNameDDL
      );
   }, [profileData, selectedBusinessUnit, location]);

   useEffect(() => {
      getQuotationEntryItemList(
         location?.rowDetails?.intRequestForQuotationId,
         profileData?.userId,
         setRowDto
      );
   }, [location, profileData]);

   const saveHandler = async (values, cb) => {
      if (!values?.supplierQuotationNo)
         return toast.warn('Supplier Quotation No is required.');

      const rowItemList = rowDto?.objRow?.map(itm => {
         return {
            intPartnerRfqid: values?.supplierName?.intPartnerRfqid,
            intItemId: itm?.intItemId,
            numRate: +itm?.rate,
            strRemarks: itm?.remarks,
            numNegotiationRate: 0,
            strAttachment: itm?.strAttachment,
         };
      });

      const payload = {
         objHeader: {
            intPartnerRfqid: values?.supplierName?.intPartnerRfqid,
            intRequestForQuotationId:
               rowDto?.objHeader?.intRequestForQuotationId,
            intAccountId: profileData?.accountId,
            intBusinessUnitId: selectedBusinessUnit?.value,
            intBusinessPartnerId: values?.supplierName?.intBusinessPartnerId,
            strSupplierRefNo: values?.supplierQuotationNo,
            dteSupplierRefDate: values?.quotationDate,
            numTransportCost: +values?.transportCost || 0,
            numOthersCost: +values?.othersCost || 0,
            numDiscountPercentage: +values?.discountPercentage || 0,
            strRemarks: values?.headerRemarks || '',
            strHeaderAttachment: headerAttachment || '',
         },
         objRow: rowItemList,
      };
      createQuotationEntry(payload, cb, setLoading);
   };

   const subTotal = rowDto?.objRow?.reduce(
      (acc, b) => (acc += +b?.rate * b?.numRfqquantity || 0),
      0
   );

   const getPercentageValue = (discount, subTotal) => {
      if (!+discount) {
         return 0;
      }
      return (+discount / 100) * subTotal || 0;
   };

   return (
      <IForm title="Create Quotation Entry" getProps={setObjprops}>
         {loading && <Loading />}
         <>
            <Formik
               enableReinitialize={true}
               initialValues={{
                  ...initData,
                  supplierName:
                     supplierNameDDL?.length === 1
                        ? {
                             value: supplierNameDDL[0]?.value,
                             label: supplierNameDDL[0]?.label,
                             intPartnerRfqid:
                                supplierNameDDL[0]?.intPartnerRfqid,
                             intBusinessPartnerId:
                                supplierNameDDL[0]?.intBusinessPartnerId,
                          }
                        : '',
                  supplierContactNo:
                     supplierNameDDL?.length === 1
                        ? supplierNameDDL[0]?.strContactNumber
                        : '',
                  supplierEmail:
                     supplierNameDDL?.length === 1
                        ? supplierNameDDL[0]?.strEmail
                        : '',
               }}
               onSubmit={(
                  values,
                  { setSubmitting, resetForm, setFieldValue }
               ) => {
                  saveHandler(values, () => {
                     resetForm(initData);
                     setHeaderAttachment("")
                     setRowDto([]);
                     setFieldValue('supplierName', '');
                     setFieldValue('supplierContactNo', '');
                     setFieldValue('supplierEmail', '');
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
                        
                        <div className="form-group  global-form">
                           <div className="row">
                              <div className="col-lg-3">
                                 RFQ Code:{' '}
                                 {rowDto?.objHeader?.strRequestForQuotationCode}
                              </div>
                              <div className="col-lg-3">
                                 RFQ Date:{' '}
                                 {_dateFormatter(rowDto?.objHeader?.dteRfqdate)}
                              </div>
                              <div className="col-lg-3">
                                 Currency: {rowDto?.objHeader?.strCurrencyCode}
                              </div>
                              <div className="col-lg-3">
                                 Delivery Address:{' '}
                                 {rowDto?.objHeader?.strDeliveryAddress}
                              </div>
                              <div className="col-lg-3">
                                 Quotation Start Date:{' '}
                                 {`${
                                    rowDto?.objHeader?.quotationStartDateTime?.split(
                                       'T'
                                    )[0]
                                 } / ${
                                    rowDto?.objHeader?.quotationStartDateTime?.split(
                                       'T'
                                    )[1]
                                 }`}
                              </div>
                              <div className="col-lg-3">
                                 Quotation End Date:{' '}
                                 {`${
                                    rowDto?.objHeader?.quotationEndDateTime?.split(
                                       'T'
                                    )[0]
                                 } / ${
                                    rowDto?.objHeader?.quotationEndDateTime?.split(
                                       'T'
                                    )[1]
                                 }`}
                              </div>
                           </div>
                           <div className="row">
                              <div className="col-lg-3">
                                 <InputField
                                    value={values?.supplierQuotationNo}
                                    label="Supplier Quotation No"
                                    name="supplierQuotationNo"
                                    type="text"
                                 />
                              </div>
                              <div className="col-lg-3">
                                 <InputField
                                    value={values?.quotationDate}
                                    label="Quotation Date"
                                    name="quotationDate"
                                    type="date"
                                 />
                              </div>
                              <div className="col-lg-3">
                                 <InputField
                                    value={values?.transportCost}
                                    label="Transport Cost"
                                    name="transportCost"
                                    type="number"
                                    onChange={e => {
                                       if (e.target.value > 0) {
                                          setFieldValue(
                                             'transportCost',
                                             e.target.value
                                          );
                                       } else {
                                          setFieldValue('transportCost', '');
                                       }
                                    }}
                                 />
                              </div>
                              <div className="col-lg-3">
                                 <InputField
                                    value={values?.othersCost}
                                    label="Others Cost"
                                    name="othersCost"
                                    type="number"
                                    onChange={e => {
                                       if (e.target.value > 0) {
                                          setFieldValue(
                                             'othersCost',
                                             e.target.value
                                          );
                                       } else {
                                          setFieldValue('othersCost', '');
                                       }
                                    }}
                                 />
                              </div>
                              <div className="col-lg-3">
                                 <InputField
                                    value={values?.discountPercentage}
                                    label="Discount (%)"
                                    name="discountPercentage"
                                    type="number"
                                    onChange={e => {
                                       if (e.target.value > 0) {
                                          setFieldValue(
                                             'discountPercentage',
                                             e.target.value
                                          );
                                          getPercentageValue(
                                             e.target.value,
                                             subTotal
                                          );
                                       } else {
                                          setFieldValue(
                                             'discountPercentage',
                                             ''
                                          );
                                       }
                                    }}
                                 />
                              </div>
                              <div className="col-lg-9">
                                 <InputField
                                    value={values?.headerRemarks}
                                    label="Remarks"
                                    name="headerRemarks"
                                    type="text"
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="form-group  global-form">
                           <div className="row">
                              <div className="col-lg-3">
                                 <NewSelect
                                    name="supplierName"
                                    options={supplierNameDDL}
                                    value={values?.supplierName}
                                    label="Supplier Name"
                                    onChange={valueOption => {
                                       setFieldValue(
                                          'supplierName',
                                          valueOption
                                       );
                                       setFieldValue(
                                          'supplierContactNo',
                                          valueOption?.strContactNumber || ''
                                       );
                                       setFieldValue(
                                          'supplierEmail',
                                          valueOption?.strEmail || ''
                                       );
                                    }}
                                    isDisabled={id}
                                 />
                              </div>
                              <div className="col-lg-3">
                                 <InputField
                                    value={values?.supplierContactNo}
                                    label="Supplier Contact"
                                    name="supplierContactNo"
                                    type="text"
                                    disabled={id}
                                 />
                              </div>
                              <div className="col-lg-3">
                                 <InputField
                                    value={values?.supplierEmail}
                                    label="Supplier Email"
                                    name="supplierEmail"
                                    type="text"
                                    disabled={id}
                                 />
                              </div>

                              <div className="col-lg-3 d-flex">
                                 <div className={'image-upload-box with-img mt-4'} >
                                    <button
                                       className="btn btn-primary"
                                       onClick={onButtonCVClick}
                                       type="button"
                                       style={{
                                          marginLeft: '10px',
                                          height: '30px',
                                       }}
                                    >
                                       Attachment
                                    </button>
                                    <input
                                       onChange={e => {
                                          // e.stopPropagation();
                                          if (e.target.files?.[0]) {
                                             attachment_action(
                                                e.target.files,
                                                setLoading
                                             )
                                                .then(data => {
                                                   setHeaderAttachment(
                                                      data?.[0]?.id
                                                   );
                                                })
                                                .catch(error => {
                                                   setHeaderAttachment('');
                                                });
                                          }
                                       }}
                                       type="file"
                                       ref={inputCVFile}
                                       id="file"
                                       style={{ display: 'none' }}
                                    />
                                 </div>
                                 {headerAttachment && 
                                  <div className='mt-5 ml-5'>
                                    <IView
                                      title={'Attachment'}
                                      style={{fontSize:"30px !important"}}
                                      classes={'text-primary'}
                                      clickHandler={() => {
                                         dispatch(
                                            getDownlloadFileView_Action(headerAttachment ? headerAttachment : "")
                                         );
                                      }}
                                    />
                                  </div>
                                 }
                              </div>
                           </div>
                        </div>

                        <div className="row">
                           <div className="col-lg-12">
                              <QuotationCreateRowDtoTable
                                 //removeHandler={removeHandler}
                                 rowDto={rowDto}
                                 setRowDto={setRowDto}
                                 values={values}
                                 getPercentageValue={getPercentageValue}
                                 subTotal={subTotal}
                                 selectedBusinessUnit={selectedBusinessUnit}
                                 profileData={profileData}
                              />
                           </div>
                        </div>

                        <button
                           type="submit"
                           style={{ display: 'none' }}
                           ref={objProps?.btnRef}
                           onSubmit={() => handleSubmit()}
                        ></button>

                        <button
                           type="reset"
                           style={{ display: 'none' }}
                           ref={objProps?.resetBtnRef}
                           onSubmit={() => resetForm(initData)}
                        ></button>
                     </Form>
                  </>
               )}
            </Formik>
         </>
      </IForm>
   );
}
