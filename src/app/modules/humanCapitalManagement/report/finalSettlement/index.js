/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Formik } from "formik";
import html2pdf from "html2pdf.js";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import FormikError from "../../../_helper/_formikError";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import "./style.css";

const initData = {
  employee: "",
  date: "",
};

function FinalSettlement() {
  const [landingData, getLandingData, loading] = useAxiosGet();
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const pdfExport = (fileName) => {
    var element = document.getElementById("pdf-section");
    var opt = {
      margin: 20,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 5, dpi: 300, letterRendering: true },
      jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "portrait" },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save();
  };

  const loadItemList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${profileData?.accountId}&search=${v}`
      )
      .then((res) => res?.data);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Final Settlement"}>
                <CardHeaderToolbar>
                  {/* <button
                    onClick={() => {
                      history.push({
                        pathname: `/financial-management/invoicemanagement-system/salesInvoice/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loading && <Loading />}
                <div className="row global-form">
                  <div className="col-lg-3">
                    <label>Employee</label>
                    <SearchAsyncSelect
                      selectedValue={values?.employee}
                      handleChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                      }}
                      loadOptions={loadItemList}
                    />
                    <FormikError
                      errors={errors}
                      name="employee"
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Date</label>
                    <InputField value={values?.date} name="date" type="date" />
                  </div>
                  <div className="ml-2">
                    <button
                      style={{ marginTop: "13px" }}
                      className="btn btn-primary"
                      type="button"
                      disabled={!values?.employee || !values?.date}
                      onClick={() => {
                        getLandingData(
                          `/hcm/Report/GetEmployeeFinalSettlement?intEmployeeId=${values?.employee?.value}&date=${values?.date}`
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                  <div className="ml-2">
                    <button
                      style={{ marginTop: "13px" }}
                      className="btn btn-primary"
                      type="button"
                      disabled={!landingData?.length}
                      onClick={(e) => pdfExport("Final Settlement Report")}
                    >
                      Export PDF
                    </button>
                  </div>
                </div>

                <div id="pdf-section" className="final-settlement-report">
                  <div className="settlement-header">
                    <h3>
                      <strong>AKIJ RESOURCES Ltd.</strong>
                    </h3>
                    <h5>
                      <strong>
                        Akij House, 198 Bir Uttam Mir Shawkat Sarak, Tejgaon,
                        Dhaka-1208
                      </strong>
                    </h5>
                    <h5>
                      <strong>Calculation of Final Payment (TOP SHEET)</strong>
                    </h5>
                  </div>
                  <div>
                    <h6 className="settlement-date">
                      <strong>13/09/2022</strong>
                    </h6>
                  </div>
                  <div className="settlement-info mt-5">
                    <div className="row">
                      <div className="col-lg-8">
                        <table style={{ width: "100%" }}>
                          <tr>
                            <td>Name</td>
                            <td>
                              <strong>:</strong>
                            </td>
                            <td>
                              <strong>
                                {landingData[0]?.strEmployeeFullName}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Designation</td>
                            <td>
                              <strong>:</strong>
                            </td>
                            <td>{landingData[0]?.strDesignationName}</td>
                          </tr>
                          <tr>
                            <td>Unit</td>
                            <td>
                              <strong>:</strong>
                            </td>
                            <td>{landingData[0]?.strBusinessUnitCode}</td>
                          </tr>
                          <tr>
                            <td>Type of Employment</td>
                            <td>
                              <strong>:</strong>
                            </td>
                            <td>
                              <strong>
                                {landingData[0]?.strEmploymentType}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Date of Joining</td>
                            <td>
                              <strong>:</strong>
                            </td>
                            <td>
                              {_dateFormatter(landingData[0]?.dteJoiningDate)}
                            </td>
                          </tr>
                          <tr>
                            <td>Date of Last working Day</td>
                            <td>
                              <strong>:</strong>
                            </td>
                            <td>{landingData[0]?.dteSeparationDate}</td>
                          </tr>
                          <tr>
                            <td>Length of Service Period</td>
                            <td>
                              <strong>:</strong>
                            </td>
                            <td>{landingData[0]?.strServiceLength}</td>
                          </tr>
                          <tr>
                            <td style={{ width: "180px" }}>
                              Reason for End of Service
                            </td>
                            <td style={{ width: "30px" }}>
                              <strong>:</strong>
                            </td>
                            <td>
                              <strong>
                                {landingData[0]?.strSeparationReason}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Ref. no. & Date</td>
                            <td>
                              <strong>:</strong>
                            </td>
                            <td>AEL/HR & Admin/2021/1029</td>
                          </tr>
                        </table>
                      </div>
                      <div className="col-lg-4">
                        <table>
                          <tr>
                            <td>Id</td>
                            <td>
                              <strong>:</strong>
                            </td>
                            <td>AEL(Sales)-013</td>
                          </tr>
                          <tr>
                            <td style={{ width: "40px" }}>En</td>
                            <td style={{ width: "30px" }}>
                              <strong>:</strong>
                            </td>
                            <td>{landingData[0]?.intEmployeeId}</td>
                          </tr>
                        </table>
                        <div
                          style={{ marginTop: "30px" }}
                          className="settlement-signature"
                        >
                          <p style={{ marginBottom: "0px" }}>
                            I have received all my dues from Akij Group
                          </p>
                          <p>
                            <strong>Signature:</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="settlement-table mt-5">
                    <table className="test">
                      <tr>
                        <th rowSpan="2">Gratuity</th>
                        <th rowSpan="2">E/L</th>
                        <th colspan="2">Salary</th>
                        <th rowSpan="2" colSpan="2">
                          PF
                        </th>
                        <th rowSpan="5">Total Due</th>
                        <th rowSpan="5">Company's Due</th>
                        <th rowSpan="5">Actual Due</th>
                      </tr>
                      <tr>
                        <th>Month</th>
                        <th>Day</th>
                      </tr>
                      <tr>
                        <th rowSpan="3"></th>
                        <th rowSpan="3"></th>
                        <th>
                          Salary of{" "}
                          {`${landingData[0]?.monthName || ""}${landingData[0]
                            ?.year || ""}`}
                          "
                        </th>
                        <th rowSpan="3">{landingData[0]?.monthDay}</th>
                        <th rowSpan="3">Owned</th>
                        <th rowSpan="3">Company</th>
                      </tr>
                      <tr>
                        <th style={{ color: "#D6DADD" }}>.</th>
                      </tr>
                      <tr>
                        <th style={{ color: "#D6DADD" }}>.</th>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td className="pl-2">
                          <p className="pmb">
                            Salary of{" "}
                            {`${landingData[0]?.monthName || ""}${landingData[0]
                              ?.year || ""}`}
                            '
                          </p>
                          <p className="pmb">Notice Pay- 2 Months</p>
                          <p className="pmb">Mobile Allowance</p>
                          <p className="pmb">
                            TADA Of{" "}
                            {`${landingData[0]?.monthName || ""}${landingData[0]
                              ?.year || ""}`}
                            ''
                          </p>
                        </td>
                        <td className="text-right pr-2">
                          <p className="pmb">
                            <strong>{landingData[0]?.numGrossSalary}</strong>
                          </p>
                          <p className="pmb">
                            <strong>{landingData[0]?.noticePay}</strong>
                          </p>
                          <p className="pmb">
                            <strong>
                              {landingData[0]?.monMobileAllowance}
                            </strong>
                          </p>
                          <p className="pmb">
                            <strong>{landingData[0]?.monTada}</strong>
                          </p>
                        </td>
                        <td className="text-right pr-2">
                          <p>
                            <strong>
                              {landingData[0]?.monPFEmployeeContribution}
                            </strong>
                          </p>
                        </td>
                        <td></td>
                        <td className="text-right pr-2">
                          <p>
                            <strong>{landingData[0]?.numActualDue}</strong>
                          </p>
                        </td>
                        <td></td>
                        <td className="text-right pr-2">
                          <p>
                            <strong>{landingData[0]?.numActualDue}</strong>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="text-right pr-2">
                          <strong>{landingData[0]?.numTotalSalary}</strong>
                        </td>
                        <td className="text-right pr-2">
                          <strong>
                            {landingData[0]?.monPFEmployeeContribution}
                          </strong>
                        </td>
                        <td className="text-center">
                          <strong>-</strong>
                        </td>
                        <td className="text-right pr-2">
                          <strong>{landingData[0]?.numTotalDue}</strong>
                        </td>
                        <td className="text-center">
                          <strong>-</strong>
                        </td>
                        <td className="text-right pr-2">
                          <strong>{landingData[0]?.numActualDue}</strong>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div
                    style={{ width: "70%" }}
                    className="settlement-account m-auto"
                  >
                    <table style={{ width: "100%" }}>
                      <tr>
                        <td>
                          <strong>Total Taka (In Digit)</strong>
                        </td>
                        <td style={{ width: "30px" }}>
                          <strong>:</strong>
                        </td>
                        <td>
                          <strong>{landingData[0]?.numActualDue}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Total Taka (In word)</strong>
                        </td>
                        <td style={{ width: "30px" }}>
                          <strong>:</strong>
                        </td>
                        <td>
                          <strong style={{ borderBottom: "1px dashed black" }}>
                            Seventy two thousand three hundred and seventy taka
                            only
                          </strong>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div
                    style={{ marginTop: "20px" }}
                    className="settlement-note"
                  >
                    <p style={{ marginBottom: "0px" }}>
                      <strong>Note:</strong>
                    </p>
                    <p>
                      <span style={{ fontSize: "11px" }}>
                        If everything is ok, payment may be made.
                      </span>
                    </p>
                  </div>
                  <div
                    style={{ marginTop: "50px" }}
                    className="settlement-footer"
                  >
                    <table style={{ width: "100%" }}>
                      <tr>
                        <td>
                          <p style={{ marginBottom: "0px" }}>
                            <strong className="settlement-border">
                              Nazia Navid
                            </strong>
                          </p>
                          <p>
                            <span style={{ fontSize: "11px" }}>Officer HR</span>
                          </p>
                        </td>
                        <td>
                          <p style={{ marginBottom: "0px" }}>
                            <strong className="settlement-border">
                              Abdul Kaium khandakar
                            </strong>
                          </p>
                          <p>
                            <span style={{ fontSize: "11px" }}>
                              Sr. Manager HR
                            </span>
                          </p>
                        </td>
                        <td>
                          <p style={{ marginBottom: "0px" }}>
                            <strong className="settlement-border">
                              Tariqul Alam
                            </strong>
                          </p>
                          <p>
                            <span style={{ fontSize: "11px" }}>
                              DGM(HR & Admin)
                            </span>
                          </p>
                        </td>

                        <td>
                          <p style={{ marginBottom: "0px" }}>
                            <strong className="settlement-border">
                              Billing Department
                            </strong>
                          </p>
                          {/* <p>
                            <span style={{ fontSize: "11px" }}>Officer HR</span>
                          </p> */}
                        </td>
                        <td>
                          <p style={{ marginBottom: "0px" }}>
                            <strong className="settlement-border">
                              Audit Department
                            </strong>
                          </p>
                          {/* <p>
                            <span style={{ fontSize: "11px" }}>Officer HR</span>
                          </p> */}
                        </td>
                        <td>
                          <p style={{ marginBottom: "0px" }}>
                            <strong className="settlement-border">
                              Head of Finance
                            </strong>
                          </p>
                          {/* <p>
                            <span style={{ fontSize: "11px" }}>Officer HR</span>
                          </p> */}
                        </td>
                      </tr>
                    </table>
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

export default FinalSettlement;
