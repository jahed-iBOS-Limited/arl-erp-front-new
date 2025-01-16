import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from "react-router";
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IForm from '../../../_helper/_form';
import IAdd from '../../../_helper/_helperIcons/_add';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import { _monthLastDate } from '../../../_helper/_monthLastDate';
import PaginationSearch from '../../../_helper/_search';
import NewSelect from '../../../_helper/_select';
import PaginationTable from '../../../_helper/_tablePagination';
import { _todayDate } from '../../../_helper/_todayDate';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';



const initData = {
    fundTrasferType: { value: 1, label: 'Contra' },
    fromDate: _todayDate(),
    toDate: _monthLastDate(),
    requestingUnit: { value: 0, label: "All" },
    status: { value: 0, label: 'Pending' },
};
export default function FundTransferApproval({ viewType }) {
    const { selectedBusinessUnit, businessUnitList } = useSelector(
        (state) => {
            return state.authData;
        },
        shallowEqual,
    );

    let history = useHistory()

    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [gridData, getGridData, loading, setGridData] = useAxiosGet();


    const saveHandler = (values, cb) => { };

    const getLandingData = (values, pageNo, pageSize, searchValue = '') => {
        const searchTearm = searchValue ? `&search=${searchValue}` : '';
        const isTransferCreated = values?.status?.value === null ? "" : `&isTransferCreated=${values?.status?.value}`;
        getGridData(
            `fino/FundManagement/GetFundTransferApprovaListForCreatePagination?businessUnitId=${selectedBusinessUnit?.value}&intRequestTypeId=${values?.fundTrasferType?.value}&intRequestToUnitId=${values?.requestingUnit?.value || 0}&isApprove=1&fromDate=${values?.fromDate}&toDate=${values?.toDate}&viewOrder=desc&pageNo=${pageNo}&pageSize=${pageSize}${searchTearm}${isTransferCreated}`
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
            initialValues={initData}
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
                    {(loading) && <Loading />}
                    <IForm
                        title="Fund Transfer Create"
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
                                            name="requestingUnit"
                                            options={[{ value: 0, label: "All" }, ...businessUnitList]}
                                            value={values?.requestingUnit}
                                            label="Requesting Unit"
                                            onChange={(valueOption) => {
                                                setFieldValue('requestingUnit', valueOption);
                                                setGridData([])
                                            }}
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="status"
                                            options={[
                                                { value: null, label: 'All' },
                                                { value: 0, label: 'Pending' },
                                                { value: 1, label: 'Complete' },
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
                                                            <div className="d-flex justify-content-around">
                                                                <span
                                                                    onClick={() => {
                                                                        const isContra = item?.strRequestType === "Contra";
                                                                        const isInterCompanyTransfer = item?.strRequestType === "InterCompanyTransferRequest";
                                                                        const isBankToBank = item?.strTransferBy === "Bank To Bank";
                                                                        const isBankToCash = item?.strTransferBy === "Bank To Cash";

                                                                        // Helper function to generate selected form values
                                                                        const getSelectedFormValues = () => {
                                                                            if (isContra) {
                                                                                return {
                                                                                    transferAmount: item?.numAmount,
                                                                                    bankAcc: {
                                                                                        bankId: item?.intGivenBankId,
                                                                                        bankName: item?.strGivenBankName,
                                                                                        bankBranch_Id: item?.intGivenBankBranchId,
                                                                                        bankBranchName: item?.strGivenBankBranchName,
                                                                                        value: item?.strGivenBankAccountId,
                                                                                        label: item?.strGivenBankAccountName,
                                                                                        bankAccNo: item?.strGivenBankAccountNumber,
                                                                                        generalLedgerId: item?.intGivenGlid,
                                                                                        generalLedgerCode: item?.strGivenGlCode,
                                                                                        generalLedgerName: item?.strGivenGlName,
                                                                                    },
                                                                                    sendToGLBank: {
                                                                                        value: item?.intRequestedBankAccountId,
                                                                                        label: item?.strRequestedBankAccountName,
                                                                                        bankAccNo: item?.strRequestedBankAccountNumber,
                                                                                        generalLedgerCode: item?.strRequestGlCode,
                                                                                    },
                                                                                    paidTo: item?.strRequestedBankAccountName || "",
                                                                                };
                                                                            } else if (isInterCompanyTransfer) {
                                                                                return {
                                                                                    amount: item?.numAmount,
                                                                                    intRequestToUnitId: item?.intRequestToUnitId,
                                                                                    transaction: {
                                                                                        value: item?.strRequestPartnerId,
                                                                                        label: item?.strRequestPartnerName,
                                                                                        code: item?.strRequestPartnerCode || "",
                                                                                    },
                                                                                    partnerBankAccount: {
                                                                                        value: item?.intRequestedBankAccountId,
                                                                                        label: item?.strRequestedBankAccountName,
                                                                                        bankId: item?.intRequestedBankId,
                                                                                        bankBranchId: item?.intRequestedBankBranchId,
                                                                                        bankAccountNo: item?.strRequestedBankAccountNumber,
                                                                                        bankName: item?.strRequestedBankName,
                                                                                        routingNo: item?.strRequestedBankRouting || "",
                                                                                    },
                                                                                    paidTo: item?.strRequestPartnerName || "",

                                                                                };
                                                                            }
                                                                            return null;
                                                                        };



                                                                        // Base state for navigation
                                                                        const baseState = {
                                                                            transferRowItem: item,
                                                                            selectedJournalTypeId: isContra ? 6 : 5,
                                                                            selectedFormValues: getSelectedFormValues(),
                                                                        };

                                                                        const isApproved = item?.isApproved === 1;
                                                                        const isTransferNotCreated = item?.isTransferCreated === 0;

                                                                        // Redirect based on transfer type
                                                                        if (isBankToBank && isApproved && isTransferNotCreated) {
                                                                            history.push({
                                                                                pathname: `/financial-management/financials/fundTransfercreate/bankTrasfer`,
                                                                                state: baseState,
                                                                            });
                                                                        } else if (isBankToCash && isApproved && isTransferNotCreated) {
                                                                            history.push({
                                                                                pathname: `/financial-management/financials/fundTransfercreate/cashTrasfer`,
                                                                                state: baseState,
                                                                            });
                                                                        }
                                                                    }}
                                                                >
                                                                    <IAdd title={"Create"} />
                                                                </span>

                                                            </div>
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
