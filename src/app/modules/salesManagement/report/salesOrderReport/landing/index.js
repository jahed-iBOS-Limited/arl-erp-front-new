/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { getSalesOrderReportData, getSummaryReportData } from "../helper";
import { Formik } from "formik";
import { Form } from "formik";
import "../style.css";

// React Pivote Table module Import
import "react-pivottable/pivottable.css";
import { _todayDate } from "../../../../_helper/_todayDate";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import IView from "../../../../_helper/_helperIcons/_view";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import SalesOrderReportModal from "./salesOrderReportModal";
import NewSelect from "./../../../../_helper/_select";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  shipPoint: { value: 0, label: "All" },
  reportType: { value: 0, label: "Details" },
  channel: "",
};

function SalesOrderReportLanding() {
  const [details, setDetails] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  const getReportView = (values) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getSalesOrderReportData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        values?.shipPoint?.value,
        values?.channel?.value,
        values?.reportType?.value,
        setGridData,
        setLoading
      );
    }
  };

  let totalOrderQty = 0;
  let totalOrderValue = 0;
  let totalDeliveryQty = 0;
  let totalDeliveryValue = 0;
  let totalPendingQty = 0;

  return (
    <>
      <ICustomCard title="Sales Order Report">
        {loading && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="shipPoint"
                      options={[{ value: 0, label: "All" }, ...shipPointDDL]}
                      value={values?.shipPoint}
                      label="Shippoint"
                      onChange={(valueOption) => {
                        setFieldValue("shipPoint", valueOption);
                        setGridData([]);
                      }}
                      placeholder="Shippoint"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <RATForm
                    obj={{
                      values,
                      setFieldValue,
                      region: false,
                      area: false,
                      territory: false,
                    }}
                  />
                  <div className="col-lg-2">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From date"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To date"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="reportType"
                      options={[
                        { value: 0, label: "Details" },
                        { value: 1, label: "Top Sheet" },
                      ]}
                      value={values?.reportType}
                      label="View Type"
                      onChange={(valueOption) => {
                        setFieldValue("reportType", valueOption);
                        setGridData([]);
                      }}
                      placeholder="View Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div style={{ marginTop: "17px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getReportView(values);
                      }}
                      disabled={
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.shipPoint
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
                {gridData?.length > 0 && (
                  <div className="loan-scrollable-table">
                    <div
                      className="scroll-table _table"
                      style={{ maxHeight: "400px" }}
                    >
                      <table className="table table-striped table-bordered bj-table bj-table-landing text-center">
                        <thead>
                          <tr>
                            <th style={{ minWidth: "50px" }}>SL</th>
                            {values?.reportType?.value !== 1 && (
                              <>
                                <th style={{ minWidth: "75px" }}>Order Date</th>
                                <th style={{ minWidth: "95px" }}>Order Code</th>
                              </>
                            )}

                            <th style={{ minWidth: "100px" }}>Customer Name</th>
                            <th style={{ minWidth: "100px" }}>
                              Customer Address
                            </th>
                            <th style={{ minWidth: "75px" }}>Order Quantity</th>
                            <th style={{ minWidth: "75px" }}>Order Value</th>

                            <th style={{ minWidth: "100px" }}>
                              Delivery Quantity
                            </th>
                            <th style={{ minWidth: "100px" }}>
                              Delivery Value
                            </th>
                            <th style={{ minWidth: "100px" }}>
                              Pending Delivery
                            </th>

                            <th style={{ minWidth: "50px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.map((item, index) => {
                            totalOrderQty += item?.orderQty;
                            totalOrderValue += item?.orderValue;
                            totalDeliveryQty += item?.deliveryQty;
                            totalDeliveryValue += item?.deliveryValue;
                            totalPendingQty +=
                              item?.orderQty - item?.deliveryQty;

                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                {values?.reportType?.value !== 1 && (
                                  <>
                                    <td>{_dateFormatter(item?.orderdate)}</td>
                                    <td>{item?.orderCode}</td>
                                  </>
                                )}
                                <td>{item?.soldToPartner}</td>
                                <td>{item?.soldToPartnerAddress}</td>
                                <td className="text-right">
                                  {_fixedPoint(item?.orderQty, true, 4)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.orderValue, true, 0)}
                                </td>

                                <td className="text-right">
                                  {_fixedPoint(item?.deliveryQty, true, 4)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.deliveryValue, true, 0)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(
                                    item?.orderQty - item?.deliveryQty,
                                    true,
                                    4
                                  )}
                                </td>

                                <td className="action-att-report-print-disabled">
                                  <div className="d-flex justify-content-around">
                                    <span className="view">
                                      <IView
                                        clickHandler={() => {
                                          setModalShow(true);
                                          getSummaryReportData(
                                            item?.orderId,
                                            setDetails
                                          );
                                        }}
                                        classes="text-primary"
                                      />
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          <tr
                            style={{ fontWeight: "bold", textAlign: "right" }}
                          >
                            <td
                              colSpan={values?.reportType?.value !== 1 ? 5 : 3}
                              className="text-right"
                            >
                              <b>Total</b>
                            </td>
                            <td>{_fixedPoint(totalOrderQty, true, 0)}</td>
                            <td>{_fixedPoint(totalOrderValue, true, 0)}</td>
                            <td>{_fixedPoint(totalDeliveryQty, true, 0)}</td>
                            <td>{_fixedPoint(totalDeliveryValue, true, 0)}</td>
                            <td>{_fixedPoint(totalPendingQty, true, 0)}</td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {/* 
                {gridData?.length > 0 && (
                  <div className="pivoteTable-sales-order-Report overflow-auto">
                    <PivotTableUI
                      data={gridData}
                      onChange={(s) => setState(s)}
                      renderers={Object.assign(
                        {},
                        TableRenderers,
                        PlotlyRenderers
                      )}
                      {...state}
                    />
                  </div>
                )} */}
              </Form>
            </>
          )}
        </Formik>
        <SalesOrderReportModal
          data={details}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </ICustomCard>
    </>
  );
}

export default SalesOrderReportLanding;
