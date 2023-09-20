/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import { getMonthlyVoyageStatement, months } from "../helper";
import { Formik } from "formik";
import { _todayDate } from "../../../_chartinghelper/_todayDate";
import ReactToPrint from "react-to-print";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getSBUListDDL } from "../../../../performanceManagement/stategyYearsPlan/helper";
import { getSalesOrgList } from "../../../transaction/timeCharter/helper";
import TextArea from "../../../../_helper/TextArea";

const headers = [
  { name: "SL" },
  { name: "Lighter Vessel Name" },
  { name: "Voyage No (lighter vessel)" },
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
  { name: "Freight" },
  { name: "Unloading Jetty" },
  { name: "Action" },
];

const initData = {
  date: _todayDate(),
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

  useEffect(() => {
    getMonthlyVoyageStatement(
      accId,
      buId,
      _todayDate(),
      setGridData,
      setLoading
    );
    getSBUListDDL(accId, buId, setSBUList);
  }, [accId, buId]);

  const JournalPost = (values, item, index) => {
    const payload = {
      accountId: accId,
      businessUnitId: buId,
      sbuId: values?.sbu?.value,
      salesOrgId: values?.salesOrg?.value,
      actionby: userId,
      date: values?.journalDate,
      totalAmount: item?.numTotalFreight,
      narration: values?.narration,
      lighterVesselId: item?.lighterVesselId,
      consigneeParty: item?.consigneePartyId,
    };

    createJournal(
      `https://imarine.ibos.io/domain/LighterVesselStatement/LighterVesselIncomeSatetementJournal`,
      payload,
      () => {
        let _data = [...gridData];
        _data[index]["jvDisable"] = true;
        setGridData(_data);
      },
      true
    );
  };

  const printRef = useRef();

  let totalFinalQty = 0,
    totalEstQty = 0,
    totalFreight = 0;

  const isLoading = loader || loading;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            {isLoading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <label>Date</label>
                    <FormikInput
                      value={values?.date}
                      name="date"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
                        getMonthlyVoyageStatement(
                          accId,
                          buId,
                          e?.target?.value,
                          setGridData,
                          setLoading
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-9 text-right mt-5">
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
                    {months[new Date(values?.date).getMonth()] +
                      "-" +
                      new Date(values?.date)?.getFullYear()}
                  </h4>
                </div>
                <ICustomTable id="table-to-xlsx" ths={headers}>
                  <div className="d-none" style={{ textAlign: "center" }}>
                    <h3>Akij Shipping Lines Ltd</h3>
                    <h4>
                      Monthly Voyage Statement Of Big Lighter
                      <br />
                      For the month of{" "}
                      {months[new Date(values?.date).getMonth()] +
                        "-" +
                        new Date(values?.date)?.getFullYear()}
                    </h4>
                  </div>
                  {gridData?.map((item, index) => {
                    totalFinalQty += item?.numActualCargoQnty;
                    totalEstQty += item?.estimatedCargoQty;
                    totalFreight += item?.numTotalFreight;
                    return (
                      <tr key={index}>
                        <td className="text-center" style={{ width: "40px" }}>
                          {index + 1}
                        </td>
                        <td>{item?.lighterVesselName}</td>
                        <td>{item?.tripNo}</td>
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
                          {_fixedPoint(item?.numTotalFreight, true, 0)}
                        </td>
                        <td>{item?.dischargePortName}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-info"
                            type="button"
                            onClick={() => {
                              JournalPost(values, item, index);
                            }}
                            disabled={
                              item?.jvDisable ||
                              isLoading ||
                              !values?.sbu ||
                              !values?.salesOrg
                            }
                          >
                            JV
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="text-right" colSpan={10}>
                      <b>Total</b>
                    </td>
                    <td className="text-right">
                      <b>{_fixedPoint(totalEstQty, true, 0)}</b>
                    </td>
                    <td className="text-right">
                      <b>{_fixedPoint(totalFinalQty, true, 0)}</b>
                    </td>
                    <td> </td>
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
