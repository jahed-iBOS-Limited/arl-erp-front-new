/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import IForm from "./../../../_helper/_form";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import { _todayDate } from "../../../_helper/_todayDate";
import { shallowEqual, useSelector } from "react-redux";
import PaginationTable from "../../../_helper/_tablePagination";
import Loading from "../../../_helper/_loading";
import { excelDownload, generateSecondLevelList } from "./helper";
const initData = {
  itemType: { value: 0, label: "All" },
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

export default function WarehouseWiseStockReport() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [itemTypeDDL, getItemTypeDDL] = useAxiosGet();
  const [rowData, getRowData, loading, setRowData] = useAxiosGet();
  const [excelData, getExcelData] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  useEffect(() => {
    getItemTypeDDL(`/wms/WmsReport/GetItemTypeListDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLandingData = (values, pageNo, pageSize) => {
    getRowData(
      `/wms/WmsReport/GetWarehouseWiseStockReport?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&intItemTypeId=${values?.itemType?.value}&pageNo=${pageNo}&pageSize=${pageSize}`,
      (res) => {
        const newList = generateSecondLevelList({
          list: res,
          matchField: "intWarehouseId",
          secondLevelField: "children",
        });
        setRowData(newList);
        getExcelData(
          `/wms/WmsReport/GetWarehouseWiseStockReport?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&intItemTypeId=${values?.itemType?.value}&pageNo=${pageNo}&pageSize=${res[0]?.totalRows}`
        );
      }
    );
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(values, pageNo, pageSize);
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getLandingData(initData, pageNo, pageSize);
    }
  }, [profileData, selectedBusinessUnit]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          {loading && <Loading />}
          <IForm
            title="Warehouse Wise Stock Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="itemType"
                    options={itemTypeDDL || []}
                    value={values?.itemType}
                    label="Item Type"
                    onChange={(valueOption) => {
                      setFieldValue("itemType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    placeholder="From Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    placeholder="Top Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3 mt-5">
                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={
                      !values?.itemType || !values?.fromDate || !values?.toDate
                    }
                    onClick={() => {
                      getLandingData(values, pageNo, pageSize);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-primary ml-5"
                    type="button"
                    disabled={!excelData?.length}
                    onClick={() => {
                      excelDownload(excelData);
                    }}
                  >
                    Export Excel
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  {rowData?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>Sl</th>
                            <th>Warehouse</th>
                            <th>Item Name</th>
                            <th>Code</th>
                            <th>Uom</th>
                            <th>Open Qty</th>
                            <th>In Qty</th>
                            <th>Out Qty</th>
                            <th>Closing Qty</th>
                            <th>Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.map((item, index) => (
                            <React.Fragment>
                              <tr key={index}>
                                <td
                                  rowSpan={
                                    item?.children?.length > 1
                                      ? item?.children?.length + 1
                                      : item?.children?.length
                                  }
                                >
                                  <div className="text-center">{index + 1}</div>
                                </td>
                                <td
                                  rowSpan={
                                    item?.children?.length > 1
                                      ? item?.children?.length + 1
                                      : item?.children?.length
                                  }
                                >
                                  <div>{item?.strWareHouseName}</div>
                                </td>
                                <td>
                                  <div>{item?.strItemName}</div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {item?.strItemCode}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {item?.strBaseUOM}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {item?.numOpenQty}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {item?.numInQty}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {item?.numOutQty}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {item?.numCloseQty}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {item?.numRate}
                                  </div>
                                </td>
                              </tr>
                              {item?.children?.length > 1
                                ? item?.children?.map((child) => (
                                    <tr key={index}>
                                      <td>
                                        <div className="text-left">
                                          {child?.strItemName}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-center">
                                          {child?.strItemCode}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-center">
                                          {child?.strBaseUOM}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-center">
                                          {child?.numOpenQty}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-center">
                                          {child?.numInQty}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-center">
                                          {child?.numOutQty}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-center">
                                          {child?.numCloseQty}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-center">
                                          {child?.numRate}
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                : null}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {rowData?.length > 0 && (
                    <PaginationTable
                      count={rowData[0]?.totalRows}
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
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
