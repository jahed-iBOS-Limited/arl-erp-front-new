/* eslint-disable react-hooks/exhaustive-deps */

import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import TextArea from "../../../../_helper/TextArea";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { getSBUListDDL } from "../../../../performanceManagement/stategyYearsPlan/helper";
import ICustomTable from "../../../_chartinghelper/_customTable";
import { _todayDate } from "../../../_chartinghelper/_todayDate";
import Loading from "../../../_chartinghelper/loading/_loading";
import { getSalesOrgList } from "../../../transaction/timeCharter/helper";
import { getMonthlyVoyageStatement, months } from "../helper";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import { iMarineBaseURL } from "../../../helper";

const headers = [
  { name: "SL" },
  { name: "Lighter Vessel Name" },
  { name: "Voyage No (lighter vessel)" },
  { name: "SR Number" },
  { name: "Receive Date & Time" },
  { name: "Discharging Start" },
  { name: "Discharging Complete" },
  { name: "Duration (DAYS)" },
  { name: "Mother Vessel" },
  { name: "Voyage No (mother vessel)" },
  { name: "Cargo" },
  { name: "Est. Quantity" },
  { name: "Final Quantity" },
  { name: "Rate" },
  { name: "Est. Freight" },
  { name: "Freight" },
  { name: "Unloading Jetty" },
  { name: "Action" },
];

const initData = {
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  salesOrg: "",
  sbu: "",
  journalDate: _todayDate(),
  narration: "",
};

