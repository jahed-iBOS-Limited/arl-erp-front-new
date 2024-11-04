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
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import LocalAirportOutlinedIcon from "@material-ui/icons/LocalAirportOutlined";
import {
  _dateFormatter,
  _dateTimeFormatter,
} from "../../../../_helper/_dateFormate";
import Chips from "../../../../_helper/chips/Chips";
import { useHistory } from "react-router-dom";
import IAdd from "../../../../_helper/_helperIcons/_add";
import { eProcurementBaseURL } from "../../../../../App";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { deleteHandler } from "../cs/helper";
import IDelete from "../../../../_helper/_helperIcons/_delete";
const initData = {
  purchaseOrganization: { value: 0, label: "ALL" },
  plant: "",
  warehouse: "",
  rfqType: "",
  status: { value: 0, label: "All" },
  fromDate: _threeMonthAgoDate(),
  toDate: _todayDate(),
};
let statusDDL = [
  {
    value: "All",
    label: "All",
    isActive: true,
    nameForApi: "All",
  },
  {
    value: "Ready For CS",
    label: "Ready For CS",
    isActive: false,
    nameForApi: "Ready For CS",
  },
  {
    value: "Pending",
    label: "Pending",
    isActive: false,
    nameForApi: "Pending",
  },
  {
    value: "Live",
    label: "Live",
    isActive: false,
    nameForApi: "Live",
  },
  {
    value: "Approved",
    label: "Approved",
    isActive: false,
    nameForApi: "Approved",
  },
];

