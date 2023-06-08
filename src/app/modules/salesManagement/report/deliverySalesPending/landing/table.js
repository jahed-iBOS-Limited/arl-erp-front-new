/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-distracting-elements */
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import ICard from "../../../../_helper/_card";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getShippointDDL_Action } from "../../pendingOrder/_redux/Actions";
import {
  CreateTransportScheduleTypeApi,
  getOrderVsShipmentVsPending_api,
  getShipmentForTransportPlanning,
  getTransportScheduleTypeData_api,
} from "../helper";
import "../style.css";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import PaginationTable from "./../../../../_helper/_tablePagination";

const initData = {
  reportType: "",
  shipPoint: "",
  // fromDate: moment(date).format("YYYY-MM-DD HH:mm"),
  // toDate: moment(date).format("YYYY-MM-DD HH:mm"),
  fromDate: _todayDate(),
  fromTime: "",
  toDate: _todayDate(),
  toTime: "",
  channel: "",
  region: "",
  area: "",
  territory: "",
};

export default function DeliverySalesPending() {
  const printRef = useRef();
  const dispatch = useDispatch();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [gridDataTwo, setGridDataTwo] = useState([]);

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const shippointDDL = useSelector((state) => {
    return state?.pendingOrder?.shippointDDL;
  }, shallowEqual);

  const viewHandler = async (
    values,
    setter,
    _pageNo = pageNo,
    _pageSize = pageSize
  ) => {
    setGridDataTwo([]);
    setter([]);
    if ([1, 3, 4].includes(values?.reportType?.value)) {
      getOrderVsShipmentVsPending_api(
        accId,
        buId,
        `${values?.fromDate}T${values?.fromTime}`,
        `${values?.toDate}T${values?.toTime}`,
        values?.shipPoint?.value,
        _pageNo,
        _pageSize,
        setLoading,
        setter,
        setGridDataTwo,
        values?.reportType?.value
      );
    } else {
      getShipmentForTransportPlanning(
        accId,
        buId,
        values?.shipPoint?.value,
        `${values?.fromDate}T${values?.fromTime}`,
        `${values?.toDate}T${values?.toTime}`,
        _pageNo,
        _pageSize,
        setter,
        setGridDataTwo,
        setLoading
      );
    }
  };
  const viewHandlerTrackingCompleteBtnClick = async (
    values,
    setter,
    _pageNo = pageNo,
    _pageSize = pageSize
  ) => {
    setGridDataTwo([]);
    setter([]);
    getTransportScheduleTypeData_api(
      accId,
      buId,
      `${values?.fromDate}T${values?.fromTime}`,
      `${values?.toDate}T${values?.toTime}`,
      values?.shipPoint?.value,
      _pageNo,
      _pageSize,
      setLoading,
      setter,
      setGridDataTwo,
      values?.logisticBy?.value
    );
  };

  useEffect(() => {
    dispatch(getShippointDDL_Action(userId, accId, buId));
  }, [accId, buId, userId]);

  useEffect(() => {
    return () => {
      setGridData([]);
    };
  }, []);

  // const maxDateFunc = (values) => {
  //   let date = new Date(values?.fromDate),
  //     y = date.getFullYear(),
  //     m = date.getMonth();
  //   var lastDay = new Date(y, m + 1, 0);
  //   return _dateFormatter(lastDay);
  // };

  const filterGridData = (values) => {
    if (values?.region) {
      if (values?.region?.value === 0) {
        setGridData(gridDataTwo);
        return;
      } else if (!values?.area && !values?.territory) {
        setGridData({
          ...gridDataTwo,
          data: gridDataTwo?.data?.filter(
            (item) => item?.region === values?.region?.label
          ),
        });
        return;
      } else if (values?.area && !values?.territory) {
        if (values?.area?.value === 0) {
          setGridData({
            ...gridDataTwo,
            data: gridDataTwo?.data?.filter(
              (item) => item?.region === values?.region?.label
            ),
          });
        } else {
          setGridData({
            ...gridDataTwo,
            data: gridDataTwo?.data?.filter(
              (item) =>
                item?.region === values?.region?.label &&
                item?.area === values?.area?.label
            ),
          });
        }
        return;
      } else if (values?.territory) {
        if (values?.territory?.value === 0) {
          setGridData({
            ...gridDataTwo,
            data: gridDataTwo?.data?.filter(
              (item) =>
                item?.region === values?.region?.label &&
                item?.area === values?.area?.label
            ),
          });
        } else {
          setGridData({
            ...gridDataTwo,
            data: gridDataTwo?.data?.filter(
              (item) =>
                item?.region === values?.region?.label &&
                item?.area === values?.area?.label &&
                item?.territory === values?.territory?.label
            ),
          });
        }
        return;
      }
    } else {
      setGridData(gridDataTwo);
    }
  };

  let totalOrderQty = 0;
  let totalShipmentQty = 0;
  let totalDeliveryQty = 0;
  let totalPendingDeliveryQty = 0;
  let totalPendingShipmentQty = 0;

  // one item select
  const itemSlectedHandler = (value, index) => {
    const copyRowDto = [...gridData?.data];
    copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
    setGridData({ ...gridData, data: copyRowDto });
  };
  // All item select
  const allGridCheck = (value) => {
    const modifyGridData = gridData?.data?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setGridData({ ...gridData, data: modifyGridData });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setFieldValue }) => {
          setFieldValue("trackingCompleteBtnClick", false);
          setFieldValue("logisticBy", "");
          viewHandler(values, setGridData);
        }}
      >
        {({ values, errors, touched, setFieldValue, setValues }) => (
          <>
            <ICard
              printTitle="Print"
              title="Pending Delivery & Shipment"
              isPrint={true}
              isShowPrintBtn={true}
              componentRef={printRef}
              isExcelBtn={
                gridData?.data?.length > 0 || gridData?.length > 0
                  ? true
                  : false
              }
              excelFileNameWillbe={`Delivery Sales Pending (${
                values?.reportType?.value === 1 ? "Top Sheet" : "Details"
              } )`}
            >
              <div>
                <marquee
                  direction="left"
                  style={{ fontSize: "15px", fontWeight: "bold", color: "red" }}
                >
                  Excel export allow for only one month
                </marquee>
                <div className="mx-auto">
                  {loading && <Loading />}
                  <Form className="form form-label-right">
                    <div className="form-group row global-form printSectionNone mt-0">
                      <div className="col-lg-3">
                        <NewSelect
                          name="reportType"
                          options={[
                            { value: 1, label: "Top Sheet (Pending)" },
                            { value: 3, label: "Top Sheet (Complete)" },
                            { value: 4, label: "Details" },
                            { value: 2, label: "Transport Schedule" },
                          ]}
                          value={values?.reportType}
                          label="Report Type"
                          onChange={(valueOption) => {
                            setFieldValue("reportType", valueOption);
                            setGridData([]);
                            setValues({ ...initData, reportType: valueOption });
                          }}
                          placeholder="Select Report Type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3 mb-2">
                        <NewSelect
                          name="shipPoint"
                          options={[
                            { value: 0, label: "All" },
                            ...shippointDDL,
                          ]}
                          value={values?.shipPoint}
                          label="Select Ship Point"
                          onChange={(valueOption) => {
                            setFieldValue("shipPoint", valueOption);
                          }}
                          placeholder="Select Ship Point"
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
                            max={values?.toDate}
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
                            min={values?.fromDate}
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
                      </div>

                      {[2]?.includes(values?.reportType?.value) && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="logisticBy"
                            options={[
                              ...(values?.trackingCompleteBtnClick
                                ? [{ value: 0, label: "All" }]
                                : []),
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
                          />
                        </div>
                      )}

                      {[1, 3, 4]?.includes(values?.reportType?.value) && (
                        <div className="col-12 text-right">
                          <button
                            disabled={
                              !values?.toDate ||
                              !values?.fromDate ||
                              !values?.toTime ||
                              !values?.fromTime ||
                              !values?.reportType
                            }
                            type="submit"
                            className="btn btn-primary mt-3"
                          >
                            View
                          </button>
                        </div>
                      )}

                      {[2]?.includes(values?.reportType?.value) && (
                        <div className="col-9 text-right">
                          <div>
                            <button
                              disabled={
                                !values?.toDate ||
                                !values?.fromDate ||
                                !values?.toTime ||
                                !values?.fromTime ||
                                !values?.reportType ||
                                !values?.shipPoint
                              }
                              className="btn btn-primary mt-3 mr-2"
                              type="submit"
                            >
                              Tracking Pending
                            </button>
                            <button
                              disabled={
                                !values?.toDate ||
                                !values?.fromDate ||
                                !values?.toTime ||
                                !values?.fromTime ||
                                !values?.reportType ||
                                !values?.logisticBy
                              }
                              type="button"
                              className="btn btn-primary mt-3"
                              onClick={() => {
                                viewHandlerTrackingCompleteBtnClick(
                                  values,
                                  setGridData
                                );
                                setFieldValue("trackingCompleteBtnClick", true);
                              }}
                            >
                              Tracking Complete
                            </button>
                            {!values?.trackingCompleteBtnClick && (
                              <button
                                disabled={
                                  !values?.logisticBy ||
                                  values?.logisticBy?.value === 0 ||
                                  !gridData?.data?.some((i) => i.itemCheck)
                                }
                                type="button"
                                className="btn btn-primary mt-3 ml-2"
                                onClick={() => {
                                  const payload = gridData?.data
                                    ?.filter((i) => i?.itemCheck)
                                    .map((itm) => ({
                                      deliveryId: itm?.intDeliveryId || 0,
                                      poviderTypeId: values?.logisticBy?.value,
                                      providerTypeName:
                                        values?.logisticBy?.label,
                                      scheduleDate: new Date(),
                                    }));
                                  CreateTransportScheduleTypeApi(
                                    payload,
                                    setLoading,
                                    () => {
                                      setGridData([]);
                                      setGridDataTwo([]);
                                    }
                                  );
                                }}
                              >
                                Save
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="col-12"></div>
                      {![1, 3]?.includes(values?.reportType?.value) && (
                        <RATForm
                          obj={{
                            values,
                            setFieldValue,
                            onChange: (values) => filterGridData(values),
                          }}
                        />
                      )}
                    </div>
                  </Form>
                  {/* reportType = Details */}
                  {values?.reportType?.value === 4 &&
                    gridData?.data?.length > 0 && (
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
                                  <th style={{ minWidth: "35px" }}>SL</th>
                                  {values?.trackingCompleteBtnClick && (
                                    <th>Logistic By</th>
                                  )}
                                  <th>Region</th>
                                  <th>Area</th>
                                  <th>Territory</th>
                                  <th>Sold To Partner Name</th>
                                  <th>Delivery Order(DO)/Customer Delivery</th>
                                  <th>Delivery Order Date & Time</th>
                                  <th>Item Name</th>
                                  <th>SO No.</th>
                                  <th>SO Date</th>
                                  <th>Order Qty</th>
                                  <th>Customer Delivery</th>
                                  <th>Delivery Amount</th>
                                  <th>Shipment Qty</th>
                                  <th>Pen. SO</th>
                                  <th>Shipment Status</th>
                                  <th>Pen. Shipment Qty</th>
                                  <th>Pen. Delivery Qty</th>
                                  <th>Ship to Party Name</th>
                                  <th>Delivery Address With Phone No.</th>
                                  <th>Vehicle Provider Type</th>
                                  <th>Vehicle No</th>
                                  <th>Supplier Name</th>
                                  <th>Vehicle Type</th>
                                  <th>Delivery Mode</th>
                                  <th>Car Type</th>
                                  <th>QTY</th>
                                </thead>
                                <tbody>
                                  {gridData?.data?.map((item, index) => {
                                    return (
                                      <tr key={index}>
                                        <td
                                          className="text-center"
                                          style={{ width: "30px" }}
                                        >
                                          {index + 1}
                                        </td>
                                        {values?.trackingCompleteBtnClick && (
                                          <td>
                                            {item?.providerTypeName || ""}
                                          </td>
                                        )}
                                        <td>{item?.region}</td>
                                        <td>{item?.area}</td>
                                        <td>{item?.territory}</td>
                                        <td>{item?.soldToPartnerName}</td>
                                        <td>{item?.deliveryCode}</td>
                                        <td>
                                          {item?.deliveryDate &&
                                            moment(item?.deliveryDate).format(
                                              "DD-MMM-yyyy, hh:mm A "
                                            )}
                                        </td>
                                        <td>{item?.itemName}</td>
                                        <td>{item?.salesOrderCode}</td>
                                        <td>
                                          {item?.salesOrderDate &&
                                            moment(item?.salesOrderDate).format(
                                              "DD-MMM-yyyy"
                                            )}
                                        </td>
                                        <td className="text-right">
                                          {_fixedPoint(item?.orderQuantity)}
                                        </td>
                                        <td className="text-right">
                                          {_fixedPoint(item?.deliveryQty)}
                                        </td>
                                        <td className="text-right">
                                          {_fixedPoint(
                                            item?.deliveryAmount,
                                            true
                                          )}
                                        </td>
                                        <td className="text-right">
                                          {_fixedPoint(item?.shipmentQty)}
                                        </td>
                                        <td className="text-right">
                                          {_fixedPoint(
                                            item?.pendingDeliveryqty
                                          )}
                                        </td>
                                        <td className="text-right">
                                          {item?.shipmentQty === 0
                                            ? "Pending"
                                            : item?.shipmentQty > 0
                                            ? "Complete"
                                            : ""}
                                        </td>
                                        <td className="text-right">
                                          {_fixedPoint(
                                            item?.pendingShipmentQty
                                          )}
                                        </td>
                                        <td className="text-right">
                                          {_fixedPoint(
                                            item?.pendingDeliveryqty
                                          )}
                                        </td>
                                        <td>{item?.shipToPartnerName}</td>
                                        <td>{item?.shipToPartnerAddress}</td>
                                        <td>{item?.vehicleProviderType}</td>
                                        <td>{item?.vehicleNo}</td>
                                        <td>{item?.supplierName}</td>
                                        <td>{item?.vehicleType}</td>
                                        <td>{item?.deliveryMode}</td>
                                        <td>{item?.carType}</td>
                                        <td className="text-right">
                                          {_fixedPoint(item?.deliveredQuantity)}
                                        </td>
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

                  {/* reportType = Top Sheet (Pending) & Top Sheet (Complete) */}
                  {[1, 3]?.includes(values?.reportType?.value) &&
                    gridData?.length > 0 && (
                      <table
                        className="table table-striped table-bordered global-table"
                        id="table-to-xlsx"
                      >
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>SO No</th>
                            <th>SO Qty</th>
                            <th>Customer Delivery Qty</th>
                            <th>Shipment Qty</th>
                            <th>Pending Customer Delivery Qty</th>
                            <th>Pending Shipment Qty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.map((td, index) => {
                            totalOrderQty += td?.orderQuantity;
                            totalShipmentQty += td?.shipmentQty;
                            totalDeliveryQty += td?.deliveredQuantity;
                            totalPendingDeliveryQty += td?.pendingDeliveryqty;
                            totalPendingShipmentQty += td?.pendingShipmentQty;

                            return (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>{td?.salesOrderCode}</td>
                                <td className="text-right">
                                  {td?.orderQuantity}
                                </td>
                                <td className="text-right">
                                  {td?.deliveredQuantity}
                                </td>
                                <td className="text-right">
                                  {td?.shipmentQty}
                                </td>
                                <td className="text-right">
                                  {td?.pendingDeliveryqty}
                                </td>
                                <td className="text-right">
                                  {td?.pendingShipmentQty}
                                </td>
                              </tr>
                            );
                          })}
                          <tr
                            style={{ textAlign: "right", fontWeight: "bold" }}
                          >
                            <td colSpan={2}>Total</td>
                            <td>{_fixedPoint(totalOrderQty, true)}</td>
                            <td>{_fixedPoint(totalDeliveryQty, true)}</td>
                            <td>{_fixedPoint(totalShipmentQty, true)}</td>
                            <td>
                              {_fixedPoint(totalPendingDeliveryQty, true)}
                            </td>
                            <td>
                              {_fixedPoint(totalPendingShipmentQty, true)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}

                  {/* report type = transport schedule */}
                  {values?.reportType?.value === 2 &&
                    gridData?.data?.length > 0 && (
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
                                  {[2]?.includes(values?.reportType?.value) &&
                                    !values?.trackingCompleteBtnClick && (
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

                                  <th style={{ minWidth: "35px" }}>SL</th>
                                  {values?.trackingCompleteBtnClick && (
                                    <th>Logistic By</th>
                                  )}
                                  <th>Region</th>
                                  <th>Area</th>
                                  <th>Territory</th>
                                  <th>Sold To Partner Name</th>
                                  <th>Delivery Order(DO)/Customer Delivery</th>
                                  <th>Delivery Date</th>
                                  <th>SO No.</th>
                                  <th>Total Item Qty</th>
                                  <th>Bag Type</th>
                                  <th>Delivery Address</th>
                                  <th>Contact</th>
                                  <th>Car Type</th>
                                </thead>
                                <tbody>
                                  {gridData?.data?.map((item, index) => {
                                    return (
                                      <tr key={index}>
                                        {[2]?.includes(
                                          values?.reportType?.value
                                        ) &&
                                          !values?.trackingCompleteBtnClick && (
                                            <td className="printSectionNone">
                                              <input
                                                id="itemCheck"
                                                type="checkbox"
                                                value={item.itemCheck}
                                                checked={item.itemCheck}
                                                name={item.itemCheck}
                                                onChange={(e) => {
                                                  itemSlectedHandler(
                                                    e.target.checked,
                                                    index
                                                  );
                                                }}
                                              />
                                            </td>
                                          )}
                                        <td
                                          className="text-center"
                                          style={{ width: "30px" }}
                                        >
                                          {index + 1}
                                        </td>
                                        {values?.trackingCompleteBtnClick && (
                                          <td>
                                            {item?.providerTypeName || ""}
                                          </td>
                                        )}
                                        <td>{item?.region}</td>
                                        <td>{item?.area}</td>
                                        <td>{item?.territory}</td>
                                        <td>{item?.strSoldToPartnerName}</td>
                                        <td>{item?.strDeliveryCode}</td>
                                        <td>
                                          {_dateFormatter(
                                            item?.dteDeliveryDate
                                          )}
                                        </td>
                                        <td>{item?.salesOrderCode}</td>
                                        <td className="text-right">
                                          {_fixedPoint(item?.itemTotalQty)}
                                        </td>
                                        <td>{item?.bagType}</td>
                                        <td>{item?.address}</td>
                                        <td>{item?.strContact}</td>
                                        <td>{item?.carType}</td>
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

                  {gridData?.data?.length > 0 && (
                    <PaginationTable
                      count={gridData?.totalCount}
                      setPositionHandler={(pageNo, pageSize) => {
                        viewHandler(values, setGridData, pageNo, pageSize);
                      }}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                    />
                  )}
                </div>
              </div>
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
}
