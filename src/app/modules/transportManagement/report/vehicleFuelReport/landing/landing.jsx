/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
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
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import printIcon from "../../../../_helper/images/print-icon.png";
import {
  getVehicleDDL,
  getVehicleFuelReportData,
} from "../helper";

const initData = {
  ownerType: "",
  vehicle: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function VehicleFuelReport() {
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [vehicleDDL, setVehicleDDL] = useState([]);
  // Get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  const printRef = useRef();
  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, touched, errors }) => (
          <Card>
            {true && <ModalProgressBar />}
            <CardHeader title={"Vehicle Fuel Report"}>
              <CardHeaderToolbar>
                {gridData?.length > 0 && (
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
                )}
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <>
                <Form>
                  <div className="row global-form">
                    <div className="col-lg-12 row m-0 p-0">
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipPoint"
                          options={[
                            { value: 0, label: "All" },
                            ...shipPointDDL,
                          ]}
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
                      <div className="col-lg-3 pb-2">
                        <NewSelect
                          name="ownerType"
                          options={[
                            { value: 1, label: "Company" },
                            { value: 3, label: "Customer" },
                          ]}
                          value={values?.ownerType}
                          onChange={(valueOption) => {
                            setFieldValue("ownerType", valueOption);
                            setFieldValue("vehicle", "");
                            getVehicleDDL(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              valueOption?.value,
                              setVehicleDDL
                            );
                          }}
                          errors={errors}
                          touched={touched}
                          label="Type"
                        />
                      </div>
                      <div className="col-lg-3 pb-2">
                        <NewSelect
                          name="vehicle"
                          options={vehicleDDL}
                          value={values?.vehicle}
                          onChange={(valueOption) => {
                            setGridData([]);
                            setFieldValue("vehicle", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                          label="Vehicle No"
                          placeholder="Vehicle No"
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>From Date</label>
                        <InputField
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="From Date"
                          type="date"
                        />
                      </div>

                      <div className="col-lg-3">
                        <label>To Date</label>
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="To Date"
                          type="date"
                        />
                      </div>

                      <div className="col text-right">
                        <button
                          type="button"
                          disabled={
                            !values?.vehicle ||
                            !values?.ownerType ||
                            !values?.shipPoint
                          }
                          onClick={() => {
                            getVehicleFuelReportData(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              values?.fromDate,
                              values?.toDate,
                              values?.vehicle?.value,
                              values?.shipPoint?.value,
                              setGridData,
                              setLoading
                            );
                          }}
                          className="btn btn-primary mt-5"
                        >
                          Show
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="table-responsive">
                  <table
                    ref={printRef}
                    className="table table-striped table-bordered global-table"
                  >
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Date</th>
                        <th>Fuel Memo No.</th>
                        <th>Deisel</th>
                        <th>CNG</th>
                        <th>Octen</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center"> {index + 1}</td>
                          <td>
                            <div className="text-center">
                              {_dateFormatter(item?.fuelDate)}
                            </div>
                          </td>
                          <td>
                            <div className="text-center pr-2">
                              {item?.fuelMemoNo}
                            </div>
                          </td>
                          <td>
                            <div className="text-right pr-2">
                              {item?.diesel}
                            </div>
                          </td>
                          <td>
                            <div className="text-right pr-2">{item?.cng}</div>
                          </td>
                          <td>
                            <div className="text-right pr-2">{item?.octen}</div>
                          </td>
                          <td>
                            <div className="text-right pr-2">
                              {+item?.diesel + +item?.cng + +item?.octen}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </Form>
              </>
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
}

export default VehicleFuelReport;
