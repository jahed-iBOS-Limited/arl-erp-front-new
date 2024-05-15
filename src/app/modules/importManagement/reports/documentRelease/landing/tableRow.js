/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import { GetBankDDLForDocReleaseReport, GetDocReleaseReport } from "../helper";
// import axios from "axios";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useEffect } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { useRef } from "react";
import { getReportHeaderInfo } from "../../costSummary/helper";
import { _firstDateofMonth } from "./../../../../_helper/_firstDateOfCurrentMonth";

const TableRow = () => {
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [bankDDL, setBankDDL] = useState([]);
  const [isPrintable, setIsPrintable] = useState(false);
  const [headerInfo, setHeaderInfo] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const initData = {
    fromDate: _firstDateofMonth(),
    toDate: _todayDate(),
    bank: "",
  };

  useEffect(() => {
    if (initData?.fromDate && initData?.toDate) {
      GetBankDDLForDocReleaseReport(
        setBankDDL,
        profileData?.accountId,
        selectedBusinessUnit?.value
      );
      getReportHeaderInfo(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setHeaderInfo
      );
      GetDocReleaseReport(
        selectedBusinessUnit?.value,
        "",
        initData?.fromDate,
        initData?.toDate,
        setRowDto,
        setLoader
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const getReport = (values) => {
    GetDocReleaseReport(
      selectedBusinessUnit?.value,
      values?.bank?.value,
      values?.fromDate,
      values?.toDate,
      setRowDto,
      setLoader
    );
  };

  const printRef = useRef();

  const header = [
    {
      name: "SL",
      style: {
        minWidth: "50px",
      },
    },
    {
      name: "Bank",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "	LC No",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Date",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "LC Type",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Doc R. Date by Bank",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Last S. Date",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Expire Date",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Supplier",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Item",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "PI Amount",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Currency",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Policy No",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Amount (BDT)",
      style: {
        minWidth: "100px",
      },
    },
    // {
    //   name: "CnF Name",
    //   style: {
    //     minWidth: "100px",
    //   },
    // },
    // {
    //   name: "Cnf F. Date",
    //   style: {
    //     minWidth: "100px",
    //   },
    // },
  ];

  return (
    <>
      {loader && <Loading />}
      <ICustomCard
        title="Document Details"
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
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({ values, errors, touched, setFieldValue, dirty, isValid }) => (
            <>
              <Form className="form form-label-right">
                <div className="row global-form">
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      max={values?.toDate}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      min={values?.fromDate}
                      // disabled={routeState === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="bank"
                      options={bankDDL || []}
                      value={values?.bank}
                      label="Bank"
                      onChange={(valueOption) => {
                        setFieldValue("bank", valueOption);
                      }}
                      placeholder="Bank"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 pt-5 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        getReport(values);
                      }}
                      className="btn btn-primary"
                      // disabled={!isValid || !dirty}
                    >
                      Show
                    </button>
                  </div>
                </div>
                {/* Table Start */}
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
                    <div className="react-bootstrap-table table-responsive">
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead style={{ position: "sticky", top: "0" }}>
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
                                <td>{data?.strBankShortName}</td>
                                <td>{data?.strLCNumber}</td>
                                <td className="text-center">
                                  {_dateFormatter(data?.dteLcDate)}
                                </td>
                                <td>{data?.strLcType}</td>
                                <td className="text-center">
                                  {_dateFormatter(data?.dteDocReceiveByBank)}
                                </td>
                                <td className="text-center">
                                  {_dateFormatter(data?.dteLastShipmentDate)}
                                </td>
                                <td className="text-center">
                                  {_dateFormatter(data?.dteLcExpireDate)}
                                </td>
                                <td>{data?.strBusinessPartnerName}</td>
                                <td>{data?.column2}</td>
                                <td className="text-right">
                                  {_formatMoney(data?.numTotalPIAmountFC, 4)}
                                </td>
                                <td>{data?.strCurrencyName}</td>
                                <td>{data?.strPolicyNumber}</td>
                                <td className="text-right">
                                  {_formatMoney(data?.numTotalBDT, 4)}
                                </td>
                                {/* <td>{data?.strCnFLCBusinessPartnerName || ""}</td>
                              <td>{data?.employeeId}</td> */}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* } */}
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default TableRow;
