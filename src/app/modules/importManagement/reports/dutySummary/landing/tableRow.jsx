/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import { GetCustomsNameDDL, getDutySummaryReport } from "../helper";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { useRef } from "react";
import { useEffect } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { getReportHeaderInfo } from "../../costSummary/helper";
import { _firstDateofMonth } from "./../../../../_helper/_firstDateOfCurrentMonth";

const TableRow = () => {
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [customsDDL, setCustomsDDL] = useState([]);
  const [headerInfo, setHeaderInfo] = useState([]);
  const [isPrintable, setIsPrintable] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const header = [
    {
      name: "SL",
      style: {
        minWidth: "50px",
      },
    },
    {
      name: "LC No",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Shipment No",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "BoE No",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "BoE Date",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Custom Duty",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "RD",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "SD",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "VAT",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "AIT",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Others",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Total",
      style: {
        minWidth: "100px",
      },
    },
  ];

  const initData = {
    fromDate: _firstDateofMonth(),
    toDate: _todayDate(),
    customs: "",
  };

  useEffect(() => {
    GetCustomsNameDDL(
      setCustomsDDL,
      profileData?.accountId,
      selectedBusinessUnit?.value
    );
    getReportHeaderInfo(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setHeaderInfo
    );
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getDutySummaryReport(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        "",
        "",
        "",
        setRowDto,
        setLoader
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const getDutySummaryReportBySearch = (customsId, fromDate, toDate) => {
    getDutySummaryReport(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      customsId,
      fromDate,
      toDate,
      setRowDto,
      setLoader
    );
  };

  // useEffect(() => {
  //   getDutySummaryReportBySearch();
  // }, []);

  const printRef = useRef();

  return (
    <>
      {loader && <Loading />}
      <ICustomCard
        title="Duty Summary"
        renderProps={() => (
          <div
            onClick={() => {
              setIsPrintable(true);
            }}
          >
            <ReactToPrint
              trigger={() => (
                <button className="btn btn-primary">
                  <img
                    style={{ width: "25px", paddingRight: "5px" }}
                    src={printIcon}
                    alt="print-icon"
                  />
                  Print
                </button>
              )}
              content={() => printRef.current}
              onAfterPrint={() => {
                setIsPrintable(false);
              }}
            />
          </div>
        )}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({ values, errors, touched, setFieldValue, dirty, isValid }) => (
            <>
              <Form className="form form-label-right">
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="customs"
                      options={customsDDL || []}
                      value={values?.customs}
                      onChange={(valueOption) => {
                        setFieldValue("customs", valueOption);
                        // getDutySummaryReportBySearch(
                        //   valueOption?.value,
                        //   values?.fromDate,
                        //   values?.toDate
                        // );
                      }}
                      placeholder="Customs"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>From</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From"
                      type="date"
                      max={values?.toDate}
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                        if (values?.customs) {
                          // getDutySummaryReportBySearch(
                          //   values?.customs?.value,
                          //   e.target.value,
                          //   values?.toDate
                          // );
                        }
                      }}
                      // disabled={routeState === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      min={values?.fromDate}
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                        if (values?.customs) {
                          // getDutySummaryReportBySearch(
                          //   values?.customs?.value,
                          //   values?.fromDate,
                          //   e.target.value
                          // );
                        }
                      }}
                      // disabled={routeState === "view"}
                    />
                  </div>
                  <div className="col-lg-2" style={{ marginTop: "18px" }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        getDutySummaryReportBySearch(
                          values?.customs?.value,
                          values?.fromDate,
                          values?.toDate
                        );
                      }}
                      disabled={!values?.fromDate && !values?.toDate}
                    >
                      Show
                    </button>
                  </div>
                </div>
                {/* Table Start */}
                {rowDto?.length > 0 && (
                  <div
                    style={{ maxHeight: "500px" }}
                    className="scroll-table-auto"
                  >
                    <div ref={printRef}>
                      {isPrintable && (
                        <div className="text-center d-none-print">
                          <h2> {headerInfo?.businessUnitName} </h2>
                          <h6> {headerInfo?.businessUnitCode} </h6>
                          <h6> {headerInfo?.businessUnitAddress} </h6>
                        </div>
                      )}
                      <div
                        className="scroll-table _table"
                        style={{ maxHeight: "500px" }}
                      >
                        <table className="table table-striped table-bordered bj-table bj-table-landing">
                          <thead>
                            <tr>
                              {header?.length > 0 &&
                                header?.map((item, index) => (
                                  <th key={index} style={item?.style}>
                                    {item?.name}
                                  </th>
                                ))}
                            </tr>
                          </thead>

                          <tbody>
                            {rowDto.length >= 0 &&
                              rowDto.map((data, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{data?.lcNumber}</td>
                                  <td>{data?.shipmentCode}</td>
                                  <td>{data?.boEnumber}</td>
                                  <td className="text-center">{_dateFormatter(data?.boEdate)}</td>
                                  <td className="text-right">
                                    {_formatMoney(data?.customDuty , 4)}
                                  </td>
                                  <td className="text-right">{_formatMoney(data?.rd , 4)}</td>
                                  <td className="text-right">{_formatMoney(data?.sd , 4)}</td>
                                  <td className="text-right">{_formatMoney(data?.vat , 4)}</td>
                                  <td className="text-right">{_formatMoney(data?.ait , 4)}</td>
                                  <td className="text-right">
                                    {data?.otherCharge}
                                  </td>
                                  <td className="text-right">
                                    {_formatMoney(data?.grandTotal , 4)}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )
                // </div>
                }
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default TableRow;
