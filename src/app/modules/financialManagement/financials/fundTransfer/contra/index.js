import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import PaginationTable from "../../../../_helper/_tablePagination";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IView from "../../../../_helper/_helperIcons/_view";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IForm from "../../../../_helper/_form";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

const initData = {

};
export default function Contra({ viewType }) {
    const { selectedBusinessUnit } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);


    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [gridData, getGridData, loading] = useAxiosGet();
    const [parentTransferType, setParentTransferType] = useState({ actionId: 1, actionName: "Bank Transfer" });


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
                                        name="parentTransferType"
                                        checked={parentTransferType?.actionName === "Bank Transfer"}
                                        className="mr-1 pointer"
                                        style={{
                                            position: "relative",
                                            top: "2px",
                                        }}
                                        onChange={(valueOption) => {
                                            setParentTransferType({ actionId: 1, actionName: "Bank Transfer" });
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
                                            name="status"
                                            options={[
                                                { value: 1, label: "Pending" },
                                                { value: 2, label: "Approved" },
                                                { value: 3, label: "Rejected" },
                                            ]}
                                            value={values?.status}
                                            label="Status"
                                            onChange={(valueOption) => {
                                                setFieldValue("status", valueOption);
                                            }}

                                        />
                                    </div>
                                    <div><button className="btn btn-primary mt-5">Show</button></div>
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
                                                        <td>{item?.strGivenBankName}</td>
                                                        <td>{item?.strRequestedBankName}</td>
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