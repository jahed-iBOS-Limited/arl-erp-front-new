import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import {
  GetTransportSheduleNUnshedule_api,
  getTerritoryList,
  getDistributionChannelDDL_api,
} from "../helper";
import { Formik } from "formik";
import { Form } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import printIcon from "../../../../_helper/images/print-icon.png";
import ReactToPrint from "react-to-print";
import { generateJsonToExcel } from "./../../../../_helper/excel/jsonToExcel";
import InputField from "./../../../../_helper/_inputField";
import Table from "./table";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  fromTime: "00:00",
  toTime: "23:59",
  shipPoint: "",
  territory: "",
  reportType: { value: 1, label: "Top Sheet" },
  distributionChannel: "",
};

function SheduleNUnshedule() {
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [territoryDDL, setTerritoryDDL] = useState([]);
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
    setGridData([]);
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetTransportSheduleNUnshedule_api(
        values?.reportType?.value,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        values?.fromTime,
        values?.toTime,
        values?.distributionChannel?.value,
        values?.shipPoint?.value,
        setGridData,
        values?.territory?.value,
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
        text: "Request No",
        textFormat: "text",
        alignment: "center:middle",
        key: "strRequestNo",
      },
      {
        text: "Item Name",
        textFormat: "text",
        alignment: "center:middle",
        key: "strItemName",
      },
      {
        text: "Party Name",
        textFormat: "text",
        alignment: "center:middle",
        key: "strPartyName",
      },
      {
        text: "Picking Point Name",
        textFormat: "text",
        alignment: "center:middle",
        key: "strPickingPointName",
      },
      {
        text: "Sold To Partner Name",
        textFormat: "text",
        alignment: "center:middle",
        key: "strSoldToPartnerName",
      },
      {
        text: "Vehicle Provider Type",
        textFormat: "text",
        alignment: "center:middle",
        key: "strVehicleProviderType",
      },
      {
        text: "Vehicle Type	",
        textFormat: "text",
        alignment: "center:middle",
        key: "strVehicleType",
      },
      {
        text: "Delivery Mode",
        textFormat: "text",
        alignment: "center:middle",
        key: "strDeliveryMode",
      },
      {
        text: "Car Type",
        textFormat: "text",
        alignment: "center:middle",
        key: "strCarType",
      },
      {
        text: "Bag Type",
        textFormat: "text",
        alignment: "center:middle",
        key: "strBagType",
      },
      {
        text: "Proceed Day",
        textFormat: "text",
        alignment: "center:middle",
        key: "ProceedDay",
      },
      {
        text: "Remaing Time",
        textFormat: "text",
        alignment: "center:middle",
        key: "RemaingTime",
      },
      {
        text: "Date Sheduled",
        textFormat: "text",
        alignment: "center:middle",
        key: "dteSheduledDate",
      },
      {
        text: "Region",
        textFormat: "text",
        alignment: "center:middle",
        key: "nl5",
      },
      {
        text: "Area",
        textFormat: "text",
        alignment: "center:middle",
        key: "nl6",
      },
      {
        text: "Total Qty",
        textFormat: "money",
        alignment: "center:middle",
        key: "decTotalQty",
      },
    ];
    const _data = row.map((item, index) => {
      return {
        ...item,
        sl: index + 1,
        dteSheduledDate: _dateFormatter(item?.dteSheduledDate),
      };
    });
    generateJsonToExcel(header, _data, "sheduleNUnshedule");
  };

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getDistributionChannelDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);
  const printRef = useRef();
  return (
    <>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title={"Schedule N UnSchedule"}>
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
          <Formik enableReinitialize={true} initialValues={{ ...initData }}>
            {({ values, setFieldValue, errors, touched }) => (
              <>
                <Form>
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="distributionChannel"
                        options={[
                          { value: 0, label: "All" },
                          ...distributionChannelDDL,
                        ]}
                        value={values?.distributionChannel}
                        label="Distribution Channel"
                        onChange={(valueOption) => {
                          setFieldValue("distributionChannel", valueOption);
                          setFieldValue("territory", "");

                          setGridData([]);
                          getTerritoryList(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setTerritoryDDL
                          );
                        }}
                        placeholder="Distribution Channel"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="territory"
                        options={
                          [{ value: 0, label: "All" }, ...territoryDDL] || []
                        }
                        value={values?.territory}
                        label="Territory"
                        onChange={(valueOption) => {
                          setFieldValue("territory", valueOption);
                          setGridData([]);
                        }}
                        placeholder="Territory"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipPoint"
                        options={
                          [{ value: 0, label: "All" }, ...shipPointDDL] || []
                        }
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
                      <label>From Date Time</label>
                      <span className="d-flex">
                        <InputField
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="Date"
                          type="date"
                          onChange={(e) => {
                            setGridData([]);
                            setFieldValue("fromDate", e.target.value);
                          }}
                        />
                        <InputField
                          value={values?.fromTime}
                          name="fromTime"
                          placeholder="From Time"
                          type="time"
                          onChange={(e) => {
                            setGridData([]);
                            setFieldValue("fromTime", e.target.value);
                          }}
                        />
                      </span>
                    </div>
                    <div className="col-lg-3">
                      <label>To Date Time</label>
                      {/* <div className="d-flex"> */}
                      <span className="d-flex">
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="Date"
                          type="date"
                          onChange={(e) => {
                            setGridData([]);
                            setFieldValue("toDate", e.target.value);
                          }}
                        />
                        <InputField
                          value={values?.toTime}
                          name="toTime"
                          placeholder="To Time"
                          type="time"
                          onChange={(e) => {
                            setGridData([]);
                            setFieldValue("toTime", e.target.value);
                          }}
                        />
                      </span>

                      {/* </div> */}
                      {/* <div><label>To Time</label></div> */}
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="reportType"
                        options={[
                          { value: 1, label: "Top Sheet" },
                          { value: 2, label: "Company" },
                          { value: 3, label: "Supplier" },
                        ]}
                        value={values?.reportType}
                        label="Report Type"
                        onChange={(valueOption) => {
                          setFieldValue("reportType", valueOption);
                          setGridData([]);
                        }}
                        placeholder="Report Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col d-flex  align-items-end justify-content-end">
                      <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={() => {
                          getReportView(values);
                        }}
                        disabled={
                          !values?.shipPoint ||
                          !values?.reportType ||
                          !values?.territory
                        }
                      >
                        View
                      </button>
                    </div>
                  </div>
                  {/* table */}
                  <Table printRef={printRef} gridData={gridData} />
                </Form>
              </>
            )}
          </Formik>
        </CardBody>
      </Card>
    </>
  );
}

export default SheduleNUnshedule;
