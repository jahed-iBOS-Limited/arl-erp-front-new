/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import { useEffect } from "react";
import { CNFDetailsReport, GetBusinessUnitDDL } from "../helper";
import NewSelect from "../../../../_helper/_select";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { useRef } from "react";
import InputField from "../../../../_helper/_inputField";
import { _todayDate } from "../../../../_helper/_todayDate";
import IView from "../../../../_helper/_helperIcons/_view";
import { removeDaysToDate } from "../../../transaction/lc-open/helper";

const TableRow = () => {
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [unitDDL, setUnitDDL] = useState();
  const [isPrintable, setIsPrintable] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const initData = {
    unit: "",
    fromDate: _dateFormatter(removeDaysToDate(new Date(), 7)),
    toDate: _todayDate(),
  };

  useEffect(() => {
    GetBusinessUnitDDL(profileData?.accountId, setUnitDDL);
  }, [profileData, selectedBusinessUnit]);

  const getLandingReport = (values) => {
    CNFDetailsReport(
      profileData?.accountId,
      selectedBusinessUnit?.value,
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
      name: "PO",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "LC",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Shipment",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Change Type",
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
      name: "Payment Date",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Bill No",
      style: {
        minWidth: "100px",
      },
    },

    {
      name: "Pay Amount",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Pay VAT",
      style: {
        minWidth: "100px",
      },
    },
    {
      name: "Action",
      className: "printSectionNone",
      style: {
        minWidth: "50px",
      },
    },
  ];

  return (
    <>
      {loader && <Loading />}
      <ICustomCard
        title="CNF Details Report"
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
                    <label>From Date</label>
                    <InputField
                      name="fromDate"
                      value={values?.fromDate}
                      type="date"
                      // max={values?.toDate}
                      onChange={(e) => {
                        setFieldValue("fromDate", e?.target?.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <InputField
                      name="toDate"
                      value={values?.toDate}
                      type="date"
                      min={values?.fromDate}
                      onChange={(e) => {
                        setFieldValue("toDate", e?.target?.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-2 pt-5 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        getLandingReport(values);
                      }}
                      className="btn btn-primary"
                      disabled={
                        !values?.unit || !values?.fromDate || !values?.toDate
                      }
                    >
                      Show
                    </button>
                  </div>
                </div>
                {/* Table Start */}
                {
                  <div className="loan-scrollable-table">
                    <div
                      style={{ maxHeight: "400px" }}
                      className="scroll-table _table scroll-table-auto"
                    >
                      <table
                        style={{ maxHeight: "500px" }}
                        className="table table-striped global-table"
                        ref={printRef}
                      >
                        <thead>
                          <tr>
                            {header?.length > 0 &&
                              header?.map((item, index) => (
                                <th key={index} style={item?.style} className={item?.className}>
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
                                <td>{item?.poNumber}</td>
                                <td>{item?.lcNumber}</td>
                                <td>{item?.shipmentCode}</td>
                                <td>{item?.costTypeName}</td>
                                <td>{item?.businessPartnerName}</td>
                                <td>{_dateFormatter(item?.paymentDate)}</td>
                                <td>{item?.billNumber}</td>
                                <td className="text-right">
                                  {item?.numActualAmount}
                                </td>
                                <td className="text-right">
                                  {item?.numActualVAT}
                                </td>
                                <td className="printSectionNone">
                                  <div className="d-flex justify-content-around">
                                    <span className="view">
                                      <IView
                                        clickHandler={() => {
                                          // history.push({
                                          //   pathname: `/rtm-management/configuration/employeeGroup/view/${item?.employeeGroupId}`,
                                          //   state: item,
                                          // });
                                        }}
                                      />
                                    </span>
                                  </div>
                                </td>
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
