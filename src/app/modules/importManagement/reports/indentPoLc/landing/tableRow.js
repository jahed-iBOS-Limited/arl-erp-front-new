/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
// import "../../scrollableTableStyle.module.css";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import { getReportHeaderInfo } from "../../costSummary/helper";
import { GetBankDDL, getReport } from "../helper";
import Print from "../view/Print";
import { _firstDateofMonth } from "./../../../../_helper/_firstDateOfCurrentMonth";

const TableRow = () => {
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isPrintable, setIsPrintable] = useState(false);
  const [bankDDL, setBankDDL] = useState([]);
  const [headerInfo, setHeaderInfo] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    GetBankDDL(setBankDDL, profileData.accountId, selectedBusinessUnit.value);
  }, [profileData.accountId, selectedBusinessUnit.value]);

  const header = [
    {
      name: "SL",
      style: {
        minWidth: "30px",
      },
    },
    {
      name: "PO No",
      style: {
        minWidth: "113px",
      },
    },

    {
      name: "LC Number",
      style: {
        minWidth: "82px",
      },
    },
    {
      name: "LC Type",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "LC Date",
      style: {
        minWidth: "65px",
      },
    },
    {
      name: "Bank",
      style: {
        minWidth: "120px",
      },
    },
    {
      name: "LastShip Date",
      style: {
        minWidth: "70px",
      },
    },
    {
      name: "Beneficiary",
      style: {
        minWidth: "240px",
      },
    },
    {
      name: "Load Port Dest.",
      style: {
        minWidth: "140px",
      },
    },
    {
      name: "Final Destination",
      style: {
        minWidth: "140px",
      },
    },
    {
      name: "Total Value",
      style: {
        minWidth: "100px",
      },
    },

    {
      name: "Bank Charge",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "CLeaning Charge",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "CnF Charge",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Doc Release Charge",
      style: {
        minWidth: "105px",
      },
    },
    {
      name: "Custom Duty",
      style: {
        minWidth: "100px",
      },
    },

    //
    {
      name: "Hatch Charge",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Insurance Charge",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Maturity",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Other Charge",
      style: {
        minWidth: "70px",
      },
    },
    {
      name: "PG",
      style: {
        minWidth: "100px",
      },
    },

    {
      name: "Port Charge",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Scavartory Charge",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Shipping Charge",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Survey Charge",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Transport Charge",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Unloading Charge",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Currency",
      style: {
        minWidth: "50px",
      },
    },
    // {
    //   name: "Action",
    //   style: {
    //     minWidth: "50px",
    //   },
    // },
  ];

  const initData = {
    PoLcNo: "",
    bank: "",
    fromDate: _firstDateofMonth(),
    toDate: _todayDate(),
  };

  const printRef = useRef();

  const loadPoNumbers = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        // `/imp/LetterOfCredit/GetPOForLCOpen?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
        `/imp/ImportCommonDDL/GetPONoForLCRegister?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
      )
      .then(
        (res) => res?.data

        // res?.data?.map((item) => ({
        //   label: item?.label,
        //   value: item?.value,
        // }))
      );
  };
  const style = {
    minWidth: "50px",
  };

  useEffect(() => {
    getReport(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      "",
      "",
      "",
      "",
      "",
      "",
      setRowDto,
      setLoader
    );
    getReportHeaderInfo(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setHeaderInfo
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  const getLandingData = (poLc, bankId, fromDate, toDate) => {
    let poNo = poLc?.charAt(0) === "P" ? poLc : "";
    let lcNo = poLc?.charAt(0) !== "P" ? poLc : "";
    console.log("poNo", poNo);
    console.log("lcNo", lcNo);
    getReport(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      poNo,
      lcNo,
      bankId,
      fromDate,
      toDate,
      "",
      setRowDto,
      setLoader
    );
  };

  // useEffect(() => {
  //   getLandingData();
  // }, []);

  return (
    <>
      {loader && <Loading />}
      <ICustomCard
        title="LC Register"
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
                    <label>PO/LC No</label>

                    <SearchAsyncSelect
                      selectedValue={values?.PoLcNo}
                      isSearchIcon={true}
                      paddingRight={10}
                      handleChange={(valueOption) => {
                        setFieldValue("PoLcNo", valueOption);
                        getLandingData(
                          valueOption?.label,
                          values?.bank?.value,
                          values?.fromDate,
                          values?.toDate
                        );
                      }}
                      loadOptions={loadPoNumbers || []}
                      placeholder="PO LC No"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      value={values?.bank}
                      options={bankDDL || []}
                      placeholder="Bank"
                      name="bank"
                      label="Bank"
                      onChange={(e) => {
                        setFieldValue("bank", e);
                        // getLandingData(
                        //   values?.PoLcNo?.label,
                        //   e?.value,
                        //   values?.fromDate,
                        //   values?.toDate
                        // );
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>From Date</label>
                    <InputField
                      name="fromDate"
                      value={values?.fromDate}
                      type="date"
                      max={values?.toDate}
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                        // getLandingData(
                        //   values?.PoLcNo?.label,
                        //   values?.bank?.value,
                        //   e.target.value,
                        //   values?.toDate
                        // );
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>To Date</label>
                    <InputField
                      name="toDate"
                      value={values?.toDate}
                      type="date"
                      min={values?.fromDate}
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                        // getLandingData(
                        //   values?.PoLcNo?.label,
                        //   values?.bank?.value,
                        //   values?.fromDate,
                        //   e.target.value
                        // );
                      }}
                    />
                  </div>
                  <div className="col-lg-2" style={{ marginTop: "18px" }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        getLandingData(
                          values?.PoLcNo?.label,
                          values?.bank?.value,
                          values?.fromDate,
                          values?.toDate
                        );
                      }}
                      disabled={!values?.fromDate && !values?.toDate}
                    >
                      Show
                    </button>
                  </div>
                  {/* <div className="col-lg-3 pt-5">
                    <button
                      className="btn btn-primary"
                      disabled={!isValid || !dirty}
                    >
                      Search
                    </button>
                  </div> */}
                </div>
                {/* Table Start */}
                {
                  // rowDto?.length > 0 &&
                  <div
                    ref={printRef}
                    style={{
                      width: "100%",
                      maxHeight: "80vh",
                      overflow: "auto",
                    }}
                  >
                    {isPrintable && (
                      <div className="text-center d-none-print">
                        <h2> {headerInfo?.businessUnitName} </h2>
                        <h6> {headerInfo?.businessUnitCode} </h6>
                        <h6> {headerInfo?.businessUnitAddress} </h6>
                      </div>
                    )}
                    <div className="react-bootstrap-table table-responsive">
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead style={style}>
                          <tr>
                            {header?.length > 0 &&
                              header?.map((item, index) => (
                                <th
                                  style={{
                                    ...item?.style,
                                    position: "sticky",
                                    top: 0,
                                  }}
                                  key={index}
                                >
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
                                <td>{data?.strPoNo}</td>
                                <td>{data?.strLc}</td>
                                <td>{data?.lcType}</td>
                                <td className="text-center">
                                  {_dateFormatter(data?.lcDate)}
                                </td>
                                <td>{data?.strBank}</td>
                                <td className="text-center">
                                  {_dateFormatter(data?.shipDate)}
                                </td>
                                <td>{data?.supplier}</td>
                                <td>{data?.strSource}</td>
                                <td>{data?.strDestination}</td>
                                <td className="text-right">
                                  {_formatMoney(data?.totalValue, 4)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.numBank, 4)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.numCleaning, 4)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.numCnF, 4)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.numDocRelease, 4)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.numDuty, 4)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.numHatch, 4)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.numInsurance, 4)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.numMaturity, 4)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.numOther, 4)}
                                </td>

                                <td className="text-right">
                                  {_formatMoney(data?.numPG, 4)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.numPort, 4)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.numScavatory, 4)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.numShipping, 4)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.numSurvey, 4)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.numTransport, 4)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(data?.numUnloading, 4)}
                                </td>
                                <td>{data?.currency}</td>
                                {/* <td>{data?.currencyName}</td> */}
                                {/* <td className="text-center">
                                <IView
                                  //classes="text-muted"
                                  clickHandler={() => {
                                    setCurrentRow(data);
                                    setModalShow(true);
                                  }}
                                />
                              </td> */}
                                {/* <td>
                                  <div className="pl-2">
                                    {data?.employeeName}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {data?.designationName}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-left pl-2">
                                    {data?.departmentName}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.totalDays}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.workingDays}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.present}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.absent}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.late}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.movement}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.leave}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.offDay}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {data?.holiday}
                                  </div>
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
        <IViewModal
          show={modalShow}
          onHide={() => {
            setCurrentRow(null);
            setModalShow(false);
          }}
        >
          <Print currentRow={currentRow} />
        </IViewModal>
      </ICustomCard>
    </>
  );
};

export default TableRow;
