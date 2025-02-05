import axios from "axios";
import { Form, Formik } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";

const initData = {
    businessUnit: {value: 0, label: "All"},
    department: "",
    employee: "",
    status: { value: null, label: "All" },
    asset:""

};

export default function AssetCheckInOut() {
    const { profileData, businessUnitList } = useSelector((state) => state.authData);
    const [departmentList, getDepartmentList] = useAxiosGet();
    const [gridData, getGridData, loading] = useAxiosGet();



    const getReportData = (values) => {
        let strStatus = values?.status?.value === null ? "" : `&Status=${values?.status?.value}`;
        getGridData(
            `/asset/Asset/GetAssetCheckInOutReport?BusinessUnitId=${values?.businessUnit?.value || 0}&DepartmentId=${values?.department?.value || 0}&EmployeeId=${values?.employee?.value || 0}&&AssetId=${values?.asset?.value || 0}${strStatus}`
        );
    };

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initData}
            onSubmit={(values) => getReportData(values)}
        >
            {({ handleSubmit, setFieldValue, values }) => (
                <>
                    {loading && <Loading />}
                    <IForm title="Asset Check-In/Out Report" isHiddenReset isHiddenBack isHiddenSave>
                        <Form>
                            <div className="form-group global-form row mb-4">
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="businessUnit"
                                        options={[{value: 0, label: "All"}, ...businessUnitList] || []}
                                        value={values?.businessUnit}
                                        label="BusinessUnit"
                                        onChange={(valueOption) => {
                                            setFieldValue("businessUnit", valueOption || "")
                                            setFieldValue("department", "")
                                            setFieldValue("employee", "");
                                            if (valueOption) {
                                                getDepartmentList(
                                                    `/asset/DropDown/GetDepartmentList?AccountId=${profileData?.accountId}&UnitId=${valueOption?.value}&Userid=${profileData?.userId}`
                                                );
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="department"
                                        options={departmentList || []}
                                        value={values?.department}
                                        label="Department"
                                        onChange={(valueOption) => setFieldValue("department", valueOption)}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <label>Employee</label>
                                    <SearchAsyncSelect
                                        selectedValue={values?.employee}
                                        handleChange={(valueOption) => {

                                            setFieldValue("employee", valueOption);
                                        }}
                                        loadOptions={(v) => {
                                            if (v?.length < 3) return [];
                                            return axios.get(
                                                `/asset/DropDown/GetEmployeeByEmpIdDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${values?.businessUnit?.value}&searchTearm=${v}`
                                            ).then((res) => {
                                                return res?.data?.map((itm) => ({
                                                    ...itm,
                                                    value: itm?.value,
                                                    label: `${itm?.level} [${itm?.employeeCode}]`,
                                                }))
                                            });
                                        }}
                                        isDisabled={!values?.businessUnit}
                                    />


                                </div>
                                <div className="col-lg-3">
                                    <label>Asset</label>
                                    <SearchAsyncSelect
                                        selectedValue={values?.asset}
                                        handleChange={(valueOption) => {

                                            setFieldValue("asset", valueOption);
                                        }}
                                        loadOptions={(v) => {
                                            if (v?.length < 3) return [];
                                            return axios.get(
                                                `/asset/Asset/GetAllAssetList?accountId=${profileData?.accountId}&search=${v}`
                                            ).then((res) => {
                                                return res?.data;
                                            });
                                        }}
                                    />


                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="status"
                                        options={[
                                            { value: null, label: "All" },
                                            { value: true, label: "In Use" },
                                            { value: false, label: "Stock" },
                                        ]}
                                        value={values?.status}
                                        label="Status"
                                        onChange={(valueOption) => setFieldValue("status", valueOption)}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <button
                                        disabled={!values?.status?.label || (values?.businessUnit?.label && !values?.employee?.label)}
                                        type="button"
                                        className="btn btn-primary mt-4"
                                        onClick={() => getReportData(values)}
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                            {gridData?.length > 0 && (
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>SL</th>
                                                <th>Asset Code</th>
                                                <th>Asset Name</th>
                                                <th>Asset Type</th>
                                                <th>Warehouse</th>
                                                <th>Employee Name</th>
                                                <th>Employee Code</th>
                                                <th>Acquisition Date</th>
                                                <th>Purchase Order</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {gridData.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td className="text-center">{item?.strAssetCode}</td>
                                                    <td>{item?.strAssetName}</td>
                                                    <td>{item?.strAssetTypeName}</td>
                                                    <td>{item?.strWarehouseName}</td>
                                                    <td>{item?.strEmployeeName}- {`[${item?.intEmployeeBasicInfoId}]`}</td>
                                                    <td className="text-center">{item?.strEmployeeCode}</td>
                                                    <td className="text-center">{_dateFormatter(item?.dteAcquisitionDate)}</td>
                                                    <td className="text-center">{item?.strPoNo}</td>
                                                    <td
                                                        className="text-center"
                                                        style={{
                                                            color: item?.status === "Use" ? "green" : "red",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {item?.status}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}
