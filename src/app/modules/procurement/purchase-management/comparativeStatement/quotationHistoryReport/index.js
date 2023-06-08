import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import IForm from '../../../../_helper/_form';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import PaginationTable from '../../../../_helper/_tablePagination';
import IViewModal from '../../../../_helper/_viewModal';
import useAxiosGet from '../../purchaseOrder/customHooks/useAxiosGet';
import { QuotationEntryDetails } from '../quotationEntry/modal/quotationEntryDetails';
const initData = {};

const QuotationHistoryReport = () => {
   const [objProps, setObjprops] = useState({});
   const [rowData, getRowData, lodar] = useAxiosGet();
   const [isQuotationEntryView, setQuotationEntryView] = useState(false);
   const [currentItem, setCurrentItem] = useState(false);
   //const [excelData, getExcelData, excelDataLoader] = useAxiosGet();
   const [pageNo, setPageNo] = useState(0);
   const [pageSize, setPageSize] = useState(15);

   const { profileData } = useSelector(state => {
      return state?.authData;
   }, shallowEqual);

   useEffect(() => {
      getRowData(
         `/procurement/ShipRequestForQuotation/GetShipSupplierWiseClosedRFQ?UserId=${profileData?.userId}&PageNo=${pageNo}&PageSize=${pageSize}`
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [profileData]);

   const setPositionHandler = (pageNo, pageSize, searchValue) => {
      getRowData(
         `/procurement/ShipRequestForQuotation/GetShipSupplierWiseClosedRFQ?UserId=${profileData?.userId}&FromDate=2023-12-01&ToDate=2022-01-01&PageNo=${pageNo}&PageSize=${pageSize}`
      );
   };
   return (
      <Formik
         enableReinitialize={true}
         initialValues={initData}
         onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
               {lodar && <Loading />}
               <IForm
                  title="Quotation History Report"
                  getProps={setObjprops}
                  isHiddenBack
                  isHiddenReset
                  isHiddenSave
               >
                  <div className="row mt-2">
                     <div className="col-lg-2">
                        <InputField
                           value={values?.fromDate}
                           label="From Date"
                           name="fromDate"
                           type="date"
                           onChange={e => {
                              setFieldValue('fromDate', e.target.value);
                           }}
                        />
                     </div>
                     <div className="col-lg-2">
                        <InputField
                           value={values?.toDate}
                           label="To Date"
                           name="toDate"
                           type="date"
                           min={values?.fromDate}
                           onChange={e => {
                              setFieldValue('toDate', e.target.value);
                           }}
                        />
                     </div>
                     <div className="col-lg-2">
                        <button
                           style={{ marginTop: '18px' }}
                           className="btn btn-primary"
                           disabled={false}
                           onClick={() => {
                              let fromDate = values?.fromDate
                                 ? `&FromDate=${values?.fromDate}`
                                 : '';
                              let toDate = values?.toDate
                                 ? `&ToDate=${values?.toDate}`
                                 : '';
                              getRowData(
                                 `/procurement/ShipRequestForQuotation/GetShipSupplierWiseClosedRFQ?UserId=${profileData?.userId}${fromDate}${toDate}&PageNo=${pageNo}&PageSize=${pageSize}`
                              );
                           }}
                        >
                           Show
                        </button>
                     </div>
                  </div>
                  <div className="mt-2">
                     <div className="mt-3">
                        <table
                           id="table-to-xlsx"
                           className="table table-striped mt-2 table-bordered bj-table bj-table-landing"
                        >
                           <thead>
                              <tr>
                                 <th>RFQ Type</th>
                                 <th>RFQ Code</th>
                                 <th>RFQ Date</th>
                                 <th>Currency</th>
                                 <th>Quotation Start Date</th>
                                 <th>Quotation End Date</th>
                                 <th>Action</th>
                              </tr>
                           </thead>
                           <tbody>
                              {rowData?.data?.map((itm, idx) => {
                                 return (
                                    <tr key={idx}>
                                       <td>{itm?.rfqTypeName}</td>
                                       <td>
                                          {itm?.strRequestForQuotationCode}
                                       </td>
                                       <td>{_dateFormatter(itm?.rfqdate)}</td>
                                       <td>{itm?.currencyCode}</td>
                                       <td>{_dateFormatter(itm?.startDate)}</td>
                                       <td>{_dateFormatter(itm?.endDate)}</td>
                                       <td className="text-center">
                                          <span
                                             onClick={e => {
                                                setCurrentItem(itm);
                                                setQuotationEntryView(true);
                                             }}
                                          >
                                             <OverlayTrigger
                                                overlay={
                                                   <Tooltip id="cs-icon">
                                                      {'View'}
                                                   </Tooltip>
                                                }
                                             >
                                                <span>
                                                   <i className="fa pointer fa-eye ml-3"></i>
                                                </span>
                                             </OverlayTrigger>
                                          </span>
                                       </td>
                                    </tr>
                                 );
                              })}
                           </tbody>
                        </table>
                        <IViewModal
                           show={isQuotationEntryView}
                           onHide={() => setQuotationEntryView(false)}
                           title="Item List For Quotation Entry"
                        >
                           <QuotationEntryDetails
                              currentItem={currentItem}
                              isHiddenBackBtn={true}
                           />
                        </IViewModal>
                        {rowData?.data?.length > 0 && (
                           <PaginationTable
                              count={rowData?.totalCount}
                              setPositionHandler={setPositionHandler}
                              paginationState={{
                                 pageNo,
                                 setPageNo,
                                 pageSize,
                                 setPageSize,
                              }}
                           />
                        )}
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
               </IForm>
            </>
         )}
      </Formik>
   );
};

export default QuotationHistoryReport;
