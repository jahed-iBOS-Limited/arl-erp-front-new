import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../../../../_helper/_loading";
import PaginationSearch from "../../../../../_helper/_search";
import PaginationTable from "../../../../../_helper/_tablePagination";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import IView from "../../../../../_helper/_helperIcons/_view";
import IEdit from "../../../../../_helper/_helperIcons/_edit";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import IForm from "../../../../../_helper/_form";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";

const initData = {

};
export default function FundTransferRequest({ viewType }) {
    const { selectedBusinessUnit } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);


    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [gridData, getGridData, loading] = useAxiosGet();
    const [transferType, setTransferType] = useState(null);


    const saveHandler = (values, cb) => { };
    const history = useHistory();

    const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
        const searchTearm = searchValue ? `&search=${searchValue}` : "";
        getGridData(
            `/fino/FundManagement/GetFundTransferPagination?businessUnitId=${selectedBusinessUnit?.value}&strRequestType=Request&viewOrder=DESC&pageNo=${pageNo}&pageSize=${pageSize}${searchTearm}`
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
                    {loading && <Loading />}
                    <IForm
                        customTitle={<>
                            <div className="d-flex mb-2 mt-5">
                                <label className="mr-3">
                                    <input
                                        type="radio"
                                        name="transferType"
                                        checked={transferType === "Bank"}
                                        className="mr-1 pointer"
                                        style={{
                                            position: "relative",
                                            top: "2px",
                                        }}
                                        onChange={(valueOption) => {
                                            setTransferType("Bank");
                                        }}
                                    />
                                    <strong style={{ fontSize: "11px" }}>Bank</strong>
                                </label>
                                <label className="mr-3">
                                    <input
                                        type="radio"
                                        name="transferType"
                                        checked={transferType === "Cash"}
                                        className="mr-1 pointer"
                                        style={{ position: "relative", top: "2px" }}
                                        onChange={(e) => {
                                            setTransferType("Cash");
                                        }}
                                    />
                                    <strong style={{ fontSize: "11px" }} >Cash</strong>
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
                                        disabled={!viewType || !transferType}
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            history.push({
                                                pathname: `/financial-management/financials/fundTransfer/contra/create`,
                                                state: { viewType, transferType }
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
                                                    <th>Request To</th>
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
                                                                <span>
                                                                    <IView />
                                                                </span>
                                                                <span>
                                                                    <IEdit />
                                                                </span>
                                                                <span>
                                                                    <IDelete />
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