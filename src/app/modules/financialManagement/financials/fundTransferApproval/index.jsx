import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IForm from '../../../_helper/_form';
import IApproval from '../../../_helper/_helperIcons/_approval';
import Loading from '../../../_helper/_loading';
import PaginationSearch from '../../../_helper/_search';
import PaginationTable from '../../../_helper/_tablePagination';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { approveHandeler } from './helper';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import IConfirmModal from '../../../_helper/_confirmModal';
import NewSelect from '../../../_helper/_select';
import InputField from '../../../_helper/_inputField';
import IClose from '../../../_helper/_helperIcons/_close';
import { _todayDate } from '../../../_helper/_todayDate';
import { _monthLastDate } from '../../../_helper/_monthLastDate';

const initData = {
  fundTrasferType: { value: 1, label: 'Contra' },
  fromDate: _todayDate(),
  toDate: _monthLastDate(),
  receivingFromUnit: { value: 0, label: "All" },
  requestedUnit: "",
  status: { value: 0, label: 'Pending' },
};
export default function FundTransferApproval({ viewType }) {
  const { profileData, selectedBusinessUnit, businessUnitList } = useSelector(
    (state) => {
      return state.authData;
    },
    shallowEqual,
  );

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();
  const [, onApproveHandler, approveLoader] = useAxiosPost();

  const saveHandler = (values, cb) => { };

  const getLandingData = (values, pageNo, pageSize, searchValue = '') => {
    const searchTearm = searchValue ? `&search=${searchValue}` : '';
    getGridData(
      `fino/FundManagement/GetFundTransferApprovalPagination?businessUnitId=${values?.requestedUnit?.value || selectedBusinessUnit?.value}&intRequestTypeId=${values?.fundTrasferType?.value}&intRequestToUnitId=${values?.receivingFromUnit?.value || 0}&isApprove=${values?.status?.value || 0}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&viewOrder=desc&pageNo=${pageNo}&pageSize=${pageSize}${searchTearm}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = '') => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  useEffect(() => {
    getLandingData(initData, pageNo, pageSize, '');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...initData, requestedUnit: { value: selectedBusinessUnit?.value, label: selectedBusinessUnit?.label } }}
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
          {(loading || approveLoader) && <Loading />}
          <IForm
            title="Fund Transfer Approval"
            isHiddenBack
            isHiddenReset
            isHiddenSave
          >
            <Form>
              <>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="fundTrasferType"
                      options={[
                        { value: 1, label: 'Contra' },
                        { value: 2, label: 'Inter Company' },
                      ]}
                      value={values?.fundTrasferType}
                      label="Fund Transfer Type"
                      onChange={(valueOption) => {
                        setFieldValue('fundTrasferType', valueOption || '');
                        setGridData([])
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue('fromDate', e.target.value);
                        setGridData([])
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      name="toDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue('toDate', e.target.value);
                        setGridData([])
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="requestedUnit"
                      options={businessUnitList}
                      value={values?.requestedUnit}
                      label="Requested Unit"
                      onChange={(valueOption) => {
                        setFieldValue('requestedUnit', valueOption);
                        setGridData([])
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="receivingFromUnit"
                      options={[{ value: 0, label: "All" }, ...businessUnitList]}
                      value={values?.receivingFromUnit}
                      label="Receiving From Unit"
                      onChange={(valueOption) => {
                        setFieldValue('receivingFromUnit', valueOption);
                        setGridData([])
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="status"
                      options={[
                        { value: 0, label: 'Pending' },
                        { value: 1, label: 'Approved' },
                        { value: 2, label: 'Rejected' },
                      ]}
                      value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        setFieldValue('status', valueOption);
                        setGridData([])
                      }}
                    />
                  </div>

                  <div className="col-lg-3">
                    <button
                      onClick={() => {
                        getLandingData(values, pageNo, pageSize, '');
                      }}
                      type="button"
                      className="btn btn-primary mt-5"
                    >
                      View
                    </button>
                  </div>
                </div>
                {gridData?.data?.length > 0 && (
                  <div className="my-3">
                    <PaginationSearch
                      placeholder="Search..."
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                )}
                {gridData?.data?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Request Code</th>
                          <th>Request Date</th>
                          <th>Request By</th>
                          {values?.fundTrasferType?.value === 2 && (
                            <th>Request To</th>
                          )}
                          <th>From Account/GL</th>
                          <th>To Account/GL</th>
                          <th>Expect Date</th>
                          <th>Amount</th>
                          <th>Responsible</th>
                          <th>Remarks</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.map((item, index) => (
                          <tr key={index}>
                            <td>{item.sl}</td>
                            <td className="text-center">
                              {item.strRequestCode}
                            </td>
                            <td className="text-center">
                              {_dateFormatter(item.dteRequestDate)}
                            </td>
                            <td>{item.strRequestByUnitName}</td>
                            {values?.fundTrasferType?.value === 2 && (
                              <td>{item?.strRequestToUnitName}</td>
                            )}
                            <td>{item?.strTransferBy === "Cash To Bank" ? item?.strRequestGlName : item?.strTransferBy === "Bank To Cash" ? item?.strGivenBankAccountName : item?.strGivenBankName || ""}</td>
                            <td>{item?.strTransferBy === "Bank To Cash" ? item?.strRequestGlName : item?.strTransferBy === "Cash To Bank" ? item?.strGivenBankAccountName || "" : item?.strRequestedBankAccountName || ""}</td>
                            <td className="text-center">
                              {_dateFormatter(item.dteExpectedDate)}
                            </td>
                            <td className="text-right">{item.numAmount}</td>
                            <td>{item.strResponsibleEmpName}</td>
                            <td>{item.strRemarks}</td>
                            <td
                              className={`bold text-center ${item.isApproved === 1
                                ? 'text-success'
                                : item.isApproved === 2
                                  ? 'text-danger'
                                  : 'text-warning'
                                }`}
                            >
                              {item.isApproved === 1
                                ? 'Approved'
                                : item.isApproved === 2
                                  ? 'Rejected'
                                  : 'Pending'}
                            </td>

                            <td className="text-center">
                              {!item.isApproved && (
                                <div className="d-flex justify-content-between">
                                  <span
                                    onClick={() => {
                                      IConfirmModal({
                                        message: `Are you sure to approve?`,
                                        yesAlertFunc: () => {
                                          approveHandeler({
                                            item,
                                            onApproveHandler,
                                            profileData,
                                            cb: () => {
                                              getLandingData(
                                                values,
                                                pageNo,
                                                pageSize,
                                                '',
                                              );
                                            },
                                            isApproved: 1
                                          });
                                        },
                                        noAlertFunc: () => { },
                                      });
                                    }}
                                  >
                                    <IApproval title={'Approve'} />
                                  </span>
                                  <span onClick={() => {
                                    IConfirmModal({
                                      message: `Are you sure to reject?`,
                                      yesAlertFunc: () => {
                                        approveHandeler({
                                          item,
                                          onApproveHandler,
                                          profileData,
                                          cb: () => {
                                            getLandingData(
                                              values,
                                              pageNo,
                                              pageSize,
                                              '',
                                            );
                                          },
                                          isApproved: 2
                                        });
                                      },
                                      noAlertFunc: () => { },
                                    });
                                  }} className='ml-1'>
                                    <IClose
                                      title={'Reject'}
                                      styles={{ fontSize: '16px' }}
                                    />
                                  </span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

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
                    values={values}
                  />
                )}
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
