import React, { useCallback, useEffect, useState, useRef } from "react";
import ICustomCard from "../../../_helper/_customCard";
import { Formik, Field } from "formik";
import { Form } from "react-bootstrap";
import Loading from "../../../_helper/_loading";
import IViewModal from "../../../_helper/_viewModal";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";
import { getApprovalLandingAction } from "./helper";
import { shallowEqual, useSelector } from "react-redux";
import BonusReportView from "./bonusReportView";
import ReactToPrint from "react-to-print";
import "./bonusReport.css";
import { _todayDate } from "../../../_helper/_todayDate";
import { downloadFile } from "../../../_helper/downloadFile";

const initData = {
  status: "0",
};

const BonusReport = () => {
  const [loader, setLoader] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData, setCurrentROwData] = useState([]);
  const [data, setData] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const getLanding = (statusId) => {
    getApprovalLandingAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      statusId,
      setLoader,
      setData
    );
  };

  useEffect(() => {
    getLanding(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const bonusTotal = useCallback(
    data?.reduce((acc, item) => acc + +item?.bonusAmount, 0),
    [data]
  );

  const printRef = useRef();

  return (
    <>
      {loader && <Loading />}
      <ICustomCard title="Bonus Report">
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <>
              <Form className="form form-label-right">
                {console.log("values", values)}
                <div className="row global-form">
                  <div className="col-lg-6">
                    <label className="mr-3">
                      <span style={{ position: "relative", top: "3px" }}>
                        <Field
                          onChange={(e) => {
                            setFieldValue("status", e.target.value);
                            getLanding(e.target.value);
                          }}
                          type="radio"
                          name="status"
                          value="0"
                        />
                      </span>
                      <span className="ml-2">Pending</span>
                    </label>
                    <label className="mr-3">
                      <span style={{ position: "relative", top: "3px" }}>
                        <Field
                          onChange={(e) => {
                            setFieldValue("status", e.target.value);
                            getLanding(e.target.value);
                          }}
                          type="radio"
                          name="status"
                          value="1"
                        />
                      </span>
                      <span className="ml-2">Approved</span>
                    </label>
                    <label>
                      <span style={{ position: "relative", top: "3px" }}>
                        <Field
                          onChange={(e) => {
                            setFieldValue("status", e.target.value);
                            getLanding(e.target.value);
                          }}
                          type="radio"
                          name="status"
                          value="2"
                        />
                      </span>
                      <span className="ml-2">Rejected</span>
                    </label>
                  </div>
                  <div className="col-lg-6 text-right">
                    {data?.length > 0 && (
                      <>
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={(e) =>
                            downloadFile(
                              `/hcm/BonusGenerate/GetBonusGenerateByStatus?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&approveStatusId=${values?.status}&isDownload=true`,
                              "Employee Bonus Report",
                              "xlsx",
                              setLoader
                            )
                          }
                        >
                          Export Excel
                        </button>
                        <ReactToPrint
                          pageStyle={
                            "@media print{body { -webkit-print-color-adjust: exact !important;} .global-table tbody tr td{font-size: 16px !important} .global-table thead tr th {font-size: 16px !important} .bonus-report-print{display : block !important}   .print-none{display : none !important}  @page {size: A4 !important} }}"
                          }
                          trigger={() => (
                            <button
                              type="button"
                              className="ml-1 btn btn-primary"
                            >
                              Print
                            </button>
                          )}
                          content={() => printRef.current}
                        />
                      </>
                    )}
                  </div>
                </div>

                <div ref={printRef}>
                  <div
                    style={{ textAlign: "center", paddingTop: "20px" }}
                    className="bonus-report-print"
                  >
                    <div style={{position: "relative"}}>
                      <h3>{selectedBusinessUnit?.label}</h3>
                      <h4>Employee Bonus Report</h4>
                      <span style={{position: "absolute", right: "0", top: "0"}}>{_todayDate()}</span>
                    </div>
                  </div>

                  <div className="react-bootstrap-table table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Bonus Name</th>
                          <th>Workplace Group</th>
                          <th>Effective Date</th>
                          <th>Bonus Amount</th>
                          <th className="print-none">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.map((item, index) => (
                          <tr>
                            <td style={{ width: "30px" }}>{index + 1}</td>
                            <td>{item?.bonusName}</td>
                            <td>{item?.workPlaceGroupName}</td>
                            <td
                              className="text-center"
                              style={{ width: "160px" }}
                            >
                              {_dateFormatter(item?.effectiveDateTime)}
                            </td>
                            <td
                              className="text-right"
                              style={{ width: "160px" }}
                            >
                              {item?.bonusAmount}
                            </td>
                            <td
                              style={{ width: "35px" }}
                              className="text-center print-none"
                            >
                              <IView
                                clickHandler={() => {
                                  setCurrentROwData(item);
                                  setIsShowModal(true);
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                        {data?.length > 0 && (
                          <tr>
                            <td style={{ width: "30px" }}></td>
                            <td></td>
                            <td></td>
                            <td
                              className="text-left"
                              style={{ width: "160px" }}
                            >
                              <b>Total</b>
                            </td>
                            <td
                              className="text-right"
                              style={{ width: "160px" }}
                            >
                              {bonusTotal}
                            </td>
                            <td
                              style={{ width: "35px" }}
                              className="text-center print-none"
                            ></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <IViewModal
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                  title="View Bonus Report"
                >
                  <BonusReportView
                    values={values}
                    currentRowData={currentRowData}
                  />
                </IViewModal>
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default BonusReport;
