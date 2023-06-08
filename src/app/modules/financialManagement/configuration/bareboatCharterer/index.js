import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IForm from '../../../_helper/_form';
import IEdit from '../../../_helper/_helperIcons/_edit';
import Loading from '../../../_helper/_loading';
import PaginationTable from '../../../_helper/_tablePagination';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';

const initData = {};

export default function BareboatInsuranceConfig() {
   // get user profile data from store
   const { profileData, selectedBusinessUnit } = useSelector(state => {
      return state.authData;
   }, shallowEqual);

   const [viewType, setViewType] = useState(1);
   //paginationState
   const [pageNo, setPageNo] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(75);

   const [gridData, getGridData, gridLoading] = useAxiosGet([]);

   const getLandingData = () => {
      getGridData(
         `/fino/BareBoatManagement/GetBasreBoatConfigLanding?BusinessUnitId=${
            selectedBusinessUnit?.value
         }&CategoryType=${
            viewType === 1 ? 1 : 2
         }&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}`
      );
   };

   useEffect(() => {
      getLandingData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [profileData, selectedBusinessUnit, viewType]);

   //setPositionHandler
   const setPositionHandler = (pageNo, pageSize) => {
      getGridData(
         `/fino/BareBoatManagement/GetBasreBoatConfigLanding?BusinessUnitId=${
            selectedBusinessUnit?.value
         }&CategoryType=${
            viewType === 1 ? 1 : 2
         }&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}`
      );
   };

   const saveHandler = (values, cb) => {};

   const history = useHistory();
   return (
      <Formik
         enableReinitialize={true}
         initialValues={{}}
         // validationSchema={{}}
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
               {gridLoading && <Loading />}
               <IForm
                  title="Bareboat Management and Insurance Configuration"
                  isHiddenReset
                  isHiddenBack
                  isHiddenSave
                  renderProps={() => {
                     return (
                        <div>
                           <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => {
                                 history.push(
                                    '/financial-management/configuration/bareboatCharterConfig/create'
                                 );
                              }}
                           >
                              Create
                           </button>
                        </div>
                     );
                  }}
               >
                  <Form>
                     <div className="col-lg-4 mb-2 mt-5">
                        <label className="mr-3">
                           <input
                              type="radio"
                              name="viewType"
                              checked={viewType === 1}
                              className="mr-1 pointer"
                              style={{ position: 'relative', top: '2px' }}
                              onChange={valueOption => {
                                 setViewType(1);
                              }}
                           />
                           Bareboat Management
                        </label>
                        <label>
                           <input
                              type="radio"
                              name="viewType"
                              checked={viewType === 2}
                              className="mr-1 pointer"
                              style={{ position: 'relative', top: '2px' }}
                              onChange={e => {
                                 setViewType(2);
                              }}
                           />
                           Insurance
                        </label>
                     </div>
                     {/* <div className="row global-form">
                    
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipment"
                        options={shipmentDDL || []}
                        label="Shipment No"
                        value={values?.shipment}
                        onChange={(valueOption) => {
                          setFieldValue("shipment", valueOption);
                        //   getGrid(values?.poLc?.label, valueOption?.value);
                          // getLandingData(
                          //   profileData?.accountId,
                          //   selectedBusinessUnit?.value,
                          //   valueOption?.value,
                          //   values?.poLc?.label,
                          //   pageSize,
                          //   pageNo,
                          //   setGridData
                          // );
                        }}
                        placeholder="Shipment"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2 pt-5 mt-1">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                           getLandingData(
                              values?.poLc?.poId,
                              values?.shipment?.value
                           );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div> */}

                     <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                           <tr>
                              <th>SL</th>
                              <th>Vessel Name</th>
                              <th>Particulars </th>
                              {viewType === 2 && (
                                 <th>Insurance Type</th>
                              )}
                              <th>Fee Per Day/Month </th>
                              <th>Base Type </th>
                              <th>Duration </th>
                              <th>Action </th>
                           </tr>
                        </thead>
                        <tbody>
                           {gridData?.data?.map((item, index) => (
                              <tr key={index}>
                                 <td>
                                    <div className="text-left">{index + 1}</div>
                                 </td>
                                 <td>
                                    <div className="text-left">
                                       {item?.vesselName}
                                    </div>
                                 </td>
                                 <td>
                                    <div className="text-left">
                                       {viewType === 1
                                          ? item?.businessTransactionName
                                          : item?.strSupplierName}
                                    </div>
                                 </td>
                                 {viewType === 2 && (
                                    <td>
                                       {item?.strInsuranceName}
                                    </td>
                                 )}
                                 <td>
                                    <div className="text-right">
                                       {item?.rate}
                                    </div>
                                 </td>
                                 <td>
                                    <div className="text-center">
                                       {item?.baseName}
                                    </div>
                                 </td>
                                 <td>
                                    <div className="text-center">
                                       {viewType === 2
                                          ? `${_dateFormatter(
                                               item?.dteFromDate
                                            )} - ${_dateFormatter(
                                               item?.dteToDate
                                            )}`
                                          : ''}
                                    </div>
                                 </td>
                                 <td className='text-center'>
                                    <IEdit
                                       onClick={() => {
                                          history.push({
                                             pathname: `/financial-management/configuration/bareboatCharterConfig/edit/${item?.id}`,
                                          });
                                       }}
                                    ></IEdit>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>

                     {/* Pagination Code */}
                     {gridData?.data?.length > 0 && (
                        <PaginationTable
                           count={gridData?.totalCount}
                           setPositionHandler={setPositionHandler}
                           paginationState={{
                              pageNo,
                              setPageNo,
                              pageSize,
                              setPageSize,
                           }}
                        />
                     )}
                  </Form>
               </IForm>
            </>
         )}
      </Formik>
   );
}
