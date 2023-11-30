import { Form, Formik } from "formik";
import React, { useState } from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import PaginationTable from "../../../_helper/_tablePagination";
import { shallowEqual, useSelector } from "react-redux";
import { _todayDate } from "../../../_helper/_todayDate";
import { _dateFormatter } from "../../../_helper/_dateFormate";
const initData = {
  type: "",
  item: "",
  date: _todayDate(),
};
export default function PurchasePlanningAndScheduling() {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const saveHandler = (values, cb) => {};
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();

  const getData = (pageNo, pageSize, values) => {
    const url =
      values?.type?.value === 1
        ? // `/imp/ImportReport/PurchasePlanningAndSchedulingReport?partName=ItemWiseSchedulingReport&businessUnitId=${selectedBusinessUnit?.value}&asOnDate=${values?.date}&itemId=${values?.item?.value}&pageNo=${pageNo}&pageSize=${pageSize}`
          `/imp/ImportReport/PurchasePlanningAndSchedulingReport?partName=ItemWiseSchedulingReport&businessUnitId=164&asOnDate=2023-01-01&itemId=7469&pageNo=2&pageSize=2`
        : `/imp/ImportReport/PurchasePlanningAndSchedulingReport?partName=PurchasePlanningNSchedulingReport&businessUnitId=${selectedBusinessUnit?.value}&asOnDate=${values?.date}&itemId=${values?.item?.value}&pageNo=${pageNo}&pageSize=${pageSize}`;

    getTableData(url);
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(pageNo, pageSize, values);
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
          {tableDataLoader && <Loading />}
          <IForm
            title="Purchase Planning & Scheduling"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      options={[
                        { value: 1, label: "Itemwise Scheduling" },
                        { value: 2, label: "Purchase Planning" },
                      ]}
                      value={values?.type}
                      label="Type"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("type", valueOption);
                          setTableData([]);
                          setPageNo(1);
                          setPageSize(15);
                        } else {
                          setFieldValue("type", "");
                          setTableData([]);
                          setPageNo(1);
                          setPageSize(15);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="item"
                      options={[
                        { value: 7469, label: "Item-1" },
                        { value: 2, label: "Item-2" },
                      ]}
                      value={values?.item}
                      label="Item"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("item", valueOption);
                          setTableData([]);
                        } else {
                          setFieldValue("item", "");
                          setTableData([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.date}
                      label="Date"
                      name="date"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
                        setTableData([]);
                      }}
                    />
                  </div>
                  <button
                    style={{ marginTop: "18px" }}
                    className="btn btn-primary"
                    type="button"
                    disabled={!values?.item || !values?.date}
                    onClick={() => {
                      getData(pageNo, pageSize, values);
                    }}
                  >
                    View
                  </button>
                </div>

                {values?.type?.value === 1 ? (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Item Id</th>
                          <th>Item Name</th>
                          <th>Uom</th>
                          <th>Booking Qty(Contract Qty)</th>
                          <th>PI Qty</th>
                          <th>
                            Inco-term <br /> FOB/CFR
                          </th>
                          <th>Price FC</th>
                          <th>Value FC</th>
                          <th>Estimated Laycan Date</th>
                          <th>ETA BD Port</th>
                          <th>
                            Estimated <br />
                            Survive Days
                          </th>
                          <th>
                            Estimated <br /> Survive DT
                          </th>
                          <th>Supplier Name</th>
                          <th>Country of Origin</th>
                          <th>Load Port</th>
                          <th>LC Issued Qty</th>
                          <th>LC Pending Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.length > 0 &&
                          tableData?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                {_dateFormatter(
                                  item?.dtePurchaseContractDate
                                ) || "N/A"}
                              </td>
                              <td>{item?.intItemId || "N/A"}</td>
                              <td>{item?.strItemName || "N/A"}</td>
                              <td>{item?.strUoMName || "N/A"}</td>
                              <td>{item?.numContractQty || "N/A"}</td>
                              <td>{item?.numPiQty || "N/A"}</td>
                              <td>{item?.strIncotermName || "N/A"}</td>
                              <td>{item?.numPriceFc || "N/A"}</td>
                              <td>{item?.numValueFc || "N/A"}</td>
                              <td>
                                {_dateFormatter(item?.dteEstimatedLaycanDate) ||
                                  "N/A"}
                              </td>
                              <td>{item?.dteEta || "N/A"}</td>
                              <td>{item?.intEstimatedSurviveDays || "N/A"}</td>
                              <td>
                                {_dateFormatter(
                                  item?.dteEstimatedSurviveDate
                                ) || "N/A"}
                              </td>
                              <td>{item?.strSupplierName || "N/A"}</td>
                              <td>{item?.strCountryOfOrigin || "N/A"}</td>
                              <td>{item?.strLoadingPort || "N/A"}</td>
                              <td>{item?.numLcIssueQty || 0}</td>
                              <td>{item?.numLcPendingQty || 0}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : values?.type?.value === 2 ? (
                  <div className="row">
                    <div className="col-lg-12">
                      <table className="table table-striped table-bordered global-table able-font-size-sm mt-5">
                        <thead>
                          <tr>
                            <th>ITem ID</th>
                            <th>Comodity/Item</th>
                            <th>UOM </th>
                            <th>Monthly Required Qty </th>
                            <th>Silo / Current Stock ( MT)</th>
                            <th>Balance on factory Ghat (MT) </th>
                            <th>Stock in Transit(BD Port-MV) </th>
                            <th>LC opened Qunatity (MT) </th>
                            <th>Last ETA CTG Date-PI </th>
                            <th>Total QNT in (MT) </th>
                            <th>Avarage Consumption (MT)</th>
                            <th>Total Survival DayS</th>
                            <th>LC & Stock Coverage</th>
                            <th>LC Pending Qty.</th>
                            <th>PI Coverage </th>
                            <th>PI Pending Qty</th>
                            <th>Booking Coverage</th>
                            <th>Load start to Factory Lead time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData?.length > 0 &&
                            tableData?.map((item, index) => (
                              <tr key={index}>
                                <td>{item?.intItemId || "N/A"}</td>
                                <td>{item?.strItemName || "N/A"}</td>
                                <td>{item?.strUom || "N/A"}</td>
                                <td>{item?.monthlyReqQty || 0}</td>
                                <td>{item?.currentStock || 0}</td>
                                <td>{item?.balanceOnGhat || 0}</td>
                                <td>{item?.stockInTransit || 0}</td>
                                <td>{item?.lcOpenedQty || 0}</td>
                                <td>{item?.lastEtaDate || 0}</td>

                                <td>{item?.totalQntIn}</td>
                                <td>{item?.averageConsumption}</td>
                                <td>{item?.totalSurviveDays}</td>
                                <td>
                                  {_dateFormatter(item?.lcAndStockCoverageDate)}
                                </td>
                                <td>{item?.lcPendingQty}</td>
                                <td>{_dateFormatter(item?.piCoverageDate)}</td>
                                <td>{item?.piPendingQty}</td>
                                <td>
                                  {_dateFormatter(item?.bookingCoverageDate)}
                                </td>
                                <td>{item?.loadFactoryLeadeTime}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}

                {tableData?.length > 0 ? (
                  <PaginationTable
                    count={tableData[0]?.totalCount}
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
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
