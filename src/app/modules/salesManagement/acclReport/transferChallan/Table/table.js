/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import NewSelect from "../../../../_helper/_select";
import {
  GetTransferChallanDetails,
  GetTransferChallanShipPointToShipPoint,
} from "../helper";
import InputField from "../../../../_helper/_inputField";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  _todaysEndTime,
  _todaysStartTime,
} from "../../../../_helper/_currentTime";
import IViewModal from "../../../../_helper/_viewModal";
import TransferChallanDetails from "./details";
import Loading from "../../../../_helper/_loading";

export function TransferChallan(props) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const initData = {
    fromShipPoint: "",
    toShipPoint: "",
    fromDate: _todayDate(),
    fromTime: _todaysStartTime(),
    toDate: _todayDate(),
    toTime: _todaysEndTime(),
  };

  const [gridData, setGridData] = useState({});
  const [show, setShow] = useState(false);
  const [detailsInfo, setDetailsInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const shipPintDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);



  const GetTransferChallanReport = (values) => {
    GetTransferChallanShipPointToShipPoint(
      values?.fromShipPoint?.value,
      values?.toShipPoint?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.fromTime,
      values?.toDate,
      values?.toTime,
      setGridData,
      setLoading
    );
  };

  const makeInt = (str) => {
    if (+str) {
      return Number(str).toFixed(2);
    } else {
      return str;
    }
  };

  const getDetails = (value) => {
    GetTransferChallanDetails(
      value?.fromShipPoint,
      value?.toShipPoint,
      value?.accountId,
      value?.businessUnitId,
      value?.fromDate,
      value?.toDate,
      setDetailsInfo,
      setLoading
    );
  };

  const printRef = useRef();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          GetTransferChallanReport(values);
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <ICard
              printTitle="Print"
              isPrint={true}
              isShowPrintBtn={true}
              componentRef={printRef}
              isExcelBtn={true}
              excelFileNameWillbe="Transfer Challan"
              title="Transfer Challan"
            >
              <Form className="form form-label-right">
                <div className="form-group row global-form printSectionNone">
                  <div className="col-lg-3">
                    <NewSelect
                      name="fromShipPoint"
                      options={shipPintDDL || []}
                      value={values?.fromShipPoint}
                      label="From ShipPoint"
                      onChange={(valueOption) => {
                        setFieldValue("fromShipPoint", valueOption);
                      }}
                      placeholder="From ShipPoint"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="toShipPoint"
                      options={[{ value: 0, label: "All" }, ...shipPintDDL]}
                      value={values?.toShipPoint}
                      label="To ShipPoint"
                      onChange={(valueOption) => {
                        setFieldValue("toShipPoint", valueOption);
                      }}
                      placeholder="To ShipPoint"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>From Date and Time</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.fromDate}
                        type="date"
                        name="fromDate"
                        onChange={(e) => {
                          setFieldValue("fromDate", e?.target?.value);
                        }}
                      />
                      <InputField
                        value={values?.fromTime}
                        type="time"
                        name="fromTime"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <label>To Date and Time</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.toDate}
                        type="date"
                        name="toDate"
                        onChange={(e) => {
                          setFieldValue("toDate", e?.target?.value);
                        }}
                      />
                      <InputField
                        value={values?.toTime}
                        type="time"
                        name="toTime"
                      />
                    </div>
                  </div>

                  <div className="col text-right">
                    <button type="submit" className="btn btn-primary mt-5">
                      View
                    </button>
                  </div>
                </div>
              </Form>
              {loading && <Loading />}
              <div className="react-bootstrap-table table-responsive pendingDeliveryReport">
                <div className="product-wise-shipment-report">
                  <div className="loan-scrollable-table scroll-table-auto">
                    <div
                      style={{ maxHeight: "540px" }}
                      className="scroll-table _table scroll-table-auto"
                    >
                      <table
                        ref={printRef}
                        id="table-to-xlsx"
                        className="table table-striped table-bordered global-table table-font-size-sm"
                      >
                        <thead>
                          <tr>
                            {gridData?.head?.length && (
                              <th style={{ minWidth: "30px" }}>SL</th>
                            )}
                            {gridData?.head?.map((item, index) => (
                              <React.Fragment key={index}>
                                {index < 4 ? (
                                  <th style={{ minWidth: "100px" }}>{item}</th>
                                ) : (
                                  <th>{item}</th>
                                )}
                              </React.Fragment>
                            ))}
                            {gridData?.head?.length && (
                              <th
                                style={{
                                  minWidth: "60px",
                                  maxWidth: "80px !important",
                                }}
                              >
                                Action
                              </th>
                            )}
                          </tr>
                        </thead>

                        <tbody>
                          {gridData?.reports?.map((itm, i) => {
                            return (
                              <tr
                                style={
                                  !itm?.toShipPoint
                                    ? {
                                        fontWeight: "bold",
                                      }
                                    : { fontWeight: "normal" }
                                }
                                key={i}
                              >
                                <td className="text-center">
                                  {" "}
                                  {`${itm?.toShipPoint ? i + 1 : ""}`}
                                </td>
                                {itm?.row?.map((singleRow, index) => {
                                  return (
                                    <td
                                      className={`${
                                        index < 1 ? "text-left" : "text-right"
                                      }`}
                                      key={index}
                                    >
                                      {makeInt(singleRow)}
                                    </td>
                                  );
                                })}
                                <td className="text-center">
                                  {itm?.toShipPoint ? (
                                    <button
                                      onClick={() => {
                                        getDetails(itm);
                                        setShow(true);
                                      }}
                                      className="btn btn-sm btn-primary pt-1 pb-1 pl-4 pr-4"
                                    >
                                      Details
                                    </button>
                                  ) : (
                                    ""
                                  )}
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
            </ICard>
          </>
        )}
      </Formik>
      <IViewModal
        show={show}
        onHide={() => {
          setShow(false);
          setDetailsInfo([]);
        }}
      >
        <TransferChallanDetails rowDto={detailsInfo} />
      </IViewModal>
    </>
  );
}
