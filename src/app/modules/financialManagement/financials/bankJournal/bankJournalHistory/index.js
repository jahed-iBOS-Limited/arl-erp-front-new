import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const initData = {};
export default function HistoryModal({ journalId, journalTypeId }) {
    const [singleJournalData, getSingleJournalData, singleJournalDataLoader] = useAxiosGet();
    const [journalHistoryData, getJournalHistoryData, journalHistoryDataLoader] = useAxiosGet();

    const selectedBusinessUnit = useSelector((state) => {
        return state.authData.selectedBusinessUnit;
    }, shallowEqual);

    useEffect(() => {
        if (journalId) {
            getSingleJournalData(`/fino/CommonFino/GetBankJournalReport?JournalId=${journalId}&AccountingJournalTypeId=${journalTypeId}&BusinessUnitId=${selectedBusinessUnit?.value}`,
                (data) => {
                    // setSingleJournalData(data?.[0]);
                    getJournalHistoryData(`/fino/Accounting/GetAccountingJournalLOGHistory?accountingJournalId=${journalId}&accountingJournalTypeId=${journalTypeId}`)
                })

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [journalId]);
    const saveHandler = (values, cb) => { };
    return (
        <Formik
            enableReinitialize={true}
            initialValues={{}}
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
                    {(journalHistoryDataLoader || singleJournalDataLoader) && <Loading />}
                    <IForm
                        title="Log History"
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave
                        renderProps={() => {
                            return (
                                <div>
                                </div>
                            );
                        }}
                    >
                        <Form>
                            <div>
                                <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                                    <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                                        <h4>{singleJournalData?.objHeader?.businessUnitName}</h4>
                                        <span>{singleJournalData?.objHeader?.businessUnitAddress}</span>
                                        <span className="my-2">Bank Journal</span>
                                    </div>
                                </div>
                                <div className="my-3 d-flex justify-content-between">
                                    <div><span className="font-weight-bold mr-2"></span>{" "}</div>
                                    <div>
                                        <div>
                                            Voucher No.
                                            <sapn className="font-weight-bold ml-1">
                                                {
                                                    singleJournalData?.objHeader?.bankJournalCode
                                                }
                                            </sapn>
                                        </div>
                                        <div>
                                            Voucher Date :
                                            <sapn className="font-weight-bold ml-1">
                                                {_dateFormatter(
                                                    singleJournalData?.objHeader?.journalDate
                                                )}
                                            </sapn>
                                        </div>
                                    </div>
                                </div>
                                <div className="row cash_journal">
                                    <div className="col-lg-12 pr-0 pl-0">
                                       <div className="table-responsive">
                                       <table className="table table-striped table-bordered mt-0 bj-table bj-table-landing table-font-size-sm">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "30px" }}>SL</th>
                                                    <th style={{ width: "50px" }}>Enroll</th>
                                                    <th style={{ width: "150px" }}>Name</th>
                                                    <th style={{ width: "100px" }}>Department</th>
                                                    <th style={{ width: "100px" }}>Designation</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {journalHistoryData?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item?.employeeId}</td>
                                                        <td>{item?.employeeName}</td>
                                                        <td>{item?.employeeDepartment}</td>
                                                        <td>{item?.employeeDesignation}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                       </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}
