import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import {
  _dateFormatter,
  _dateTimeFormatter,
} from "../../../_helper/_dateFormate";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import "./style.css";

const initData = {
  fromDateTime: "",
  toDateTime: "",
  type: "",
  businessUnit: "",
  shipPoint: "",
};

function WeightmentReport() {
  const [rowData, getRowData, lodar] = useAxiosGet();

  const [loading, setLoading] = useState(false);
  const [shipPoint, getShipPoint, shipPointLoader] = useAxiosGet();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const businessUnitDDL = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    setLoading(true);
    if (selectedBusinessUnit) {
      initData.businessUnit = selectedBusinessUnit;
    }
    getShipPoint(
      `/mes/MSIL/GetAllMSIL?PartName=GetShipPointForVehicleEntry&BusinessUnitId=${initData?.businessUnit?.value}&AutoId=${profileData?.userId}`,
      (data) => {
        initData.shipPoint = data[0];
        setLoading(false);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalGross = rowData?.reduce(
    (total, value) => total + value?.firstWeight || 0,
    0
  );
  const totalTare = rowData?.reduce(
    (total, value) => total + value?.secondWeight || 0,
    0
  );
  const totalRealNet = rowData?.reduce(
    (total, value) => total + value?.netWeight || 0,
    0
  );
  const totalQuantity = rowData?.reduce(
    (total, value) => total + value?.quantity || 0,
    0
  );
  const printRef = useRef();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, isValid, errors, touched }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Weightment Report"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {(lodar || shipPointLoader || loading) && <Loading />}
                <div className="form-group global-form">
                  <div className="row">
                    <div className="col-lg-2">
                      <NewSelect
                        name="businessUnit"
                        options={businessUnitDDL}
                        value={values?.businessUnit}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("businessUnit", valueOption);
                            getShipPoint(
                              `/mes/MSIL/GetAllMSIL?PartName=GetShipPointForVehicleEntry&BusinessUnitId=${valueOption?.value}&AutoId=${profileData?.userId}`,
                              (data) => {
                                if (data === [])
                                  return toast.warn("No Ship Point Found");
                                setFieldValue("shipPoint", data[0]);
                              }
                            );
                          } else {
                            setFieldValue("businessUnit", "");
                            setFieldValue("shipPoint", "");
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="shipPoint"
                        options={shipPoint}
                        value={values?.shipPoint}
                        label="Ship Point"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("shipPoint", valueOption);
                          } else {
                            setFieldValue("shipPoint", "");
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.fromDateTime}
                        label="From Date & Time"
                        name="fromDateTime"
                        type="datetime-local"
                        onChange={(e) => {
                          setFieldValue("fromDateTime", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.toDateTime}
                        label="To Date & Time"
                        name="toDateTime"
                        type="datetime-local"
                        onChange={(e) => {
                          setFieldValue("toDateTime", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        value={values?.type}
                        label="Type"
                        name="type"
                        options={[
                          { value: 0, label: "All" },
                          { value: 1, label: "Bulk" },
                          { value: 2, label: "Others" },
                        ]}
                        onChange={(valueOption) => {
                          setFieldValue("type", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div>
                      <button
                        style={{ marginTop: "18px" }}
                        className="btn btn-primary"
                        disabled={
                          !values?.fromDateTime ||
                          !values?.toDateTime ||
                          !values?.type
                        }
                        onClick={() => {
                          getRowData(
                            `/mes/MSIL/GetAllMSIL?PartName=WeightDetailsReport&FromDate=${values?.fromDateTime}&ToDate=${values?.toDateTime}&BusinessUnitId=${values?.businessUnit?.value}&typeId=${values?.type?.value}&AutoId=${values?.shipPoint?.value}`
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                    <div className="mt-4 ml-4">
                      <ReactToPrint
                        pageStyle={
                          "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important} td,th{font-size: 16px!important}}"
                        }
                        trigger={() => (
                          <button
                            type="button"
                            disabled={rowData?.length < 1}
                            className="btn btn-primary px-3 py-2"
                          >
                            <i
                              className="mr-1 fa fa-print pointer"
                              aria-hidden="true"
                            ></i>
                            Print
                          </button>
                        )}
                        content={() => printRef.current}
                      />
                    </div>
                  </div>
                </div>
                <div ref={printRef} className="row weightment-report">
                  <div className="col-lg-12 weightment-report-header">
                    <div className="titleContent text-center">
                      <h1 className="mt-3 font-weight-bold">
                        {selectedBusinessUnit?.label}
                      </h1>
                      <h2 className="font-weight-bold">Weight Details</h2>
                      <div className="d-flex justify-content-around">
                        <h4>
                          From Date & Time :{" "}
                          {`${_dateFormatter(
                            values?.fromDateTime.split("T")[0]
                          )} - ${_timeFormatter(
                            values?.fromDateTime.split("T")[1] || ""
                          )}`}
                        </h4>
                        <h4>
                          To Date & Time :{" "}
                          {`${_dateFormatter(
                            values?.toDateTime.split("T")[0]
                          )} - ${_timeFormatter(
                            values?.toDateTime.split("T")[1] || ""
                          )}`}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>Reg. No</th>
                            <th>Vehcile</th>
                            <th style={{ width: "200px" }}>Challan No</th>
                            <th>Material</th>
                            <th>Gross</th>
                            <th>Tare</th>
                            <th>Real Net</th>
                            <th>Quantity</th>
                            <th>Date Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.length > 0 &&
                            rowData?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {item?.entryCode}
                                </td>
                                <td>{item?.vehicleNumber}</td>
                                <td className="text-center">
                                  {item?.challanNo}
                                </td>
                                <td className="text-left">
                                  {item?.materialDescription}
                                </td>
                                <td className="text-center">
                                  {item?.firstWeight}
                                </td>
                                <td className="text-center">
                                  {item?.secondWeight}
                                </td>
                                <td className="text-center">
                                  {" "}
                                  {item?.netWeight}
                                </td>
                                <td className="text-center">
                                  {item?.quantity}
                                </td>
                                <td className="text-center">
                                  {_dateTimeFormatter(item?.secondWeightDate)}
                                </td>
                              </tr>
                            ))}
                          <tr>
                            <td colSpan={5} className="text-right">
                              Total
                            </td>
                            <td className="text-center">{totalGross}</td>
                            <td className="text-center">{totalTare}</td>
                            <td className="text-center">{totalRealNet}</td>
                            <td className="text-center">
                              {totalQuantity.toFixed(2)}
                            </td>
                            <td>{""}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default WeightmentReport;
