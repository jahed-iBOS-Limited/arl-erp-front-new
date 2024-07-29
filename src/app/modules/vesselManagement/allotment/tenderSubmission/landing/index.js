
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import PaginationTable from "../../../../_helper/_tablePagination";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IEdit from "../../../../_helper/_helperIcons/_edit";



// const initData = {};


export default function TenderSubmissionLanding() {
    const history = useHistory();
    const { profileData: { accountId }, selectedBusinessUnit: { value: buUnId } } = useSelector(state => state.authData, shallowEqual)

    const [pageNo, setPageNo] = useState(0)
    const [pageSize, setPageSize] = useState(15)
    const [submittedTenderLists, getSubmittedTenderLists] = useAxiosGet()


    useEffect(() => {
        fetchSubmittedTenderData(pageNo, pageSize)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchSubmittedTenderData = (pageNo, pageSize) => {
        const url = `/tms/TenderSubmission/GetTenderSubmissionpagination?AccountId=${accountId}&BusinessUnitId=${buUnId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`

        getSubmittedTenderLists(url)
    }

    const setPositionHandler = (pageNo, pageSize) => {
        fetchSubmittedTenderData(pageNo, pageSize)
    }


    const saveHandler = (values, cb) => { };

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{}}
            // validationSchema={{}}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                saveHandler(values, () => {
                    resetForm();
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
                    {false && <Loading />}
                    <IForm
                        title="Tender Submission"
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
                                            history.push("/vessel-management/allotment/tendersubmission/entry");
                                        }}
                                    >
                                        Create
                                    </button>
                                </div>
                            );
                        }}
                    >
                        <Form>


                            <div className="table-responsive">
                                <table
                                    id="table-to-xlsx"
                                    className={
                                        "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                                    }
                                >
                                    <thead>
                                        <tr className="cursor-pointer">
                                            <th>SL</th>
                                            <th>enquiryNo</th>
                                            <th>itemName</th>
                                            <th>loadPortName</th>
                                            <th>dischargePortName</th>
                                            <th>foreignPriceUsd</th>
                                            <th>totalQty</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submittedTenderLists?.data?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td
                                                        style={{ width: "40px" }}
                                                        className="text-center"
                                                    >
                                                        {index + 1}
                                                    </td>
                                                    <td>{item?.enquiryNo}</td>
                                                    <td>{item?.itemName}</td>
                                                    <td>{item?.loadPortName}</td>
                                                    <td>{item?.dischargePortName}</td>
                                                    <td className="text-right">
                                                        {item?.foreignPriceUsd}
                                                    </td>
                                                    <td className="text-right">
                                                        {item?.totalQty}
                                                    </td>
                                                    <td
                                                        style={{ width: "80px" }}
                                                        className="text-center"
                                                    >
                                                        <div className="d-flex justify-content-around">
                                                            <span>
                                                                <IDelete
                                                                // remover={(id) => {
                                                                //     deleteHandler(id, values);
                                                                // }}
                                                                // id={item?.shiptoPartnerId}
                                                                />
                                                            </span>
                                                            <span>
                                                                <IEdit
                                                                    onClick={() => {
                                                                        // setFormType("edit");
                                                                        // setSingleItem(item);
                                                                        // setShow(true);
                                                                    }}
                                                                // id={item?.shiptoPartnerId}
                                                                />
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {submittedTenderLists?.data?.length > 0 && (
                                <PaginationTable
                                    count={submittedTenderLists?.totalCount}
                                    setPositionHandler={setPositionHandler}
                                    paginationState={
                                        {
                                            pageNo,
                                            setPageNo,
                                            pageSize,
                                            setPageSize
                                        }
                                    }
                                />
                            )}
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}