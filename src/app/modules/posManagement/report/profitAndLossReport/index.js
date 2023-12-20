import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

const initData = {
  warehouse: "",
  fromDate: "",
  toDate: "",
};
const ProfitAndLossReport = () => {
  const [fairPriceDDL, getFairPriceDDL, fairPriceDDLloader] = useAxiosGet();
  const [rowData, getRowData, rowDataLoader] = useAxiosGet();
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  useEffect(() => {
    getFairPriceDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=68&OrgUnitTypeId=8`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData?.userId]);

  const getGridData = (values, pageNo = 0, pageSize = 15, searchText = "") => {
    const searchTermText = searchText ? `&searchTerm=${searchText}` : "";
    getRowData(
      `/partner/Pos/GetPosProfitLossReport?BusinessUnitId=${selectedBusinessUnit?.value}&WarehouseId=${values?.warehouse?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&PageNumber=${pageNo}&PageSize=${pageSize}&Order=ASC${searchTermText}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getGridData(values, pageNo, pageSize, searchValue);
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  let TotalCost = 0;
  let TotalProfit = 0;
  let TotalLoss = 0;
  let NetProfit = 0;

  return (
    <IForm
      title={"Profit And Loss Report"}
      isHiddenReset={true}
      isHiddenBack={true}
      isHiddenSave={true}
    >
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, errors }) => (
          <>
            {(rowDataLoader || fairPriceDDLloader) && <Loading />}
            <div className="form-group  global-form mb-5">
              <div className="row">
                <div className="col-lg-2">
                  <NewSelect
                    name="warehouse"
                    options={fairPriceDDL}
                    value={values?.warehouse}
                    label="Warehouse"
                    onChange={(valueOption) => {
                      setFieldValue("warehouse", valueOption);
                    }}
                    errors={errors}
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
                    }}
                  />
                </div>
                <div className="">
                  <button
                    style={{ marginTop: "18px" }}
                    className="btn btn-primary ml-2 mr-3"
                    disabled={!values?.warehouse?.value}
                    onClick={() => {
                      getGridData(values, pageNo, pageSize);
                    }}
                  >
                    Show
                  </button>
                </div>
                {rowData?.length > 0 ? (
                  <div className="mt-4 d-flex justify-content-end">
                    <ReactHtmlTableToExcel
                      id="test-table-xls-button-att-reports"
                      className="btn btn-primary px-3 py-2 mr-2"
                      table="table-to-xlsx"
                      filename="Profit And Loss Report"
                      sheet="Sheet-1"
                      buttonText="Export Excel"
                    />
                  </div>
                ) : null}
              </div>
            </div>
            {rowData?.length > 0 && (
              <div className="mt-5">
                <PaginationSearch
                  placeholder="Search..."
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
              </div>
            )}
            {rowData?.length > 0 && (
              <table
                id="table-to-xlsx"
                className="table table-striped mt-2 table-bordered bj-table bj-table-landing"
              >
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Item Id</th>
                    <th>Materials Name</th>
                    <th>Uom</th>
                    <th>Quantity</th>
                    <th>Cost Per Unit</th>
                    <th>Total Cost</th>
                    <th>Sales Price</th>
                    <th>Price Diff.</th>
                    <th>Total Profit</th>
                    <th>Total Loss</th>
                    <th>Net Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {rowData?.map((item, index) => {
                    TotalCost += item?.TotalCost || 0;
                    TotalProfit += item?.TotalProfit || 0;
                    TotalLoss += item?.TotalLoss || 0;
                    NetProfit += item?.NetProfit || 0;
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="text-center">{item?.ItemId}</td>
                        <td>{item?.ItemName}</td>
                        <td className="text-center">{item?.UMO}</td>
                        <td className="text-center">{item?.Quantity}</td>
                        <td className="text-center">{item?.CostPerUnit}</td>
                        <td className="text-center">{item?.TotalCost}</td>
                        <td className="text-center">{item?.SalesPrice}</td>
                        <td className="text-center">{item?.PriceDiff}</td>
                        <td className="text-center">{item?.TotalProfit}</td>
                        <td className="text-center">{item?.TotalLoss}</td>
                        <td className="text-center">{item?.NetProfit}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan={6}>
                      <strong>Total</strong>
                    </td>
                    <td className="text-center">{TotalCost}</td>
                    <td className="text-center"></td>
                    <td className="text-center"></td>
                    <td className="text-center">{TotalProfit}</td>
                    <td className="text-center">{TotalLoss}</td>
                    <td className="text-center">{NetProfit}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {rowData?.data?.length > 0 && (
              <PaginationTable
                count={rowData?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{
                  pageNo,
                  setPageNo,
                  pageSize,
                  setPageSize,
                }}
                values={values}
              />
            )}
          </>
        )}
      </Formik>
    </IForm>
  );
};

export default ProfitAndLossReport;
