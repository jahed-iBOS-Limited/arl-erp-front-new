/* eslint-disable no-undef */
import { Paper, Tab, Tabs, makeStyles } from "@material-ui/core";
import { SaveOutlined } from "@material-ui/icons";
import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls/Card";
import { dateFormatWithMonthName } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import IButton from "../../../../_helper/iButton";
import printIcon from "../../../../_helper/images/print-icon.png";
import {
  CreateTransportScheduleTypeApi,
  GetShipmentTypeApi,
  commonfilterGridData,
  getDeliverySchedulePlan,
} from "../helper";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import NewSelect from "./../../../../_helper/_select";
import ConfirmtionModal from "./components/Modal";
import RATForm from "./ratForm";
import "./style.scss";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  shipPoint: { value: 0, label: "All" },
  trackingType: {
    value: 1,
    label: "Tracking Pending",
  },
  logisticBy: "",
  channel: "",
  region: "",
  area: "",
  territory: "",
  isMoreFiter: false,
  logisticByFilter: { value: 0, label: "All" },
  isGateOut: { value: false, label: "NO" },
};

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    padding: "5px",
    margin: "5px",
    border: "none",
    display: "flex",
  },
  tab: {
    padding: "0px !important",
    margin: "0px !important",
    minWidth: "105px",
  },
});

