/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import {
   Card,
   CardBody,
   CardHeader,
   CardHeaderToolbar,
   ModalProgressBar,
} from '../../../../../_metronic/_partials/controls';
import NewSelect from '../../../_helper/_select';
import Table from './table/table';
import PaginationTable from '../../../_helper/_tablePagination';
import Loading from '../../../_helper/_loading';
import {
   cancelAccountingJournalTax,
   cashJournalSbuApi,
   getAccountJournalLandingData,
   getJournalTypeDDL,
} from './helper';
import '../../../financialManagement/financials/adjustmentJournal/adjustmentJournal.css';
import { useHistory } from 'react-router-dom';
import InputField from '../../../_helper/_inputField';
import { IInput } from '../../../_helper/_input';
import { SetAccountingJournalLandingAction } from '../../../_helper/reduxForLocalStorage/Actions';
import IConfirmModal from '../../../_helper/_confirmModal';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';

const AccountJournal = () => {
   const history = useHistory();
   const dispatch = useDispatch();
   const { accountingJournalLanding } = useSelector(
      state => state.localStorage
   );

   const [loading, setLoading] = useState(false);
   const [journalTypeDDL, setJournalTypeDDL] = useState([]);
   const [sbuDDL, setSbuDDL] = useState([]);
   const [rowData, setRowData] = useState([]);
   const [pageNo, setPageNo] = useState(0);
   const [pageSize, setPageSize] = useState(15);
   const [, createTransferJournelToTaxAcc] = useAxiosPost()

   const { profileData, selectedBusinessUnit } = useSelector(state => {
      return state.authData;
   }, shallowEqual);

   useEffect(() => {
      getJournalTypeDDL(setJournalTypeDDL);
      cashJournalSbuApi(
         profileData?.accountId,
         selectedBusinessUnit?.value,
         setSbuDDL
      );
   }, []);

   useEffect(() => {
      getAccountJournalLandingData({
         buId: selectedBusinessUnit?.value,
         sbuId: accountingJournalLanding?.sbu?.value,
         journalTypeId: accountingJournalLanding?.journalType?.value,
         voucherCode: accountingJournalLanding?.code,
         fromDate: accountingJournalLanding?.fromDate,
         toDate: accountingJournalLanding?.toDate,
         pageNo,
         pageSize,
         setter: setRowData,
         setLoading,
      });
   }, []);

   const getGridData = (values, pageNo, pageSize) => {
      getAccountJournalLandingData({
         buId: selectedBusinessUnit?.value,
         sbuId: values?.sbu?.value,
         journalTypeId: values?.journalType?.value,
         voucherCode: values?.code,
         fromDate: values?.fromDate,
         toDate: values?.toDate,
         pageNo,
         pageSize,
         setter: setRowData,
         setLoading,
      });
   };

   const setPositionHandler = (pageNo, pageSize, values) => {
      getGridData(values, pageNo, pageSize);
   };

   const updatePopUp = (values, code = '') => {
      let confirmObject = {
         title: 'Delete Action',
         closeOnClickOutside: false,
         message: 'Are you sure you want to Delete?',
         yesAlertFunc: () => {
            const deleteData = rowData?.data
               ?.filter(data => data?.isSelect)
               .map(itm => itm?.strAccountingJournalCode);
            const payload = {
               businessUnitId: selectedBusinessUnit?.value,
               accountingJournalCode: code ? [code] : deleteData,
               isActive: false,
            };
            cancelAccountingJournalTax(
               payload,
               () => {
                  getGridData(values, pageNo, pageSize);
               },
               setLoading
            );
         },
         noAlertFunc: () => {},
      };
      IConfirmModal(confirmObject);
   };

   const reversePopUp = (values, code = '') => {
      let confirmObject = {
         title: 'Reverse Action',
         closeOnClickOutside: false,
         message: 'Are you sure you want to Reverse?',
         yesAlertFunc: () => {
            const reverseData = rowData?.data
               ?.filter(data => data?.isSelect)
               .map(itm => itm?.strAccountingJournalCode);
            const payload = {
               businessUnitId: selectedBusinessUnit?.value,
               accountingJournalCode: code ? [code] : reverseData,
               isActive: false,
               isForceActive: true
            };
            cancelAccountingJournalTax(
               payload,
               () => {
                  getGridData(values, pageNo, pageSize);
               },
               setLoading
            );
         },
         noAlertFunc: () => {},
      };
      IConfirmModal(confirmObject);
   };

   const createTransferJournelToTaxAccConfirmation = (values) => {
      let confirmObject = {
         title: 'Create Transfer Journal To Tax Acc',
         closeOnClickOutside: false,
         message: 'Are you sure you want to Create?',
         yesAlertFunc: () => {
            createTransferJournelToTaxAcc(`/fino/TransferJournalToTaxAcc/CreateTransferJournalToTaxAcc?BusinessUnitId=${selectedBusinessUnit?.value}&ActionById=${profileData?.userId}`,
               [
                  {
                    journalCode: values?.code || "",
                  }
                ],
                  () => {getGridData(values, pageNo, pageSize);},
                  true,
               )
         },
         noAlertFunc: () => {},
      };
      IConfirmModal(confirmObject);
   };

   const deleteIcon = rowData?.data?.find(itm => itm?.isSelect === true);

   return (
      <>
         <Formik
            enableReinitialize={true}
            initialValues={accountingJournalLanding}
            // validationSchema={{}}
            onSubmit={values => {}}
         >
            {({
               handleSubmit,
               resetForm,
               values,
               errors,
               touched,
               setFieldValue,
               isValid,
            }) => (
               <div>
                  {loading && <Loading />}
                  <Card>
                     {true && <ModalProgressBar />}
                     <CardHeader title="Account Journal">
                        <CardHeaderToolbar>
                           <button
                              onClick={() => {
                                 // dispatch(
                                 //   setCashJournalLandingAction({ ...values, code: "" })
                                 // );
                                 if (
                                    [1, 2, 3].includes(
                                       values?.journalType?.value
                                    )
                                 ) {
                                    history.push({
                                       pathname: `/mngVat/tax-financial/account-journalCreate/cashJournalCreate`,
                                       state: {
                                          ...values,
                                          accountingJournalTypeId:
                                             values?.journalType?.value,
                                       },
                                    });
                                 } else if (
                                    [4, 5, 6].includes(
                                       values?.journalType?.value
                                    )
                                 ) {
                                    history.push({
                                       pathname: `/mngVat/tax-financial/account-journalCreate/bankJournalCreate`,
                                       state: {
                                          ...values,
                                          accountingJournalTypeId:
                                             values?.journalType?.value,
                                       },
                                    });
                                 } else if (values?.journalType?.value === 7) {
                                    history.push({
                                       pathname: `/mngVat/tax-financial/account-journalCreate/adjustmentJournalCreate`,
                                       state: {
                                          ...values,
                                          accountingJournalTypeId:
                                             values?.journalType?.value,
                                       },
                                    });
                                 }
                              }}
                              className="btn btn-primary"
                              disabled={!values?.sbu || !values?.journalType}
                           >
                              Create
                           </button>
                        </CardHeaderToolbar>
                     </CardHeader>
                     <CardBody>
                        <Form className="form form-label-right">
                           <div className="form-group row global-form">
                              <div className="col-lg-3">
                                 <NewSelect
                                    isSearchable={true}
                                    options={sbuDDL || []}
                                    name="sbu"
                                    onChange={valueOption => {
                                       setFieldValue('sbu', valueOption);
                                       setRowData([]);
                                    }}
                                    placeholder="SBU"
                                    value={values?.sbu}
                                    errors={errors}
                                    touched={touched}
                                 />
                              </div>
                              <div className="col-lg-3">
                                 <NewSelect
                                    isSearchable={true}
                                    options={
                                       journalTypeDDL?.filter(
                                          item =>
                                             item?.value !== 3 &&
                                             item?.value !== 6
                                       ) || []
                                    }
                                    name="journalType"
                                    placeholder="Type"
                                    onChange={valueOption => {
                                       setFieldValue(
                                          'journalType',
                                          valueOption
                                       );
                                       setRowData([]);
                                    }}
                                    value={values?.journalType}
                                    errors={errors}
                                    touched={touched}
                                 />
                              </div>
                              <div className="col-lg-3">
                                 <label>From Date</label>
                                 <InputField
                                    value={values?.fromDate}
                                    name="fromDate"
                                    placeholder="From Date"
                                    type="date"
                                    onChange={e => {
                                       setFieldValue(
                                          'fromDate',
                                          e.target.value
                                       );
                                    }}
                                 />
                              </div>
                              <div className="col-lg-3">
                                 <label>To Date</label>
                                 <InputField
                                    value={values?.toDate}
                                    name="toDate"
                                    placeholder="To Date"
                                    min={values?.fromDate}
                                    type="date"
                                    onChange={e => {
                                       setFieldValue('toDate', e.target.value);
                                    }}
                                 />
                              </div>
                              <div className="d-flex align-items-end pt-1">
                                 <div
                                    className="mr-2 pl-4 "
                                    style={{
                                       width: '175px',
                                       position: 'relative',
                                    }}
                                 >
                                    <span style={{ paddingRight: '10px' }}>
                                       Journal Code
                                    </span>
                                    <IInput value={values?.code} name="code" />

                                    <i
                                       class="fas fa-search"
                                       style={{
                                          position: 'absolute',
                                          right: '4px',
                                          top: '21px',
                                          fontSize: '13px',
                                       }}
                                    ></i>
                                 </div>
                                 <div className=" d-flex justify-content-end align-items-center ">
                                    <button
                                       type="button"
                                       onClick={() => {
                                          getGridData(values, pageNo, pageSize);
                                          dispatch(
                                             SetAccountingJournalLandingAction(
                                                values
                                             )
                                          );
                                       }}
                                       className="btn btn-primary mt-2"
                                       disabled={
                                          !values?.sbu || !values?.journalType
                                       }
                                    >
                                       View
                                    </button>

                                    <button
                                       type="button"
                                       onClick={() => {
                                          createTransferJournelToTaxAccConfirmation(values);
                                       }}
                                       className="btn btn-primary mt-2 ml-4"
                                       disabled={
                                          !values?.sbu || !values?.journalType || !values?.code
                                       }
                                    >
                                       Create
                                    </button>

                                    {deleteIcon ? (
                                       <>
                                          <button
                                             type="button"
                                             onClick={() => {
                                                updatePopUp(values);
                                             }}
                                             className="btn btn-primary mt-2 ml-4"
                                             disabled={false}
                                          >
                                             Delete
                                          </button>

                                          <button
                                             type="button"
                                             onClick={() => {
                                                reversePopUp(values);
                                             }}
                                             className="btn btn-success mt-2 ml-4"
                                             disabled={false}
                                          >
                                             Reverse
                                          </button>
                                       </>
                                    ) : null}
                                 </div>
                              </div>
                           </div>
                        </Form>
                        {rowData?.data?.length > 0 && (
                           <div>
                              <Table
                                 values={values}
                                 rowData={rowData?.data}
                                 setRowData={setRowData}
                                 updatePopUp={updatePopUp}
                                 reversePopUp={reversePopUp}
                              ></Table>
                           </div>
                        )}
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
                              values={values}
                           />
                        )}
                     </CardBody>
                  </Card>
               </div>
            )}
         </Formik>
      </>
   );
};

export default AccountJournal;
