/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

const initData = {
    businessUnit: "",
    fromDate: _todayDate(),
    toDate: _todayDate(),
};

export default function ForecastVsActual() {
    const { selectedBusinessUnit, businessUnitList } = useSelector(
        (state) => state.authData,
        shallowEqual
    );

    const [landingData, getLandingData, loading, setLandingData] = useAxiosGet();

    const getData = (values) => {
        getLandingData(
            `/mes/MESReport/GetProductionForecastVsActual?BusinessUnitId=${values?.businessUnit?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`
        );
    };

    const calculateTotals = (key) =>
        landingData.reduce((sum, item) => sum + (+item[key] || 0), 0);

    const calculateDifferenceTotal = () =>
        landingData.reduce(
            (sum, item) =>
                sum + ((+item.forecastedQty || 0) - (+item.approveQty || 0)),
            0
        );

    return (
        <Formik
            enableReinitialize
            initialValues={{
                ...initData,
                businessUnit: { value: selectedBusinessUnit?.value, label: selectedBusinessUnit?.label }
            }}
            onSubmit={(values, { resetForm }) => {
                resetForm(initData);
            }}
        >
            {({ values, setFieldValue }) => (
                <>
                    {loading && <Loading />}
                    <IForm
                        title="Forecast Vs Actual"
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave
                    >
                        <Form>
                            {/* Form Inputs */}
                            <div className="form-group global-form row">
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
                                        onClick={() => getData(values)}
                                        disabled={!values?.businessUnit}
                                        className="btn btn-primary mt-5"
                                    >
                                        Show
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="table-responsive">
                                <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                                    <thead>
                                        <tr>
                                            <th>SL</th>
                                            <th>Product Name</th>
                                            <th>Item Code</th>
                                            <th>Forecasted Quantity</th>
                                            <th>Actual Quantity</th>
                                            <th>Difference Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Dynamic Data Rows */}
                                        {landingData?.length > 0 &&
                                            landingData.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.productName}</td>
                                                    <td className="text-center">{item.itemCode}</td>
                                                    <td className="text-center">{item.forecastedQty}</td>
                                                    <td className="text-center">{item.approveQty}</td>
                                                    <td className="text-center">
                                                        {(+item.forecastedQty || 0) - (+item.approveQty || 0)}
                                                    </td>
                                                </tr>
                                            ))}

                                        {/* Total Row */}
                                        {landingData?.length > 0 && (
                                            <tr>
                                                <td colSpan={3} className="text-end fw-bold">
                                                    Total
                                                </td>
                                                <td className="text-center fw-bold">
                                                    {calculateTotals("forecastedQty")}
                                                </td>
                                                <td className="text-center fw-bold">
                                                    {calculateTotals("approveQty")}
                                                </td>
                                                <td className="text-center fw-bold">
                                                    {calculateDifferenceTotal()}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}