function DeliveryScheduleplanReport() {
  const orderCodeMargeCount = (index, salesOrderCode, quantity) => {
    let count = 1;
    let totalQty = quantity;

    for (let i = index + 1; i <= gridData?.length; i++) {
      if (salesOrderCode === gridData[i]?.salesOrderCode) {
        count++;
        totalQty += gridData[i]?.quantity;
      } else {
        break;
      }
    }
    return {
      count,
      totalQty,
    };
  };
  const classes = useStyles();
  const [shipmentType, setShipmentType] = React.useState(0);
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [gridDataCopy, setGridDataCopy] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [gridDataWithOutFilter, setGridDataWithOutFilter] = useState([]);
  const [shipmentTypeDDl, setShipmentTypeDDl] = React.useState([]);
  const [deliveryStatusDDL, getDeliveryStatusDDL] = useAxiosGet();
  const [, updateDeliveryStatus, updateDeliveryStatusLoading] = useAxiosPost();
  const [showBIReport, setShowBIReport] = useState(false);

  // Get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const reportId = `1ba40322-cba5-46fd-87c7-e40ca7b43d25`;
  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;

  const parameterValues = (values) => {
    // console.log(values?.fromDate);
    return [
      { name: "isGateOut", value: `${values?.isGateOut?.value}` },
      { name: "intpartid", value: `${2}` },
      { name: "fromDate", value: `${values?.fromDate}` },
      { name: "toDtae", value: `${values?.toDate}` },
      { name: "accountId", value: `${+profileData?.accountId}` },
      { name: "businessUnitId", value: `${+selectedBusinessUnit?.value}` },
      { name: "shipmentType", value: `${+values?.logisticByFilter?.value}` },
      { name: "shippointId", value: `${+values?.shipPoint?.value}` },
    ];
  };

  const shippointDDL = useSelector((state) => {
    return state.commonDDL.shippointDDL;
  }, shallowEqual);

  const printRef = useRef();

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  React.useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetShipmentTypeApi(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        0,
        setShipmentTypeDDl,
        setLoading
      );
    }
  }, [profileData, selectedBusinessUnit]);

  // delivery status ddl load
  useEffect(() => {
    getDeliveryStatusDDL(
      `/oms/SalesOrganization/GetDeliveryScheduleStatusDDL?BusinessUnitId=${selectedBusinessUnit.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit]);

  const handleChange = (newValue, values) => {
    setShipmentType(newValue);
    getDeliverySchedulePlan(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      shipmentTypeDDl?.[newValue]?.value || 0,
      values?.shipPoint?.value,
      values?.trackingType?.value === 2 ? true : false,
      setLoading,
      (restData) => {
        const filterData = commonfilterGridData(values, restData);
        setGridData(filterData);

        setGridDataWithOutFilter(restData);
      }
    );
  };

  //handle delivery status update
  const handleDeliveryStatusUpdate = (payload) => {
    const uri = "/wms/Delivery/UpdateDeliveryStatus";
    updateDeliveryStatus(uri, payload);
  };

  // one item select
  const itemSlectedHandler = (index) => {
    const copyRowDto = [...gridData];
    copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
    setGridData(copyRowDto);
  };
  // All item select
  const allGridCheck = (value) => {
    const modifyGridData = gridData?.map((itm) => ({
      ...itm,
      itemCheck: itm?.shipmentStatus ? false : value,
    }));
    setGridData(modifyGridData);
  };

  const commonGridApi = (values) => {
    getDeliverySchedulePlan(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      shipmentTypeDDl?.[shipmentType]?.value || 0,
      values?.shipPoint?.value,
      values?.trackingType?.value === 2 ? true : false,
      setLoading,
      (restData) => {
        const filterData = commonfilterGridData(values, restData);
        setGridData(filterData);
        setGridDataCopy(structuredClone(filterData));
        setGridDataWithOutFilter(restData);
      }
    );
  };

  const filterGridDataFunc = (values, allGridData) => {
    const filterData = commonfilterGridData(values, allGridData);
    setGridData(filterData);
  };

  const totalSelectQty = useMemo(() => {
    return gridData
      ?.filter((itm) => itm?.itemCheck)
      ?.reduce((acc, curr) => acc + curr?.quantity, 0);
  }, [gridData]);

  return (
    <>
      {(loading || updateDeliveryStatusLoading) && <Loading />}
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
          }}
        >
          {({ values, setFieldValue, touched, errors }) => (
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Delivery Schedule Plan Report"}>
                <CardHeaderToolbar>
                  {gridData?.length > 0 && (
                    <>
                      <ReactToPrint
                        trigger={() => (
                          <button
                            type="button"
                            className="btn btn-primary px-4 py-1"
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
                      />
                    </>
                  )}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <>
                  <form>
                    <div className="row global-form p-0 m-0 pb-1">
                      <div className="col-lg-3">
                        <NewSelect
                          name="reportType"
                          options={[
                            { value: 1, label: "Shipment Plan Info" },
                            {
                              value: 2,
                              label: "Shipmen Plan Using Auto Suggestion",
                            },
                          ]}
                          value={values?.reportType}
                          label="Report Type"
                          onChange={(valueOption) => {
                            setFieldValue("reportType", valueOption);
                            setGridData([]);
                            setShowBIReport(false);
                          }}
                          placeholder="Report Type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipPoint"
                          options={
                            [{ value: 0, label: "All" }, ...shippointDDL] || []
                          }
                          value={values?.shipPoint}
                          label="Ship Point"
                          onChange={(valueOption) => {
                            setFieldValue("shipPoint", valueOption);
                            setGridData([]);
                            setShowBIReport(false);
                          }}
                          placeholder="Ship Point"
                          errors={errors}
                          touched={touched}
                          isClearable={false}
                        />
                      </div>
                      {values?.reportType?.value === 2 && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="isGateOut"
                            options={[
                              { value: true, label: "YES" },
                              { value: false, label: "NO" },
                            ]}
                            value={values?.isGateOut}
                            label="Is Gate Out?"
                            onChange={(valueOption) => {
                              setFieldValue("isGateOut", valueOption);
                              setShowBIReport(false);
                            }}
                            placeholder="Is Gate Out?"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}

                      {values?.reportType?.value === 1 && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="trackingType"
                            options={[
                              { value: 1, label: "Tracking Pending" },
                              { value: 2, label: "Tracking Complete" },
                            ]}
                            value={values?.trackingType}
                            label="Tracking Type"
                            onChange={(valueOption) => {
                              setGridData([]);
                              setFieldValue("trackingType", valueOption);
                              setFieldValue("logisticBy", "");
                              setFieldValue("isMoreFiter", false);
                              setFieldValue("channel", "");
                              setFieldValue("region", "");
                              setFieldValue("area", "");
                              setFieldValue("territory", "");
                              setFieldValue("logisticByFilter", {
                                value: 0,
                                label: "All",
                              });
                              setShowBIReport(false);
                            }}
                            placeholder="Tracking Type"
                            errors={errors}
                            touched={touched}
                            isClearable={false}
                          />
                        </div>
                      )}
                      {values?.trackingType?.value === 2 && (
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="logisticByFilter"
                              options={[
                                { value: 0, label: "All" },
                                { value: 1, label: "Company" },
                                { value: 2, label: "Supplier" },
                              ]}
                              value={values?.logisticByFilter}
                              label="Logistic By"
                              onChange={(valueOption) => {
                                setFieldValue("logisticByFilter", valueOption);
                                setShowBIReport(false);
                                if (values?.reportType?.value === 1) {
                                  filterGridDataFunc(
                                    {
                                      ...values,
                                      logisticByFilter: valueOption,
                                    },
                                    gridDataWithOutFilter
                                  );
                                }
                              }}
                              placeholder="Logistic By"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </>
                      )}
                      {values?.reportType?.value === 2 && (
                        <>
                          <FromDateToDateForm obj={{ values, setFieldValue }} />
                          <IButton
                            title="View"
                            onClick={() => {
                              setShowBIReport(true);
                            }}
                            disabled={
                              !values?.isGateOut ||
                              !values?.shipPoint ||
                              !values?.logisticByFilter
                            }
                          />
                        </>
                      )}
                      {/* <div className="col-lg-2"></div> */}
                      {values?.trackingType?.value === 1 &&
                        values?.reportType?.value === 1 && (
                          <>
                            <div className="col-lg-3">
                              <div className="d-flex">
                                <NewSelect
                                  name="logisticBy"
                                  options={[
                                    { value: 1, label: "Company" },
                                    { value: 2, label: "Supplier" },
                                  ]}
                                  value={values?.logisticBy}
                                  label="Logistic By"
                                  onChange={(valueOption) => {
                                    setFieldValue("logisticBy", valueOption);
                                  }}
                                  placeholder="Logistic By"
                                  errors={errors}
                                  touched={touched}
                                  isClearable={false}
                                  isDisabled={
                                    !gridData?.some((i) => i.itemCheck)
                                  }
                                />
                                <button
                                  disabled={
                                    // !values?.logisticBy?.value ||
                                    !gridData?.some((i) => i.itemCheck)
                                  }
                                  type="button"
                                  style={{ marginTop: "17px" }}
                                  className="btn btn-primary ml-2"
                                  onClick={() => {
                                    const payload = gridData
                                      ?.filter((i) => i?.itemCheck)
                                      .map((itm) => ({
                                        deliveryId:
                                          itm?.intDeliveryId ||
                                          itm?.deliveryId ||
                                          0,
                                        poviderTypeId:
                                          values?.logisticBy?.value,
                                        providerTypeName:
                                          values?.logisticBy?.label,
                                        scheduleName: itm?.scheduleName || "",
                                        scheduleId:
                                          deliveryStatusDDL.find(
                                            (i) => i.label === itm?.scheduleName
                                          )?.value || 0,
                                        scheduleDate:
                                          itm?.deliveryScheduleDate ||
                                          new Date(),
                                      }));

                                    if (selectedBusinessUnit?.value === 144) {
                                      const isDeliveryStatusSelected = payload?.every(
                                        (item) => item.scheduleName !== ""
                                      );

                                      console.log(
                                        "isDeliveryStatusSelected",
                                        !isDeliveryStatusSelected
                                      );

                                      if (!isDeliveryStatusSelected)
                                        return toast.warn(
                                          "Delivery Status Must be Selected!"
                                        );
                                      return;
                                    }
                                    if (!values?.logisticBy)
                                      return toast.warn(
                                        "Logistic By Must be Selected!"
                                      );
                                    console.log(payload);

                                    CreateTransportScheduleTypeApi(
                                      payload,
                                      setLoading,
                                      () => {
                                        setGridData([]);
                                        commonGridApi(values);
                                        setFieldValue("logisticBy", "");
                                        setFieldValue("isMoreFiter", false);
                                        setFieldValue("channel", "");
                                        setFieldValue("region", "");
                                        setFieldValue("area", "");
                                        setFieldValue("territory", "");
                                      }
                                    );
                                  }}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </>
                        )}

                      {values?.reportType?.value === 1 && (
                        <div className="col-lg-12 p-0 m-0">
                          <Paper square className={classes.root}>
                            <div>
                              <Tabs
                                value={shipmentType}
                                indicatorColor="primary"
                                textColor="primary"
                                onChange={(e, value) => {
                                  handleChange(value, values);
                                }}
                                aria-label="disabled tabs example"
                              >
                                {shipmentTypeDDl?.map((itm, idx) => {
                                  return (
                                    <Tab
                                      label={itm?.label}
                                      className={classes.tab}
                                    />
                                  );
                                })}
                              </Tabs>
                            </div>
                            {windowSize?.width > 600 && (
                              <RestElements
                                values={values}
                                setFieldValue={setFieldValue}
                                setGridData={setGridData}
                                commonGridApi={commonGridApi}
                                filterGridDataFunc={filterGridDataFunc}
                                gridDataWithOutFilter={gridDataWithOutFilter}
                                mobileResponsive={false}
                              />
                            )}
                          </Paper>
                          {/* Duplicate for responsive  */}
                          {windowSize?.width < 600 && (
                            <RestElements
                              values={values}
                              setFieldValue={setFieldValue}
                              setGridData={setGridData}
                              commonGridApi={commonGridApi}
                              filterGridDataFunc={filterGridDataFunc}
                              gridDataWithOutFilter={gridDataWithOutFilter}
                              mobileResponsive={true}
                            />
                          )}
                        </div>
                      )}
                      {values?.isMoreFiter && values?.reportType?.value === 1 && (
                        <>
                          <RATForm
                            obj={{
                              values,
                              setFieldValue,
                              onChange: (values) =>
                                filterGridDataFunc(
                                  values,
                                  gridDataWithOutFilter
                                ),
                            }}
                          />
                        </>
                      )}
                    </div>

                    {/* Table Start */}
                    {!showBIReport && gridData?.length > 0 && (
                      <div
                        ref={printRef}
                        className="deliveryScheduleplanPrintSection"
                      >
                        <div className="text-center my-2 headerInfo">
                          <h3>
                            <b> {selectedBusinessUnit?.label} </b>
                          </h3>

                          <h4>Delivery Schedule Plan Report</h4>
                          <div className="d-flex justify-content-center">
                            <h5>
                              For The Month:
                              {dateFormatWithMonthName(values?.fromDate)}
                            </h5>
                            <h5 className="ml-5">
                              To: {dateFormatWithMonthName(values?.toDate)}
                            </h5>
                          </div>
                        </div>
                        <div className="text-right">
                          Total Qty.:{" "}
                          <b>
                            {_fixedPoint(
                              gridData?.reduce(
                                (acc, curr) => acc + curr?.quantity,
                                0
                              )
                            )}
                          </b>
                        </div>
                        {totalSelectQty > 0 && (
                          <>
                            <div className="text-right">
                              Select Total Qty.: <b>{totalSelectQty}</b>
                            </div>
                          </>
                        )}

                        <div className="loan-scrollable-tafble">
                          <div className="scroll-table _tafble">
                            <div className="table-responsive">
                              <table className="table table-striped table-bordered global-table">
                                <thead>
                                  <tr>
                                    {values?.trackingType?.value === 1 && (
                                      <th
                                        style={{ minWidth: "25px" }}
                                        className="printSectionNone"
                                      >
                                        <input
                                          type="checkbox"
                                          id="parent"
                                          onChange={(event) => {
                                            allGridCheck(event.target.checked);
                                          }}
                                        />
                                      </th>
                                    )}
                                    <th>SL</th>
                                    <th>Sales Order</th>
                                    <th>Delivery Code </th>
                                    <th>Logistic By</th>
                                    {shipmentTypeDDl?.[shipmentType]?.value ===
                                    0 ? (
                                      <th>Shipment Type</th>
                                    ) : null}
                                    <th>Ship Point</th>
                                    <th>Region</th>
                                    <th>Area</th>
                                    <th>Territory</th>
                                    <th>Sold To Party</th>
                                    <th>Ship To Party</th>
                                    <th>Address</th>
                                    <th style={{ minWidth: "100px" }}>
                                      Item Name
                                    </th>
                                    <th>Quantity</th>
                                    <th>Total Qty</th>
                                    {values?.trackingType?.value === 2 && (
                                      <>
                                        <th>Schedule Assign</th>
                                      </>
                                    )}

                                    <th style={{ minWidth: "65px" }}>
                                      Create Date
                                    </th>
                                    <th style={{ minWidth: "65px" }}>
                                      Delivery Status
                                    </th>
                                    <th style={{ minWidth: "65px" }}>
                                      Delivery Date
                                    </th>
                                    <th>Lead Time</th>
                                    <th style={{ minWidth: "70px" }}>
                                      Spend Time
                                    </th>
                                    <th style={{ minWidth: "70px" }}>
                                      Rest of Time{" "}
                                    </th>
                                    <th>Shipment Status</th>
                                    <th>Updated By</th>
                                    <th>Updated Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {gridData?.map((item, index) => {
                                    //check if the table row is saved previosly and we find a scheduleName or not. based on this wi will show the update button for delivery status
                                    const isSubmittedPreviosly = gridDataCopy.find(
                                      (preItem) =>
                                        preItem.deliveryId === item.deliveryId
                                    )?.scheduleName;

                                    // deliveryScheduleDate today date check momentjs
                                    const todayDate = moment(new Date()).format(
                                      "DD-MM-YYYY"
                                    );
                                    const deliveryScheduleDate = moment(
                                      item?.deliveryScheduleDate
                                    ).format("DD-MM-YYYY");
                                    const isToday =
                                      todayDate === deliveryScheduleDate;

                                    // next day deliveryScheduleDate check momentjs
                                    const nextDayDate = moment()
                                      .add(1, "days")
                                      .format("YYYY-MM-DD");
                                    const nextDayDeliveryScheduleDate = moment(
                                      item?.deliveryScheduleDate
                                    ).format("YYYY-MM-DD");
                                    const isNextDay =
                                      new Date(nextDayDate) <=
                                      new Date(nextDayDeliveryScheduleDate);

                                    // yesterday deliveryScheduleDate check momentjs
                                    const yesterdayDate = moment()
                                      .subtract(1, "days")
                                      .format("YYYY-MM-DD");
                                    const yesterdayDeliveryScheduleDate = moment(
                                      item?.deliveryScheduleDate
                                    ).format("YYYY-MM-DD");

                                    const isYesterday =
                                      new Date(yesterdayDate) >=
                                      new Date(yesterdayDeliveryScheduleDate);

                                    const prvSalesOrderCode =
                                      gridData?.[index - 1]?.salesOrderCode;
                                    const forwardSalesOrderCode =
                                      gridData?.[index + 1]?.salesOrderCode;
                                    let rowSpan = 1;
                                    let totalQty = item?.quantity;
                                    if (
                                      forwardSalesOrderCode ===
                                      item?.salesOrderCode
                                    ) {
                                      const margeResult = orderCodeMargeCount(
                                        index,
                                        item?.salesOrderCode,
                                        item?.quantity
                                      );
                                      rowSpan = margeResult.count;
                                      totalQty = margeResult.totalQty;
                                    }

                                    return (
                                      <tr
                                        key={index}
                                        style={{
                                          background: isYesterday
                                            ? "#ff8a98"
                                            : isToday
                                            ? "#e1f0ff"
                                            : isNextDay
                                            ? "#ffff00"
                                            : "",
                                        }}
                                      >
                                        {values?.trackingType?.value === 1 && (
                                          <td className="printSectionNone">
                                            <input
                                              id="itemCheck"
                                              type="checkbox"
                                              value={item.itemCheck}
                                              checked={item.itemCheck}
                                              name={item.itemCheck}
                                              disabled={item?.shipmentStatus}
                                              onChange={(e) => {
                                                itemSlectedHandler(index);
                                              }}
                                            />
                                          </td>
                                        )}

                                        <td className="text-center">
                                          {" "}
                                          {index + 1}
                                        </td>

                                        {prvSalesOrderCode !==
                                          item?.salesOrderCode && (
                                          <td
                                            rowSpan={rowSpan}
                                            style={
                                              rowSpan > 1
                                                ? { fontWeight: "bold" }
                                                : {}
                                            }
                                          >
                                            {item?.salesOrderCode}
                                          </td>
                                        )}
                                        <td>{item?.deliveryCode}</td>
                                        <td>{item?.providerTypeName}</td>
                                        {shipmentTypeDDl?.[shipmentType]
                                          ?.value === 0 ? (
                                          <td>{item?.shipmentType}</td>
                                        ) : null}
                                        <td>{item?.shipPointName}</td>
                                        <td>{item?.region}</td>
                                        <td>{item?.area}</td>
                                        <td>{item?.territory}</td>
                                        <td>{item?.soldToPartnerName}</td>
                                        <td>{item?.shipToPartnerName}</td>
                                        <td>{item?.shipToPartnerAddress}</td>
                                        <td>{item?.itemName}</td>
                                        <td className="text-center">
                                          {item?.quantity}
                                        </td>
                                        {prvSalesOrderCode !==
                                          item?.salesOrderCode && (
                                          <td
                                            className="text-center"
                                            rowSpan={rowSpan}
                                          >
                                            {totalQty}
                                          </td>
                                        )}
                                        {values?.trackingType?.value === 2 && (
                                          <>
                                            <td>
                                              {item?.scheduleAssign ||
                                                item?.vehicleName ||
                                                item?.supplierName}
                                            </td>
                                          </>
                                        )}

                                        <td>
                                          {item?.challanDateTime &&
                                            moment(
                                              item?.challanDateTime
                                            ).format("DD-MM-YYYY hh:mm: A")}
                                        </td>
                                        <td style={{ minWidth: "150px" }}>
                                          <div className="d-flex align-items-center">
                                            <NewSelect
                                              name="deliveryStatus"
                                              options={deliveryStatusDDL ?? []}
                                              value={
                                                item?.scheduleName
                                                  ? deliveryStatusDDL?.find(
                                                      (i) =>
                                                        i.label ===
                                                        item?.scheduleName
                                                    )
                                                  : ""
                                              }
                                              onChange={(valueOption) => {
                                                let copyGridData = [
                                                  ...gridData,
                                                ];
                                                console.log({ gridDataCopy });
                                                copyGridData[index][
                                                  "scheduleName"
                                                ] = valueOption.label;
                                                setGridData(copyGridData);
                                                console.log({ gridData });
                                              }}
                                              errors={errors}
                                              touched={touched}
                                              isClearable={false}
                                            />

                                            {isSubmittedPreviosly && (
                                              <>
                                                <OverlayTrigger
                                                  overlay={
                                                    <Tooltip id="cs-icon">
                                                      Update
                                                    </Tooltip>
                                                  }
                                                >
                                                  <SaveOutlined
                                                    onClick={() =>
                                                      setShowConfirmModal(true)
                                                    }
                                                    role="button"
                                                    className="bg-primary text-white p-1 ml-2 rounded"
                                                  />
                                                </OverlayTrigger>
                                                <ConfirmtionModal
                                                  show={showConfirmModal}
                                                  title="Update Delivery Status"
                                                  message="Are you sure, You want to update delivery status?"
                                                  onYesAction={() => {
                                                    //update data (api call)
                                                    console.log({ item });
                                                    const payload = {
                                                      scheduleId: deliveryStatusDDL.find(
                                                        (i) =>
                                                          i.label ===
                                                          item?.scheduleName
                                                      )?.value,
                                                      autoId: 0,
                                                      deliveryId:
                                                        item?.deliveryId,
                                                      scheduleName:
                                                        item?.scheduleName,
                                                      updatedById:
                                                        profileData?.userId,
                                                    };
                                                    handleDeliveryStatusUpdate(
                                                      payload
                                                    );
                                                    setShowConfirmModal(false);
                                                  }}
                                                  handleClose={
                                                    setShowConfirmModal
                                                  }
                                                />
                                              </>
                                            )}
                                          </div>
                                        </td>
                                        <td>
                                          {item?.deliveryScheduleDate &&
                                            moment(
                                              item?.deliveryScheduleDate
                                            ).format("DD-MM-YYYY hh:mm: A")}
                                        </td>
                                        <td>{item?.leadTimeHr}</td>
                                        <td>{item?.spendTimeHr}</td>
                                        <td>{item?.pendingTimeHr}</td>
                                        <td>{item?.shipmentStatus || ""}</td>
                                        <td>{item?.updatedByName || ""}</td>
                                        <td>{item?.updateDate || ""}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {showBIReport &&
                      [2].includes(values?.reportType?.value) && (
                        <PowerBIReport
                          reportId={reportId}
                          groupId={groupId}
                          parameterValues={parameterValues(values)}
                          parameterPanel={false}
                        />
                      )}
                  </form>
                </>
              </CardBody>
            </Card>
          )}
        </Formik>
      </div>
    </>
  );
}

export default DeliveryScheduleplanReport;

const RestElements = ({
  values,
  setFieldValue,
  setGridData,
  commonGridApi,
  filterGridDataFunc,
  gridDataWithOutFilter,
  mobileResponsive,
}) => {
  return (
    <>
      <div className={`col-lg-2 ${mobileResponsive && "col-sm-12"}`}>
        <label>From Date</label>
        <InputField
          value={values?.fromDate}
          name="fromDate"
          placeholder="From Date"
          type="date"
          onChange={(e) => {
            setGridData([]);
            setFieldValue("fromDate", e.target.value);
          }}
        />
      </div>

      <div className={`col-lg-2 ${mobileResponsive && "col-sm-12"}`}>
        <label>To Date</label>
        <InputField
          value={values?.toDate}
          name="toDate"
          placeholder="To Date"
          type="date"
          onChange={(e) => {
            setFieldValue("toDate", e.target.value);
            setGridData([]);
          }}
        />
      </div>

      <div className={`col-lg-2 ${mobileResponsive && "col-sm-12"}`}>
        <div className="d-flex justify-content-between align-items-center">
          <button
            type="button"
            style={{ marginTop: "17px" }}
            disabled={
              !values?.fromDate || !values?.toDate || !values?.shipPoint
            }
            onClick={() => {
              setGridData([]);
              commonGridApi(values);
              setFieldValue("isMoreFiter", false);
              setFieldValue("channel", "");
              setFieldValue("region", "");
              setFieldValue("area", "");
              setFieldValue("territory", "");
            }}
            className="btn btn-primary"
          >
            Show
          </button>
          <div className="d-flex justify-content-center align-items-center">
            <label className="mr-1" htmlFor="isMoreFiter">
              More Filter
            </label>
            <input
              id="isMoreFiter"
              value={values?.isMoreFiter}
              name="isMoreFiter"
              checked={values?.isMoreFiter}
              onChange={(e) => {
                setFieldValue("isMoreFiter", e.target.checked);
                setFieldValue("channel", "");
                setFieldValue("region", "");
                setFieldValue("area", "");
                setFieldValue("territory", "");

                filterGridDataFunc(
                  {
                    ...values,
                    channel: "",
                    region: "",
                    area: "",
                    territory: "",
                  },
                  gridDataWithOutFilter
                );
              }}
              type="checkbox"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </>
  );
};
