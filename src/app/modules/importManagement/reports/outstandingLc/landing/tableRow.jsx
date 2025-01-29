/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import { useEffect } from "react";
import {
  GetBankListForOutstandingLCReport,
  GetBusinessUnitDDL,
  GetOutstandingLCReport,
} from "../helper";
import NewSelect from "../../../../_helper/_select";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { useRef } from "react";

const TableRow = () => {
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [unitDDL, setUnitDDL] = useState();
  const [bankDDL, setBankDDL] = useState([]);
  const [isPrintable, setIsPrintable] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    GetBusinessUnitDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setUnitDDL
    );
    GetBankListForOutstandingLCReport(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setBankDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const getLandingReport = (values) => {
    GetOutstandingLCReport(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRowDto,
      setLoader
    );
  };

  const printRef = useRef();

  const initData = {
    unit: "",
    bank: "",
  };

  const header = [
    {
      name: "SL",
      style: {
        minWidth: "50px",
      },
    },
    {
      name: "Unit",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Bank",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "LC No",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "LC Date",
      style: {
        minWidth: "80px",
      },
    },
    {
      name: "LC Type",
      style: {
        minWidth: "80px",
      },
    },
    {
      name: "Benificiary",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Invoice No",
      style: {
        minWidth: "100px",
      },
    },

    {
      name: "Inv Date",
      style: {
        minWidth: "80px",
      },
    },
    {
      name: "Shipment",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Acc. Date",
      style: {
        minWidth: "80px",
      },
    },
    {
      name: "Start Date",
      style: {
        minWidth: "80px",
      },
    },
    {
      name: "Tenor Days",
      style: {
        minWidth: "50px",
      },
    },
    {
      name: "Mat. Date",
      style: {
        minWidth: "80px",
      },
    },
    {
      name: "Bank Rate",
      style: {
        minWidth: "50px",
      },
    },
    {
      name: "Libor Rate",
      style: {
        minWidth: "50px",
      },
    },
    {
      name: "Invoice Amount",
      style: {
        minWidth: "80px",
      },
    },
    {
      name: "Currency",
      style: {
        minWidth: "50px",
      },
    },
  ];

  return (
    <>
      {loader && <Loading />}
      <ICustomCard
        title="List of deffered LC"
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
                      value={values?.unit}
                      name="unit"
                      label="Unit"
                      options={unitDDL || []}
                      onChange={(valueOption) => {
                        setFieldValue("unit", valueOption);
                        if (!valueOption) {
                          setRowDto([]);
                        }
                      }}
                      placeholder="Unit"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      value={values?.bank}
                      name="bank"
                      label="Bank"
                      options={bankDDL || []}
                      onChange={(valueOption) => {
                        setFieldValue("bank", valueOption);
                        if (!valueOption) {
                          setRowDto([]);
                        }
                      }}
                      placeholder="Bank"
                    />
                  </div>
                  <div className="col-lg-2 pt-5 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        getLandingReport(values);
                      }}
                      className="btn btn-primary"
                      disabled={!values?.unit}
                    >
                      Show
                    </button>
                  </div>
                </div>
                {/* Table Start */}
                {
                  // <div className="scroll-table _table" ref={printRef}>
                  //   {isPrintable && (
                  //     <div className='text-center'>
                  //       <h2> {headerInfo?.businessUnitName} </h2>
                  //       <h6> {headerInfo?.businessUnitCode} </h6>
                  //       <h6> {headerInfo?.businessUnitAddress} </h6>
                  //     </div>
                  //   )}
                  <div className="loan-scrollable-table">
                    <div
                      style={{ maxHeight: "400px" }}
                      className="scroll-table _table scroll-table-auto"
                    >
                      <table
                        style={{ maxHeight: "500px" }}
                        className="table table-striped table-bordered global-table"
                        ref={printRef}
                      >
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
                            rowDto?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{values?.unit?.label}</td>
                                <td>{values?.bank?.label}</td>
                                <td>{item?.lcNumber}</td>
                                <td>{_dateFormatter(item?.lcDate)}</td>
                                <td>{item?.lcTypeName}</td>
                                <td>{item?.poBenificiaryName}</td>
                                <td className="text-center">
                                  {item?.invoiceNo}
                                </td>
                                <td>{_dateFormatter(item?.invoiceDate)}</td>
                                <td>{item?.shipmentCode}</td>
                                <td>{_dateFormatter(item?.accDate)}</td>
                                <td>{_dateFormatter(item?.startDate)}</td>
                                <td className="text-center">
                                  {item?.tenoDays}
                                </td>
                                <td>{_dateFormatter(item?.maturityDate)}</td>
                                <td className="text-right">
                                  {item?.bankRate}
                                </td>
                                <td className="text-right">
                                  {item?.liborRate}
                                </td>
                                <td className="text-right">
                                  {item?.invoiceAmount}
                                </td>
                                <td>{item?.currencyName}</td>
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
