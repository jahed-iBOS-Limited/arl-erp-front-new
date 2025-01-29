/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import printIcon from "../../../../_helper/images/print-icon.png";
import { setExistingtransportpolicyLandingAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import { getLandingData } from "../helper";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import { generateJsonToExcel } from "./../../../../_helper/excel/jsonToExcel";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import InputField from "../../../../_helper/_inputField";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  shipPoint: "",
  reportType: "",
};

function TransportZoneRateReport({ title }) {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const dispatch = useDispatch();
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

  const { existingtransportpolicyLanding } = useSelector((state) => {
    return state?.localStorage;
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  const getReportView = (values) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getLandingData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.shipPoint?.value,
        setGridData,
        setLoading
      );
    }
  };

  const generateExcel = (row) => {
    const header = [
      {
        text: "SL",
        textFormat: "number",
        alignment: "center:middle",
        key: "sl",
      },
      {
        text: "Shippoint Name",
        textFormat: "text",
        alignment: "center:middle",
        key: "shippointName",
      },
      {
        text: "Transport Zone",
        textFormat: "money",
        alignment: "center:middle",
        key: "transportZoneName",
      },
      {
        text: "Transport Rate",
        textFormat: "money",
        alignment: "center:middle",
        key: "transferRate",
      },
      {
        text: "Three Tone Rate",
        textFormat: "money",
        alignment: "center:middle",
        key: "num3tonRate",
      },
      {
        text: "Five Tone Rate",
        textFormat: "money",
        alignment: "center:middle",
        key: "num5tonRate",
      },
      {
        text: "Twenty Tone Rate",
        textFormat: "money",
        alignment: "center:middle",
        key: "num7tonRate",
      },
      {
        text: "Twenty Tone Rate",
        textFormat: "money",
        alignment: "center:middle",
        key: "num20tonRate",
      },
      {
        text: "Handling Cost",
        textFormat: "money",
        alignment: "center:middle",
        key: "handlingCost",
      },
      {
        text: "Dropping Charge",
        textFormat: "money",
        alignment: "center:middle",
        key: "labourCost",
      },
      {
        text: "Dropping Charge less 6ton",
        textFormat: "money",
        alignment: "center:middle",
        key: "labourCostLess6",
      },
      {
        text: "Subsidy Rate",
        textFormat: "money",
        alignment: "center:middle",
        key: "subsidyCostRate",
      },
    ];
    const _data = row.map((item, index) => {
      return {
        ...item,
        sl: index + 1,
        transferRate: item?.transferRate || 0,
      };
    });
    generateJsonToExcel(header, _data, "transportZoneRate");
  };

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      if (existingtransportpolicyLanding?.shipPoint?.value) {
        getReportView(existingtransportpolicyLanding);
      }
    }
  }, [selectedBusinessUnit, profileData]);

  const printRef = useRef();
  return (
    <>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title={title ? title : "Transport Zone Rate Report"}>
          <CardHeaderToolbar>
            <ReactToPrint
              trigger={() => (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: "2px 5px" }}
                >
                  <img
                    style={{
                      width: "25px",
                      paddingRight: "5px",
                    }}
                    src={printIcon}
                    alt="print-icon"
                  />
                  Print
                </button>
              )}
              content={() => printRef.current}
              pageStyle={
                "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}"
              }
            />
            <button
              className="btn btn-primary ml-2"
              type="button"
              onClick={(e) => generateExcel(gridData)}
              style={{ padding: "6px 5px" }}
              disabled={gridData?.length === 0}
            >
              Export Excel
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          {loading && <Loading />}
          <Formik
            enableReinitialize={true}
            initialValues={{ ...initData, ...existingtransportpolicyLanding }}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <>
                <Form>
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="reportType"
                        options={[
                          { value: 6, label: "Ghat Base" },
                          { value: 7, label: "Ghat vs Customer Transportcost" },
                          {
                            value: 8,
                            label: "Ghat vs Territory  Transportcost",
                          },
                        ]}
                        value={values?.reportType}
                        label="Report Type"
                        onChange={(valueOption) => {
                          setFieldValue("reportType", valueOption);
                          setShowReport(false);
                          setGridData([]);
                        }}
                        placeholder="Report Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipPoint"
                        options={[{ value: 0, label: "All" }, ...shipPointDDL]}
                        value={values?.shipPoint}
                        label="Shippoint"
                        onChange={(valueOption) => {
                          setFieldValue("shipPoint", valueOption);
                          setShowReport(false);
                          setGridData([]);
                        }}
                        placeholder="Shippoint"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {[7, 8].includes(values?.reportType?.value) && (
                      <>
                        {" "}
                        <RATForm
                          obj={{
                            values,
                            setFieldValue,
                            onChange: () => {
                              setShowReport(false);
                            },
                          }}
                        />
                        <div className="col-lg-3">
                          <InputField
                            value={values?.fromDate}
                            label="From Date"
                            name="fromDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("fromDate", e.target.value);
                              setShowReport(false);
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.toDate}
                            label="To Date"
                            name="toDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("toDate", e.target.value);
                              setShowReport(false);
                            }}
                          />
                        </div>
                      </>
                    )}

                    <div className="col d-flex  align-items-end">
                      <button
                        type="button"
                        className="btn btn-primary mt-5"
                        onClick={() => {
                          if ([6].includes(values?.reportType?.value)) {
                            getReportView(values);
                            dispatch(
                              setExistingtransportpolicyLandingAction(values)
                            );
                          }
                          if ([7, 8].includes(values?.reportType?.value)) {
                            setShowReport(true);
                          }
                        }}
                        // disabled={!values?.shipPoint}
                      >
                        View
                      </button>
                    </div>
                  </div>

                  {[6].includes(values?.reportType?.value) && (
                    <div className="table-responsive">
                      <table
                        className="table table-striped table-bordered global-table"
                        componentRef={printRef}
                        ref={printRef}
                      >
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Shippoint Name</th>
                            <th>Transport Zone</th>
                            <th>Transfer Rate</th>
                            <th>Three Tone Rate</th>
                            <th>Five Tone Rate</th>
                            <th>Seven Tone Rate</th>
                            <th>Twenty Tone Rate</th>
                            <th>Handling Cost</th>
                            <th>Dropping Charge</th>
                            <th>Dropping Charge less 6ton</th>
                            <th>Subsidy Rate</th>
                            <th>Total Rate</th>
                            {/* <th className="printSectionNone">Action</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.map((item, index) => (
                            <tr key={index}>
                              <td> {index + 1}</td>
                              <td>
                                <div className="pl-2">
                                  {item?.shippointName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {item?.transportZoneName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {item?.factoryToGhatTransferRate || 0}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">{item?.num3tonRate}</div>
                              </td>
                              <td>
                                <div className="pl-2">{item?.num5tonRate}</div>
                              </td>
                              <td>
                                <div className="pl-2">{item?.num7tonRate}</div>
                              </td>
                              <td>
                                <div className="pl-2">{item?.num20tonRate}</div>
                              </td>
                              <td>
                                <div className="pl-2 text-right">
                                  {_formatMoney(item?.handlingCost)}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2 text-right">
                                  {_formatMoney(item?.labourCost)}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2 text-right">
                                  {_formatMoney(item?.labourCostLess6)}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2 text-right">
                                  {_formatMoney(item?.subsidyCostRate)}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2 text-right">
                                  {_formatMoney(item?.totalRate)}
                                </div>
                              </td>
                              {/* <td
                            className="text-center printSectionNone"
                            onClick={() => {
                              history.push(
                                `/transport-management/report/transportZoneRate/edit/${item?.zoneCostId}`
                              );
                            }}
                          >
                            <IEdit />
                          </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {showReport && (
                    <PowerBIReport
                      reportId={`dd8ca1e4-eff1-45f0-be67-72cffee7c805`}
                      groupId={`e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`}
                      parameterValues={[
                        {
                          name: "BusinessUnitId",
                          value: `${selectedBusinessUnit?.value?.toString()}`,
                        },
                        {
                          name: "ShipPointId",
                          value: `${values?.shipPoint?.value?.toString()}`,
                        },
                        {
                          name: "intpartid",
                          value: `${values?.reportType?.value?.toString()}`,
                        },
                        {
                          name: "intDistributionChannel",
                          value: `${values?.channel?.value?.toString()}`,
                        },
                        {
                          name: "intRegionid",
                          value: `${values?.region?.value?.toString()}`,
                        },
                        {
                          name: "intAreaid",
                          value: `${values?.area?.value?.toString()}`,
                        },
                        {
                          name: "intTerritoryid",
                          value: `${values?.territory?.value?.toString()}`,
                        },
                        {
                          name: "fromdate",
                          value: `${values?.fromDate}`,
                        },
                        {
                          name: "todate",
                          value: `${values?.toDate}`,
                        },
                      ]}
                      parameterPanel={false}
                    />
                  )}
                </Form>
              </>
            )}
          </Formik>
        </CardBody>
      </Card>
    </>
  );
}

export default TransportZoneRateReport;
