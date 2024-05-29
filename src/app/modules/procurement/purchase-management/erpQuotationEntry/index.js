import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import { _threeMonthAgoDate, _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

const initData = {
  purchaseOrganization: { value: 0, label: 'ALL' },
  rfqType: { value: 1, label: 'Standard RFQ' },
  plant: "",
  warehouse: "",
  fromDate: _threeMonthAgoDate(),
  toDate: _todayDate(),
};

export default function ErpQuotationEntryLanding() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const saveHandler = (values, cb) => { };
  const [purchangeOrgListDDL, getPurchaseOrgListDDL, purchaseOrgListDDLloader] = useAxiosGet();
  const [plantListDDL, getPlantListDDL, plantListDDLloader] = useAxiosGet();
  const [warehouseListDDL, getWarehouseListDDL, warehouseListDDLloader] = useAxiosGet();
  const [landingData, , landingDataLoader, setLandingData] = useAxiosGet();
 
  useEffect(() => {
    getPurchaseOrgListDDL(`/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${profileData?.accountId
      }&BusinessUnitId=${selectedBusinessUnit?.value}`)

    getPlantListDDL(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId
      }&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = (values, pageNo, pageSize, searchValue = "") => {
    return toast.warn("API is under development")
    // getLandingData(`/procurement/RequestForQuotation/GetRequestForQuotationPasignation?AccountId=${profileData?.accountId
    //   }&UnitId=${selectedBusinessUnit?.value
    //   }&RequestTypeId=${values?.rfqType?.value}&SBUId=${values?.sbu?.value
    //   }&PurchaseOrganizationId=${values?.purchaseOrganization?.value
    //   }&PlantId=${values?.plant?.value}&WearHouseId=${values?.warehouse?.value
    //   }&status=${values?.status?.label}&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize
    //   }&fromDate=${values?.fromDate}&toDate=${values?.toDate}&search=${searchValue}`
    // )
  }

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
            title="Quotation Entry Landing"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  {/* <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        history.push("route here");
                      }}
                    >
                      Create
                    </button> */}
                </div>
              );
            }}
          >
            <Form>
              <div>
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
                        // setLandingData([]);
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
                          { value: 1, label: 'Standard RFQ' },
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
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="plant"
                      options={plantListDDL || []}
                      value={values?.plant}
                      label="Plant"
                      onChange={(v) => {
                        if (v) {
                          setFieldValue("plant", v);
                          setFieldValue("warehouse", "");
                          setLandingData([]);
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
                        getData(values, pageNo, pageSize)
                      }}
                      disabled={
                        !values?.purchaseOrganization ||
                        !values?.rfqType ||
                        !values?.plant ||
                        !values?.warehouse ||
                        !values?.fromDate ||
                        !values?.toDate
                      }
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary ml-1"
                      style={{ marginTop: "18px" }}
                      onClick={() => {
                        toast.warn("Export excel is under development")
                      }}
                      disabled={!landingData?.data?.length > 0}
                    >
                      Export Excel
                    </button>
                  </div>
                </div>
                <div className="mb-2">
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
                        <th>Plant</th>
                        <th>Warehouse</th>
                        <th>Currency</th>
                        <th>RFQ Start Date-Time</th>
                        <th>RFQ End Date-Time</th>
                        <th>Created By</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {landingData?.data?.length > 0 && landingData?.data?.map((item, index) => (
                        <tr>

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
                    />) : null}
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}