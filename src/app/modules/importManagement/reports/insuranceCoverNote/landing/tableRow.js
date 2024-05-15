/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import ICustomCard from "../../../../_helper/_customCard";
import { _todayDate } from "../../../../_helper/_todayDate";
import InputField from "../../../../_helper/_inputField";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { useEffect } from "react";
import { GetBankDDL, getInsuranceCoverNoteReport } from "../helper";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { useRef } from "react";
import { getReportHeaderInfo } from "../../costSummary/helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _firstDateofMonth } from "./../../../../_helper/_firstDateOfCurrentMonth";
import { _formatMoney } from "./../../../../_helper/_formatMoney";

const TableRow = () => {
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [bankDDL, setBankDDL] = useState([]);
  const [headerInfo, setHeaderInfo] = useState([]);
  const [isPrintable, setIsPrintable] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const header = [
    {
      name: "SL",
      style: {
        minWidth: "30px",
      },
    },
    {
      name: "PO Number",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Provider Name",
      style: {
        minWidth: "100px",
      },
    },

    {
      name: "Shipped By",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Cover Note No",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "CN Date",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "LC/PI Amount(FC)",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "CN Currency",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "PI Amount (BDT)",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "CN PO Amount",
      style: {
        minWidth: "100px",
      },
    },
    // {
    //   name: "(%) of Total ",
    //   style: {
    //     minWidth: "100px",
    //   },
    // },
  ];

  const initData = {
    fromDate: _firstDateofMonth(),
    toDate: _todayDate(),
    lcNumber: "",
    provider: "",
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetBankDDL(
        setBankDDL,
        profileData?.accountId,
        selectedBusinessUnit?.value
      );
      getReportHeaderInfo(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setHeaderInfo
      );
      getInsuranceCoverNoteReport(
        selectedBusinessUnit?.value,
        profileData?.accountId,
        "",
        "",
        "",
        "",
        setRowDto,
        setLoader
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const getReport = (poNumber, providerId, fromDate, toDate) => {
    getInsuranceCoverNoteReport(
      selectedBusinessUnit?.value,
      profileData?.accountId,
      poNumber,
      providerId,
      fromDate,
      toDate,
      setRowDto,
      setLoader
    );
  };

  // useEffect(() => {
  //   getReport();
  // }, []);

  const loadPoNumbers = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        // `/imp/ImportCommonDDL/GetLetterOfCreditDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
        `/imp/ImportCommonDDL/GetPONoForReport?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
      )
      .then((res) =>
        res?.data?.map((item) => ({
          label: item?.label,
          value: item?.value,
        }))
      );
  };

  const printRef = useRef();

  return (
    <>
      {loader && <Loading />}
      <ICustomCard
        title="Insurance Cover Note Report"
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
          //   validationSchema={LoanApproveSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({ values, errors, touched, setFieldValue, dirty, isValid }) => (
            <>
              {/* {console.log(values, "values")} */}
              <Form className="form form-label-right">
                <div className="row global-form">
                  <div className="col-lg-3">
                    <label>PO Number</label>
                    <SearchAsyncSelect
                      selectedValue={values?.lcNumber}
                      isSearchIcon={true}
                      paddingRight={10}
                      handleChange={(valueOption) => {
                        setFieldValue("lcNumber", valueOption);
                        getReport(
                          valueOption?.label,
                          values?.provider?.value,
                          values?.fromDate,
                          values?.toDate
                        );
                      }}
                      loadOptions={loadPoNumbers || []}
                      // placeholder="Search by LC ID"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="provider"
                      options={bankDDL || []}
                      value={values?.provider}
                      onChange={(valueOption) => {
                        setFieldValue("provider", valueOption);
                        // getReport(
                        //   values?.lcNumber?.label,
                        //   valueOption?.value,
                        //   values?.fromDate,
                        //   values?.toDate
                        // );
                      }}
                      placeholder="Service Provider"
                      label="Service Provider"
                      errors={errors}
                      touched={touched}
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
                      onChange={(e) => {
                        setFieldValue("fromDate", e?.target?.value);
                        // getReport(
                        //   values?.lcNumber?.label,
                        //   values?.provider?.value,
                        //   e?.target?.value,
                        //   values?.toDate
                        // );
                      }}
                      // disabled={routeState === "view"}
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
                      onChange={(e) => {
                        setFieldValue("toDate", e?.target?.value);
                        // getReport(
                        //   values?.lcNumber?.label,
                        //   values?.provider?.value,
                        //   values?.fromDate,
                        //   e?.target?.value
                        // );
                      }}
                      // disabled={routeState === "view"}
                    />
                  </div>
                  <div className="col-lg-2" style={{ marginTop: "18px" }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        getReport(
                          values?.lcNumber?.label,
                          values?.provider?.value,
                          values?.fromDate,
                          values?.toDate
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                {/* Table Start */}

                {
                  // rowDto?.length > 0 &&
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
                          {rowDto?.length >= 0 &&
                            rowDto?.map((data, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {data?.poNumber}
                                </td>
                                <td className="text-center">
                                  {data?.providerName}
                                </td>
                                <td className="text-center">
                                  {data?.shippedByName}
                                </td>
                                <td className="text-center">
                                  {data?.coverNoteNo}
                                </td>
                                <td className="text-center">
                                  {_dateFormatter(data?.cnDate)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.piAmount, 4)}
                                </td>
                                <td className="text-center">
                                  {data?.currencyName}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.piAmountBdt, 4)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.poAmount, 4)}
                                </td>
                                {/* <td className='text-center'>
                                {data?.monPOTotal}
                              </td> */}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
