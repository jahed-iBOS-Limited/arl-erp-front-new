import { Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardHeaderToolbar, ModalProgressBar } from '../../../../../_metronic/_partials/controls';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IEdit from '../../../_helper/_helperIcons/_edit';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import PaginationTable from '../../../_helper/_tablePagination';
import { _todayDate } from '../../../_helper/_todayDate';
import IViewModal from '../../../_helper/_viewModal';
import ScheduleMaintainanceModal from './Modal';
import './styles.css';

const initData = {
    maintenanceDate: _todayDate(),
    departmentId: 1,
    departamentName: 'Electrical',
    maintenanceTypeId: 1,
    maintenanceTypeName: 'Daily',
};

const ScheduleMaintainence = () => {
    const [data, getData, loading] = useAxiosGet();
    const [isShowRowItemModal, setIsShowRowItemModal] = useState(false);
    const [clickedRowItem, setClickedRowItem] = useState(null);
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const history = useHistory();

    const selectedBusinessUnit = useSelector((state) => {
        return state.authData.selectedBusinessUnit;
    }, shallowEqual);


    const getLandingData = (values, pageNo, pageSize, searchValue) => {
        getData(
            `/mes/ScheduleMaintenance/GetScheduleMaintenanceLanding?BusinessUnitId=${selectedBusinessUnit.value}&PageNo=${pageNo}&PageSize=${pageSize}&Search=${searchValue}&Date=${values.maintenanceDate}&DepartmentId=${values.departmentId}&MaintenanceTypeId=${values.maintenanceTypeId}`
        );

    };

    const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
        getLandingData(values, pageNo, pageSize, searchValue);
    };

    const viewHandler = (values) => {
        getLandingData(values, pageNo, pageSize, "");
    }
    useEffect(() => {
        getData(`/mes/ScheduleMaintenance/GetScheduleMaintenanceLanding?BusinessUnitId=${selectedBusinessUnit.value}&PageNo=${pageNo}&PageSize=${pageSize}&Search=&Date=${_todayDate()}&DepartmentId=1&MaintenanceTypeId=1`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
                errors,
                touched,
                setFieldValue,
                isValid,
            }) => (
                <>
                    <Card>
                        {true && <ModalProgressBar />}
                        <CardHeader title="Schedule Maintainence">
                            <CardHeaderToolbar>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        history.push(
                                            "/production-management/ACCLFactory/Schedule-Maintenance/create",
                                        );
                                    }}
                                >
                                    Create
                                </button>
                            </CardHeaderToolbar>
                        </CardHeader>
                        <CardBody>
                            {loading && <Loading />}
                            <div className=" row mb-4 global-form">
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.maintenanceDate}
                                        label="Maintenance Date"
                                        name="maintenanceDate"
                                        type="date"
                                        placeholder="Maintainence DateTime"
                                        onChange={(e) => {
                                            setFieldValue("maintenanceDate", e.target.value);
                                        }}
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
                                        value={
                                            {
                                                value: values?.departmentId,
                                                label: values?.departamentName
                                            }
                                        }
                                        label="Department"
                                        onChange={valueOption => {
                                            if (valueOption) {
                                                setFieldValue("departamentName", valueOption?.label);
                                                setFieldValue("departmentId", valueOption?.value);
                                            } else {
                                                setFieldValue("departamentName", "");
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
                                        value={
                                            {
                                                value: values?.maintenanceTypeId,
                                                label: values?.maintenanceTypeName
                                            }
                                        }
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
                                <div className="col-lg-3 schedule-maintainence-modal-view-button">
                                    <button
                                        type='button'
                                        onClick={() => { viewHandler(values) }}
                                        className="btn btn-primary"
                                        disabled={false}
                                    >
                                        View
                                    </button>
                                </div>

                            </div>

                            {loading ? <Loading /> : ""}
                            <div className="row">
                                <div className="col-lg-12">
                                    {data?.scheduleMaintenance?.length > 0 && (
                                        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                                            <thead>
                                                <tr>
                                                    <th>Sl</th>
                                                    <th>Machine Name</th>
                                                    <th>Department Name</th>
                                                    <th>Maintenance Type</th>
                                                    <th>Maintenance Date</th>
                                                    <th>Completed Date</th>
                                                    <th>Remarks</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    data?.scheduleMaintenance?.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{item?.machineName}</td>
                                                            <td>{item?.departmentName}</td>
                                                            <td>{item?.maintenanceTypeName}</td>
                                                            <td>{_dateFormatter(item?.maintenanceDateTime)}</td>
                                                            <td>{_dateFormatter(item?.completedDateTime)}</td>
                                                            <td>{item?.remarks}</td>
                                                            <td className='text-center'>
                                                                <IEdit
                                                                    onClick={
                                                                        () => {
                                                                            setClickedRowItem(item);
                                                                            setIsShowRowItemModal(true);
                                                                        }
                                                                    }

                                                                />
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    )}

                                    {data?.scheduleMaintenance?.length > 0 && (<PaginationTable
                                        count={data?.scheduleMaintenance?.length}
                                        setPositionHandler={setPositionHandler}
                                        paginationState={{
                                            pageNo,
                                            setPageNo,
                                            pageSize,
                                            setPageSize,
                                        }}
                                        values={values}
                                    />)}
                                </div>
                            </div>

                            <IViewModal
                                show={isShowRowItemModal}
                                onHide={() => setIsShowRowItemModal(false)}
                                title="Edit Schedule Maintainence"
                                modelSize="lg"
                            >
                                <ScheduleMaintainanceModal
                                    clickedRowItem={clickedRowItem}
                                    setIsShowRowItemModal={setIsShowRowItemModal}
                                    viewHandler={viewHandler}
                                    landingValues={values}
                                />
                            </IViewModal>
                        </CardBody>
                    </Card>
                </>
            )}
        </Formik>
    )
}

export default ScheduleMaintainence