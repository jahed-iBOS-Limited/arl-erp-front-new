import React, { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import TableGird from "./gird";
import { Formik, Form } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import moment from "moment";
import {
  getTaxSalesReport_api,
  getItemDDL_api,
  GetBranchDDL,
  getPartnerNameDDL_api,
  GetItemTypeDDL_api,
  GetItemNameDDL_api,
  getWarehouseDDL,
  GetSellableReportApi,
} from "../helper";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import "./style.css";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import PaginationTable from "../../../../_helper/_tablePagination";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  shipmentName: "",
  taxItemName: "",
  partnerName: "",
  salesReportType: {
    value: 1,
    label: "Sales Report",
  },
};

export default function SalesReportOMSTable() {
  const printRef = useRef();
  const [rowDto, setRowDto] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
  const [branch, setBranch] = useState([]);
  const [partnerNameDDL, setPartnerNameDDL] = useState([]);
  const [taxItemNameDDL, setTaxItemNameDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [itemName, setItemName] = useState([]);
  const [itemTypeDDL, setitemType] = useState([]);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getItemDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTaxItemNameDDL
      );
      GetBranchDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setBranch
      );
      getPartnerNameDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPartnerNameDDL
      );

      getPlantDDL(
        `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
      );
      GetItemTypeDDL_api(setitemType);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  console.log(rowDto)

  const commonGridDataApi = (
    values,
    _pageNo = pageNo,
    _pageSize = pageSize
  ) => {
    setRowDto([]);
    if (values?.salesReportType?.value === 1) {
      getTaxSalesReport_api(
        selectedBusinessUnit?.value,
        values?.taxItemName?.value,
        values?.shipmentName?.value,
        values?.fromDate,
        values?.toDate,
        values?.partnerName?.value,
        setRowDto,
        setLoading
      );
    } else {
      GetSellableReportApi(
        selectedBusinessUnit?.value,
        values?.itemName?.value,
        values?.itemType?.value,
        values?.fromDate,
        values?.toDate,
        values?.plant?.value,
        values?.warehouse?.value,
        _pageNo,
        _pageSize,
        setRowDto,
        setLoading
      );
    }
  };
  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title="Sales Report"
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
          pageStyle={
            "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}"
          }
        >
          <div>
            <div className="mx-auto SalesReportOMG">
              <Formik enableReinitialize={true} initialValues={initData}>
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form">
                        <div className="col-lg-3">
                          <NewSelect
                            name="salesReportType"
                            options={
                              [
                                {
                                  value: 1,
                                  label: "Sales Report",
                                },
                                {
                                  value: 2,
                                  label: "Sellable Report",
                                },
                              ] || []
                            }
                            value={values?.salesReportType}
                            label="Sales Report Type"
                            onChange={(valueOption) => {
                              setFieldValue("salesReportType", valueOption);
                              setRowDto([]);
                            }}
                            placeholder="Sales Report Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        {/*  if type Sales Report */}
                        {values?.salesReportType?.value === 1 && (
                          <>
                            {" "}
                            <div className="col-lg-3">
                              <NewSelect
                                name="shipmentName"
                                options={
                                  [{ value: 0, label: "All" }, ...branch] || []
                                }
                                value={values?.shipmentName}
                                label="Ship Point"
                                onChange={(valueOption) => {
                                  setFieldValue("shipmentName", valueOption);
                                  setRowDto([]);
                                }}
                                placeholder="Ship Point"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-3">
                              <NewSelect
                                name="taxItemName"
                                options={[
                                  { value: 0, label: "All" },
                                  ...taxItemNameDDL,
                                ]}
                                value={values?.taxItemName}
                                label="Item Name"
                                onChange={(valueOption) => {
                                  setFieldValue("taxItemName", valueOption);
                                  setRowDto([]);
                                }}
                                placeholder="Item Name"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-3">
                              <NewSelect
                                name="partnerName"
                                options={
                                  [
                                    { value: 0, label: "All" },
                                    ...partnerNameDDL,
                                  ] || []
                                }
                                value={values?.partnerName}
                                onChange={(valueOption) => {
                                  setFieldValue("partnerName", valueOption);
                                  setRowDto([]);
                                }}
                                errors={errors}
                                touched={touched}
                                label="Customer Name"
                                placeholder="Customer Name"
                              />
                            </div>
                          </>
                        )}

                        {/*  if type Sellable Report */}
                        {values?.salesReportType?.value === 2 && (
                          <>
                            <div className="col-lg-3">
                              <NewSelect
                                name="plant"
                                options={plantDDL}
                                value={values?.plant}
                                label="Plant"
                                onChange={(valueOption) => {
                                  setRowDto([]);
                                  setFieldValue("plant", valueOption);
                                  setFieldValue("warehouse", "");
                                  getWarehouseDDL(
                                    profileData.userId,
                                    profileData.accountId,
                                    selectedBusinessUnit.value,
                                    valueOption?.value,
                                    setWarehouse
                                  );
                                }}
                              />
                            </div>
                            <div className="col-lg-3">
                              <NewSelect
                                name="warehouse"
                                options={warehouse || []}
                                value={values?.warehouse}
                                label="Select Warehouse"
                                onChange={(valueOption) => {
                                  setRowDto([]);
                                  setFieldValue("warehouse", valueOption);
                                }}
                                placeholder="Select Warehouse"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-3">
                              <NewSelect
                                name="itemType"
                                options={itemTypeDDL || []}
                                value={values?.itemType}
                                label="Item Type"
                                onChange={(valueOption) => {
                                  setRowDto([]);
                                  setFieldValue("itemType", valueOption);
                                  setFieldValue("itemName", "");
                                  GetItemNameDDL_api(
                                    profileData.accountId,
                                    selectedBusinessUnit.value,
                                    valueOption?.value,
                                    setItemName
                                  );
                                }}
                                placeholder="Item Type"
                                errors={errors}
                                touched={touched}
                                // isDisabled={isEdit}
                              />
                            </div>

                            <div className="col-lg-3">
                              <NewSelect
                                name="itemName"
                                options={
                                  [{ value: 0, label: "All" }, ...itemName] ||
                                  []
                                }
                                value={values?.itemName}
                                label="Item"
                                onChange={(valueOption) => {
                                  setRowDto([]);
                                  setFieldValue("itemName", valueOption);
                                }}
                                placeholder="Item Name"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </>
                        )}

                        <div className="col-lg-3">
                          <label>From Date</label>
                          <InputField
                            value={values?.fromDate}
                            placeholder="From Date"
                            name="fromDate"
                            type="date"
                            touched={touched}
                            onChange={(e) => {
                              setFieldValue("fromDate", e.target.value);
                              setRowDto([]);
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>To Date</label>
                          <InputField
                            value={values?.toDate}
                            placeholder="To Date"
                            name="toDate"
                            type="date"
                            touched={touched}
                            onChange={(e) => {
                              setFieldValue("toDate", e.target.value);
                              setRowDto([]);
                            }}
                          />
                        </div>
                        <div className="mt-2 col d-flex justify-content-end align-items-center">
                          <button
                            disabled={
                              values?.salesReportType?.value === 1
                                ? !values?.shipmentName ||
                                  !values?.partnerName ||
                                  !values?.taxItemName
                                : !values?.plant ||
                                  !values?.warehouse ||
                                  !values?.itemType ||
                                  !values?.itemName
                            }
                            className="btn btn-primary"
                            onClick={() => {
                              commonGridDataApi(values);
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                      {loading && <Loading />}
                      <div ref={printRef}>
                        {/* sales report table */}
                        {values?.salesReportType?.value === 1 && (
                          <SalesReportTable
                            rowDto={rowDto}
                            selectedBusinessUnit={selectedBusinessUnit}
                            values={values}
                          />
                        )}

                        {/* Sellable Report Table */}
                        {values?.salesReportType?.value === 2 && (
                          <SellableReportTable
                            rowDto={rowDto}
                            selectedBusinessUnit={selectedBusinessUnit}
                            values={values}
                            commonGridDataApi={commonGridDataApi}
                            setPageSize={setPageSize}
                            setPageNo={setPageNo}
                            pageSize={pageSize}
                            pageNo={pageNo}
                          />
                        )}
                      </div>
                    </Form>
                  </>
                )}
              </Formik>
            </div>
          </div>
        </ICard>
      </>
    </Formik>
  );
}

function SalesReportTable({ rowDto, selectedBusinessUnit, values }) {
  return (
    <>
      {rowDto?.length > 0 && (
        <>
          <div className="reportTopInfo">
            <div className="my-5">
              <div className="text-center my-2">
                <h3>
                  <b> {selectedBusinessUnit?.label} </b>
                </h3>
                <h6>
                  <b> {selectedBusinessUnit?.address} </b>
                </h6>
                <h3>
                  <b>Sales Report</b>
                </h3>
                <div className="d-flex justify-content-center">
                  <h5>
                    From Date: {moment(values?.fromDate).format("DD-MM-YYYY")}
                  </h5>
                  <h5 className="ml-5">
                    To Date: {moment(values?.toDate).format("DD-MM-YYYY")}
                  </h5>
                </div>
              </div>
            </div>
            <div className="">
              <p className="mr-3 mb-0">
                <b>Ship Point:</b> {values?.shipmentName?.label}
              </p>
              <p className="mr-3  mb-0">
                <b>Customer Name:</b> {values?.partnerName?.label}
              </p>
              <p className="mr-3  mb-0">
                <b>Item Name:</b> {values?.taxItemName?.label}
              </p>
            </div>
          </div>
          
          {/* Table Grid Data */}
          <TableGird
            rowDto={rowDto}
            values={values}
            selectedBusinessUnit={selectedBusinessUnit}
          />
        </>
      )}
    </>
  );
}
// Sellable Report
function SellableReportTable({
  rowDto,
  selectedBusinessUnit,
  values,
  commonGridDataApi,
  setPageSize,
  setPageNo,
  pageSize,
  pageNo,
}) {
  let numOpenQty = 0,
    numOpenValue = 0,
    numInQty = 0,
    numInValue = 0,
    numOutQty = 0,
    numOutValue = 0,
    numCloseQty = 0,
    numRate = 0,
    numClosingValue = 0,
    numSalesQty = 0,
    numHoldQty = 0,
    numSellableQty = 0;
  return (
    <>
      {rowDto?.length > 0 && (
        <>
          <div className="reportTopInfo">
            <div className="my-5">
              <div className="text-center my-2">
                <h3>
                  <b> {selectedBusinessUnit?.label} </b>
                </h3>
                <h6>
                  <b> {selectedBusinessUnit?.address} </b>
                </h6>
                <h3>
                  <b>Sales Report</b>
                </h3>
                <div className="d-flex justify-content-center">
                  <h5>
                    From Date: {moment(values?.fromDate).format("DD-MM-YYYY")}
                  </h5>
                  <h5 className="ml-5">
                    To Date: {moment(values?.toDate).format("DD-MM-YYYY")}
                  </h5>
                </div>
              </div>
            </div>
            <div className="">
              <p className="mr-3 mb-0">
                <b>Ship Point:</b> {values?.shipmentName?.label}
              </p>
              <p className="mr-3  mb-0">
                <b>Customer Name:</b> {values?.partnerName?.label}
              </p>
              <p className="mr-3  mb-0">
                <b>Item Name:</b> {values?.taxItemName?.label}
              </p>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>UOM Name</th>
                  <th>Open Qty</th>
                  <th>Open Value</th>
                  <th>In Qty</th>
                  <th>In Value</th>
                  <th>Out Qty</th>
                  <th>Out Value</th>
                  <th>Close Qty</th>
                  <th>Rate</th>
                  <th>Closing Value</th>
                  <th>Sales Qty</th>
                  <th>Hold Qty</th>
                  <th>Sellable Qty</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((item, i) => {
                  numOpenQty += +item?.numOpenQty || 0;
                  numOpenValue += +item?.numOpenValue || 0;
                  numInQty += +item?.numInQty || 0;
                  numInValue += +item?.numInValue || 0;
                  numOutQty += +item?.numOutQty || 0;
                  numOutValue += +item?.numOutValue || 0;
                  numCloseQty += +item?.numCloseQty || 0;
                  numRate += +item?.numRate || 0;
                  numClosingValue += +item?.numClosingValue || 0;
                  numSalesQty += +item?.numSalesQty || 0;
                  numHoldQty += +item?.numHoldQty || 0;
                  numSellableQty += +item?.numSellableQty || 0;

                  return (
                    <tr key={i + 1}>
                      <td>{i + 1}</td>
                      <td>{item?.strItemCode}</td>
                      <td>{item?.strItemName}</td>
                      <td>{item?.strBaseUOM}</td>
                      <td className="text-right">
                        {_formatMoney(item?.numOpenQty, 0)}
                      </td>
                      <td className="text-right">
                        {_formatMoney(item?.numOpenValue, 0)}
                      </td>
                      <td className="text-right">
                        {_formatMoney(item?.numInQty, 0)},
                      </td>
                      <td className="text-right">
                        {_formatMoney(item?.numInValue, 0)}
                      </td>
                      <td className="text-right">
                        {_formatMoney(item?.numOutQty, 0)}
                      </td>
                      <td className="text-right">
                        {_formatMoney(item?.numOutValue, 0)}
                      </td>
                      <td className="text-right">
                        {_formatMoney(item?.numCloseQty, 0)}
                      </td>
                      <td className="text-right">
                        {_formatMoney(item?.numRate, 0)}
                      </td>
                      <td className="text-right">
                        {_formatMoney(item?.numClosingValue, 0)}
                      </td>
                      <td className="text-right">
                        {_formatMoney(item?.numSalesQty, 0)}
                      </td>
                      <td className="text-right">
                        {_formatMoney(item?.numHoldQty, 0)}
                      </td>
                      <td className="text-right">
                        {_formatMoney(item?.numSellableQty, 0)}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="text-right" colspan="4">
                    <b> Total</b>
                  </td>
                  <td className="text-right">
                    <b>{_formatMoney(numOpenQty, 0)}</b>
                  </td>
                  <td className="text-right">
                    <b>{_formatMoney(numOpenValue, 0)}</b>
                  </td>
                  <td className="text-right">
                    <b>{_formatMoney(numInQty, 0)}</b>
                  </td>
                  <td className="text-right">
                    <b>{_formatMoney(numInValue, 0)}</b>
                  </td>
                  <td className="text-right">
                    <b>{_formatMoney(numOutQty, 0)}</b>
                  </td>
                  <td className="text-right">
                    <b>{_formatMoney(numOutValue, 0)}</b>
                  </td>
                  <td className="text-right">
                    <b>{_formatMoney(numCloseQty, 0)}</b>
                  </td>
                  <td className="text-right">
                    <b>{_formatMoney(numRate, 0)}</b>
                  </td>
                  <td className="text-right">
                    <b>{_formatMoney(numClosingValue, 0)}</b>
                  </td>
                  <td className="text-right">
                    <b>{_formatMoney(numSalesQty, 0)}</b>
                  </td>
                  <td className="text-right">
                    <b>{_formatMoney(numHoldQty, 0)}</b>
                  </td>
                  <td className="text-right">
                    <b>{_formatMoney(numSellableQty, 0)}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {rowDto?.length > 0 && (
            <div className="printSectionNone">
              <PaginationTable
                count={rowDto?.[0]?.totalRows}
                setPositionHandler={(page) => {
                  commonGridDataApi(values);
                }}
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
