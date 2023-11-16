import { Paper, Tab, Tabs, makeStyles } from "@material-ui/core";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import printIcon from "../../../../_helper/images/print-icon.png";
import {
  CreateTransportScheduleTypeApi,
  GetShipmentTypeApi,
  commonfilterGridData,
  getDeliverySchedulePlan,
} from "../helper";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import NewSelect from "./../../../../_helper/_select";
import RATForm from "./ratForm";
import "./style.scss";
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
  const [gridDataWithOutFilter, setGridDataWithOutFilter] = useState([]);
  const [shipmentTypeDDl, setShipmentTypeDDl] = React.useState([]);
  const [deliveryStatusDDL, getDeliveryStatusDDL] = useAxiosGet();
  // Get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const shippointDDL = useSelector((state) => {
    return state.commonDDL.shippointDDL;
  }, shallowEqual);
  const printRef = useRef();

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
      `/oms/SalesOrganization/GetDeliveryScheduleStatusDDL?BusinessUnitId=${selectedBusinessUnit.value}`,
      (data) => console.log({ data })
    );
    console.log({ selectedBusinessUnit });
    console.log({ deliveryStatusDDL });
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
      {loading && <Loading />}
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
                  <Form>
                    <div className="row global-form p-0 m-0 pb-1">
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
                          }}
                          placeholder="Ship Point"
                          errors={errors}
                          touched={touched}
                          isClearable={false}
                        />
                      </div>

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
                          }}
                          placeholder="Tracking Type"
                          errors={errors}
                          touched={touched}
                          isClearable={false}
                        />
                      </div>
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
                                filterGridDataFunc(
                                  {
                                    ...values,
                                    logisticByFilter: valueOption,
                                  },
                                  gridDataWithOutFilter
                                );
                              }}
                              placeholder="Logistic By"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </>
                      )}
                      <div className="col-lg-2"></div>
                      {values?.trackingType?.value === 1 && (
                        <>
                          <div className="col-lg-4">
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
                                isDisabled={!gridData?.some((i) => i.itemCheck)}
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
                                      poviderTypeId: values?.logisticBy?.value,
                                      providerTypeName:
                                        values?.logisticBy?.label,
                                        scheduleName:
                                        itm?.scheduleName?.label,
                                      scheduleDate:
                                        itm?.deliveryScheduleDate || new Date(),
                                    }));

                                  const isDeliveryStatusSelected = payload?.every(
                                    (item) => item.scheduleName !== null
                                  );

                                  if (!isDeliveryStatusSelected)
                                    return toast.warn(
                                      "Delivery Status Must be Selected!"
                                    );

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

                          <div className="col-lg-2">
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

                          <div className="col-lg-2">
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

                          <div className="col">
                            <div className="d-flex justify-content-between align-items-center">
                              <button
                                type="button"
                                style={{ marginTop: "17px" }}
                                disabled={
                                  !values?.fromDate ||
                                  !values?.toDate ||
                                  !values?.shipPoint
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
                                <label className="mr-1" for="isMoreFiter">
                                  More Filter
                                </label>
                                <input
                                  id="isMoreFiter"
                                  value={values?.isMoreFiter}
                                  name="isMoreFiter"
                                  checked={values?.isMoreFiter}
                                  onChange={(e) => {
                                    setFieldValue(
                                      "isMoreFiter",
                                      e.target.checked
                                    );
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
                        </Paper>
                      </div>
                      {values?.isMoreFiter && (
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
                    {gridData?.length > 0 && (
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
                                  </tr>
                                </thead>
                                <tbody>
                                  {gridData?.map((item, index) => {
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
                                          <div>
                                          <NewSelect
                                            name="deliveryStatus"
                                            options={deliveryStatusDDL ?? []}
                                            value={item?.scheduleName ? deliveryStatusDDL?.find(i=>i.label === item?.scheduleName) : ""}
                                            onChange={(valueOption) => {
                                              let copyGridData = [...gridData];
                                              copyGridData[index][
                                                "scheduleName"
                                              ] = valueOption;
                                              setGridData(copyGridData);
                                              console.log(gridData);
                                            }}
                                            errors={errors}
                                            touched={touched}
                                            isClearable={false}
                                          />
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
                  </Form>
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
