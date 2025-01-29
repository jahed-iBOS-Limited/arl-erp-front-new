import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IForm from '../../../_helper/_form';
import IView from '../../../_helper/_helperIcons/_view';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import PaginationTable from '../../../_helper/_tablePagination';
import { _todayDate } from '../../../_helper/_todayDate';

const initData = {
   fromDate: _todayDate(),
   toDate: _todayDate(),
};
export default function HistoryAssetDepreciation() {
   const [pageNo, setPageNo] = useState(0);
   const [pageSize, setPageSize] = useState(15);
   const [rowData, getRowData, lodar] = useAxiosGet();
   const history = useHistory()

   const selectedBusinessUnit = useSelector(state => {
      return state.authData.selectedBusinessUnit;
   }, shallowEqual);

   useEffect(() => {
      getRowData(
         `/asset/Asset/GetAssetDepreciationLanding?FromDate=${initData?.fromDate}&ToDate=${initData?.toDate}&BusinessUnit=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=ASC`
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const setPositionHandler = (pageNo, pageSize, values, searchValue) => {
      getRowData(
         `/asset/Asset/GetAssetDepreciationLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&BusinessUnit=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=ASC`
      );
   };

//    const [id, setId] = useState('');
//    const [show, setShow] = useState(false);
   // eslint-disable-next-line no-unused-vars
   const [objProps, setObjprops] = useState({});
   return (
      <IForm
        title={'Asset Depreciation History'}
        getProps={setObjprops}
        isHiddenReset={true}
        isHiddenBack={true}
        isHiddenSave={true}
      >
         <Formik
            enableReinitialize={true}
            initialValues={initData}
            onSubmit={() => {}}
         >
            {({ values, setFieldValue }) => (
               <>
                  {lodar && <Loading />}
                  <div className="form-group  global-form">
                     <div className="row">
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
                              onChange={e => {
                                 setFieldValue('toDate', e.target.value);
                              }}
                           />
                        </div>
                        <div className="col-lg-2">
                           <button
                              style={{ marginTop: '18px' }}
                              className="btn btn-primary ml-2"
                              disabled={false}
                              onClick={() => {
                                 getRowData(
                                    `/asset/Asset/GetAssetDepreciationLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&BusinessUnit=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=ASC`
                                 );
                              }}
                           >
                              Show
                           </button>
                        </div>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-lg-12">
                       <div className="table-responsive">
                       <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                           <thead>
                              <tr>
                                 <th style={{ width: '30px' }}>SL</th>
                                 <th>SBU Name</th>
                                 <th>Transaction Date</th>
                                 <th>Adjustment Journal Code</th>
                                 <th style={{ width: '50px' }}>Action</th>
                              </tr>
                           </thead>
                           <tbody>
                              {rowData?.data?.length > 0 &&
                                 rowData?.data?.map((item, index) => (
                                    <tr key={index}>
                                       <td>{index + 1}</td>
                                       <td>{item?.strSBUName}</td>
                                       <td className="text-center">
                                          {_dateFormatter(
                                             item?.dteTransactionDate
                                          )}
                                       </td>
                                       <td className="text-center">
                                          {item?.strAdjustmentJournalCode}
                                       </td>
                                       <td className="text-center">
                                          <IView
                                             clickHandler={() => {
                                               // setId(item?.intDepreciationId);
                                                history.push(`/mngAsset/report/HistoryAssetDepreciation/view/${item?.intDepreciationId}`)
                                               // setShow(true);
                                             }}
                                          />
                                       </td>
                                    </tr>
                                 ))}
                           </tbody>
                        </table>
                       </div>
                        {/* <IViewModal show={show} onHide={() => setShow(false)}>
                           <AssetDepreciationModal id={id} />
                        </IViewModal> */}
                        {rowData?.data?.length > 0 && (
                           <PaginationTable
                              count={rowData?.data?.length}
                              setPositionHandler={setPositionHandler}
                              paginationState={{
                                 pageNo,
                                 setPageNo,
                                 pageSize,
                                 setPageSize,
                              }}
                              values={values}
                           />
                        )}
                     </div>
                  </div>
               </>
            )}
         </Formik>
      </IForm>
   );
}
