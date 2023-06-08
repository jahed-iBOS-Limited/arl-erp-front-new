import axios from 'axios';
import { Form, Formik } from 'formik';
import React, { useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import TreasuryDepositTable from '../../../vatManagement/report/auditLog/Table/treasuryDepositTable';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import SearchAsyncSelect from '../../../_helper/SearchAsyncSelect';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IForm from '../../../_helper/_form';
import IClose from '../../../_helper/_helperIcons/_close';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import { _todayDate } from '../../../_helper/_todayDate';


const initData = {
    sl: 0,
    scheduleMaintenanceId: "",
    accountId: "",
    businessUnitId: "",
    maintenanceDateTime: "",
    maintenanceTypeId: "",
    maintenanceTypeName: "",
    departmentId: "",
    departmentName: "",
    machineId: "",
    machineName: "",
    completedDateTime: "",
    remarks: "",
    actionBy: "",
    insertDateTime: "",
    lastActionDateTime: "",
    isActive: ""
};


const ScheduleMaintainenceCreate = () => {
    const [objProps, setObjprops] = useState({});
    const [, saveData] = useAxiosPost();
    const [payloadData, setPayloadData] = useState([]);


    const { profileData } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    const selectedBusinessUnit = useSelector((state) => {
        return state.authData.selectedBusinessUnit;
    }, shallowEqual);


    const saveHandler = async (values, cb) => {

        if (payloadData.length > 0) {
            const payload = payloadData.map((item) => {
                return {
                    ...item,
                    accountId: profileData?.accountId,
                    businessUnitId: selectedBusinessUnit?.value,
                    maintenanceDateTime: _todayDate(),
                    actionBy: profileData?.userId,
                    insertDateTime: _todayDate(),
                    lastActionDateTime: _todayDate(),
                    isActive: true,
                    scheduleMaintenanceId: 0,
                };
            });
            saveData('/mes/ScheduleMaintenance/ScheduleMaintenanceCreateAndEdit', payload, cb, TreasuryDepositTable);
        } else {
            toast.error("Please Add Data");
        }
    }

    const addhandler = (values) => {
        setPayloadData([...payloadData, values]);
    };
    const handleCloseHandler = (index) => {
        const data = payloadData.filter((item, idx) => idx !== index);
        setPayloadData(data);
    }
    const loadEnrollList = (v) => {
        if (v?.length < 2) return [];
        return axios
            .get(
                `/mes/ScheduleMaintenance/GetAllmachineListDDL?BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
            )
            .then((res) => {
                return res?.data;
            })
            .catch((err) => []);
    };
    return (
        <IForm title="Create Schedule Maintainance" getProps={setObjprops}>
            {false && <Loading />}
            <>
                <Formik
                    enableReinitialize={true}
                    initialValues={initData}
                    onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
                        saveHandler(values, () => {
                            resetForm(initData);
                            setPayloadData([]);
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
                            <Form className="form form-label-right">
                                {false && <Loading />}

                                <div className="form-group  global-form">
                                    <div className="row">
                                        <div className="col-lg-3">
                                            <label>Machine</label>
                                            <SearchAsyncSelect
                                                selectedValue={{
                                                    value: values?.machineId,
                                                    label: values?.machineName,
                                                }}
                                                isSearchIcon={true}
                                                handleChange={(valueOption) => {
                                                    if (valueOption) {
                                                        setFieldValue('machineId', valueOption?.value);
                                                        setFieldValue('machineName', valueOption?.label);
                                                    } else {
                                                        setFieldValue('machineId', '');
                                                        setFieldValue('machineName', '');
                                                    }
                                                }}
                                                loadOptions={loadEnrollList}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <NewSelect
                                                name="department"
                                                options={
                                                    [
                                                        { value: 1, label: "Electrical" },
                                                        { value: 2, label: "Mechanical" },
                                                    ]
                                                }
                                                value={{
                                                    value: values?.departmentId,
                                                    label: values?.departmentName,
                                                }}
                                                label="Department"
                                                onChange={valueOption => {
                                                    if (valueOption) {
                                                        setFieldValue("departmentName", valueOption?.label);
                                                        setFieldValue("departmentId", valueOption?.value);
                                                    } else {
                                                        setFieldValue("departmentName", "");
                                                        setFieldValue("departmentId", "");
                                                    }
                                                }}
                                                placeholder="Department"
                                                errors={errors}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <NewSelect
                                                name="maintainenceType"
                                                options={
                                                    [
                                                        { value: 1, label: "Daily" },
                                                        { value: 2, label: "Weekly" },
                                                        { value: 3, label: "Monthly" },
                                                        { value: 4, label: "Quaterly" },
                                                        { value: 5, label: "Half Yearly" },
                                                        { value: 6, label: "Anually" },
                                                    ]
                                                }
                                                value={{
                                                    value: values?.maintenanceTypeId,
                                                    label: values?.maintenanceTypeName,
                                                }}
                                                label="Maintainence Type"
                                                onChange={valueOption => {
                                                    if (valueOption) {
                                                        setFieldValue("maintenanceTypeName", valueOption?.label);
                                                        setFieldValue("maintenanceTypeId", valueOption?.value);
                                                    } else {
                                                        setFieldValue("maintenanceTypeName", "");
                                                        setFieldValue("maintenanceTypeId", "");
                                                    }
                                                }}
                                                placeholder="Maintainence Type"
                                                errors={errors}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <InputField
                                                value={values?.maintenanceDateTime}
                                                label="Maintenance Date"
                                                name="maintenanceDateTime"
                                                type="date"
                                                placeholder="Maintainence DateTime"
                                                onChange={(e) => {
                                                    setFieldValue("maintenanceDateTime", e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <InputField
                                                value={values?.completedDateTime}
                                                label="Completed DateTime"
                                                name="completedDateTime"
                                                type="datetime-local"
                                                placeholder="Completed DateTime"
                                                onChange={(e) => {
                                                    setFieldValue("completedDateTime", e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <InputField
                                                value={values?.remarks}
                                                label="Remarks"
                                                name="remarks"
                                                type="text"
                                                placeholder="Remarks"
                                                onChange={(e) => {
                                                    setFieldValue("remarks", e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className="col-lg-3">
                                            <button
                                                type='button'
                                                onClick={
                                                    () => {
                                                        addhandler(values);
                                                    }
                                                }
                                                className="btn btn-primary  mt-5"
                                                disabled={
                                                    !values?.machineId ||
                                                    !values?.departmentId ||
                                                    !values?.maintenanceTypeId ||
                                                    !values?.maintenanceDateTime ||
                                                    !values?.completedDateTime
                                                }
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-5">
                                    <div className="col-lg-12">
                                        <div className="loan-scrollable-table">
                                            {payloadData?.length > 0 ? (<div className="scroll-table _table">
                                                <table className="table table-striped table-bordered bj-table bj-table-landing">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ minWidth: "30px" }}>Sl</th>
                                                            <th style={{ minWidth: "120px" }}>Machine Name</th>
                                                            <th style={{ minWidth: "85px" }}>Department</th>
                                                            <th style={{ minWidth: "85px" }}>Maintainence Type</th>
                                                            <th style={{ minWidth: "85px" }}>Maintainance Date</th>
                                                            <th style={{ minWidth: "85px" }}>Completed Date</th>
                                                            <th style={{ minWidth: "85px" }}>Remarks</th>
                                                            <th style={{ minWidth: "85px" }}>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {payloadData?.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{item?.machineName}</td>
                                                                <td className="text-center">
                                                                    {item?.departmentName}
                                                                </td>
                                                                <td className="text-center">
                                                                    {item?.maintenanceTypeName}
                                                                </td>
                                                                <td className="text-center">
                                                                    {item?.maintenanceDateTime}
                                                                </td>
                                                                <td className="text-center">
                                                                    {_dateFormatter(item?.completedDateTime)}
                                                                </td>
                                                                <td className="text-center">
                                                                    {item?.remarks}
                                                                </td>
                                                                <td className="text-center">
                                                                    <span
                                                                        onClick={() => {
                                                                            handleCloseHandler(index);
                                                                        }}
                                                                    >
                                                                        <IClose />
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>) : null}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    style={{ display: "none" }}
                                    ref={objProps?.btnRef}
                                    onSubmit={() => handleSubmit()}
                                ></button>

                                <button
                                    type="reset"
                                    style={{ display: "none" }}
                                    ref={objProps?.resetBtnRef}
                                    onSubmit={() => resetForm(initData)}
                                ></button>
                            </Form>
                        </>
                    )}
                </Formik>
            </>
        </IForm>
    )
}

export default ScheduleMaintainenceCreate