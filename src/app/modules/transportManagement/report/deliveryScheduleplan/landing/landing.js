import { Paper, Tab, Tabs, makeStyles } from "@material-ui/core";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
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
import printIcon from "../../../../_helper/images/print-icon.png";
import { GetShipmentTypeApi, getDeliverySchedulePlan } from "../helper";
import NewSelect from "./../../../../_helper/_select";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  shipPoint: { value: 0, label: "All" },
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
                      />
                    </div>
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
                              getDeliverySchedulePlan(
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                values?.fromDate,
                                values?.toDate,
                                shipmentTypeDDl?.[shipmentType]?.value || 0,
                                values?.shipPoint?.value,
                                setGridData,
                                setLoading
                              );
                            }}
                            className='btn btn-primary'
                          >
                            Show
                          </button>
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
                      <div className='loan-scrollable-tafble'>
                        <div className='scroll-table _tafble'>
                          <table className='table table-striped table-bordered global-table'>
                            <thead>
                              <tr>
                                <th>SL</th>
                                <th>Delivery Code </th>
                                <th>Ship Point</th>
                                <th>Area</th>
                                <th>Territory</th>
                                <th>Sold To Party</th>
                                <th>Ship To Party</th>
                                <th>Address</th>
                                <th>Quantity</th>
                                {/* <th>Chalan Date</th> */}
                                <th>Delivery Date</th>
                                <th>Lead Time</th>
                                <th>Spend Time</th>
                                <th>Rest of Time </th>
                              </tr>
                            </thead>
                            <tbody>
                              {gridData?.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td className='text-center'>
                                      {" "}
                                      {index + 1}
                                    </td>
                                    <td>{item?.deliveryCode}</td>
                                    <td>{item?.shipPointName}</td>
                                    <td>{item?.area}</td>
                                    <td>{item?.territory}</td>
                                    <td>{item?.soldToPartnerName}</td>
                                    <td>{item?.shipToPartnerName}</td>
                                    <td>{item?.shipToPartnerAddress}</td>
                                    <td className='text-center'>
                                      {item?.quantity}
                                    </td>
                                    {/* <td>
                                      {item?.challanDateTime &&
                                        moment(item?.challanDateTime).format(
                                          "DD-MM-YYYY hh:mm: A"
                                        )}
                                    </td> */}
                                    <td>
                                      {item?.deliveryScheduleDate &&
                                        moment(item?.deliveryScheduleDate).format(
                                          "DD-MM-YYYY hh:mm: A"
                                        )}
                                    </td>
                                    <td>{item?.leadTimeHr}</td>
                                    <td>{item?.spendTimeHr}</td>
                                    <td>{item?.pendingTimeHr}</td>
                                  </tr>
                                );
                              })}
                              <tr>
                                <td className='text-right' colSpan='8'>
                                  <b>Total:</b>
                                </td>
                                <td className='text-center'>
                                  <b>
                                    {gridData?.reduce(
                                      (acc, curr) => acc + curr?.quantity,
                                      0
                                    )}
                                  </b>
                                </td>
                                <td colSpan='4'></td>
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
