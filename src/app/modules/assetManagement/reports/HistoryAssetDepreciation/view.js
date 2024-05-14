import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { useHistory, useParams } from 'react-router-dom';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IForm from '../../../_helper/_form';
import Loading from '../../../_helper/_loading';

const AssetDepreciationHistoryView = () => {
   const [rowData, getRowData, lodar] = useAxiosGet();
   const { id } = useParams();
   const history= useHistory()
   // eslint-disable-next-line no-unused-vars
   const [objProps, setObjprops] = useState({});
   useEffect(() => {
      getRowData(`/asset/Asset/GetAssetDepreciation?IntDepreciationId=${id}`);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const totalDepreciation = rowData?.reduce(
      (acc, data) => acc + +data?.numDepreciation,
      0
    )
   return (
      <IForm
        customTitle={'Asset Depreciation History View'}
        getProps={setObjprops}
        isHiddenReset={true}
        isHiddenSave={true}
        isHiddenBack={true}
        renderProps={() => (
         <>
            <button
               type='button'
               onClick={() => history.goBack()}
               className='btn btn-secondary back-btn ml-2'
            >
               <i className='fa fa-arrow-left mr-1'></i>
                  Back
            </button>
           <ReactHtmlTableToExcel
             id='test-table-xls-button'
             className='download-table-xls-button btn btn-primary ml-2'
             table='table-to-xlsx'
             filename='tablexls'
             sheet='tablexls'
             buttonText='Export Excel'
           />
           
         </>
       )}
      >
         <Formik
            enableReinitialize={true}
            initialValues={{}}
            onSubmit={() => {}}
         >
            {({ values, setFieldValue }) => (
               <>
                  {lodar && <Loading />}
                  <div className="row">
                     <div className="col-lg-12">
                     <div className="table-responsive">
                     <table id="table-to-xlsx" className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                           <thead>
                              <tr>
                                 <th style={{ width: '30px' }}>SL</th>
                                 <th>Asset Code</th>
                                 <th>Asset Name</th>
                                 <th>Category Name</th>
                                 <th>Period From</th>
                                 <th>Period To</th>
                                 <th>Depreciation</th>
                              </tr>
                           </thead>
                           <tbody>
                              {rowData?.length > 0 &&
                                 rowData?.map((item, index) => (
                                    <tr key={index}>
                                       <td>{index + 1}</td>
                                       <td className="text-center">
                                          {item?.strAssetCode}
                                       </td>
                                       <td>{item?.strAssetName}</td>
                                       <td>{item?.strItemCategoryName}</td>
                                       <td
                                          style={{ width: '100px' }}
                                          className="text-center"
                                       >
                                          {_dateFormatter(item?.dtePeriodFrom)}
                                       </td>
                                       <td
                                          style={{ width: '100px' }}
                                          className="text-center"
                                       >
                                          {_dateFormatter(item?.dtePeriodTo)}
                                       </td>
                                       <td className="text-right">
                                          {item?.numDepreciation.toFixed(2)}
                                       </td>
                                    </tr>
                                 ))}
                                 <tr>
                                    <td className="text-right font-weight-bold" colSpan={6}>Grand Total</td>
                                    <td className="text-right font-weight-bold">{(totalDepreciation || 0).toFixed(2)}</td>
                                 </tr>
                           </tbody>
                        </table>
                     </div>
                     </div>
                  </div>
               </>
            )}
         </Formik>
      </IForm>
   );
};

export default AssetDepreciationHistoryView;
