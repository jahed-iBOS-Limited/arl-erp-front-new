import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import axios from "axios";
import { shallowEqual, useSelector } from "react-redux";
import {
  getLCSummaryBasicInformation,
  getLCSummaryCostSummary,
  getShipmentListForLCSummaryReport,
} from "../helper";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { useRef } from "react";
import { getReportHeaderInfo } from "../../costSummary/helper";
import IViewModal from "../../../../_helper/_viewModal";
import { PurchaseOrderViewTableRow } from "../../../../procurement/purchase-management/purchaseOrder/report/tableRow";
import { useHistory } from "react-router-dom";

const TableRow = () => {
  const [loader, setLoader] = useState(false);

  const [basicInformation, setBasicInformation] = useState({});
  const [costSummary, setCostSummary] = useState({});
  const [shipmentDDL, setShipmentDDL] = useState([]);
  // const [poLc, setPoLc] = useState({});
  const [totalLandingCost, setTotalLandingCost] = useState("");
  const [isPrintable, setIsPrintable] = useState(false);
  const [headerInfo, setHeaderInfo] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const history = useHistory();

  const initData = {
    poLc: "",
  };

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const loadPoNumbers = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/imp/ImportCommonDDL/GetPONOLcNoforLCSummeryDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
      )
      .then((res) =>
        res?.data?.map((item) => ({
          label: item?.label,
          value: item?.value,
          PoNo: item?.PONumber,
          lcNumber: item?.LcNumber,
        }))
      );
  };

  const getBasicInformation = (poNo) => {
    getLCSummaryBasicInformation(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      poNo,
      setBasicInformation,
      setLoader
    );
  };

  const getCostSummary = (poNo, shipmentId) => {
    getLCSummaryCostSummary(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      poNo,
      shipmentId,
      setCostSummary,
      setTotalLandingCost,
      setLoader
    );
  };

  useEffect(() => {
    getReportHeaderInfo(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setHeaderInfo
    );
  }, [selectedBusinessUnit, profileData]);

  const printRef = useRef();
  return (
    <>
      {loader && <Loading />}
      <ICustomCard
        title="LC Summary"
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
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({ values, errors, touched, setFieldValue, dirty, isValid }) => (
            <>
              <div className="row global-form">
                <div className="col-lg-3 ">
                  <label>PO/LC No</label>

                  <SearchAsyncSelect
                    selectedValue={values?.poLc}
                    isSearchIcon={true}
                    paddingRight={10}
                    handleChange={(valueOption) => {
                      setFieldValue("poLc", valueOption);
                      if (!valueOption) {
                        setBasicInformation({});
                        setShipmentDDL([]);
                        setFieldValue("shipment", "");
                        setCostSummary({});
                        setTotalLandingCost("");
                      } else {
                        getBasicInformation(valueOption?.label);
                        getShipmentListForLCSummaryReport(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.label,
                          setShipmentDDL
                        );
                        // setPoLc({
                        //   PO: valueOption?.PoNo,
                        //   LC: valueOption?.lcNumber,
                        // });
                      }
                    }}
                    loadOptions={loadPoNumbers || []}
                    placeholder="PO LC No"
                  />
                </div>
                {values?.poLc && (
                  <div className="col-lg-2 pt-5 mt-2">
                    <b>PO Number: </b>
                    <span
                      className="text-primary font-weight-bold cursor-pointer mr-2"
                      style={{ textDecoration: "underline" }}
                      onClick={() => {
                        setIsShowModal(true);
                      }}
                    >
                      {basicInformation?.poNumber
                        ? basicInformation?.poNumber
                        : ""}
                    </span>
                  </div>
                )}
                {values?.poLc && (
                  <div className="col-lg-2 pt-5 mt-2">
                    <b>{`LC Number: ${
                      basicInformation?.lcNumber
                        ? basicInformation?.lcNumber
                        : ""
                    }`}</b>
                  </div>
                )}
              </div>
              <Form className="form form-label-right" ref={printRef}>
                {isPrintable && (
                  <div className="text-center d-none-print">
                    <h2> {headerInfo?.businessUnitName} </h2>
                    <h6> {headerInfo?.businessUnitCode} </h6>
                    <h6> {headerInfo?.businessUnitAddress} </h6>
                  </div>
                )}
                <div className="row">
                  <div className="col-lg-6">
                    <div className="global-form text-center">
                      <b>Basic Information</b>
                    </div>
                    <div className="react-bootstrap-table table-responsive">
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <tbody>
                          <tr>
                            <td className="text-left w-50">Supplier Name</td>
                            <td className="w-50">
                              {basicInformation?.supplierName
                                ? basicInformation.supplierName
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left">Bank Name</td>
                            <td>{basicInformation?.bankName}</td>
                          </tr>
                          <tr>
                            <td className="text-left">LC Number</td>
                            <td>
                              {basicInformation?.lcNumber
                                ? basicInformation?.lcNumber
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left">LC Date</td>
                            <td>{_dateFormatter(basicInformation?.lcDate)}</td>
                          </tr>
                          <tr>
                            <td className="text-left">Inco Terms</td>
                            <td>{basicInformation?.incoTermsName}</td>
                          </tr>
                          <tr>
                            <td className="text-left">Last Shipment Date</td>
                            <td>
                              {_dateFormatter(
                                basicInformation?.lastShipmentDate
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left">Payment Mode</td>
                            <td>{basicInformation?.bankName}</td>
                          </tr>
                          <tr>
                            <td className="text-left">HS Code</td>
                            <td>
                              {basicInformation?.hsCode
                                ? basicInformation.hsCode
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left">Loading Port</td>
                            <td>{basicInformation?.loadingPortName}</td>
                          </tr>
                          <tr>
                            <td className="text-left">Destination Port</td>
                            <td>{basicInformation?.destinationPort}</td>
                          </tr>
                          <tr>
                            <td className="text-left">Tolerance (%)</td>
                            <td>{basicInformation?.tolerance}</td>
                          </tr>
                          <tr>
                            <td className="text-left">Currency</td>
                            <td>{basicInformation?.currency}</td>
                          </tr>
                          <tr>
                            <td className="text-left">Total Invoice Amount</td>
                            <td>
                              {_formatMoney(basicInformation?.invoiceAmount)}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left">Exchange Rate</td>
                            <td>{basicInformation?.exchangeRate}</td>
                          </tr>
                          <tr>
                            <td className="text-left">
                              Total Invoice Amount (BDT)
                            </td>
                            <td>
                              {_formatMoney(
                                basicInformation?.totalInvoiceAmountBDT
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left">LC Length (Quarter)</td>
                            <td>{basicInformation?.lcLength}</td>
                          </tr>
                          <tr>
                            <td className="text-left">
                              Insurance Provider Name:
                            </td>
                            <td>{basicInformation?.insuranceProviderName}</td>
                          </tr>
                          <tr>
                            <td className="text-left">Cover Note number</td>
                            <td>
                              {basicInformation?.coverNoteNumber
                                ? basicInformation.coverNoteNumber
                                : ""}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-left">No of LC Amendments</td>
                            <td>{basicInformation?.noOfLCAmendments}</td>
                          </tr>
                          <tr>
                            <td className="text-left">
                              No of Insurance Amendments:
                            </td>
                            <td>{basicInformation?.noOfInsuranceAmendments}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="global-form text-center">
                      <b>COST SUMMARY (BDT) </b>
                    </div>
                    <div className="react-bootstrap-table table-responsive">
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <tbody>
                          <tr className="global-form">
                            <td>
                              <b>Select Shipment</b>
                            </td>
                            <td>
                              <NewSelect
                                name="shipment"
                                options={shipmentDDL || []}
                                value={values?.shipment}
                                onChange={(valueOption) => {
                                  setFieldValue("shipment", valueOption);
                                  if (!valueOption) {
                                    setCostSummary({});
                                    setTotalLandingCost("");
                                  } else {
                                    getCostSummary(
                                      values?.poLc?.label,
                                      valueOption?.value
                                    );
                                  }
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>BL/AWB/TR No</td>
                            <td>
                              <span
                                className="text-primary font-weight-bold cursor-pointer mr-2"
                                style={{
                                  textDecoration: "underline",
                                }}
                                onClick={() => {
                                  history.push({
                                    pathname: `/managementImport/transaction/shipment/view/${costSummary?.shipmentId}`,
                                    state: {
                                      ...costSummary,
                                      checkbox: "shipmentInformation",
                                      ponumber: basicInformation?.poNumber
                                        ? basicInformation?.poNumber
                                        : "",
                                      lcnumber: basicInformation?.lcNumber
                                        ? basicInformation?.lcNumber
                                        : "",
                                    },
                                  });
                                }}
                              >
                                {costSummary?.blawbtrNo
                                  ? costSummary?.blawbtrNo
                                  : ""}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>BL/AWB/TR Date</td>
                            <td>{_dateFormatter(costSummary?.blawbtrDate)}</td>
                          </tr>
                          <tr>
                            <td>LC Opening Charge</td>
                            <td className="text-right">
                              {costSummary?.lcOpeningCharge}
                            </td>
                          </tr>
                          <tr>
                            <td>Insurance Policy</td>
                            <td className="text-right">
                              {costSummary?.insurancePolicy}
                            </td>
                          </tr>
                          <tr>
                            <td>Total Doc Release Charges</td>
                            <td className="text-right">
                              {costSummary?.totalDocReleaseCharges}
                            </td>
                          </tr>
                          <tr>
                            <td>Payment on Maturity</td>
                            <td className="text-right">
                              {costSummary?.paymentOnMaturity}
                            </td>
                          </tr>
                          <tr>
                            <td>PG</td>
                            <td className="text-right">
                              {costSummary?.pgAmount}
                            </td>
                          </tr>
                          <tr>
                            <td>Customs Duty and Taxes</td>
                            <td className="text-right">
                              {costSummary?.customDutyandTaxes}
                            </td>
                          </tr>
                          <tr>
                            <td>Port Charges</td>
                            <td className="text-right">
                              {costSummary?.portCharges}
                            </td>
                          </tr>
                          <tr>
                            <td>Shipping Charges</td>
                            <td className="text-right">
                              {costSummary?.shippingCharges}
                            </td>
                          </tr>
                          <tr>
                            <td>Transport Charges</td>
                            <td className="text-right">
                              {costSummary?.transportCharges}
                            </td>
                          </tr>
                          <tr>
                            <td>C&F Charges</td>
                            <td className="text-right">
                              {costSummary?.cnFCharges}
                            </td>
                          </tr>
                          <tr>
                            <td>Survey Charges</td>
                            <td className="text-right">
                              {costSummary?.surveyCharges}
                            </td>
                          </tr>
                          <tr>
                            <td>Cleaning Charges</td>
                            <td className="text-right">
                              {costSummary?.cleaningCharges}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <b>Total Landing Cost</b>
                            </td>
                            <td className="text-right">
                              <b>{_formatMoney(totalLandingCost)}</b>
                            </td>
                          </tr>{" "}
                          {/* </>
                        ) : (
                          <>
                            {" "}
                            <tr>
                              <td>BL/AWB/TR No</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>BL/AWB/TR Date</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>LC Opening Charge</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>Insurance Policy</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>Total Doc Release Charges</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>Payment on Maturity</td>
                              <td>10,029,009.4548</td>
                            </tr>
                            <tr>
                              <td>PG</td>
                              <td>10,029,009.4548</td>
                            </tr>
                            <tr>
                              <td>Custome Duty and Taxes</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>Port Charges</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>Shipping Charges</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>Transport Charges</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>C&F Charges</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>Survey Charges</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>Cleaning Charges</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>
                                <b>Total Landing Cost</b>
                              </td>
                              <td>
                                <b>{totalLandingCost}</b>
                              </td>
                            </tr>{" "}
                          </>
                        )} */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <IViewModal
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                  title="View Purchase Order"
                >
                  <PurchaseOrderViewTableRow
                    poId={basicInformation?.poId}
                    orId={basicInformation?.poTypeId}
                    isHiddenBackBtn={true}
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

export default TableRow;
