import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import IApproval from "../../../_helper/_helperIcons/_approval";
import IDelete from "../../../_helper/_helperIcons/_delete";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { approveHandeler } from "./helper";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IConfirmModal from "../../../_helper/_confirmModal";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import IClose from "../../../_helper/_helperIcons/_close";


const initData = {

};
export default function FundTransferApproval({ viewType }) {
    const { profileData, selectedBusinessUnit, businessUnitList } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);


    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [gridData, getGridData, loading] = useAxiosGet();
    const [, onApproveHandler, approveLoader] = useAxiosPost();



    const saveHandler = (values, cb) => { };

    const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
        const searchTearm = searchValue ? `&search=${searchValue}` : "";
        getGridData(
            `/fino/FundManagement/GetFundTransferApprovalPagination?businessUnitId=${selectedBusinessUnit?.value}&viewOrder=desc&isApprove=0&pageNo=${pageNo}&pageSize=${pageSize}${searchTearm}`
        );
    };

    const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
        getLandingData(values, pageNo, pageSize, searchValue);
    };

    const paginationSearchHandler = (searchValue, values) => {
        setPositionHandler(pageNo, pageSize, values, searchValue);
    };

    useEffect(() => {
        getLandingData({}, pageNo, pageSize, "");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
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
                                            options={[{ value: 1, label: "Contra" }, { value: 2, label: "Inter Company" }]}
                                            value={values?.fundTrasferType}
                                            label="Fund Transfer Type"
                                            onChange={(valueOption) => {
                                                setFieldValue("fundTrasferType", valueOption || "");

                                            }
                                            }
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
                                            }}
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="requestingUnit"
                                            options={businessUnitList}
                                            value={values?.requestingUnit}
                                            label="Requesting Unit"
                                            onChange={(valueOption) => {
                                                setFieldValue("requestingUnit", valueOption);
                                            }}

                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="status"
                                            options={[
                                                { value: 1, label: "Pending" },
                                                { value: 2, label: "Approved" },
                                            ]}
                                            value={values?.status}
                                            label="Status"
                                            onChange={(valueOption) => {
                                                setFieldValue("status", valueOption);
                                            }}

                                        />
                                    </div>

                                    <div className="col-lg-3">
                                        <button
                                            onClick={() => {
                                                getLandingData(values, pageNo, pageSize, "");
                                            }}
                                            type="button"
                                            className="btn btn-primary mt-5"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                                {gridData?.itemList?.length > 0 && (
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
                                                    {values?.fundTrasferType?.value === 2 && <th>Request By</th>}
                                                    <th>From Account</th>
                                                    <th>To Account</th>
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
                                                        <td className="text-center">{item.strRequestCode}</td>
                                                        <td className="text-center">{_dateFormatter(item.dteRequestDate)}</td>
                                                        <td>{item.strRequestByUnitName}</td>
                                                        {values?.fundTrasferType?.value === 2 && <td>Request To</td>}
                                                        <td>{item.strRequestToUnitName}</td>
                                                        <td>{item.strRequestToUnitName}</td>
                                                        <td className="text-center">{_dateFormatter(item.dteExpectedDate)}</td>
                                                        <td className="text-right">{item.numAmount}</td>
                                                        <td>{item.strResponsibleEmpName}</td>
                                                        <td>{item.strRemarks}</td>
                                                        <td
                                                            className={`bold text-center ${item.isApproved ? "text-success" : "text-primary"
                                                                }`}
                                                        >
                                                            {item.isApproved ? "Approved" : "Pending"}
                                                        </td>                                                        <td className="text-center">
                                                            <div className="d-flex justify-content-around">
                                                                <span onClick={() => {
                                                                    IConfirmModal({
                                                                        message: `Are you sure to approve?`,
                                                                        yesAlertFunc: () => {
                                                                            approveHandeler({
                                                                                item, onApproveHandler, profileData, cb: () => {
                                                                                    getLandingData({}, pageNo, pageSize, "");

                                                                                }
                                                                            })
                                                                        },
                                                                        noAlertFunc: () => { },
                                                                    });

                                                                }}>
                                                                    <IApproval title={"Approve"} />
                                                                </span>
                                                                <span>
                                                                    <IClose title={"Reject"} style={{ fontSize: "16px" }} />
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