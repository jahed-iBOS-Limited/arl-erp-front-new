import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import IViewModal from "../../../_helper/_viewModal";
import GlDetailsModal from "./glDetailsModal";
const initData = {
    profitCenter: "",
    isComponentDetails: "",
    fromDate: "",
    toDate: ""
};
export default function IscomponentDetails() {
    const { profileData, selectedBusinessUnit } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    const [isShowModal, setIsShowModal] = useState(false);
    const [singleData, setSingleData] = useState(null);

    const [gridData, getGridData, loading] = useAxiosGet();
    const [profitCenterDDL, getProfitCenterDDL] = useAxiosGet()
    const [isComponentDDL, getIsComponentDDL, , setIsComponentDDL] = useAxiosGet()

    useEffect(() => {
        getProfitCenterDDL(`/fino/CostSheet/ProfitCenterDDL?BUId=${selectedBusinessUnit?.value}`)
        getIsComponentDDL(`/fino/Report/GetISComponentDDL`, (res) => {
            const data = res.map((item) => ({ value: item?.intFscomponentId, label: item?.strFscomponentName }))
            setIsComponentDDL(data)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBusinessUnit]);
    const saveHandler = (values, cb) => { };


    const getLandingData = (values) => {
        const strFromDate = values?.fromDate ? `&FromDate=${values?.fromDate}` : "";
        const strToDate = values?.toDate ? `&ToDate=${values?.toDate}` : "";
        getGridData(
            `/fino/Report/GetIncomeStatementComponentDetails?BusinessUnitId=${selectedBusinessUnit?.value}&ProfitCenter=${values?.profitCenter?.value || 0}&FsComId=${values?.isComponentDetails?.value || 0}${strFromDate}${strToDate}`
        );
    };


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
                        title="Is Component Details"
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave
                    >
                        <Form>
                            <>
                                <div className="form-group  global-form row">
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="profitCenter"
                                            options={profitCenterDDL || []}
                                            value={values?.profitCenter}
                                            label="Profit Center"
                                            onChange={(valueOption) => {
                                                setFieldValue("profitCenter", valueOption || "");

                                            }}
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="isComponentDetails"
                                            options={isComponentDDL || []}
                                            value={values?.isComponentDetails}
                                            label="Is Component"
                                            onChange={(valueOption) => {
                                                setFieldValue("isComponentDetails", valueOption || "");

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

                                    <div >
                                        <button
                                            onClick={() => {
                                                getLandingData(values)
                                            }}
                                            type="button"
                                            className="btn btn-primary mt-5 ml-5"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                                {gridData?.length > 0 && (
                                    <div className="table-responsive">
                                        <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                                            <thead>
                                                <tr>
                                                    <th>SL</th>
                                                    <th>General Ledger Code</th>
                                                    <th>General Ledger Name</th>
                                                    <th>Sub GL Name</th>
                                                    <th>Sub GL Code</th>
                                                    <th>Amount</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {gridData?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>

                                                        <td className="text-center">{item?.strGeneralLedgerCode}</td>
                                                        <td>{item?.strGeneralLedgerName}</td>
                                                        <td className="text-center">{item?.strSubGlCode}</td>
                                                        <td>{item?.strSubGlName}</td>
                                                        <td className="text-center">{item?.numAmount}</td>
                                                        <td className="text-center">
                                                            <div className="">
                                                                <span onClick={() => {
                                                                    setSingleData(item)
                                                                    setIsShowModal(true)
                                                                }} className="">
                                                                    <IView title="GL Details" />
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}


                                {isShowModal && (
                                    <IViewModal
                                        show={isShowModal}
                                        onHide={() => {
                                            setIsShowModal(false);
                                            setSingleData(null);
                                        }}
                                        title="GL Details"
                                    >
                                        <GlDetailsModal singleData={singleData} values={values} selectedBusinessUnit={selectedBusinessUnit} />
                                    </IViewModal>
                                )}

                            </>
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}