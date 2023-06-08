import { Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import IForm from '../../../../_helper/_form';
import IView from '../../../../_helper/_helperIcons/_view';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions';
import { _todayDate } from '../../../../_helper/_todayDate';
import { attachment_action } from './helper';
import NegotiationCreateRowDtoTable from './negotiationCreateTable';

const initData = {
   transportCost: '',
   othersCost: '',
   negotiationRate: '',
   discountPercentage: '',
   headerRemarks: '',
};
export default function ShippingNegotiationCreate() {
   const [objProps, setObjprops] = useState({});
   const [loading, setLoading] = useState(false);
   const location = useLocation();
   const dispatch = useDispatch()
   const [
      negotiationItemList,
      getNegotiationItemList,
      getLoading,
      setNegotiationItemList,
   ] = useAxiosGet([]);
   const [, saveNegotiation, saveLoading] = useAxiosPost([]);
   const [headerAttachment, setHeaderAttachment] = useState('');

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
      getNegotiationItemList(
         `/procurement/ShipRequestForQuotation/GetRequestForQuatationEntryShipById?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&RequestForQuotationId=${location?.rowDetails?.intRequestForQuotationId}&PartnerRfqId=${location?.rowDetails?.intPartnerRfqid}`,
         data => {
            let modifyRowData = data?.objSupplierRow.map(item => ({
               ...item,
               numAmount:
                  +item?.numNegotiationRate > 0
                     ? (+item?.numNegotiationRate || 0) *
                       (+item?.numRequestQuantity || 0)
                     : (+item?.numRate || 0) * (+item?.numRequestQuantity || 0),
               negotiationRate:
                  item?.numNegotiationRate > 0
                     ? item?.numNegotiationRate
                     : item?.numRate,
            }));
            setNegotiationItemList({
               ...data,
               objSupplierRow: modifyRowData || [],
            });
            setHeaderAttachment(data?.objSuplierHeader?.strHeaderAttachment)
         }
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [profileData, selectedBusinessUnit, location]);

   const saveHandler = async (values, cb) => {
      if (negotiationItemList?.objSupplierRow?.length < 0)
         return toast.warn("You don't entry Negotiation without List");
      const negotiationRowList = negotiationItemList?.objSupplierRow?.map(
         itm => {
            return {
               intNegotiationRowId: 0,
               intNegotiationHeaderId: 0,
               strPrreferenceCode: itm?.strPrreferenceCode || '',
               intItemId: itm?.intItemId || 0,
               strItemCode: itm?.strItemCode || '',
               strItemName: itm?.strItemName || '',
               numRate: +itm?.negotiationRate || 0,
               strRemarks: itm?.strRemarks || '',
               strAttachment: itm?.strAttachment || '',
               isActive: true,
               dteServerDateTime: _todayDate,
            };
         }
      );

      const payload = {
         intNegotiationHeaderId: 0,
         intAccountId: profileData?.accountId,
         intBusinessUnitId: selectedBusinessUnit?.value,
         intRequestForQuotationId:
            negotiationItemList?.objSuplierHeader?.intRequestForQuotationId,
         strRequestForQuotationCode:
            negotiationItemList?.objSuplierHeader?.strRequestForQuotationCode,
         intPartnerRfqid:
            negotiationItemList?.objSuplierHeader?.intPartnerRfqid,
         intBusinessPartnerId:
            negotiationItemList?.objSuplierHeader?.intBusinessPartnerId,
         strBusinessPartnerName:
            negotiationItemList?.objSuplierHeader?.strBusinessPartnerName,
         intUser: profileData?.userId,
         dteSupplierEntryDate:
            negotiationItemList?.objSuplierHeader?.dteSupplierRefDate,
         numTransportCost: +values?.transportCost || 0,
         numOthersCost: +values?.othersCost || 0,
         numDiscountPercentage: +values?.discountPercentage || 0,
         strRemarks: values.headerRemarks,
         strHeaderAttachment: headerAttachment,
         dteUserEntryDate: _todayDate,
         dteServerDateTime: _todayDate,
         isActive: true,
         negotiationRows: negotiationRowList,
      };
      saveNegotiation(
         `/procurement/ShipRequestForQuotation/CreateRFQNegotiationShip`,
         payload,
         cb,
         true
      );
   };

   return (
      <IForm title="Negotiation Entry" getProps={setObjprops}>
         {(loading || saveLoading || getLoading) && <Loading />}
         <>
            <Formik
               enableReinitialize={true}
               initialValues={{
                  ...initData,
                  supplierQuotationNo:
                     negotiationItemList?.objSuplierHeader?.strSupplierRefNo,
                  quotationDate: _dateFormatter(
                     negotiationItemList?.objSuplierHeader?.dteSupplierRefDate
                  ),
                  supplierName:
                     negotiationItemList?.objSuplierHeader
                        ?.strBusinessPartnerName,
                  supplierContactNo:
                     negotiationItemList?.objSuplierHeader?.strContactNumber,
                  supplierEmail:
                     negotiationItemList?.objSuplierHeader?.strEmail,
                  transportCost:
                     negotiationItemList?.objSuplierHeader?.numTransportCost,
                  othersCost:
                     negotiationItemList?.objSuplierHeader?.numOthersCost,
                  discountPercentage:
                     negotiationItemList?.objSuplierHeader
                        ?.numDiscountPercentage,
                  headerRemarks:
                     negotiationItemList?.objSuplierHeader?.strRemarks,
               }}
               onSubmit={(values, { setSubmitting, resetForm }) => {
                  saveHandler(values, () => {
                     resetForm(initData);
                     setNegotiationItemList([]);
                     setHeaderAttachment("")
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
                                 {
                                    negotiationItemList?.objHeader
                                       ?.strRequestForQuotationCode
                                 }
                              </div>
                              <div className="col-lg-3">
                                 RFQ Date:{' '}
                                 {_dateFormatter(
                                    negotiationItemList?.objHeader?.dteRfqdate
                                 )}
                              </div>
                              <div className="col-lg-3">
                                 Currency:{' '}
                                 {
                                    negotiationItemList?.objHeader
                                       ?.strCurrencyCode
                                 }
                              </div>
                              <div className="col-lg-3">
                                 Delivery Address:{' '}
                                 {
                                    negotiationItemList?.objHeader
                                       ?.strDeliveryAddress
                                 }
                              </div>
                              <div className="col-lg-3">
                                 Quotation Start Date:{' '}
                                 {`${
                                    negotiationItemList?.objHeader?.quotationStartDateTime?.split(
                                       'T'
                                    )[0]
                                 } / ${
                                    negotiationItemList?.objHeader?.quotationStartDateTime?.split(
                                       'T'
                                    )[1]
                                 }`}
                              </div>
                              <div className="col-lg-3">
                                 Quotation End Date:{' '}
                                 {`${
                                    negotiationItemList?.objHeader?.quotationEndDateTime?.split(
                                       'T'
                                    )[0]
                                 } / ${
                                    negotiationItemList?.objHeader?.quotationEndDateTime?.split(
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
                                    disabled
                                 />
                              </div>
                              <div className="col-lg-3">
                                 <InputField
                                    value={values?.quotationDate}
                                    label="Quotation Date"
                                    name="quotationDate"
                                    type="date"
                                    disabled
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
                                 <InputField
                                    value={values?.supplierName}
                                    label="Supplier Name"
                                    name="supplierName"
                                    type="text"
                                    disabled
                                 />
                              </div>
                              <div className="col-lg-3">
                                 <InputField
                                    value={values?.supplierContactNo}
                                    label="Supplier Contact"
                                    name="supplierContactNo"
                                    type="text"
                                    disabled
                                 />
                              </div>
                              <div className="col-lg-3">
                                 <InputField
                                    value={values?.supplierEmail}
                                    label="Supplier Email"
                                    name="supplierEmail"
                                    type="text"
                                    disabled
                                 />
                              </div>
                              <div className="col-lg-3 d-flex justify content-between">
                                 <div
                                    className={'image-upload-box with-img mt-4'}
                                 >
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
                                 {(negotiationItemList?.objSuplierHeader?.strHeaderAttachment || headerAttachment) && 
                                  <div className='mt-5 ml-5'>
                                    <IView
                                      title={'Attachment'}
                                      style={{fontSize:"30px !important"}}
                                      classes={'text-primary'}
                                      clickHandler={() => {
                                         dispatch(
                                            getDownlloadFileView_Action(headerAttachment ? headerAttachment : negotiationItemList?.objSuplierHeader?.strHeaderAttachment || "")
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
                              <NegotiationCreateRowDtoTable
                                 //removeHandler={removeHandler}
                                 negotiationItemList={negotiationItemList}
                                 setNegotiationItemList={setNegotiationItemList}
                                 values={values}
                                 selectedBusinessUnit={selectedBusinessUnit}
                                 profileData={profileData}
                                 discountPercentage={+values?.discountPercentage || 0}
                                 transportCost={+values?.transportCost || 0}
                                 othersCost={+values?.othersCost || 0}
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
