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
const initData = {
  itemType: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export default function WarehouseWiseStockReport() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [itemTypeDDL, getItemTypeDDL] = useAxiosGet();
  const [rowData, getRowData, loading] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  useEffect(() => {
    getItemTypeDDL(`/wms/WmsReport/GetItemTypeListDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLandingData = (values, pageNo, pageSize) => {
    getRowData(
      `/wms/WmsReport/GetWarehouseWiseStockReport?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&intItemTypeId=${values?.itemType?.value}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(values, pageNo, pageSize);
  };

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
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  {rowData?.length > 0 && (
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>Sl</th>
                          <th>Item Name</th>
                          <th>Code</th>
                          <th>Warehouse</th>
                          <th>Uom</th>
                          <th>Open Qty</th>
                          <th>Open value</th>
                          <th>In Qty</th>
                          <th>In Value</th>
                          <th>Closing Qty</th>
                          <th>Closing Value</th>
                          <th>Out Qty</th>
                          <th>Out Value</th>
                          <th>Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="text-center">{index + 1}</div>
                            </td>
                            <td>
                              <div className="text-center">
                                {item?.strItemName}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {item?.strItemCode}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {item?.strWareHouseName}
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
                                {item?.numOpenValue}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {item?.numInQty}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {item?.numInValue}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {item?.numCloseQty}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {item?.numClosingValue}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {item?.numOutQty}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {item?.numOutValue}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">{item?.numRate}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
