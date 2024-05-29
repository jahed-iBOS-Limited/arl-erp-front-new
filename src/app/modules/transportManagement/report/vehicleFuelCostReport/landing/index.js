/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  GetSupplierFuelStationDDL_api,
  GetVehicleFuelTypeDDL_api,
  getLandingData,
  getSupplierDDL,
} from "../helper";
import "../style.css";

// React Pivote Table module Import
import "react-pivottable/pivottable.css";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  isBillSubmit: "",
};

function VehicleFuelCostReport() {
  const [gridData, setGridData] = useState([]);
  const [vhicleFuelTypeDDL, setVhicleFuelTypeDDL] = useState([]);
  const [supplierDDL, setSupplierDDL] = useState([]);
  const [fuelStationDDL, setFuelStationDDL] = useState([]);
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
      getLandingData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        values?.fuelStationName?.value,
        values?.fuelType?.value,
        values?.shipPoint?.value,
        setGridData,
        setLoading
      );
    }
  };

  useEffect(() => {
    GetVehicleFuelTypeDDL_api(setVhicleFuelTypeDDL);
    getSupplierDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSupplierDDL
    );
  }, []);
  let totalCredit = 0;
  let totalCash = 0;
  let grandTotal = 0;
  let totalPayable = 0;
  return (
    <>
      <ICustomCard title="Vehicle Fuel Cost Report">
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
                  <div className="col-lg-3">
                    <NewSelect
                      name="supplier"
                      options={supplierDDL}
                      value={values?.supplier}
                      label="Supplier Name"
                      onChange={(valueOption) => {
                        setFieldValue("supplier", valueOption);
                        GetSupplierFuelStationDDL_api(
                          valueOption?.value,
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          setFuelStationDDL
                        );
                        setFieldValue("fuelStationName", "");
                      }}
                      placeholder="Vehicle Supplier Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="fuelStationName"
                      options={fuelStationDDL || []}
                      value={values?.fuelStationName}
                      label="Fuel Station Name"
                      onChange={(valueOption) => {
                        setFieldValue("fuelStationName", valueOption);
                      }}
                      placeholder="Fuel Station Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="fuelType"
                      options={vhicleFuelTypeDDL || []}
                      value={values?.fuelType}
                      label="Fuel Type"
                      onChange={(valueOption) => {
                        setFieldValue("fuelType", valueOption);
                      }}
                      placeholder="Fuel Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>From Date</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From date"
                        type="date"
                        max={_todayDate()}
                        style={{width: "100%"}}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        type="date"
                        max={_todayDate()}
                        style={{width: "100%"}}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "15px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getReportView(values);
                      }}
                      disabled={
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.shipPoint ||
                        !values?.fuelType ||
                        !values?.supplier ||
                        !values?.fuelStationName
                      }
                    >
                      View
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Date</th>
                      <th>Shipment Number</th>
                      <th>Fuel Type</th>
                      <th>Fuel Memo No.</th>
                      <th>Credit</th>
                      <th>Cash</th>
                      <th>Total</th>
                      <th>Payable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.map((item, index) => {
                      totalCredit += item?.purchaseCreditAmount;
                      totalCash += item?.purchaseCashAmount;
                      grandTotal += item?.total;
                      totalPayable += item?.payable;
                      return (
                        <tr key={index}>
                          <td> {index + 1}</td>
                          <td>
                            <div className="pl-2">
                              {_dateFormatter(item?.fuelDate)}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.shipmentNumber}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.fuelTypeName}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.fuelMemoNo}</div>
                          </td>
                          <td>
                            <div className="pl-2 text-right">
                              {_formatMoney(item?.purchaseCreditAmount)}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2 text-right">
                              {_formatMoney(item?.purchaseCashAmount)}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2 text-right">
                              {_formatMoney(item?.total)}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2 text-right">
                              {_formatMoney(item?.payable)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {gridData?.length ? (
                      <tr className="text-right" style={{ fontWeight: "bold" }}>
                        <td colSpan="5" className="text-right">
                          Total
                        </td>
                        <td> {totalCredit.toFixed(2)} </td>
                        <td> {totalCash.toFixed(2)} </td>
                        <td> {grandTotal.toFixed(2)} </td>
                        <td> {totalPayable.toFixed(2)} </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default VehicleFuelCostReport;
