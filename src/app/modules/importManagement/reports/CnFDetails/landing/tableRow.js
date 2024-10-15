import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import ICustomCard from "../../../../_helper/_customCard";
import { _todayDate } from "../../../../_helper/_todayDate";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { useEffect } from "react";
import {
  getCnfDDLForCnFReport,
  getCnFDetailsReport,
  GetCustomsNameDDLForCnfReport,
} from "../helper";
import NewSelect from "../../../../_helper/_select";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { useRef } from "react";
import { getReportHeaderInfo } from "../../costSummary/helper";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { _firstDateofMonth } from "./../../../../_helper/_firstDateOfCurrentMonth";

const TableRow = () => {
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [cnfDDL, setCnfDDL] = useState([]);
  const [customsDDL, setCustomsDDL] = useState([]);
  const [isPrintable, setIsPrintable] = useState(false);
  const [headerInfo, setHeaderInfo] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  console.log("rowDto: ", rowDto);

  useEffect(() => {
    getCnfDDLForCnFReport(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setCnfDDL
    );
    GetCustomsNameDDLForCnfReport(
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

  const getReport = (values) => {
    getCnFDetailsReport(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.provider?.value || 0,
      values?.customs?.value || 0,
      values?.fromDate,
      values?.toDate,
      setRowDto,
      setLoader
    );
  };

  const printRef = useRef();

  const initData = {
    provider: "",
    customs: "",
    fromDate: _firstDateofMonth(),
    toDate: _todayDate(),
  };

  let initialFromDate = initData?.fromDate;
  let initialToDate = initData?.toDate;
  //this useEffect may need for the future changes, depending on nullable issue.
  useEffect(() => {
    if (initialFromDate)
      getCnFDetailsReport(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        "",
        "",
        initialFromDate,
        initialToDate,
        setRowDto,
        setLoader
      );
  }, [profileData, selectedBusinessUnit, initialFromDate, initialToDate]);

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
      name: "Business Partner",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Doc F Date",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Payment Date",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Service Rec Date",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Inv Amount (BDT)",
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
      name: "Item Description",
      style: {
        minWidth: "100px",
      },
    },
  ];

  return (
    <>
      {loader && <Loading />}
      <ICustomCard
        title="CnF Details"
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
              {/*  */}
              <Form className="form form-label-right">
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      value={values?.provider}
                      name="provider"
                      label="Provider"
                      options={cnfDDL || []}
                      onChange={(valueOption) => {
                        setFieldValue("provider", valueOption);
                        if (!valueOption) {
                          setRowDto([]);
                        }
                      }}
                      placeholder="Provider"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      value={values?.customs}
                      name="customs"
                      label="Customs"
                      options={customsDDL || []}
                      onChange={(valueOption) => {
                        setFieldValue("customs", valueOption);
                        if (!valueOption) {
                          setRowDto([]);
                        }
                      }}
                      placeholder="Customs"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      max={values?.toDate}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      min={values?.fromDate}
                    />
                  </div>
                  <div className="col-lg-2 pt-5 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        getReport(values);
                      }}
                      className="btn btn-primary"
                      // disabled={!values?.customs || !values?.provider}
                    >
                      Show
                    </button>
                  </div>
                </div>
                {/* Table Start */}

                <div className="scroll-table _table " ref={printRef}>
                  {isPrintable && (
                    <div className="text-center d-none-print">
                      <h2> {headerInfo?.businessUnitName} </h2>
                      <h6> {headerInfo?.businessUnitCode} </h6>
                      <h6> {headerInfo?.businessUnitAddress} </h6>
                    </div>
                  )}
                  <div className="react-bootstrap-table table-responsive">
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
                        {rowDto?.length > 0 &&
                          rowDto?.map((data, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{data?.strLCNumber}</td>
                              <td>{data?.strShipmentCode}</td>
                              <td>{data?.strName}</td>
                              <td className="text-center">
                                {_dateFormatter(data?.dteDocumentforwardDate)}
                              </td>
                              <td className="text-center">
                                {_dateFormatter(data?.dtePaymentDate)}
                              </td>
                              <td className="text-center">
                                {_dateFormatter(data?.dteServiceReceiveDate)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(data?.numInvoiceAmount, 4)}
                              </td>
                              <td>{data?.strCurrencyName}</td>
                              <td>{data?.column3}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default TableRow;
