import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import ICard from "../../../../_helper/_card";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import { IInput } from "../../../../_helper/_input";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getUserLoginInfo } from "../../salesReportEssential/helper";
import { getSalesTrendAnalysisApi, getDistributionChannelDDL } from "../helper";
import "../style.css";
// import PieChart from "./pieChart";
// import TargetVsSalesChart from "./targetVsSalesChart";

// Validation schema
const validationSchema = Yup.object().shape({
  distributionChannel: Yup.object().shape({
    label: Yup.string().required("Distribution Channel is required"),
    value: Yup.string().required("Distribution Channel is required"),
  }),
  reportType: Yup.object().shape({
    label: Yup.string().required("Report Type is required"),
    value: Yup.string().required("Report Type is required"),
  }),
});

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  distributionChannel: "",
  reportType: "",
  totalDay: "",
  runningDay: "",
};

const reportTypes = [
  { value: 1, label: "Top sheet" },
  { value: 2, label: "Territory Basis Top sheet" },
  { value: 3, label: "Area Basis Top sheet" },
  { value: 4, label: "Region Basis Top sheet" },
  { value: 5, label: "Area Region Growth Report" },
  { value: 6, label: "Area vs Territory Growth Report" },
];

export default function SalesTrendsAnalysisReportLanding() {
  const printRef = useRef();
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [biReport, setBIReport] = useState(false);

  const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";

  const generalReport = (values) => {
    return [1, 2, 3, 4].includes(values?.reportType?.value);
  };
  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getDistributionChannelDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const viewHandler = async (values, setter) => {
    getUserLoginInfo(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.employeeId,
      setLoading,
      (resData) => {
        getSalesTrendAnalysisApi(
          values?.reportType?.value,
          selectedBusinessUnit?.value,
          values?.distributionChannel?.value,
          values?.totalDay || 1,
          values?.runningDay || 1,
          values?.fromDate,
          values?.toDate,
          setLoading,
          setter,
          profileData?.employeeId,
          resData?.empLevelId === 7
            ? +resData?.empTerritoryId
            : +resData?.levelId === 6
            ? +resData?.areaId
            : +resData?.levelId === 5
            ? +resData?.regionId
            : +resData?.empTerritoryId,
          resData?.empLevelId
        );
      }
    );
  };

  const grandTotalMaker = () => {
    let PCC1Month = 0;
    let OPC1Month = 0;
    let PCCQ1Day = 0;
    let OPCQ1Day = 0;
    let QntTargetMonthly1 = 0;
    let qntLastMonSales1 = 0;
    let ach = 0;
    let Perdaytarg = 0;
    let Pads = 0;
    let Rads = 0;
    let TrendThisMonth = 0;
    let LMVSThisM = 0;
    let qntShortfall = 0;
    let totalQtyMonth = 0;

    for (let i = 0; i < rowDto?.length; i++) {
      let item = rowDto[i];
      PCC1Month = PCC1Month + item?.PCC1Month || 0;
      OPC1Month = OPC1Month + item?.OPC1Month || 0;
      PCCQ1Day = PCCQ1Day + item?.PCCQ1Day || 0;
      OPCQ1Day = OPCQ1Day + item?.OPCQ1Day || 0;
      QntTargetMonthly1 = QntTargetMonthly1 + item?.QntTargetMonthly1 || 0;
      qntLastMonSales1 = qntLastMonSales1 + item?.qntLastMonSales1 || 0;
      ach = ach + item?.ach || 0;
      Perdaytarg = Perdaytarg + item?.Perdaytarg || 0;
      Pads = Pads + item?.Pads || 0;
      Rads = Rads + item?.Rads || 0;
      TrendThisMonth = TrendThisMonth + item?.TrendThisMonth || 0;
      LMVSThisM = LMVSThisM + item?.LMVSThisM || 0;
      qntShortfall = qntShortfall + item?.qntShortfall || 0;
      totalQtyMonth = totalQtyMonth + item?.PCC1Month + item?.OPC1Month || 0;
    }

    return {
      PCC1Month,
      OPC1Month,
      PCCQ1Day,
      OPCQ1Day,
      QntTargetMonthly1,
      qntLastMonSales1,
      ach,
      Perdaytarg,
      Pads,
      Rads,
      TrendThisMonth,
      LMVSThisM,
      qntShortfall,
      totalQtyMonth,
    };
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values) => {}}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <>
          <ICard
            printTitle="Print"
            title="Sales Trend Analysis"
            isPrint={true}
            isShowPrintBtn={true}
            componentRef={printRef}
            isExcelBtn={true}
            excelFileNameWillbe={"Sales Trends Analysis"}
            // pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
          >
            <div>
              <div className="mx-auto">
                <>
                  {loading && <Loading />}
                  <Form className="form form-label-right">
                    <div className="form-group row global-form printSectionNone">
                      <div className="col-lg-3">
                        <NewSelect
                          name="reportType"
                          options={reportTypes}
                          value={values?.reportType}
                          label="Report Type"
                          onChange={(valueOption) => {
                            setFieldValue("reportType", valueOption);
                            setRowDto([]);
                            setBIReport(false);
                          }}
                          placeholder="Report Type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      {generalReport(values) && (
                        <>
                          <div className="col-lg-3">
                            <IInput
                              value={values?.fromDate}
                              label="From Date"
                              name="fromDate"
                              type="date"
                              onChange={(e) => {
                                setFieldValue("fromDate", e?.target?.value);
                                setRowDto([]);
                              }}
                            />
                          </div>

                          <div className="col-lg-3">
                            <IInput
                              value={values?.toDate}
                              label="To Date"
                              name="toDate"
                              type="date"
                              onChange={(e) => {
                                setFieldValue("toDate", e?.target?.value);
                                setRowDto([]);
                              }}
                            />
                          </div>

                          <div className="col-lg-3">
                            <NewSelect
                              name="distributionChannel"
                              options={[...distributionChannelDDL]}
                              value={values?.distributionChannel}
                              label="Distribution Channel"
                              onChange={(valueOption) => {
                                setFieldValue(
                                  "distributionChannel",
                                  valueOption
                                );
                                setRowDto([]);
                              }}
                              placeholder="Distribution Channel"
                              errors={errors}
                              touched={touched}
                            />
                          </div>

                          <div className="col-lg-3">
                            <IInput
                              value={values?.totalDay}
                              label="Total Day"
                              name="totalDay"
                              type="number"
                              onChange={(e) => {
                                setFieldValue("totalDay", e?.target?.value);
                              }}
                            />
                          </div>

                          <div className="col-lg-3">
                            <IInput
                              value={values?.runningDay}
                              label="Running Day"
                              name="runningDay"
                              type="number"
                              onChange={(e) => {
                                setFieldValue("runningDay", e?.target?.value);
                              }}
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <button
                          type="button"
                          className="btn btn-primary mt-5"
                          onClick={() => {
                            if (generalReport(values)) {
                              viewHandler(values, setRowDto);
                            } else {
                              setBIReport(true);
                            }
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </Form>

                  {/* Reports By Power BI */}
                  {biReport && values?.reportType?.value === 5 && (
                    <PowerBIReport
                      groupId={groupId}
                      reportId="7d6dffa7-3343-4522-bef3-788f027229e0" // Area Region Growth Report
                    />
                  )}
                  {biReport && values?.reportType?.value === 6 && (
                    <PowerBIReport
                      groupId={groupId}
                      reportId="8f3c8f39-3fdb-4a6e-a5d4-0dc440c1ccd1" // Area vs Territory Growth Report
                    />
                  )}

                  {/* General Reports */}
                  {rowDto?.length > 0 && generalReport(values) ? (
                    <div className="mt-4">
                      <div className="react-bootstrap-table table-responsive pendingDeliveryReport">
                        <div className="sta-scrollable-table scroll-table-auto">
                          <div
                            style={{ maxHeight: "500px" }}
                            className="scroll-table _table scroll-table-auto"
                          >
                            <table
                              id="table-to-xlsx"
                              ref={printRef}
                              className="table table-striped table-bordered global-table table-font-size-sm"
                            >
                              <thead>
                                <th>SL</th>

                                {values?.reportType?.value === 1 ? (
                                  <th style={{ minWidth: "150px" }}>Name</th>
                                ) : null}

                                {values?.reportType?.value === 1 ||
                                values?.reportType?.value === 2 ? (
                                  <th style={{ minWidth: "130px" }}>
                                    Territory
                                  </th>
                                ) : null}

                                {values?.reportType?.value === 1 ||
                                values?.reportType?.value === 2 ||
                                values?.reportType?.value === 3 ? (
                                  <th style={{ minWidth: "100px" }}>Area</th>
                                ) : null}

                                {values?.reportType?.value === 1 ||
                                values?.reportType?.value === 2 ||
                                values?.reportType?.value === 3 ||
                                values?.reportType?.value === 4 ? (
                                  <th style={{ minWidth: "75px" }}>Region</th>
                                ) : null}

                                <th style={{ minWidth: "90px" }}>PCC1 Month</th>
                                <th style={{ minWidth: "90px" }}>OPC1 Month</th>
                                <th style={{ minWidth: "90px" }}>
                                  Total Qnt(Month)
                                </th>
                                <th style={{ minWidth: "90px" }}>PCCQ1 Day</th>
                                <th style={{ minWidth: "90px" }}>OPCQ1 Day</th>
                                <th style={{ minWidth: "90px" }}>
                                  Target Monthly (Qty)
                                </th>
                                <th style={{ minWidth: "90px" }}>
                                  Last Month Sales (Qty)
                                </th>
                                <th style={{ minWidth: "90px" }}>
                                  Achievement
                                </th>
                                <th style={{ minWidth: "90px" }}>
                                  Per Day Target
                                </th>
                                <th style={{ minWidth: "90px" }}>
                                  Present Avg. Daily Sales
                                </th>
                                <th style={{ minWidth: "90px" }}>
                                  Required Avg. Daily Sales
                                </th>
                                <th style={{ minWidth: "90px" }}>
                                  Trend This Month
                                </th>
                                <th style={{ minWidth: "75px" }}>LM Vs TM</th>
                                <th style={{ minWidth: "75px" }}>Short Fall</th>
                              </thead>
                              <tbody>
                                {rowDto?.map((item, i) => {
                                  return (
                                    <tr key={i}>
                                      <td className="text-center">{i + 1}</td>

                                      {values?.reportType?.value === 1 ? (
                                        <td>{item?.strName}</td>
                                      ) : null}

                                      {values?.reportType?.value === 1 ||
                                      values?.reportType?.value === 2 ? (
                                        <td>{item?.strTer}</td>
                                      ) : null}

                                      {values?.reportType?.value === 1 ||
                                      values?.reportType?.value === 2 ||
                                      values?.reportType?.value === 3 ? (
                                        <td className="text-center">
                                          {item?.strArea}
                                        </td>
                                      ) : null}

                                      {values?.reportType?.value === 1 ||
                                      values?.reportType?.value === 2 ||
                                      values?.reportType?.value === 3 ||
                                      values?.reportType?.value === 4 ? (
                                        <td className="text-center">
                                          {item?.strRegion}
                                        </td>
                                      ) : null}

                                      <td className="text-right">
                                        {item?.PCC1Month?.toFixed(2) || 0}
                                      </td>
                                      <td className="text-right">
                                        {item?.OPC1Month?.toFixed(2) || 0}
                                      </td>
                                      <td className="text-right">
                                        {_fixedPoint(
                                          item?.OPC1Month + item?.PCC1Month,
                                          true
                                        )}
                                      </td>
                                      <td className="text-right">
                                        {item?.PCCQ1Day?.toFixed(2) || 0}
                                      </td>
                                      <td className="text-right">
                                        {item?.OPCQ1Day?.toFixed(2) || 0}
                                      </td>
                                      <td className="text-right">
                                        {item?.QntTargetMonthly1?.toFixed(2) ||
                                          0}
                                      </td>
                                      <td className="text-right">
                                        {item?.qntLastMonSales1?.toFixed(2) ||
                                          0}
                                      </td>
                                      <td className="text-right">
                                        {item?.ach?.toFixed(2) || 0}
                                      </td>
                                      <td className="text-right">
                                        {item?.Perdaytarg?.toFixed(2) || 0}
                                      </td>
                                      <td className="text-right">
                                        {item?.PAds?.toFixed(2) || 0}
                                      </td>
                                      <td className="text-right">
                                        {item?.RAds?.toFixed(2) || 0}
                                      </td>
                                      <td className="text-right">
                                        {item?.TrendThisMonth?.toFixed(2) || 0}
                                      </td>
                                      <td className="text-right">
                                        {item?.LMVSThisM?.toFixed(2) || 0}
                                      </td>
                                      <td className="text-right">
                                        {item?.qntShortfall?.toFixed(2) || 0}
                                      </td>
                                    </tr>
                                  );
                                })}

                                <tr>
                                  <td colSpan="1" className="text-right">
                                    <strong>Total</strong>
                                  </td>

                                  {values?.reportType?.value === 1 ? (
                                    <td></td>
                                  ) : null}

                                  {[1, 2].includes(
                                    values?.reportType?.value
                                  ) ? (
                                    <td></td>
                                  ) : null}

                                  {[1, 2, 3].includes(
                                    values?.reportType?.value
                                  ) ? (
                                    <td></td>
                                  ) : null}

                                  {[1, 2, 3, 4].includes(
                                    values?.reportType?.value
                                  ) ? (
                                    <td></td>
                                  ) : null}

                                  <td className="text-right font-weight-bold">
                                    {grandTotalMaker()?.PCC1Month?.toFixed(2) ||
                                      0}
                                  </td>
                                  <td className="text-right font-weight-bold">
                                    {grandTotalMaker()?.OPC1Month?.toFixed(2) ||
                                      0}
                                  </td>
                                  <td className="text-right font-weight-bold">
                                    {grandTotalMaker()?.totalQtyMonth?.toFixed(
                                      2
                                    ) || 0}
                                  </td>
                                  <td className="text-right font-weight-bold">
                                    {grandTotalMaker()?.PCCQ1Day?.toFixed(2) ||
                                      0}
                                  </td>
                                  <td className="text-right font-weight-bold">
                                    {grandTotalMaker()?.OPCQ1Day?.toFixed(2) ||
                                      0}
                                  </td>
                                  <td className="text-right font-weight-bold">
                                    {grandTotalMaker()?.QntTargetMonthly1?.toFixed(
                                      2
                                    ) || 0}
                                  </td>
                                  <td className="text-right font-weight-bold">
                                    {grandTotalMaker()?.qntLastMonSales1?.toFixed(
                                      2
                                    ) || 0}
                                  </td>
                                  <td className="text-right font-weight-bold">
                                    {grandTotalMaker()?.ach?.toFixed(2) || 0}
                                  </td>
                                  <td className="text-right font-weight-bold">
                                    {grandTotalMaker()?.Perdaytarg?.toFixed(
                                      2
                                    ) || 0}
                                  </td>
                                  <td className="text-right font-weight-bold">
                                    {grandTotalMaker()?.Pads?.toFixed(2) || 0}
                                  </td>
                                  <td className="text-right font-weight-bold">
                                    {grandTotalMaker()?.Rads?.toFixed(2) || 0}
                                  </td>
                                  <td className="text-right font-weight-bold">
                                    {grandTotalMaker()?.TrendThisMonth?.toFixed(
                                      2
                                    ) || 0}
                                  </td>
                                  <td className="text-right font-weight-bold">
                                    {grandTotalMaker()?.LMVSThisM?.toFixed(2) ||
                                      0}
                                  </td>
                                  <td className="text-right font-weight-bold">
                                    {grandTotalMaker()?.qntShortfall?.toFixed(
                                      2
                                    ) || 0}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </>

                {/* {rowDto?.length > 0 &&
                [3, 4].includes(values?.reportType?.value) ? (
                  <TargetVsSalesChart
                    rowData={rowDto}
                    topSheetId={values?.reportType?.value}
                  />
                ) : null} */}
                {/* {<PieChart />} */}
              </div>
            </div>
          </ICard>
        </>
      )}
    </Formik>
  );
}
