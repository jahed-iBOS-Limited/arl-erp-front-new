import { Paper, Tab, Tabs, makeStyles } from "@material-ui/core";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
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
import printIcon from "../../../../_helper/images/print-icon.png";
import {
  CreateTransportScheduleTypeApi,
  GetShipmentTypeApi,
  getDeliverySchedulePlan,
} from "../helper";
import NewSelect from "./../../../../_helper/_select";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  shipPoint: { value: 0, label: "All" },
  trackingType: {
    value: 1,
    label: "Tracking Pending",
  },
  logisticBy: "",
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
  const classes = useStyles();
  const [shipmentType, setShipmentType] = React.useState(0);
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [shipmentTypeDDl, setShipmentTypeDDl] = React.useState([]);
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
      setGridData,
      setLoading
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
      setGridData,
      setLoading
    );
  };

  return (
    <>
      {loading && <Loading />}
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
                          type='button'
                          className='btn btn-primary px-4 py-1'
                        >
                          <img
                            style={{
                              width: "25px",
                              paddingRight: "5px",
                            }}
                            src={printIcon}
                            alt='print-icon'
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
                  <div className='row global-form p-0 m-0'>
                    <div className='col-lg-3'>
                      <NewSelect
                        name='shipPoint'
                        options={
                          [{ value: 0, label: "All" }, ...shippointDDL] || []
                        }
                        value={values?.shipPoint}
                        label='Ship Point'
                        onChange={(valueOption) => {
                          setFieldValue("shipPoint", valueOption);
                          setGridData([]);
                        }}
                        placeholder='Ship Point'
                        errors={errors}
                        touched={touched}
                        isClearable={false}
                      />
                    </div>

                    <div className='col-lg-3'>
                      <NewSelect
                        name='trackingType'
                        options={[
                          { value: 1, label: "Tracking Pending" },
                          { value: 2, label: "Tracking Complete" },
                        ]}
                        value={values?.trackingType}
                        label='Tracking Type'
                        onChange={(valueOption) => {
                          setGridData([]);
                          setFieldValue("trackingType", valueOption);
                          setFieldValue("logisticBy", "");
                        }}
                        placeholder='Tracking Type'
                        errors={errors}
                        touched={touched}
                        isClearable={false}
                      />
                    </div>
                    <div className='col-lg-3'></div>
                    {values?.trackingType?.value === 1 && (
                      <>
                        <div className='col-lg-3'>
                          <NewSelect
                            name='logisticBy'
                            options={[
                              { value: 1, label: "Company" },
                              { value: 2, label: "Supplier" },
                            ]}
                            value={values?.logisticBy}
                            label='Logistic By'
                            onChange={(valueOption) => {
                              setFieldValue("logisticBy", valueOption);
                            }}
                            placeholder='Logistic By'
                            errors={errors}
                            touched={touched}
                            isClearable={false}
                          />
                        </div>
                      </>
                    )}

                    <div className='col-lg-12 p-0 m-0'>
                      <Paper square className={classes.root}>
                        <div>
                          <Tabs
                            value={shipmentType}
                            indicatorColor='primary'
                            textColor='primary'
                            onChange={(e, value) => {
                              handleChange(value, values);
                            }}
                            aria-label='disabled tabs example'
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

                        <div className='col-lg-2'>
                          <label>From Date</label>
                          <InputField
                            value={values?.fromDate}
                            name='fromDate'
                            placeholder='From Date'
                            type='date'
                            onChange={(e) => {
                              setGridData([]);
                              setFieldValue("fromDate", e.target.value);
                            }}
                          />
                        </div>

                        <div className='col-lg-2'>
                          <label>To Date</label>
                          <InputField
                            value={values?.toDate}
                            name='toDate'
                            placeholder='To Date'
                            type='date'
                            onChange={(e) => {
                              setFieldValue("toDate", e.target.value);
                              setGridData([]);
                            }}
                          />
                        </div>

                        <div className='col'>
                          <button
                            type='button'
                            style={{ marginTop: "17px" }}
                            disabled={
                              !values?.fromDate ||
                              !values?.toDate ||
                              !values?.shipPoint
                            }
                            onClick={() => {
                              setGridData([]);
                              commonGridApi(values);
                            }}
                            className='btn btn-primary'
                          >
                            Show
                          </button>
                          {values?.trackingType?.value === 1 && (
                            <>
                              {" "}
                              <button
                                disabled={
                                  !values?.logisticBy?.value ||
                                  !gridData?.some((i) => i.itemCheck)
                                }
                                type='button'
                                style={{ marginTop: "17px" }}
                                className='btn btn-primary'
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
                                      scheduleDate:
                                        itm?.deliveryScheduleDate || new Date(),
                                    }));

                                  console.log(payload);
                                  CreateTransportScheduleTypeApi(
                                    payload,
                                    setLoading,
                                    () => {
                                      setGridData([]);
                                      commonGridApi(values);
                                      setFieldValue("logisticBy", "");
                                    }
                                  );
                                }}
                              >
                                Save
                              </button>
                            </>
                          )}
                        </div>
                      </Paper>
                    </div>
                  </div>

                  {/* Table Start */}
                  {gridData?.length > 0 && (
                    <div ref={printRef}>
                      <div className='text-center my-2'>
                        <h3>
                          <b> {selectedBusinessUnit?.label} </b>
                        </h3>

                        <h4>Delivery Schedule Plan Report</h4>
                        <div className='d-flex justify-content-center'>
                          <h5>
                            For The Month:
                            {dateFormatWithMonthName(values?.fromDate)}
                          </h5>
                          <h5 className='ml-5'>
                            To: {dateFormatWithMonthName(values?.toDate)}
                          </h5>
                        </div>
                      </div>
                      <div className='text-right'>
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
                      <div className='loan-scrollable-tafble'>
                        <div className='scroll-table _tafble'>
                          <table className='table table-striped table-bordered global-table'>
                            <thead>
                              <tr>
                                {values?.trackingType?.value === 1 && (
                                  <th
                                    style={{ minWidth: "25px" }}
                                    className='printSectionNone'
                                  >
                                    <input
                                      type='checkbox'
                                      id='parent'
                                      onChange={(event) => {
                                        allGridCheck(event.target.checked);
                                      }}
                                    />
                                  </th>
                                )}
                                <th>SL</th>
                                <th>Delivery Code </th>
                                <th>Logistic By</th>
                                {shipmentTypeDDl?.[shipmentType]?.value ===
                                0 ? (
                                  <th>Shipment Type</th>
                                ) : null}
                                <th>Ship Point</th>
                                <th>Area</th>
                                <th>Territory</th>
                                <th>Sold To Party</th>
                                <th>Ship To Party</th>
                                <th>Address</th>
                                <th>Quantity</th>
                                <th>Create Date</th>
                                <th>Delivery Date</th>
                                <th>Lead Time</th>
                                <th>Spend Time</th>
                                <th>Rest of Time </th>
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
                                const nextDayDate = moment().add(1, "days").format("YYYY-MM-DD");
                                const nextDayDeliveryScheduleDate = moment(
                                  item?.deliveryScheduleDate
                                ).format("YYYY-MM-DD");
                                console.log(new Date(nextDayDate))
                                console.log(new Date(nextDayDeliveryScheduleDate))
                                const isNextDay =
                                  new Date(nextDayDate) <=
                                  new Date(nextDayDeliveryScheduleDate);

                                // yesterday deliveryScheduleDate check momentjs
                                const yesterdayDate = moment()
                                  .subtract(1, "days").format("YYYY-MM-DD");
                                const yesterdayDeliveryScheduleDate = moment(
                                  item?.deliveryScheduleDate
                                ).format("YYYY-MM-DD");

                                const isYesterday =
                                  new Date(yesterdayDate) >=
                                  new Date(yesterdayDeliveryScheduleDate);

                                return (
                                  <tr
                                    key={index}
                                    style={{
                                      background: isYesterday
                                        ? "#f64e60"
                                        : isToday
                                        ? "#32e732"
                                        : isNextDay
                                        ? "yellow"
                                        : "",
                                    }}
                                  >
                                    {values?.trackingType?.value === 1 && (
                                      <td className='printSectionNone'>
                                        <input
                                          id='itemCheck'
                                          type='checkbox'
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

                                    <td className='text-center'>
                                      {" "}
                                      {index + 1}
                                    </td>
                                    <td>{item?.deliveryCode}</td>
                                    <td>{item?.providerTypeName}</td>
                                    {shipmentTypeDDl?.[shipmentType]?.value ===
                                    0 ? (
                                      <td>{item?.shipmentType}</td>
                                    ) : null}
                                    <td>{item?.shipPointName}</td>
                                    <td>{item?.area}</td>
                                    <td>{item?.territory}</td>
                                    <td>{item?.soldToPartnerName}</td>
                                    <td>{item?.shipToPartnerName}</td>
                                    <td>{item?.shipToPartnerAddress}</td>
                                    <td className='text-center'>
                                      {item?.quantity}
                                    </td>
                                    <td>
                                      {item?.challanDateTime &&
                                        moment(item?.challanDateTime).format(
                                          "DD-MM-YYYY hh:mm: A"
                                        )}
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
                              <tr>
                                {values?.trackingType?.value === 1 && <td></td>}

                                <td
                                  className='text-right'
                                  colSpan={
                                    shipmentTypeDDl?.[shipmentType]?.value === 0
                                      ? 10
                                      : 9
                                  }
                                >
                                  <b>Total:</b>
                                </td>
                                <td className='text-center'>
                                  <b>
                                    {_fixedPoint(
                                      gridData?.reduce(
                                        (acc, curr) => acc + curr?.quantity,
                                        0
                                      )
                                    )}
                                  </b>
                                </td>
                                <td colSpan='6'></td>
                              </tr>
                            </tbody>
                          </table>
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
    </>
  );
}

export default DeliveryScheduleplanReport;
