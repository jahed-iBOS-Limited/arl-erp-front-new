/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Formik } from "formik";
// import ReactToPrint from "react-to-print";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Loading from "../../_chartinghelper/loading/_loading";
import ICustomTable from "../../_chartinghelper/_customTable";
import { getIncomeReport } from "./helper";
import FormikSelect from "../../_chartinghelper/common/formikSelect";
import { getVesselDDL, getVoyageDDLNew } from "../../helper";
import customStyles from "../../_chartinghelper/common/selectCustomStyle";
import moment from "moment";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
import FormikInput from "../../_chartinghelper/common/formikInput";
import { _todayDate } from "../../_chartinghelper/_todayDate";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { getSBUListDDL } from "../../../financialManagement/invoiceManagementSystem/billregister/othersBillNew/helper";
import { getSalesOrgList } from "../../transaction/timeCharter/helper";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import IViewModal from "../../../_helper/_viewModal";
import AdjustmentJournalCreateForm from "./journals/adjustmentJournal/addEditFrom";
import IButton from "../../../_helper/iButton";

const getHeaders = (values, gridData) => {
  return [
    { name: "SL", style: { minWidth: "30px" } },
    { name: "Vessel Name", style: { minWidth: "130px" } },
    { name: "Voyage No", style: { minWidth: "50px" } },
    { name: "Voyage Type", style: { minWidth: "100px" } },
    { name: "Charterer Name", style: { minWidth: "180px" } },
    { name: "Commence Date", style: { minWidth: "120px" } },
    { name: "Completion Date", style: { minWidth: "120px" } },
    { name: "Duration", style: { minWidth: "70px" } },
    { name: "Cargo", style: { minWidth: "100px" } },
    { name: "Quantity", style: { minWidth: "70px" } },
    { name: "Rate", style: { minWidth: "70px" } },
    { name: "Freight", style: { minWidth: "80px" } },
    { name: "Hire per Day", style: { minWidth: "70px" } },
    { name: "Add Comm", style: { minWidth: "70px" } },
    { name: "Broker Comm", style: { minWidth: "70px" } },
    { name: "CVE", style: { minWidth: "70px" } },
    { name: "ILOHC", style: { minWidth: "70px" } },
    { name: "Revenue per Day", style: { minWidth: "90px" } },
    { name: "Total Revenue", style: { minWidth: "100px" } },
    {
      name: `Revenue in (${values?.fromDate + " To " + values?.toDate})`,
      style: { minWidth: "120px" },
      isHide: !(gridData?.length && values?.fromDate && values?.toDate),
    },
    {
      name: `Final Revenue`,
      style: { minWidth: "100px" },
      isHide: !(gridData?.length && values?.fromDate && values?.toDate),
    },
    {
      name: `Action`,
      style: { minWidth: "130px" },
      isHide: !(gridData?.length && values?.fromDate && values?.toDate),
    },
  ];
};

const initData = {
  vesselName: { value: 0, label: "All" },
  voyageNo: { value: 0, label: "All" },
  fromDate: "",
  toDate: "",
  salesOrg: "",
  sbu: "",
  journalDate: _todayDate(),
};

