import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import Loading from '../../../../_helper/_loading';

import PaginationTable from '../../../../_helper/_tablePagination';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import PaginationSearch from '../../../../_helper/_search';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import { shallowEqual, useSelector } from 'react-redux';
import NewSelect from '../../../../_helper/_select';
import InputField from '../../../../_helper/_inputField';
import IViewModal from '../../../../_helper/_viewModal';
import AdjustmentDetailsModal from './adjustmentDetailsModal';
import { _monthFirstDate } from '../../../../_helper/_monthFirstDate';
import { _todayDate } from '../../../../_helper/_todayDate';
const initData = {
    search: "",
    plant: "",
    warehouse: "",
    fromDate: _monthFirstDate(),
    toDate: _todayDate(),
}
const InventoryAdjust = () => {
    const { profileData, selectedBusinessUnit } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [tableData, getTableData, tableDataLoader] = useAxiosGet();
    const [plantDDL, getPlantDDL, plantDDLloader] = useAxiosGet();
    const [wareHouseDDL, getWareHouseDDL, wareHouseDDLloader] = useAxiosGet();

    const [isShowModal, setIsShowModal] = useState(false);
    const [currentRow, setCurrentRow] = useState({});


    const paginationSearchHandler = (value, values) => {
        getTableData(`/wms/InventoryTransaction/GetInventoryAdjustmentSearchPagination?searchTerm=${value || ""
            }&accountId=${profileData?.accountId
            }&businessUnitId=${selectedBusinessUnit?.value
            }&warehouseId=${values?.warehouse?.value
            }&fromDate=${values?.fromDate
            }&toDate=${values?.toDate
            }&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=1`)
    }

    const setPositionHandler = (pageNo, pageSize, values) => {
        getTableData(`/wms/InventoryTransaction/GetInventoryAdjustmentSearchPagination?searchTerm=${values?.search || ""
            }&accountId=${profileData?.accountId
            }&businessUnitId=${selectedBusinessUnit?.value
            }&warehouseId=${values?.warehouse?.value
            }&fromDate=${values?.fromDate
            }&toDate=${values?.toDate
            }&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=1`)
    };

    useEffect(() => {
        getPlantDDL(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initData}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                // resetForm(initData);
            }}
        >
            {({
                handleSubmit,
                resetForm,
                values,
                errors,
                touched,
                setFieldValue,
                setValues,
                isValid,
            }) => (
                <>
                    {(tableDataLoader || plantDDLloader || wareHouseDDLloader) && <Loading />}
                    <Form>
                        <div className="form form-label-right row">
                            <div className="col-lg-12">
                                <div className="global-form">
                                    <div className="row d-flex justify-content-between align-items-center">
                                        <div className="col-lg-9">
                                            <h1>Inventory Adjustment</h1>
                                        </div>
                                        <div className="col-lg-3">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group  global-form row">
                            <div className="col-lg-3">
                                <NewSelect
                                    name="plant"
                                    options={plantDDL || []}
                                    value={values?.plant}
                                    label="Plant"
                                    onChange={(valueOption) => {
                                        setFieldValue('plant', valueOption);
                                        getWareHouseDDL(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId}&AccId=${profileData?.accountId
                                            }&BusinessUnitId=${selectedBusinessUnit?.value
                                            }&PlantId=${valueOption?.value
                                            }&OrgUnitTypeId=8`)
                                    }}
                                    placeholder="plant"
                                />
                            </div>
                            <div className="col-lg-3">
                                <NewSelect
                                    name="warehouse"
                                    options={wareHouseDDL || []}
                                    value={values?.warehouse}
                                    label="warehouse"
                                    onChange={(valueOption) => {
                                        setFieldValue('warehouse', valueOption);
                                    }}
                                    placeholder="Warehouse"
                                />
                            </div>
                            <div className="col-lg-2">
                                <InputField
                                    value={values?.fromDate}
                                    label="From Date"
                                    name="fromDate"
                                    type="date"
                                    onChange={e => {
                                        setFieldValue('fromDate', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="col-lg-2">
                                <InputField
                                    value={values?.toDate}
                                    label="To Date"
                                    name="toDate"
                                    type="date"
                                    onChange={e => {
                                        setFieldValue('toDate', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="col-lg-2">
                                <button
                                    style={{ marginTop: '18px' }}
                                    className="btn btn-primary ml-2"
                                    disabled={false}
                                    onClick={() => {
                                        console.log("values", values);
                                        getTableData(`/wms/InventoryTransaction/GetInventoryAdjustmentSearchPagination?searchTerm=${values?.search
                                            }&accountId=${profileData?.accountId
                                            }&businessUnitId=${selectedBusinessUnit?.value
                                            }&warehouseId=${values?.warehouse?.value
                                            }&fromDate=${values?.fromDate
                                            }&toDate=${values?.toDate
                                            }&PageNo=1&PageSize=1&viewOrder=1`)
                                    }}
                                >
                                    Show
                                </button>
                            </div>
                        </div>
                        <div>
                            <PaginationSearch
                                placeholder="Transaction Code Search"
                                paginationSearchHandler={paginationSearchHandler}
                                values={values}
                            />
                        </div>
                    </Form>
                  <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                        <thead>
                            <tr>
                                <th>SL</th>
                                <th>Transaction Code</th>
                                <th>Reference Type</th>
                                <th>Reference No.</th>
                                <th>Transaction Type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData?.data?.map((item, i) => (
                                <tr>
                                    <td className="text-center">{item?.sl}</td>
                                    <td>
                                        <span className="pl-2">{item?.strCode}</span>
                                    </td>
                                    <td>
                                        <span className="pl-2">{item.whName}</span>
                                    </td>
                                    <td className="text-center">
                                        {_dateFormatter(item?.transectionDate)}
                                    </td>
                                    <td className="text-center">{item?.quantity}</td>
                                    <td className="text-center">{item?.strNarration}</td>
                                    <td className="text-center">
                                        X
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
                    {tableData?.data?.length > 0 && (<PaginationTable
                        count={tableData?.totalCount}
                        setPositionHandler={setPositionHandler}
                        paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                        values={values}
                    />)}
                    <IViewModal
                        show={isShowModal}
                        onHide={() => setIsShowModal(false)}
                        title="Inventory Adjustment"
                        modelSize="sm"
                    >
                        <AdjustmentDetailsModal landingValues={values} setLandingField={setFieldValue} currentRow={currentRow} setCurrentRow={setCurrentRow} />
                    </IViewModal>
                </>
            )}

        </Formik>
    )
}

export default InventoryAdjust