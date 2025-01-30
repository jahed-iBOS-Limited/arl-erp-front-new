import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { _monthLastDate } from "../../../../_helper/_monthLastDate";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
    transferType: "",
    status: { value: 1, isApproved: 0, label: "Pending", isFundReceived: null, isTransferCreated: null },
    fromDate: _todayDate(),
    toDate: _monthLastDate(),

};
export default function Contra({ viewType }) {
    const { selectedBusinessUnit } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);


    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [gridData, getGridData,loading, setGridData] = useAxiosGet();
    const [parentTransferType, setParentTransferType] = useState({ actionId: 1, actionName: "Bank Transfer" });

    // const transferTypeList = parentTransferType?.actionName === "Bank Transfer" ? [{ value: 1, label: "Bank To Bank" }, { value: 2, label: "Bank To Cash" }] : [{ value: 3, label: "Cash To Bank" }]
    const transferTypeList = parentTransferType?.actionName === "Bank Transfer" ? [{ value: 1, label: "Bank To Bank" }] : [{ value: 3, label: "Cash To Bank" }]

    const saveHandler = (values, cb) => { };
    const history = useHistory();

    const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
        const searchTearm = searchValue ? `&strSearch=${searchValue}` : "";
        const isTransferCreated = values?.status?.isTransferCreated === null ? "" : `&isTransferCreated=${values?.status?.isTransferCreated}`;
        const isFundReceived = values?.status?.isFundReceived === null ? "" : `&isFundReceived=${values?.status?.isFundReceived}`;

        getGridData(
            `/fino/FundManagement/GetFundTransferPagination?businessUnitId=${selectedBusinessUnit?.value}&intTransaferById=${values?.transferType?.value}&intRequestTypeId=${viewType?.actionId}&StrTransactionType=${parentTransferType?.actionName}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&isApproved=${values?.status?.isApproved}&viewOrder=desc&pageNo=${pageNo}&pageSize=${pageSize}${searchTearm}${isFundReceived}${isTransferCreated}`
        );
    };

    const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
        getLandingData(values, pageNo, pageSize, searchValue);
    };

    const paginationSearchHandler = (searchValue, values) => {
        setPositionHandler(pageNo, pageSize, values, searchValue);
    };

    useEffect(() => {
        getLandingData(initData, pageNo, pageSize, "");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                ...initData,
                transferType: parentTransferType?.actionName === "Bank Transfer" ? { value: 1, label: "Bank To Bank" } : { value: 3, label: "Cash To Bank" },
            }}
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
                    {loading && <Loading />}
                    <IForm
                        customTitle={<>
                            <div className="d-flex mb-2 mt-1">
                                <label className="mr-3">
                                    <input
                                        type="radio"
                                        name="parentTransferType"
                                        checked={parentTransferType?.actionName === "Bank Transfer"}
                                        className="mr-1 pointer"
                                        style={{
                                            position: "relative",
                                            top: "2px",
                                        }}
                                        onChange={(valueOption) => {
                                            setParentTransferType({ actionId: 1, actionName: "Bank Transfer" });
                                            setFieldValue("transferType", "");
                                            setGridData([])
                                        }}
                                    />
                                    <strong style={{ fontSize: "11px" }}>Bank Transfer</strong>
                                </label>
                                <label className="mr-3">
                                    <input
                                        type="radio"
                                        name="parentTransferType"
                                        checked={parentTransferType?.actionName === "Cash Transfer"}
                                        className="mr-1 pointer"
                                        style={{ position: "relative", top: "2px" }}
                                        onChange={(e) => {
                                            setParentTransferType({ actionId: 1, actionName: "Cash Transfer" });
                                            setFieldValue("transferType", "")
                                            setGridData([])
                                        }}
                                    />
                                    <strong style={{ fontSize: "11px" }} >Cash Transfer</strong>
                                </label>
                            </div>
                        </>}
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave
                        renderProps={() => {
                            return (
                                <div>
                                    <button
                                        disabled={!viewType || !parentTransferType}
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            history.push({
                                                pathname: `/financial-management/financials/fundTransfer/contra/create`,
                                                state: { viewType, parentTransferType }
                                            });
                                        }}
                                    >
                                        Create
                                    </button>
                                </div>
                            );
                        }}
                    >
                        <Form>
                            <>
                                <div className="form-group  global-form row">

                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="transferType"
                                            options={transferTypeList}
                                            value={values?.transferType}
                                            label="Transfer Type"
                                            onChange={(valueOption) => {
                                                setFieldValue("transferType", valueOption)
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
                                                setFieldValue("fromDate", e.target.value);
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
                                                setFieldValue("toDate", e.target.value);
                                                setGridData([])
                                            }}
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="status"
                                            options={[
                                                { value: 1, isApproved: 0, label: "Pending", isFundReceived: null, isTransferCreated: null },
                                                { value: 2, isApproved: 1, label: "Approved", isFundReceived: null, isTransferCreated: null },
                                                { value: 3, isApproved: 2, label: "Rejected", isFundReceived: null, isTransferCreated: null },
                                                { value: 4, isApproved: 1, label: 'Fund Transferred', isFundReceived: false, isTransferCreated: 1 },
                                                { value: 5, isApproved: 1, label: 'Fund Received', isFundReceived: true, isTransferCreated: 1 },
                                            ]}
                                            value={values?.status}
                                            label="Status"
                                            onChange={(valueOption) => {
                                                setFieldValue("status", valueOption);
                                                setGridData([])
                                            }}

                                        />
                                    </div>
                                    <div><button disabled={!values?.transferType} type="button" onClick={() => {
                                        getLandingData(values, pageNo, pageSize, "");

                                    }} className="btn btn-primary mt-5">Show</button></div>
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
                                                    <th>Transfer From</th>
                                                    <th>Transfer To</th>
                                                    <th>Expect Date</th>
                                                    <th>Amount</th>
                                                    <th>Responsible</th>
                                                    <th>Remarks</th>
                                                    <th>Status</th>
                                                    <th style={{ minWidth: "60px" }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {gridData?.data?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.sl}</td>
                                                        <td className="text-center">{item.strRequestCode}</td>
                                                        <td className="text-center">{_dateFormatter(item.dteRequestDate)}</td>
                                                        <td>{item.strRequestByUnitName}</td>
                                                        <td>{item?.strTransferBy === "Cash To Bank" ? item?.strRequestGlName : item?.strGivenBankAccountName}</td>
                                                        <td>{item?.strTransferBy === "Bank To Cash" ? item?.strRequestGlName : item?.strTransferBy === "Cash To Bank" ? item?.strGivenBankAccountName : item?.strRequestedBankAccountName}</td>
                                                        <td className="text-center">{_dateFormatter(item.dteExpectedDate)}</td>
                                                        <td className="text-right">{item.numAmount}</td>
                                                        <td>{item.strResponsibleEmpName}</td>
                                                        <td>{item.strRemarks}</td>
                                                        <td
                                                            className={`bold text-center ${item?.strStatus === "Fund Received"
                                                                ? "text-success"
                                                                : item?.strStatus === "Fund Transferred"
                                                                    ? "text-primary"
                                                                    : item?.strStatus === "Approved"
                                                                        ? "text-info"
                                                                        : item?.strStatus === "Rejected"
                                                                            ? "text-danger"
                                                                            : "text-warning"}`}
                                                        >
                                                            {item?.strStatus}
                                                        </td>

                                                        <td className="text-center">
                                                            <div className="d-flex justify-content-between">
                                                                {/* <span>
                                                                    <IView styles={{ fontSize: "16px" }} />
                                                                </span> */}
                                                                {item?.strStatus === "Pending" && (
                                                                    <>
                                                                        <span
                                                                            onClick={() => {
                                                                                history.push({
                                                                                    pathname: `/financial-management/financials/fundTransfer/contra/edit/${item?.intFundTransferRequestId}`,
                                                                                    state: { viewType, parentTransferType, rowItem: item }
                                                                                });
                                                                            }}
                                                                        >
                                                                            <IEdit />
                                                                        </span>
                                                                        {/* <span>
                                                                            <IDelete style={{ fontSize: "16px" }} />
                                                                        </span> */}
                                                                    </>
                                                                )}
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