import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import IForm from "./../../../_helper/_form";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import { _todayDate } from "../../../_helper/_todayDate";
import { shallowEqual, useSelector } from "react-redux";
import PaginationTable from "../../../_helper/_tablePagination";
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
  const [rowData, getRowData, Loading] = useAxiosGet();
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
    <Formik enableReinitialize={true} initialValues={initData}>
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
          {false && <Loading />}
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
                  {rowData?.data?.length > 0 && (
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.data?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="text-center">{index + 1}</div>
                            </td>
                          </tr>
                        ))}
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
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
