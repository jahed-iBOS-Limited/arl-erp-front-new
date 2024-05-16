import { Paper, Tab, Tabs, makeStyles } from "@material-ui/core";
import Axios from "axios";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
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
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { dateFormatWithMonthName } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import printIcon from "../../../../_helper/images/print-icon.png";
import {
  GetShipmentTypeApi,
  commonfilterGridData,
  getAssignedDeliveryVehicleProvider,
  saveAssignDeliveryVehicleSupplier,
} from "../helper";
import LogisticByUpdateModal from "./logisticByUpdateModal";
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

function DeliveryScheduleAssignReport() {
  const classes = useStyles();
  const [shipmentType, setShipmentType] = React.useState(0);
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [gridDataWithOutFilter, setGridDataWithOutFilter] = useState([]);
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
  const handleChange = (newValue, values) => {
    setShipmentType(newValue);
    getAssignedDeliveryVehicleProvider(
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
    getAssignedDeliveryVehicleProvider(
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

  const saveHandler = (values, setFieldValue) => {
    const selectedItem = gridData?.filter((i) => i?.itemCheck);

    const emptyItem = selectedItem?.find(
      (i) => !i?.vehicleId && !i?.supplierId
    );

    if (emptyItem) {
      toast.warn(
        `Please select ${
          values?.logisticByFilter?.value === 1 ? "Vehicle" : "Suppler"
        } for ${emptyItem?.deliveryCode}`
      );
      return;
    }

    const payload = selectedItem.map((itm) => ({
      businessUnitId: selectedBusinessUnit?.value,
      deliveryId: itm?.intDeliveryId || itm?.deliveryId || 0,
      supplierId: itm?.supplierId || 0,
      supplierName: itm?.supplierName || "",
      territoryId: itm?.territoryId || 0,
      vehicleId: itm?.vehicleId || 0,
      vehicleName: itm?.vehicleName || "",
      actionBy: profileData?.userId,

      deliverySummeryId: 0,
      deliveryCode: "string",
      salesOrderNumber: "string",
      qnt: 0,
      customerName: "string",
      delvAddress: 0,
      delvDate: _todayDate(),
      process: false,
    }));

    saveAssignDeliveryVehicleSupplier(payload, setLoading, () => {
      setGridData([]);
      commonGridApi(values);
      setFieldValue("logisticBy", "");
      setFieldValue("isMoreFiter", false);
      setFieldValue("channel", "");
      setFieldValue("region", "");
      setFieldValue("area", "");
      setFieldValue("territory", "");
    });
  };

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
              <CardHeader title={"Logistic By Update"}>
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
                    <div className='row global-form p-0 m-0 pb-1'>
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
                            { value: 1, label: "Assign Pending" },
                            { value: 2, label: "Assign Complete" },
                          ]}
                          value={values?.trackingType}
                          label='Tracking Type'
                          onChange={(valueOption) => {
                            setGridData([]);
                            setFieldValue("trackingType", valueOption);
                            setFieldValue("logisticBy", "");
                            setFieldValue("isMoreFiter", false);
                            setFieldValue("channel", "");
                            setFieldValue("region", "");
                            setFieldValue("area", "");
                            setFieldValue("territory", "");
                            setFieldValue("logisticByFilter", "");
                            if (valueOption?.value === 1) {
                              setFieldValue("logisticByFilter", {
                                value: 0,
                                label: "All",
                              });
                            } else {
                              setFieldValue("logisticByFilter", {
                                value: 1,
                                label: "Company",
                              });
                            }
                          }}
                          placeholder='Tracking Type'
                          errors={errors}
                          touched={touched}
                          isClearable={false}
                        />
                      </div>

                      <div className='col-lg-3'>
                        <NewSelect
                          name='logisticByFilter'
                          options={[
                            ...(values?.trackingType?.value === 1
                              ? [{ value: 0, label: "All" }]
                              : []),
                            { value: 1, label: "Company" },
                            { value: 2, label: "Supplier" },
                          ]}
                          value={values?.logisticByFilter}
                          label='Logistic By'
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
                          placeholder='Logistic By'
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <>
                        <div className='col-lg-3'>
                          <div className='d-flex justify-content-between'>
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
                                setFieldValue("isMoreFiter", false);
                                setFieldValue("channel", "");
                                setFieldValue("region", "");
                                setFieldValue("area", "");
                                setFieldValue("territory", "");
                              }}
                              className='btn btn-primary'
                            >
                              Show
                            </button>
                            {values?.trackingType?.value === 1 && (
                              <>
                                <button
                                  disabled={!gridData?.some((i) => i.itemCheck)}
                                  type='button'
                                  style={{ marginTop: "17px" }}
                                  className='btn btn-primary ml-2'
                                  onClick={() => {
                                    saveHandler(values, setFieldValue);
                                  }}
                                >
                                  Save
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </>

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

                         {
                          windowSize?.width > 600 &&<RestElements 
                          values={values}
                          setFieldValue={setFieldValue}
                          setGridData={setGridData}
                          filterGridDataFunc={filterGridDataFunc}
                          gridDataWithOutFilter={gridDataWithOutFilter}
                          isMobileResponsive={false}
                          />
                         }
                        </Paper>
                        {
                          windowSize?.width < 600 &&<RestElements 
                          values={values}
                          setFieldValue={setFieldValue}
                          setGridData={setGridData}
                          filterGridDataFunc={filterGridDataFunc}
                          gridDataWithOutFilter={gridDataWithOutFilter}
                          isMobileResponsive={false}
                          />
                         }
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
                    <Table
                      printRef={printRef}
                      gridData={gridData}
                      setGridData={setGridData}
                      values={values}
                      selectedBusinessUnit={selectedBusinessUnit}
                      shipmentTypeDDl={shipmentTypeDDl}
                      shipmentType={shipmentType}
                      allGridCheck={allGridCheck}
                      itemSlectedHandler={itemSlectedHandler}
                      commonGridApi={commonGridApi}
                    />
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

export default DeliveryScheduleAssignReport;

function Table({
  gridData,
  setGridData,
  values,
  selectedBusinessUnit,
  shipmentTypeDDl,
  shipmentType,
  allGridCheck,
  itemSlectedHandler,
  printRef,
  commonGridApi,
}) {
  const [clickRowData, setClickRowData] = useState({});
  const [isLogisticByUpdateModal, setIsLogisticByUpdateModal] = useState(false);

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

  return (
    <>
      {gridData?.length > 0 && (
        <div ref={printRef} className='deliveryScheduleplanPrintSection'>
          <div className='text-center my-2 headerInfo'>
            <h3>
              <b> {selectedBusinessUnit?.label} </b>
            </h3>

            <h4>Delivery Schedule Assign Report</h4>
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
                gridData?.reduce((acc, curr) => acc + curr?.quantity, 0)
              )}
            </b>
          </div>
          <div className='loan-scrollable-tafble'>
            <div className='scroll-table _tafble'>
              <div className='table-responsive'>
                <table className='table table-striped table-bordered global-table'>
                  <thead>
                    <tr>
                      {values?.trackingType?.value === 1 &&
                        values?.logisticByFilter?.value !== 0 && (
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
                      <th>Sales Order</th>
                      <th>Delivery Code </th>
                      <th>Logistic By</th>
                      {shipmentTypeDDl?.[shipmentType]?.value === 0 ? (
                        <th>Shipment Type</th>
                      ) : null}
                      <th>Ship Point</th>
                      <th>Region</th>
                      <th>Area</th>
                      <th>Territory</th>
                      <th>Sold To Party</th>
                      <th>Ship To Party</th>
                      <th>Address</th>
                      {values?.logisticByFilter?.value === 1 ? (
                        <th
                          style={
                            values?.trackingType?.value === 1
                              ? { minWidth: "130px" }
                              : {}
                          }
                        >
                          Vehicle
                        </th>
                      ) : values?.logisticByFilter?.value === 2 ? (
                        <th
                          style={
                            values?.trackingType?.value === 1
                              ? { minWidth: "130px" }
                              : {}
                          }
                        >
                          {" "}
                          Supplier
                        </th>
                      ) : null}
                      <th style={{ minWidth: "100px" }}>Item Name</th>
                      <th>Quantity</th>
                      <th>Total Qty</th>
                      <th style={{ minWidth: "65px" }}>Create Date</th>
                      <th style={{ minWidth: "65px" }}>Delivery Date</th>
                      <th>Lead Time</th>
                      <th style={{ minWidth: "70px" }}>Spend Time</th>
                      <th style={{ minWidth: "70px" }}>Rest of Time </th>
                      <th>Shipment Status</th>
                      {values?.trackingType?.value === 2 && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.map((item, index) => {
                      // deliveryScheduleDate today date check momentjs
                      const todayDate = moment(new Date()).format("DD-MM-YYYY");
                      const deliveryScheduleDate = moment(
                        item?.deliveryScheduleDate
                      ).format("DD-MM-YYYY");
                      const isToday = todayDate === deliveryScheduleDate;

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
                      if (forwardSalesOrderCode === item?.salesOrderCode) {
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
                          {values?.trackingType?.value === 1 &&
                            values?.logisticByFilter?.value !== 0 && (
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

                          <td className='text-center'> {index + 1}</td>

                          {prvSalesOrderCode !== item?.salesOrderCode && (
                            <td
                              rowSpan={rowSpan}
                              style={rowSpan > 1 ? { fontWeight: "bold" } : {}}
                            >
                              {item?.salesOrderCode}
                            </td>
                          )}
                          <td>{item?.deliveryCode}</td>

                          <td>{item?.providerTypeName}</td>
                          {shipmentTypeDDl?.[shipmentType]?.value === 0 ? (
                            <td>{item?.shipmentType}</td>
                          ) : null}
                          <td>{item?.shipPointName}</td>
                          <td>{item?.region}</td>
                          <td>{item?.area}</td>
                          <td>{item?.territory}</td>
                          <td>{item?.soldToPartnerName}</td>
                          <td>{item?.shipToPartnerName}</td>
                          <td>{item?.shipToPartnerAddress}</td>

                          {values?.logisticByFilter?.value === 1 ? (
                            <td>
                              {values?.trackingType?.value === 1 ? (
                                <SearchAsyncSelect
                                  selectedValue={
                                    item?.vehicleId
                                      ? {
                                          value: item?.vehicleId,
                                          label: item?.vehicleName,
                                        }
                                      : ""
                                  }
                                  handleChange={(valueOption) => {
                                    const copyGridData = [...gridData];
                                    copyGridData[index].vehicleId =
                                      valueOption?.value;
                                    copyGridData[index].vehicleName =
                                      valueOption?.label;
                                    setGridData(copyGridData);
                                  }}
                                  loadOptions={(v) => {
                                    if (v?.length < 2) return [];
                                    return Axios.get(
                                      `/wms/Delivery/GetVehicleByShippointDDL?businessUnitId=${selectedBusinessUnit?.value}&shippointId=${values?.shipPoint?.value}&searchTerm=${v}`
                                    ).then((res) => {
                                      return res?.data || [];
                                    });
                                  }}
                                  placeholder='Select Vehicle'
                                />
                              ) : (
                                item?.vehicleName
                              )}
                            </td>
                          ) : values?.logisticByFilter?.value === 2 ? (
                            <td>
                              {values?.trackingType?.value === 1 ? (
                                <SearchAsyncSelect
                                  selectedValue={
                                    item?.supplierId
                                      ? {
                                          value: item?.supplierId,
                                          label: item?.supplierName,
                                        }
                                      : ""
                                  }
                                  handleChange={(valueOption) => {
                                    const copyGridData = [...gridData];
                                    copyGridData[index].supplierId =
                                      valueOption?.value;
                                    copyGridData[index].supplierName =
                                      valueOption?.label;
                                    setGridData(copyGridData);
                                  }}
                                  loadOptions={(v) => {
                                    if (v?.length < 2) return [];
                                    return Axios.get(
                                      `/wms/Delivery/GetSupplierByShipPointDDl?businessUnitId=${selectedBusinessUnit?.value}&shippointId=${values?.shipPoint?.value}&searchTerm=${v}`
                                    ).then((res) => {
                                      return res?.data || [];
                                    });
                                  }}
                                  placeholder='Select Supplier'
                                />
                              ) : (
                                item?.supplierName
                              )}
                            </td>
                          ) : null}

                          <td className='text-center'>{item?.itemName}</td>
                          <td className='text-center'>{item?.quantity}</td>

                          {prvSalesOrderCode !== item?.salesOrderCode && (
                            <td className='text-center' rowSpan={rowSpan}>
                              {totalQty}
                            </td>
                          )}

                          <td>
                            {item?.challanDateTime &&
                              moment(item?.challanDateTime).format(
                                "DD-MM-YYYY hh:mm: A"
                              )}
                          </td>
                          <td>
                            {item?.deliveryScheduleDate &&
                              moment(item?.deliveryScheduleDate).format(
                                "DD-MM-YYYY hh:mm: A"
                              )}
                          </td>
                          <td>{item?.leadTimeHr}</td>
                          <td>{item?.spendTimeHr}</td>
                          <td>{item?.pendingTimeHr}</td>
                          <td>{item?.shipmentStatus || ""}</td>

                          {values?.trackingType?.value === 2 && (
                            <td>
                              {!item?.shipmentStatus && (
                                <button
                                  type='button'
                                  style={{
                                    padding: "1px 6px",
                                    margin: "0",
                                  }}
                                  className='btn btn-primary'
                                  onClick={() => {
                                    setIsLogisticByUpdateModal(true);
                                    setClickRowData({
                                      ...item,
                                      ...values,
                                    });
                                  }}
                                >
                                  Update
                                </button>
                              )}
                            </td>
                          )}
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

      {isLogisticByUpdateModal && (
        <IViewModal
          show={isLogisticByUpdateModal}
          onHide={() => {
            setIsLogisticByUpdateModal(false);
            setClickRowData({});
          }}
        >
          <LogisticByUpdateModal
            clickRowData={clickRowData}
            landingCB={() => {
              setIsLogisticByUpdateModal(false);
              setClickRowData({});
              commonGridApi(values);
            }}
          />
        </IViewModal>
      )}
    </>
  );
}


const RestElements = ({
  values,
  setFieldValue,
  setGridData,
  filterGridDataFunc,
  gridDataWithOutFilter,
  isMobileResponsive
}) => {
  return (
    <>
      <div className={`col-lg-2 ${isMobileResponsive && "col-sm-12"}`}>
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

      <div className={`col-lg-2 ${isMobileResponsive && "col-sm-12"}`}>
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

      <div className={`col ${isMobileResponsive && "col-sm-12"} d-flex align-items-center`}>
        <div className='d-flex justify-content-center align-items-center'>
          <label className='mr-1' htmlFor='isMoreFiter'>
            More Filter
          </label>
          <input
            id='isMoreFiter'
            value={values?.isMoreFiter}
            name='isMoreFiter'
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
            type='checkbox'
            className='mt-1'
          />
        </div>
      </div>
    </>
  );
};