export default function MonthlyVoyageStatement() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, createJournal, loader] = useAxiosPost();
  const [sbuList, setSBUList] = useState([]);
  const [salesOrgList, setSalesOrgList] = useState([]);

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getRowData = (values) => {
    getMonthlyVoyageStatement(
      accId,
      buId,
      values?.fromDate,
      values?.toDate,
      setGridData,
      setLoading
    );
  };

  useEffect(() => {
    getRowData(initData);
    getSBUListDDL(accId, buId, setSBUList);
  }, [accId, buId]);

  const JournalPost = (values, item, index, journalType) => {
    const amount =
      journalType === "jv"
        ? item?.estFreightAmount
        : journalType === "aj"
        ? item?.estFreightAmount - item?.numTotalFreight
        : 0;

    const narration = `Amount ${
      journalType === "jv" ? "debited" : "credited"
    } to ${item?.consigneePartyName} & ${
      journalType === "jv" ? "credited" : "debited"
    } to Freight Income as provision of freight income of ${
      item?.lighterVesselName
    }, Trip-${item?.tripNo} For the month of ${months[
      new Date(values?.fromDate).getMonth()
    ] +
      "-" +
      new Date(values?.fromDate)?.getFullYear()}`;

    const payload = {
      accountId: accId,
      businessUnitId: buId,
      sbuId: values?.sbu?.value,
      salesOrgId: values?.salesOrg?.value,
      actionby: userId,
      date: values?.journalDate,
      // totalAmount: item?.numTotalFreight,
      totalAmount: amount,
      narration: narration,
      lighterVesselId: item?.lighterVesselId,
      consigneeParty: item?.consigneePartyId,
      tripId: item?.lighterTripId,
    };

    const apiName =
      journalType === "jv"
        ? `LighterVesselIncomeSatetementJournal`
        : journalType === "aj"
        ? `LighterVesselIncomeSatetementAdjustmentJournal`
        : "";

    createJournal(
      `${iMarineBaseURL}/domain/LighterVesselStatement/${apiName}`,
      payload,
      () => {
        const field =
          journalType === "jv"
            ? "jvDisable"
            : journalType === "aj"
            ? "ajDisable"
            : "";
        let _data = [...gridData];
        _data[index][field] = true;
        setGridData(_data);
      },
      true
    );
  };

  const printRef = useRef();

  let totalFinalQty = 0,
    totalEstQty = 0,
    totalEstFreight = 0,
    totalFreight = 0;

  const isLoading = loader || loading;
  const journalBtnDisable = (values) => {
    return isLoading || !values?.sbu || !values?.salesOrg;
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            {isLoading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-content">
                <div className="row">
                  <FromDateToDateForm
                    obj={{
                      values,
                      setFieldValue,
                      onChange: (allValues) => {
                        getRowData(allValues);
                      },
                    }}
                  />

                  <div className="col-lg-6 text-right mt-5">
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button-att-reports"
                      className="btn btn-primary px-3 py-2 mr-2"
                      table="table-to-xlsx"
                      filename="Monthly Voyage Statement"
                      sheet="Sheet-1"
                      buttonText="Export Excel"
                    />
                    <ReactToPrint
                      pageStyle={
                        "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                      }
                      trigger={() => (
                        <button
                          type="button"
                          className="btn btn-primary px-3 py-2"
                        >
                          <i
                            className="mr-1 fa fa-print pointer"
                            aria-hidden="true"
                          ></i>
                          Print
                        </button>
                      )}
                      content={() => printRef.current}
                    />
                  </div>
                  {gridData?.length > 0 && (
                    <>
                      <div className="col-lg-2">
                        <NewSelect
                          value={values?.sbu || ""}
                          options={sbuList || []}
                          name="sbu"
                          placeholder="SBU"
                          label="SBU"
                          onChange={(valueOption) => {
                            setFieldValue("sbu", valueOption);
                            setFieldValue("salesOrg", "");
                            if (valueOption) {
                              getSalesOrgList(
                                accId,
                                buId,
                                valueOption?.value,
                                setSalesOrgList,
                                setLoading
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="col-lg-2">
                        <NewSelect
                          value={values?.salesOrg || ""}
                          options={salesOrgList || []}
                          name="salesOrg"
                          placeholder="Sales Organization"
                          label="Sales Organization"
                          onChange={(valueOption) => {
                            setFieldValue("salesOrg", valueOption);
                          }}
                          isDisabled={!values?.sbu}
                        />
                      </div>
                      <div className="col-lg-2">
                        <InputField
                          label="Journal Date"
                          value={values?.journalDate}
                          name="journalDate"
                          placeholder="Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("journalDate", e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-lg-4">
                        <label>Narration</label>
                        <TextArea
                          value={values?.narration}
                          name="narration"
                          placeholder="Narration"
                          type="text"
                          rows="3"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div ref={printRef}>
                <div className="text-center" style={{ margin: "15px 0" }}>
                  <h3>Akij Shipping Lines Ltd</h3>
                  <h4>
                    Monthly Voyage Statement Of Big Lighter
                    <br />
                    For the month of{" "}
                    {months[new Date(values?.fromDate).getMonth()] +
                      "-" +
                      new Date(values?.fromDate)?.getFullYear()}
                  </h4>
                </div>
                <ICustomTable id="table-to-xlsx" ths={headers}>
                  <div className="d-none" style={{ textAlign: "center" }}>
                    <h3>Akij Shipping Lines Ltd</h3>
                    <h4>
                      Monthly Voyage Statement Of Big Lighter
                      <br />
                      For the month of{" "}
                      {months[new Date(values?.fromDate).getMonth()] +
                        "-" +
                        new Date(values?.fromDate)?.getFullYear()}
                    </h4>
                  </div>
                  {gridData?.map((item, index) => {
                    totalFinalQty += item?.numActualCargoQnty;
                    totalEstQty += item?.estimatedCargoQty;
                    totalEstFreight += item?.estFreightAmount;
                    totalFreight += item?.numTotalFreight;
                    return (
                      <tr key={index}>
                        <td className="text-center" style={{ width: "40px" }}>
                          {index + 1}
                        </td>
                        <td>{item?.lighterVesselName}</td>
                        <td>{item?.tripNo}</td>
                        <td>{item?.srNo}</td>
                        <td>{item?.receiveDate}</td>
                        <td>{item?.dischargeStartDate}</td>
                        <td>{item?.dischargeComplDate}</td>
                        <td className="text-right">
                          {item?.numTotalTripDuration} DAYS
                        </td>
                        <td>{item?.motherVesselName}</td>
                        <td>{item?.voyageNo}</td>
                        <td>{item?.cargoName}</td>
                        <td className="text-right">
                          {_fixedPoint(item?.estimatedCargoQty, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.numActualCargoQnty, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.numFreight, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.estFreightAmount, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.numTotalFreight, true, 0)}
                        </td>
                        <td>{item?.dischargePortName}</td>
                        <td>
                          <div className="d-flex justify-content-around align-items-center">
                            <button
                              className="btn btn-sm btn-info mr-1"
                              type="button"
                              onClick={() => {
                                JournalPost(values, item, index, "jv");
                              }}
                              disabled={
                                item?.jvDisable || journalBtnDisable(values)
                              }
                            >
                              JV
                            </button>
                            <button
                              className="btn btn-sm btn-info ml-1"
                              type="button"
                              onClick={() => {
                                JournalPost(values, item, index, "aj");
                              }}
                              disabled={
                                item?.ajDisable || journalBtnDisable(values)
                              }
                            >
                              AJ
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="text-right" colSpan={11}>
                      <b>Total</b>
                    </td>
                    <td className="text-right">
                      <b>{_fixedPoint(totalEstQty, true, 0)}</b>
                    </td>
                    <td className="text-right">
                      <b>{_fixedPoint(totalFinalQty, true, 0)}</b>
                    </td>
                    <td> </td>
                    <td>
                      <b>{_fixedPoint(totalEstFreight, true, 0)}</b>
                    </td>
                    <td className="text-right">
                      <b>{_fixedPoint(totalFreight, true, 0)}</b>
                    </td>
                    <td> </td>
                    <td> </td>
                  </tr>
                </ICustomTable>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
