import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../../_helper/_inputField";
import { shallowEqual, useSelector } from "react-redux";
import { _threeMonthAgoDate, _todayDate } from "../../../../_helper/_todayDate";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import IView from "../../../../_helper/_helperIcons/_view";
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import LocalAirportOutlinedIcon from '@material-ui/icons/LocalAirportOutlined';
import { _dateFormatter, _dateTimeFormatter } from "../../../../_helper/_dateFormate";
import Chips from "../../../../_helper/chips/Chips";
const initData = {
    purchaseOrganization: { value: 0, label: 'ALL' },
    plant: "",
    warehouse: "",
    rfqType: "",
    status: { value: 0, label: 'All' },
    fromDate: _threeMonthAgoDate(),
    toDate: _todayDate(),
};
export default function ErpComparativeStatementLanding() {

    const [landingData, getLandingData, landingDataLoader, setLandingData] = useAxiosGet();
    const { profileData, selectedBusinessUnit } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    const [purchangeOrgListDDL, getPurchaseOrgListDDL, purchaseOrgListDDLloader] = useAxiosGet();
    const [plantListDDL, getPlantListDDL, plantListDDLloader] = useAxiosGet();
    const [warehouseListDDL, getWarehouseListDDL, warehouseListDDLloader] = useAxiosGet();

    useEffect(() => {
        getPurchaseOrgListDDL(`/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${profileData?.accountId
            }&BusinessUnitId=${selectedBusinessUnit?.value}`)

        getPlantListDDL(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId
            }&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [objProps, setObjprops] = useState({});
    const saveHandler = (values, cb) => { };
    // const history = useHistory();

    const getData = (values, pageNo, pageSize) => {

    };

    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(15);

    const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
        getData(values, pageNo, pageSize, searchValue)
    };

    const paginationSearchHandler = (searchValue, values) => {
        setPositionHandler(pageNo, pageSize, values, searchValue);
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
                    {(purchaseOrgListDDLloader || plantListDDLloader || warehouseListDDLloader || landingDataLoader) && <Loading />}
                    <IForm
                        title="Comparative Statement"
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave
                        getProps={setObjprops}
                        renderProps={() => {
                            return (
                                <div>
                                    {/* <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            console.log("create clicked");
                                        }}
                                    >
                                        Create
                                    </button> */}
                                </div>
                            );
                        }}
                    >
                        <Form>
                            <div className="form-group  global-form row">
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="purchaseOrganization"
                                        options={[
                                            { value: 0, label: 'ALL' },
                                            ...purchangeOrgListDDL
                                        ] || []}
                                        value={values?.purchaseOrganization}
                                        label="Purchase Organization"
                                        onChange={(v) => {
                                            setFieldValue("purchaseOrganization", v);
                                            setLandingData([]);
                                        }}
                                        placeholder="Purchase Organization"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="rfqType"
                                        options={
                                            [
                                                { value: 1, label: 'Request for Quotation' },
                                                { value: 2, label: 'Request for Information' },
                                                { value: 3, label: 'Request for Proposal' }
                                            ]
                                        }
                                        value={values?.rfqType}
                                        label="RFQ Type"
                                        onChange={(v) => {
                                            setFieldValue("rfqType", v);
                                            setLandingData([]);
                                        }}
                                        placeholder="RFQ Type"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="plant"
                                        options={plantListDDL || []}
                                        value={values?.plant}
                                        label="Plant"
                                        onChange={(v) => {
                                            setLandingData([]);
                                            if (v) {
                                                setFieldValue("plant", v);
                                                getWarehouseListDDL(`/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PlantId=${v?.value
                                                    }`)
                                            } else {
                                                setFieldValue("plant", "");
                                                setFieldValue("warehouse", "");
                                            }
                                        }}
                                        placeholder="Plant"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="warehouse"
                                        options={warehouseListDDL || []}
                                        value={values?.warehouse}
                                        label="Warehouse"
                                        onChange={(v) => {
                                            setFieldValue("warehouse", v);
                                            setLandingData([]);
                                        }}
                                        placeholder="Warehouse"
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={!values?.plant}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="status"
                                        options={
                                            [
                                                { value: 0, label: 'All' },
                                                { value: 1, label: 'Live' },
                                                { value: 2, label: 'Closed' },
                                                { value: 3, label: 'Pending' },
                                                { value: 4, label: 'Waiting' }
                                            ]
                                        }
                                        value={values?.status}
                                        label="Status"
                                        onChange={(v) => {
                                            setFieldValue("status", v);
                                            setLandingData([]);
                                        }}
                                        placeholder="Status"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        label="From Date"
                                        value={values?.fromDate}
                                        name="fromDate"
                                        placeholder="From Date"
                                        type="date"
                                        onChange={(e) => {
                                            setFieldValue("fromDate", e.target.value);
                                            setLandingData([]);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        label="To Date"
                                        value={values?.toDate}
                                        name="toDate"
                                        placeholder="To Date"
                                        type="date"
                                        onChange={(e) => {
                                            setFieldValue("toDate", e.target.value);
                                            setLandingData([]);
                                        }}
                                        disabled={false}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        style={{
                                            marginTop: "18px",
                                        }}
                                        onClick={() => {
                                            console.log("values", values);
                                            const dummyData = [{
                                                purchaseOrganizationName: "Foreign Procurement",
                                                requestForQuotationCode: "RFQ-2021-0001",
                                                rfqdate: "2021-07-01T00:00:00",
                                                rfqType: "Standard",
                                                rfqTitle: "ARL stationery items",
                                                plant: "ACCL Narayangonj",
                                                warehouse: "ACCL Factory",
                                                currencyCode: "USD",
                                                startDateTime: "2021-07-01T00:00:00",
                                                endDateTime: "2021-07-01T00:00:00",
                                                rfqStatus: "Live",
                                                approvalStatus: "Approved",
                                                createdBy: "Wahed",
                                            },
                                            {
                                                purchaseOrganizationName: "Local Procurement",
                                                requestForQuotationCode: "RFQ-2021-0001",
                                                rfqdate: "2021-07-01T00:00:00",
                                                rfqType: "Standard",
                                                rfqTitle: "ARL stationery items",
                                                plant: "ACCL Narayangonj",
                                                warehouse: "APFIL Factory",
                                                currencyCode: "BDT",
                                                startDateTime: "2021-07-01T00:00:00",
                                                endDateTime: "2021-07-01T00:00:00",
                                                rfqStatus: "Closed",
                                                approvalStatus: "Pending",
                                                createdBy: "Wahed",
                                            }]
                                            setLandingData(dummyData)
                                            // getData(values, pageNo, pageSize)
                                        }}
                                    // disabled={
                                    //     !values?.purchaseOrganization ||
                                    //     !values?.rfqType ||
                                    //     !values?.plant ||
                                    //     !values?.warehouse ||
                                    //     !values?.status ||
                                    //     !values?.fromDate ||
                                    //     !values?.toDate
                                    // }
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                            {/*  */}
                            <div className="mb-2 mt-2">
                                <PaginationSearch
                                    placeholder="Search RFQ No"
                                    paginationSearchHandler={paginationSearchHandler}
                                    values={values}
                                />
                            </div>
                            <div>
                                {console.log("landingData", landingData)}
                                <table className="table table-striped table-bordered bj-table bj-table-landing">
                                    <thead>
                                        <tr>
                                            <th>SL</th>
                                            <th>RFQ No</th>
                                            <th>RFQ Date</th>
                                            <th>RFQ Type</th>
                                            <th>RFQ Title</th>
                                            <th>Plant</th>
                                            <th>Warehouse</th>
                                            <th>Currency</th>
                                            <th>Quotation Start Date-Time</th>
                                            <th>Quotation End Date-Time</th>
                                            <th>RFQ Status</th>
                                            <th>Approval Status</th>
                                            <th>Created by</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {landingData?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {
                                                        item?.purchaseOrganizationName === "Foreign Procurement" ?
                                                            <span>
                                                                <LocalAirportOutlinedIcon style={{
                                                                    color: "#00FF00",
                                                                    marginRight: "5px",
                                                                    rotate: "90deg",
                                                                    fontSize: "15px"
                                                                }} />
                                                                {item?.requestForQuotationCode}
                                                            </span>
                                                            :
                                                            <span>
                                                                <LocalShippingIcon style={{
                                                                    color: "#000000",
                                                                    marginRight: "5px",
                                                                    fontSize: "15px"
                                                                }} />

                                                                {item?.requestForQuotationCode}
                                                            </span>
                                                    }
                                                </td>
                                                <td className="text-center">{_dateFormatter(item?.rfqdate)}</td>
                                                <td>{item?.rfqType}</td>
                                                <td>{item?.rfqTitle}</td>
                                                <td>{item?.plant}</td>
                                                <td>{item?.warehouse}</td>
                                                <td>{item?.currencyCode}</td>
                                                <td className="text-center">{_dateTimeFormatter(item?.startDateTime)}</td>
                                                <td className="text-center">{_dateTimeFormatter(item?.endDateTime)}</td>
                                                <td className="text-center">{
                                                    item?.rfqStatus && item?.rfqStatus === "Live" ? (
                                                        <Chips classes="badge-primary" status={item?.rfqStatus} />
                                                    ) : item?.rfqStatus === "Closed" ? (
                                                        <Chips classes="badge-danger" status={item?.rfqStatus} />
                                                    ) : item?.rfqStatus === "Pending" ? (
                                                        <Chips classes="badge-warning" status={item?.rfqStatus} />
                                                    ) : item?.rfqStatus === "Waiting" ? (
                                                        <Chips classes="badge-info" status={item?.rfqStatus} />
                                                    ) : null
                                                }</td>
                                                <td className="text-center">{
                                                    item?.approvalStatus && item?.approvalStatus === "Approved" ? (
                                                        <Chips classes="badge-success" status={item?.approvalStatus} />
                                                    ) : item?.approvalStatus === "Pending" ? (
                                                        <Chips classes="badge-warning" status={item?.approvalStatus} />
                                                    ) : null
                                                }</td>
                                                <td>{item?.createdBy}</td>
                                                <td className="text-center">
                                                    <span className="ml-2 mr-3">
                                                        <IView clickHandler={
                                                            () => { }
                                                        } />
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {landingData?.data?.length > 0 ? (
                                    <PaginationTable
                                        count={landingData?.totalCount}
                                        setPositionHandler={setPositionHandler}
                                        paginationState={{
                                            pageNo,
                                            setPageNo,
                                            pageSize,
                                            setPageSize,
                                        }}
                                        values={values}
                                    />) : null}
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
                    </IForm>
                </>
            )}
        </Formik>
    );
}