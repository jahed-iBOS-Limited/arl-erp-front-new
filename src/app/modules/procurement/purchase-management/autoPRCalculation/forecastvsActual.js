/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useReducer, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import BreakDownModal from "./breakdownModal";
import CommonItemDetailsModal from "./rawMaterialModals/commonItemDetailsModal";
import {
    commonItemInitialState,
    commonItemReducer,
} from "./rawMaterialModals/helper";
import WarehouseStockModal from "./rawMaterialModals/warehouseStockModal";
import RawMaterialAutoPRNewModalView from "./rawMaterialModalView";

const initData = {
    businessUnit: "",
    fromDate: _todayDate(),
    toDate: _todayDate(),
};

export default function ForecastVsActual() {

    const { profileData, businessUnitList } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    const [singleRowData, setSingleRowData] = useState();
    const [showModal, setShowModal] = useState(false);

    const [showBreakdownModal, setShowBreakdownModal] = useState(false);
    const [warehouseStockModalShow, setWarehouseStockModalShow] = useState(false);

    // reducer
    const [commonItemDetailsState, commonItemDetailsDispatch] = useReducer(
        commonItemReducer,
        commonItemInitialState
    );

    console.log("singleRowData", singleRowData)



    const [
        landingData,
        getLandingData,
        loading,
        setLandingData,
    ] = useAxiosGet();



    const saveHandler = (values, cb) => {



    };

    const getData = (values) => {
        getLandingData(`/mes/MESReport/GetProductionForecastVsActual?BusinessUnitId=${values?.businessUnit?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`)
    };




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
                        title="Forecast Vs Actual"
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave

                    >
                        <Form>
                            <>
                                <div className="form-group  global-form row">
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="businessUnit"
                                            options={businessUnitList || []}
                                            value={values?.businessUnit}
                                            label="Business Unit"
                                            onChange={(valueOption) => {
                                                setFieldValue("businessUnit", valueOption || "");
                                                setLandingData([]);
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
                                                setLandingData([]);
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
                                                setLandingData([]);
                                            }}
                                            min={values?.fromDate}
                                        />
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                getData(values);
                                            }}
                                            disabled={!values?.businessUnit}
                                            className="btn btn-primary mt-5"
                                        >
                                            Show
                                        </button>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                                        <thead>
                                            <tr>
                                                <th>SL</th>
                                                <th>Product Name</th>
                                                <th>Item Code</th>
                                                <th>Forecasted Quantity</th>
                                                <th>Approved Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Dynamic data rows */}
                                            {landingData?.length > 0 &&
                                                landingData?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.productName}</td>
                                                        <td className="text-center">{item.itemCode}</td>
                                                        <td className="text-center">{item.forecastedQty}</td>
                                                        <td className="text-center">{item.approveQty}</td>
                                                    </tr>
                                                ))}

                                            {/* Total row */}
                                            {landingData?.length > 0 && (
                                                <tr>
                                                    <td colSpan={3} className="text-end fw-bold">Total</td>
                                                    <td className="text-center fw-bold">
                                                        {landingData.reduce((sum, item) => sum + item.forecastedQty, 0)}
                                                    </td>
                                                    <td className="text-center fw-bold">
                                                        {landingData.reduce((sum, item) => sum + item.approveQty, 0)}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>


                                </div>

                            </>
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}