export default function IncomeReport() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageDDL, setVoyageDDL] = useState([]);
  const [, createJournal, loader] = useAxiosPost();
  const [sbuList, setSBUList] = useState([]);
  const [salesOrgList, setSalesOrgList] = useState([]);
  const [show, setShow] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [, postAllJV, isLoading] = useAxiosPost();

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getGridData = (values) => {
    getIncomeReport(
      accId,
      buId,
      values?.vesselName?.value || 0,
      values?.voyageNo?.value || 0,
      values?.fromDate,
      values?.toDate,
      setGridData,
      setLoading
    );
  };

  useEffect(() => {
    // getGridData(initData);
    getVesselDDL(accId, buId, setVesselDDL);
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
      totalAmount: item?.finalRevenue,
      // totalAmount: item?.incomeInDateRange,
      narration: `Amount debited to ${item?.chartererName} & credited to Freight Income ${item?.vesselName} as provision of freight income of ${item?.vesselName}, VOYAGE-${item?.voyageNo}`,
      vesselId: item?.vesselId,
      charterId: item?.chartererId,
    };

    createJournal(
      `https://imarine.ibos.io/domain/TimeCharterTransaction/IncomeSatetementJournal`,
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

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, errors, touched, setFieldValue }) => (
          <>
            {(loading || loader || isLoading) && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-2">
                    <FormikSelect
                      value={values?.vesselName || ""}
                      isSearchable={true}
                      options={[{ value: 0, label: "All" }, ...vesselDDL]}
                      styles={customStyles}
                      name="vesselName"
                      placeholder="Vessel Name"
                      label="Vessel Name"
                      onChange={(valueOption) => {
                        setFieldValue("vesselName", valueOption);
                        setFieldValue("voyageNo", "");
                        setGridData([]);
                        if (valueOption) {
                          getVoyageDDLNew({
                            accId: accId,
                            buId: buId,
                            id: valueOption?.value,
                            setter: setVoyageDDL,
                            setLoading: setLoading,
                            hireType: 0,
                            isComplete: 0,
                            voyageTypeId: 0,
                          });
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-2">
                    <FormikSelect
                      value={values?.voyageNo || ""}
                      isSearchable={true}
                      options={[{ value: 0, label: "All" }, ...voyageDDL] || []}
                      styles={customStyles}
                      name="voyageNo"
                      placeholder="Voyage No"
                      label="Voyage No"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue("voyageNo", valueOption);
                      }}
                      isDisabled={!values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <FormikInput
                      label="From Date"
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setGridData([]);
                        setFieldValue("fromDate", e.target.value);
                      }}
                      max={values?.toDate}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <FormikInput
                      label="To Date"
                      value={values?.toDate}
                      name="toDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setGridData([]);
                        setFieldValue("toDate", e.target.value);
                      }}
                      min={values?.fromDate}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-1 mt-5">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        getGridData(values);
                      }}
                      disabled={
                        (values?.fromDate && !values?.toDate) ||
                        (values?.toDate && !values?.fromDate)
                      }
                    >
                      View
                    </button>
                  </div>
                  <div className="col-lg-3 text-right mt-5">
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button-att-reports"
                      className="btn btn-primary px-3 py-2 mr-2"
                      table="table-to-xlsx"
                      filename="Income Report"
                      sheet="Sheet-1"
                      buttonText="Export Excel"
                    />
                    {/* <ReactToPrint
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
                    /> */}
                  </div>
                  <div className="col-lg-12"></div>
                  {gridData?.length > 0 && values?.fromDate && values?.toDate && (
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
                      <IButton
                        onClick={() => {
                          postAllJV(
                            `https://imarine.ibos.io/domain/Report/CreateForceAutoJournal?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`
                          );
                        }}
                      >
                        Create bulk JV
                      </IButton>
                    </>
                  )}
                </div>
              </div>
              <div ref={printRef}>
                <ICustomTable
                  id="table-to-xlsx"
                  ths={getHeaders(values, gridData)}
                  scrollable={true}
                >
                  {gridData?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center" style={{ width: "40px" }}>
                        {index + 1}
                      </td>
                      <td>{item?.vesselName}</td>
                      <td className="text-center">{item?.voyageNo}</td>
                      <td>{item?.voyageType}</td>
                      <td>{item?.chartererName}</td>
                      <td>
                        {moment(item?.startDate).format("DD-MMM-yyyy, HH:mm")}
                      </td>
                      <td>
                        {moment(item?.endDate).format("DD-MMM-yyyy, HH:mm")}
                      </td>
                      <td>{Number(item?.duration).toFixed(4)}</td>
                      <td>{item?.cargo}</td>
                      <td className="text-right">
                        {_fixedPoint(item?.cargoQty, true, 0)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.rate, true)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.freight, true)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.hirePerDay, true)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.addrComm, true)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.brockComm, true)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.cve, true)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.ilohc, true)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.incomePerDay, true)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.totalIncome, true)}
                      </td>
                      {gridData?.length && values?.fromDate && values?.toDate && (
                        <>
                          <td className="text-right">
                            {_fixedPoint(item?.incomeInDateRange, true)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(item?.finalRevenue, true)}
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-around">
                              <button
                                title={
                                  item?.jvDisable
                                    ? ""
                                    : "Click to create Journal Voucher"
                                }
                                disabled={
                                  item?.jvDisable ||
                                  loading ||
                                  loader ||
                                  !values?.sbu ||
                                  !values?.salesOrg
                                }
                                className="btn btn-info btn-sm"
                                type="button"
                                onClick={() => {
                                  JournalPost(values, item, index);
                                }}
                              >
                                JV
                              </button>
                              <button
                                title={"Click to create Adjustment Journal"}
                                disabled={
                                  loading || loader || isLoading || !values?.sbu
                                  // ||
                                  // !values?.salesOrg
                                }
                                className="btn btn-info btn-sm"
                                type="button"
                                onClick={() => {
                                  setSingleData(item);
                                  setShow(true);
                                }}
                              >
                                AJ
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </ICustomTable>
              </div>
            </form>
            <IViewModal show={show} onHide={() => setShow(false)}>
              <AdjustmentJournalCreateForm
                preData={{ ...values, ...singleData }}
                setShow={setShow}
              />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}
