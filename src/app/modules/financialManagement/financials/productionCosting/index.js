import { Form, Formik } from "formik";
import React from "react";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IConfirmModal from "../../../_helper/_confirmModal";
import findIndex from "../../../_helper/_findIndex";
import { toast } from "react-toastify";

const initData = {
    item: '',
    fromDate: "",
    toDate: _todayDate(),
};

export default function ProductionCost() {

    const userRole = useSelector(
        (state) => state?.authData?.userRole,
        shallowEqual
    );

    const productionCostPermission = userRole[findIndex(userRole, "Production Costing")];
    const [cheakingMonthClosingState, getCheakingMonthClosingState, closingLoader] = useAxiosGet();


    const [rowData, getRowData, rowDataLoader, setRowData] = useAxiosGet();
    const [, saveData, saveDataLoader] = useAxiosPost();

    const { selectedBusinessUnit, profileData } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    const confirmToApprove = (values) => {
        let confirmObject = {
            title: "Are you sure?",
            message: "",
            yesAlertFunc: async () => {
                const payload = {
                    updateCostLsit: rowData?.map((item) => ({
                        intRowId: item?.intRowId,
                        updateProductCost: item?.ActualAvgRate * item?.numTransactionQuantity,
                    })),
                };
                saveData(`/mes/MesDDL/UpdateProductionCost`, payload, null, true)
                console.log("payload", payload);

            },
            noAlertFunc: () => {
                "";
            },
        };
        IConfirmModal(confirmObject);
    };

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initData}
            onSubmit={(values, { setSubmitting, resetForm }) => {

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
                    {(rowDataLoader || saveDataLoader || closingLoader) && <Loading />}
                    <IForm
                        title="Production Costing"
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
                                <div className="form-group global-form row">
                                    <div className="col-lg-3">
                                        <label>Item</label>
                                        <SearchAsyncSelect
                                            selectedValue={values.item}
                                            handleChange={(valueOption) => {
                                                setFieldValue("item", valueOption);
                                            }}
                                            isDebounce
                                            loadOptions={(v, resolve) => {
                                                if (v?.length < 3) return [];
                                                return (
                                                    axios.get(`/mes/MesDDL/GetUnitWiseFGItemDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`)
                                                        .then((res) => {
                                                            const updateList = res?.data.map((item) => ({ ...item }));
                                                            resolve(updateList);
                                                        })
                                                );
                                            }}
                                            isOptionSelected={(option, selectValue) =>
                                                selectValue.some((i) => i === option)
                                            }
                                        />
                                    </div>
                                    <div className="col-lg-2">
                                        <InputField
                                            value={values?.fromDate}
                                            label="From Date"
                                            name="fromDate"
                                            type="date"
                                            onChange={(e) => {
                                                setRowData([]);
                                                setFieldValue("fromDate", e.target.value);
                                                getCheakingMonthClosingState(`/wms/InventoryTransaction/CheckMonthClosing?BusinessUnitId=${selectedBusinessUnit?.value}&dteDate=${e.target.value}`)
                                            }}
                                        />
                                    </div>
                                    <div className="col-lg-2">
                                        <InputField
                                            value={values?.toDate}
                                            label="To Date"
                                            name="toDate"
                                            type="date"
                                            onChange={(e) => {
                                                setRowData([]);
                                                setFieldValue("toDate", e.target.value);
                                            }}
                                            min={values?.fromDate}
                                            disabled={!values?.fromDate}
                                        />
                                    </div>
                                    <div className="col-lg-2">
                                        <button
                                            style={{ marginTop: "17px" }}
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => {
                                                if(cheakingMonthClosingState?.statuscode === 400){
                                                    return toast.warn(cheakingMonthClosingState?.message)
                                                }
                                                getRowData(`/fino/Report/GetProductionOrderActualRate?intBusinessUnitId=${selectedBusinessUnit?.value}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}&intItemId=${values?.item?.value}`)
                                            }}
                                            disabled={!values?.item || !values?.fromDate || !values?.toDate}
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                                {productionCostPermission?.isView ? (<div className="d-flex justify-content-end">
                                    <button
                                        style={{ marginTop: "10px" }}
                                        className="btn btn-primary"
                                        onClick={() => confirmToApprove(values)}
                                        disabled={!rowData?.length}
                                    >
                                        Save
                                    </button>
                                </div>) : null}
                              
                                <div className="table-responsive">
                                <table className="table table-striped table-bordered global-table">
                                    <thead>
                                        <tr>
                                            <th>SL</th>
                                            <th>Date</th>
                                            <th>Transaction Code</th>
                                            <th>Ref Code</th>
                                            <th>Production Quantity</th>
                                            <th>Production Rate</th>
                                            <th>Revised Production Rate</th>
                                            <th>Revised Production Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rowData?.map((item, index) => (
                                            // fields are binded as per ziaul bhai's instruction
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td className="text-center">{_dateFormatter(item?.dteTransactionDate)}</td>
                                                <td className="text-center">{item?.strInventoryTransactionCode}</td>
                                                <td className="text-center">{item?.strReferenceCode}</td>
                                                <td className="text-right">{item?.numTransactionQuantity}</td>
                                                <td className="text-right">{_formatMoney(item?.RuningAvgRate)}</td>
                                                <td className="text-right">{_formatMoney(item?.ActualAvgRate)}</td>
                                                <td className="text-right">{_formatMoney(item?.ActualAvgRate * item?.numTransactionQuantity)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
     </div>
                            </div>
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}