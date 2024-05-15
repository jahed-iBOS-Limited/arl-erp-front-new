import { Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
// import { APIUrl } from "../../../../App";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _currentTime12hour } from "../../../_helper/_currentTime";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import Loading from "../../../_helper/_loading";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import { _todayDate } from "../../../_helper/_todayDate";
import "./style.css";
import magnumLogo from "./images/magnumLogo.png";
import cementLogo from "./images/cementLogo.png";
import ispatLogo from "./images/ispatLogo.png";
import essentialLogo from "./images/essentialLogo.png";

function Report({ weightmentId }) {
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [reportData, getReportData, reportLoader] = useAxiosGet();

  useEffect(() => {
    if (weightmentId) {
      getReportData(
        `/mes/MSIL/GetAllMSIL?PartName=FirstWeightSecondWeightInfoForPDF&AutoId=${weightmentId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weightmentId, selectedBusinessUnit]);

  const printRef = useRef();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={""}>
                <CardHeaderToolbar>
                  <ReactToPrint
                    pageStyle={
                      "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                    }
                    trigger={() => (
                      <button type="button" className="btn btn-primary ml-3">
                        <i
                          className="fa fa-print pointer"
                          aria-hidden="true"
                        ></i>
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                  />
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {reportLoader && <Loading />}
                <div
                  componentRef={printRef}
                  ref={printRef}
                  className="weight-scale-report-wrapper"
                >
                  <div className="weight-report-header center">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex justify-content-center align-items-center">
                        {/* <div className="d-flex justify-content-center align-items-center"> */}
                        {[171, 224, 4, 144].includes(
                          reportData[0]?.intBusinessUnitId
                        ) ? (
                          <img
                            style={{
                              width: "100px",
                              height: "60px",
                            }}
                            // src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
                            src={
                              reportData[0]?.intBusinessUnitId === 171
                                ? magnumLogo
                                : reportData[0]?.intBusinessUnitId === 224
                                ? ispatLogo
                                : reportData[0]?.intBusinessUnitId === 144
                                ? essentialLogo
                                : cementLogo
                            }
                            alt="logo"
                          />
                        ) : null}
                        {/* </div> */}
                      </div>
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <h1 className="bold">
                          {reportData[0]?.strBusinessUnitName}
                        </h1>
                        <h4>{reportData[0]?.strBusinessUnitAddress}</h4>
                        <h3 className="bold">
                          <span className="border-bottom">Weight Report</span>
                        </h3>
                      </div>
                      <div></div>
                    </div>
                  </div>
                  <div className="weight-report-serial">
                    <h5>
                      Reg. No:{" "}
                      <span className="">{reportData[0]?.entryCode}</span>
                    </h5>

                    <h5>
                      Printed On:{" "}
                      <span class="">
                        {_todayDate() + " " + _currentTime12hour()}
                      </span>
                    </h5>
                  </div>
                  <div className="weight-report-details">
                    <div className="table-responsive">
                      <table className="weight-report-details-left-table">
                        <tr>
                          <td
                            style={{
                              minWidth: "125px",
                              verticalAlign: "text-top",
                            }}
                            class="bold"
                          >
                            Date
                          </td>
                          <td style={{ verticalAlign: "text-top" }}>: </td>
                          <td
                            style={{
                              width: "300px",
                              verticalAlign: "text-top",
                            }}
                          >
                            {_dateFormatter(
                              reportData[0]?.lastWeightDate?.split("T")
                            )}
                          </td>
                          <td
                            style={{ verticalAlign: "text-top" }}
                            class="bold"
                          >
                            Challan No
                          </td>
                          <td style={{ verticalAlign: "text-top" }}>: </td>
                          <td>{reportData[0]?.challanNo}</td>
                        </tr>
                        {/* <tr>
                        <td class="bold">Weight Type</td>
                        <td>: </td>
                        <td>{reportData[0]?.weightType}</td>
                      </tr> */}
                        <tr>
                          <td
                            style={{
                              minWidth: "125px",
                              verticalAlign: "text-top",
                            }}
                            class="bold"
                          >
                            Client Code
                          </td>
                          <td style={{ verticalAlign: "text-top" }}>: </td>
                          <td style={{ width: "300px" }}>
                            {reportData[0]?.partnerCode}
                          </td>

                          <td class="bold">Client Type</td>
                          <td>: </td>
                          <td>{reportData[0]?.clientType}</td>
                        </tr>

                        <tr>
                          <td
                            class="bold"
                            style={{
                              verticalAlign: "text-top",
                              minWidth: "125px",
                            }}
                          >
                            {reportData[0]?.intClientTypeId === 1
                              ? "Supplier"
                              : "Customer"}
                          </td>
                          <td style={{ verticalAlign: "text-top" }}>: </td>
                          <td colSpan={4}>{reportData[0]?.partnerName}</td>
                        </tr>

                        <tr>
                          <td
                            style={{
                              verticalAlign: "text-top",
                              minWidth: "125px",
                            }}
                            class="bold"
                          >
                            Address
                          </td>
                          <td style={{ verticalAlign: "text-top" }}>: </td>
                          <td colSpan={4}>{reportData[0]?.partnerAddress}</td>
                        </tr>

                        <tr>
                          <td
                            style={{
                              verticalAlign: "text-top",
                              minWidth: "125px",
                            }}
                            class="bold"
                          >
                            Material Description
                          </td>
                          <td style={{ verticalAlign: "text-top" }}>: </td>
                          <td colSpan={4} style={{ verticalAlign: "text-top" }}>
                            {reportData[0]?.materialDescription}
                          </td>
                        </tr>

                        <tr>
                          <td style={{ minWidth: "125px" }} class="bold">
                            Vehicle No
                          </td>
                          <td>: </td>
                          <td>{reportData[0]?.vehicleNo}</td>
                        </tr>

                        <tr>
                          <td style={{ minWidth: "125px" }} class="bold">
                            Driver Name
                          </td>
                          <td>: </td>
                          <td style={{ width: "300px" }}>
                            {reportData[0]?.driverName}
                          </td>

                          <td class="bold">Quantity</td>
                          <td>: </td>
                          <td>{reportData[0]?.quantity}</td>
                        </tr>

                        <tr>
                          <td style={{ minWidth: "125px" }} class="bold">
                            Driver Phone No
                          </td>
                          <td>: </td>
                          <td style={{ width: "300px" }}>
                            {reportData[0]?.telFaxEmail}
                          </td>

                          <td
                            style={{ verticalAlign: "text-top" }}
                            class="bold"
                          >
                            Quantity (KG)
                          </td>
                          <td style={{ verticalAlign: "text-top" }}>: </td>
                          <td style={{ verticalAlign: "text-top" }}>
                            {reportData[0]?.quantitykg}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ verticalAlign: "text-top" }}
                            class="bold"
                          >
                            Operator Name
                          </td>
                          <td style={{ verticalAlign: "text-top" }}>: </td>
                          <td style={{ verticalAlign: "text-top" }}>
                            {reportData[0]?.operatorName}
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>

                <p className="border-style"></p>
                <br />
                <br />
                <div className="weight-report-scale">
                  <div className="first">
                    <p>
                      <strong>First Weight Date</strong> <br />
                      <span>
                        {_dateFormatter(reportData[0]?.firstWeightDate)}{" "}
                        {_timeFormatter(reportData[0]?.firstWeightTime || "")}
                      </span>
                    </p>
                    <p>
                      <span className="bold">First Weight</span>
                    </p>
                    <p>
                      <span
                        style={{ fontSize: "16px" }}
                        className="bold weight-report-scale-border"
                      >
                        {reportData[0]?.firstWeight} Kg
                      </span>
                    </p>
                  </div>
                  <div className="second">
                    <p>
                      <strong>Second Weight Date</strong>
                      <br />
                      <span>
                        {_dateFormatter(reportData[0]?.lastWeightDate)}{" "}
                        {_timeFormatter(reportData[0]?.lastWeightTime || "")}
                      </span>
                    </p>
                    <p>
                      <span className="bold">Second Weight</span>
                    </p>
                    <p>
                      <span
                        style={{ fontSize: "16px" }}
                        className="bold weight-report-scale-border"
                      >
                        {reportData[0]?.lastWeight} Kg
                      </span>
                    </p>
                  </div>
                  <div className="third">
                    <p>
                      <strong>Net Weight Date</strong> <br />
                      <span>
                        {_dateFormatter(reportData[0]?.lastWeightDate)}{" "}
                        {_timeFormatter(reportData[0]?.lastWeightTime || "")}
                      </span>
                    </p>
                    <p>
                      <span className="bold">Net Weight</span>
                    </p>
                    <p>
                      <span
                        style={{ fontSize: "16px" }}
                        className="bold weight-report-scale-border"
                      >
                        {reportData[0]?.netWeight} Kg
                      </span>
                    </p>
                  </div>
                </div>

                <br />
                <div className="weight-report-signature">
                  <div className="first">
                    <p>
                      <span className="bold border-top">Driver Signature</span>
                    </p>
                  </div>
                  <div className="second">
                    <p>
                      <span className="bold border-top">
                        Customer Signature
                      </span>
                    </p>
                  </div>
                  <div className="third">
                    <p>
                      <span className="bold border-top">
                        Security Signature
                      </span>
                    </p>
                  </div>
                  <div className="fourth">
                    <p>
                      <span className="bold border-top">
                        Authorized Signature
                      </span>
                    </p>
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

export default Report;
