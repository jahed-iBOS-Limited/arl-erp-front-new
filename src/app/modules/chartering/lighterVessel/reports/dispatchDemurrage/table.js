/* eslint-disable react-hooks/exhaustive-deps */

import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { imarineBaseUrl } from "../../../../../App";
import TextArea from "../../../../_helper/TextArea";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
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

const headers = [
  { name: "SL", style: { minWidth: "40px" } },
  { name: "Lighter Vessel Name", style: { minWidth: "120px" } },
  { name: "Voyage No (lighter vessel)", style: { minWidth: "40px" } },
  //   { name: "SR Number" },
  { name: "Trip Start", style: { minWidth: "120px" } },
  { name: "Departure Date", style: { minWidth: "120px" } },
  { name: "Loading Start", style: { minWidth: "120px" } },
  { name: "Loading Complete", style: { minWidth: "120px" } },
  { name: "Discharging Start", style: { minWidth: "120px" } },
  { name: "Discharging Complete", style: { minWidth: "120px" } },
  { name: "Duration (DAYS)", style: { minWidth: "40px" } },
  { name: "Mother Vessel", style: { minWidth: "120px" } },
  { name: "Voyage No (mother vessel)", style: { minWidth: "40px" } },
  { name: "Cargo", style: { minWidth: "140px" } },
  { name: "Est. Quantity", style: { minWidth: "100px" } },
  { name: "Final Quantity", style: { minWidth: "100px" } },
  { name: "Rate", style: { minWidth: "100px" } },
  { name: "Gross Freight-1", style: { minWidth: "100px" } },
  { name: "Gross Freight-2", style: { minWidth: "100px" } },
  { name: "Gross Freight-3", style: { minWidth: "100px" } },
  { name: "Gross Freight-4", style: { minWidth: "100px" } },
  { name: "Free Time", style: { minWidth: "40px" } },
  { name: "Dispatch Days", style: { minWidth: "40px" } },
  { name: "Dispatch Rate", style: { minWidth: "70px" } },
  { name: "Dispatch Amount", style: { minWidth: "100px" } },
  { name: "Demurrage Days", style: { minWidth: "40px" } },
  { name: "Demurrage Rate", style: { minWidth: "70px" } },
  { name: "Demurrage Amount", style: { minWidth: "100px" } },

  { name: "Freight", style: { minWidth: "100px" } },
  { name: "Action", style: { minWidth: "80px" } },
];

const initData = {
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  salesOrg: "",
  sbu: "",
  journalDate: _todayDate(),
  narration: "",
};

export default function DispatchAndDemurrage() {
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

  const dateTimeFormat = (date) => {
    return moment(date).format("YYYY-MM-DD HH:mm A");
  };

  const JournalPost = (values, item, index, journalType) => {
    const amount = item?.netFreight;

    const narration = `Amount debited to ${
      item?.consigneePartyName
    } & credited to Freight Income as provision of freight income of ${
      item?.lighterVesselName
    }, Trip-${item?.tripNumber} For the month of ${months[
      new Date(values?.journalDate).getMonth()
    ] +
      "-" +
      new Date(values?.journalDate)?.getFullYear()}`;

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

      despatchAmount: item?.dispachAmount,
      damarageAmount: item?.damarageAmount,
      extraTripAmount: 0,

      chartererId: item?.consigineePartyId,
    };

    createJournal(
      `${imarineBaseUrl}/domain/LighterVesselTrip/CreateTripDispatchDamarageJournal`,
      payload,
      () => {
        const field = "jvDisable";
        let _data = [...gridData];
        _data[index][field] = true;
        setGridData(_data);
      },
      true
    );
  };

  const printRef = useRef();

//   let totalFinalQty = 0,
//     totalEstQty = 0,
//     totalEstFreight = 0,
//     totalFreight = 0;

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

                  {/* <div className="col-lg-6 text-right mt-5">
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
                  </div> */}
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
                    Dispatch and Demurrage Report
                    {/* <br />
                    For the month of{" "}
                    {months[new Date(values?.fromDate).getMonth()] +
                      "-" +
                      new Date(values?.fromDate)?.getFullYear()} */}
                  </h4>
                </div>
                <ICustomTable
                  id="table-to-xlsx"
                  ths={headers}
                  scrollable={true}
                >
                  <div className="d-none" style={{ textAlign: "center" }}>
                    <h3>Akij Shipping Lines Ltd</h3>
                    <h4>
                      Dispatch and Demurrage Report
                      <br />
                      {/* For the month of{" "}
                      {months[new Date(values?.fromDate).getMonth()] +
                        "-" +
                        new Date(values?.fromDate)?.getFullYear()} */}
                    </h4>
                  </div>
                  {gridData?.map((item, index) => {
                    // totalFinalQty += item?.numActualCargoQnty;
                    // totalEstQty += item?.estimatedCargoQty;
                    // totalEstFreight += item?.estFreightAmount;
                    // totalFreight += item?.numTotalFreight;
                    return (
                      <tr key={index}>
                        <td className="text-center" style={{ width: "40px" }}>
                          {index + 1}
                        </td>
                        <td>{item?.lighterVesselName}</td>
                        <td>{item?.tripNumber}</td>
                        {/* <td>{item?.srNo}</td> */}
                        <td>{dateTimeFormat(item?.tripStartDate)}</td>
                        <td>{dateTimeFormat(item?.departureDate)}</td>
                        <td>{dateTimeFormat(item?.loadingStartDate)}</td>
                        <td>{dateTimeFormat(item?.loadingCompeteDate)}</td>
                        <td>{dateTimeFormat(item?.dischargeStartDate)}</td>
                        <td>{dateTimeFormat(item?.dischargeCompleteDate)}</td>
                        <td className="text-right">{item?.duration} DAYS</td>
                        <td>{item?.motherVesselName}</td>
                        <td>{item?.voyageNo}</td>
                        <td>{item?.cargoName}</td>
                        <td className="text-right">
                          {_fixedPoint(item?.cargoQtyEst, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.cargoQtyAct, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.cargoFreightRate, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.grossFreight, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.grossFreight2, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.grossFreight3, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.grossFreight4, true, 0)}
                        </td>
                        <td className="text-center">
                          {_fixedPoint(item?.freeTime, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.dispachDays, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.dispachRate, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.dispachAmount, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.damarageDays, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.damarageRate, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.damarageAmount, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.netFreight, true, 0)}
                        </td>

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
                            {/* <button
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
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {/* <tr>
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
                  </tr> */}
                </ICustomTable>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