export default function ErpComparativeStatementLanding() {
  const [
    landingData,
    getLandingData,
    landingDataLoader,
    setLandingData,
  ] = useAxiosGet();
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const history = useHistory();

  const [, deleteRFQById, deleteRFQLoading] = useAxiosPost();

  const [
    purchangeOrgListDDL,
    getPurchaseOrgListDDL,
    purchaseOrgListDDLloader,
  ] = useAxiosGet();
  const [
    plantListDDL,
    getPlantListDDL,
    plantListDDLloader,
    setPlantListDDL,
  ] = useAxiosGet();
  const [
    warehouseListDDL,
    getWarehouseListDDL,
    warehouseListDDLloader,
    setWarehouseListDDL,
  ] = useAxiosGet();

  useEffect(() => {
    getPurchaseOrgListDDL(
      `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );

    getPlantListDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`,
      (data) => {
        // let list = [];
        // // eslint-disable-next-line array-callback-return, no-unused-expressions
        // data?.map((item) => {
        //   list.push({
        //     value: item?.rowId,
        //     label: item?.itemName,
        //   });
        // });
        setPlantListDDL([{ value: 0, label: "All" }, ...data]);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [objProps, setObjprops] = useState({});
  const saveHandler = (values, cb) => {};
  // const history = useHistory();

  const getData = (values, pageNo, pageSize) => {};

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getData(values, pageNo, pageSize, searchValue);
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
          {(purchaseOrgListDDLloader ||
            plantListDDLloader ||
            warehouseListDDLloader ||
            landingDataLoader) && <Loading />}
          <IForm
            title="Comparative Statement"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            getProps={setObjprops}
            // renderProps={() => {
            //   return (
            //     <div>
            //       <button
            //         type="button"
            //         col-lg-2
            //         className="btn btn-primary"
            //         onClick={() => {
            //           history.push(
            //             "/mngProcurement/purchase-management/cs/create"
            //           );
            //         }}
            //       >
            //         Create
            //       </button>
            //     </div>
            //   );
            // }}
          >
            <Form>
              <div className="form-group  global-form row">
                {/* <div className="col-lg-3">
                  <NewSelect
                    name="purchaseOrganization"
                    options={
                      [{ value: 0, label: "ALL" }, ...purchangeOrgListDDL] || []
                    }
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
                    options={[
                      { value: 1, label: "Request for Quotation" },
                      { value: 2, label: "Request for Information" },
                      { value: 3, label: "Request for Proposal" },
                    ]}
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
                </div> */}
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
                        getWarehouseListDDL(
                          `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PlantId=${v?.value}`,
                          (data) => {
                            setWarehouseListDDL([
                              { value: 0, label: "All" },
                              ...data,
                            ]);
                          }
                        );
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
                    options={statusDDL || []}
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
                {/* <div className="col-lg-3">
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
                </div> */}
                <div className="col-lg-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      marginTop: "18px",
                    }}
                    onClick={() => {
                      getLandingData(
                        `${eProcurementBaseURL}/ComparativeStatement/GetComparativeStatementLanding?businessUnitId=${
                          selectedBusinessUnit?.value
                        }&plantId=${values?.plant?.value}&warehouseId=${
                          values?.warehouse?.value
                        }&partnerId=${0}&status=${values?.status?.label}`
                      );

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
                <div className="table-responsive">
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
                        {/* <th>Approval Status</th> */}
                        <th>Total Items</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {landingData?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            {item?.purchaseOrganizationName ===
                            "Foreign Procurement" ? (
                              <span>
                                <LocalAirportOutlinedIcon
                                  style={{
                                    color: "#00FF00",
                                    marginRight: "5px",
                                    rotate: "90deg",
                                    fontSize: "15px",
                                  }}
                                />
                                {item?.requestForQuotationCode}
                              </span>
                            ) : (
                              <span>
                                <LocalShippingIcon
                                  style={{
                                    color: "#000000",
                                    marginRight: "5px",
                                    fontSize: "15px",
                                  }}
                                />

                                {item?.requestForQuotationCode}
                              </span>
                            )}
                          </td>
                          <td className="text-center">
                            {_dateFormatter(item?.rfqDate)}
                          </td>
                          <td>{item?.requestTypeName}</td>
                          <td>{item?.rfqTitle}</td>
                          <td>{item?.plantName}</td>
                          <td>{item?.warehouseName}</td>
                          <td>{item?.currencyCode}</td>
                          <td className="text-center">
                            {_dateTimeFormatter(item?.quotationEntryStart)}
                          </td>
                          <td className="text-center">
                            {_dateTimeFormatter(item?.validTillDate)}
                          </td>
                          <td className="text-center">
                            {item?.status && item?.status === "Live" ? (
                              <Chips
                                classes="badge-primary"
                                status={item?.status}
                              />
                            ) : item?.status &&
                              item?.status === "Ready For CS" ? (
                              <Chips
                                classes="badge-success"
                                status={item?.status}
                              />
                            ) : item?.status && item?.status === "Pending" ? (
                              <Chips
                                classes="badge-warning"
                                status={item?.status}
                              />
                            ) : item?.status && item?.status === "Approved" ? (
                              <Chips
                                classes="badge-info"
                                status={item?.status}
                              />
                            ) : item?.status && item?.status === "All" ? (
                              <Chips
                                classes="badge-primary"
                                status={item?.status}
                              />
                            ) : null}
                          </td>
                          {/* <td className="text-center">
                            {item?.status && item?.status === "Approved" ? (
                              <Chips
                                classes="badge-success"
                                status={item?.status}
                              />
                            ) : item?.status === "Pending" ? (
                              <Chips
                                classes="badge-warning"
                                status={item?.status}
                              />
                            ) : null}
                          </td> */}
                          <td>{item?.totalItems}</td>
                          <td className="text-center d-flex">
                            {item?.status &&
                            item?.status === "Ready For CS" &&
                            !item?.comparativeStatementType ? (
                              <span
                                className="ml-2 mr-3"
                                onClick={() => {
                                  history.push({
                                    pathname: `/mngProcurement/purchase-management/cs/create`,
                                    state: { rfqDetail: item, isView: false },
                                  });
                                }}
                              >
                                <IAdd title={"Add"} />
                              </span>
                            ) : item?.comparativeStatementType ? (
                              <span
                                className="ml-2"
                                onClick={() => {
                                  history.push({
                                    pathname: `/mngProcurement/purchase-management/cs/view`,
                                    state: { rfqDetail: item, isView: true },
                                  });
                                }}
                              >
                                <IView title={"View"} />
                              </span>
                            ) : null}
                            {item?.status &&
                              item?.status !== "Approved" &&
                              item?.comparativeStatementType && (
                                <span
                                  className="ml-2 mr-3"
                                  onClick={() => {
                                    deleteHandler({
                                      item: {
                                        ...item,
                                      },
                                      deleteRFQById,
                                      CB: () => {
                                        getLandingData(
                                          `${eProcurementBaseURL}/ComparativeStatement/GetComparativeStatementLanding?businessUnitId=${
                                            selectedBusinessUnit?.value
                                          }&plantId=${
                                            values?.plant?.value
                                          }&warehouseId=${
                                            values?.warehouse?.value
                                          }&partnerId=${0}&status=${
                                            values?.status?.label
                                          }`
                                        );
                                      },
                                    });
                                  }}
                                >
                                  <IDelete title={"Delete"} />
                                </span>
                              )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                  />
                ) : null}
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
