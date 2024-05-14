import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
const initData = {
    vehicle: "",
    service: "",
    fromDate: _todayDate(),
    toDate: _todayDate(),
};
export default function VehicleExpireStatus() {
    const saveHandler = (values, cb) => { };
    const [service, getService, serviceLoader] = useAxiosGet();
    const [rowData, getRowData, rowLoader, setRwoData] = useAxiosGet();

    const { profileData, selectedBusinessUnit } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    useEffect(() => {
        getService(`/asset/DropDown/GetRenewalService`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadVehicleList = (v) => {
        if (v?.length < 3) return [];
        return axios
            .get(
                `/asset/DropDown/GetAssetListForVehicle?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&searchTearm=${v}`
            )
            .then((res) => res?.data);
    };

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initData}
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
                    {(serviceLoader || rowLoader) && <Loading />}
                    <IForm
                        title="Vehicle Expire Status"
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave
                    >
                        <Form>
                            <div className="form-group  global-form row">
                                <div className="col-md-2">
                                    <label>Vehicle No</label>
                                    <SearchAsyncSelect
                                        selectedValue={values?.vehicle}
                                        handleChange={(valueOption) => {
                                            if (valueOption) {
                                                setFieldValue("vehicle", valueOption);
                                                setRwoData([])
                                            } else {
                                                setFieldValue("vehicle", "");
                                                setRwoData([])
                                            }
                                        }}
                                        loadOptions={loadVehicleList}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="service"
                                        options={
                                            [
                                                { value: "ALL", label: "All" },
                                                ...service
                                            ]

                                        }
                                        value={values?.service}
                                        label="Service"
                                        onChange={(valueOption) => {
                                            if (valueOption) {
                                                setFieldValue("service", valueOption);
                                                setRwoData([])
                                            } else {
                                                setFieldValue("service", "");
                                                setRwoData([])
                                            }
                                        }}
                                        placeholder="service"
                                        errors={errors}
                                        isDisabled={false}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.fromDate}
                                        label="From Date"
                                        name="fromDate"
                                        type="date"
                                        onChange={(e) => {
                                            setFieldValue("fromDate", e.target.value);
                                            setRwoData([])
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
                                            setFieldValue("toDate", e.target.value);
                                            setRwoData([])
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3 d-flex">
                                    <button onClick={() => {
                                        getRowData(`/asset/Asset/VehicleRenewalExpireDateWiseReport?BusinessUnitId=${selectedBusinessUnit?.value}&VehicleNo=${values?.vehicle?.value || 0
                                            }&RenewalServiceName=${values?.service?.label
                                            }&FromDate=${values?.fromDate
                                            }&ToDate=${values?.toDate
                                            }`)
                                    }}
                                        type="button"
                                        className="btn btn-primary mt-5"
                                        disabled={
                                            !values?.service ||
                                            !values?.fromDate ||
                                            !values?.toDate
                                        }
                                    >
                                        View
                                    </button>

                                    <div className="mt-5">
                                        <ReactHtmlTableToExcel
                                            id='test-table-xls-button'
                                            className='download-table-xls-button btn btn-primary ml-2'
                                            table='table-to-xlsx'
                                            filename='Vehicle Expire Status'
                                            sheet='Sheet-1'
                                            buttonText='Export Excel'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="table-responsive">
                                    <table id="table-to-xlsx" className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "30px" }}>SL</th>
                                                <th>Brta Vehicel Type</th>
                                                <th>Vehicle No</th>
                                                <th>Renewal Service Name</th>
                                                <th>Expire Date</th>
                                                <th>Next Renewal Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                rowData?.length > 0 && rowData?.map((itm, idx) => {
                                                    return (
                                                        <tr key={idx}>
                                                            <td className="text-center">{idx + 1}</td>
                                                            <td>{itm?.strBrtaVehicelType}</td>
                                                            <td>{itm?.strAssetName}</td>
                                                            <td>{itm?.strRenewalServiceName}</td>
                                                            <td className="text-center">{_dateFormatter(itm?.dteExpireDate)}</td>
                                                            <td className="text-center">{_dateFormatter(itm?.dteNextRenewalDate)}</td>
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                    </table>
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