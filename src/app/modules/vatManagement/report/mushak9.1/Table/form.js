import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { useSelector } from "react-redux";
import GridData from "./grid";
import { shallowEqual } from "react-redux";
import {
  getSupplyInputputTaxReport,
  getSupplyOutputTaxReport,
  getTaxPayerInformationReport,
  getTaxAdjustmentIncrInfoReport,
  getTaxAdjustmentDecreInfoReport,
  getNoteInfoReport,
  getEmployeeBasicInfoById_Api,
  getTreasuryDepositInfo_api,
  getTaxLedgerSdVat,
  getEmployeeBasicInfoById,
  getPayableSurcharge,
  getTaxLedgerSdVatForNote54,
  getTaxLedgerSdVatForNote52,
  getPenaltyMonth_api,
  CreateMonthlyReturn_api,
  savePostTaxMonthEndNineNineJvApi,
  GetMonthlyReturn_api,
} from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";

import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import InputField from "../../../../_helper/_inputField";

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
  mushakDate: _todayDate(),
  taxBranch: "",
  isRefundYes: false,
  isRefundNo: false,
};

export default function HeaderForm() {
  const [elevenRefund, setElevenRefund] = useState({
    note67: 0,
    note68: 0,
  });
  const [netTaxCalculation, setNetTaxCalculation] = useState({
    note44: 0,
  });
  let allGridData = [];
  const [monthlyReturn, setMonthlyReturn] = useState("");
  const [outputTaxData, setOutputTaxData] = useState([]);
  const [inputTaxData, setInputTaxData] = useState([]);
  const [penaltyMonth, setPenaltyMonth] = useState(0);
  const [isLateReturn65, setLateReturn65] = useState(false);
  const [isAmendReturn66, setAmendReturn66] = useState(false);
  const [taxPayerInfo, setTaxPayerInfo] = useState("");
  const [incrAdjustmentData, setIncrAdjustmentData] = useState([]);
  const [decreAdjustmentData, setDecreAdjustmentData] = useState([]);
  const [noteData, setNoteData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taxDataTable, setTaxDataTable] = useState(false);
  const [employeeBasicInfo, setEmployeeBasicInfo] = useState("");
  const [treasuryDepositInfo, setTreasuryDepositInfo] = useState([]);
  const [taxLedgerSdVat, setTaxLedgerSdVat] = useState([]);
  const [payableSurcharge, setPayableSurcharge] = useState([]);
  const [closingbalance, setClosingbalance] = useState([]);
  const [employeeBasicDetails, setEmployeeBasicDetails] = useState("");
  const [cbLastTax, setCBLastTax] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const commonSetStateEmpty = () => {
    setElevenRefund({
      note67: 0,
      note68: 0,
    });
    setNetTaxCalculation({
      note44: 0,
    });
    setMonthlyReturn([]);
    setTaxPayerInfo("");
    setOutputTaxData([]);
    setInputTaxData([]);
    setIncrAdjustmentData([]);
    setDecreAdjustmentData([]);
  };

  const saveHandler = (values) => {
    const payload = {
      objHeader: {
        accountingId: profileData?.accountId,
        businessunitId: selectedBusinessUnit?.value,
        monthId: +moment(values?.mushakDate).format("M"),
        yearId: +moment(values?.mushakDate).format("YYYY"),
        insertby: profileData?.userId,
        isLateReturn: isLateReturn65 || false,
        isAmendReturn: isAmendReturn66 || false,
      },
      objRowList: allGridData?.map((itm) => {
        const noteNumber = itm.noteNo.split("note_");
        return {
          noteNo: +noteNumber[1] || "",
          value: +itm?.value || 0,
          sd: +itm?.sd || 0,
          vat: +itm?.vat || 0,
        };
      }),
    };

    let vatAmountObj = {
      vat4: 0,
      vat23: 0,
      vat30: 0,
    };

    if (allGridData?.length) {
      allGridData.forEach((itm) => {
        if (itm.noteNo === "note_04") {
          vatAmountObj.vat4 = itm?.value || 0;
        }
        if (itm.noteNo === "note_23") {
          vatAmountObj.vat23 = itm?.value || 0;
        }
        if (itm.noteNo === "note_30") {
          vatAmountObj.vat30 = itm?.vat || 0;
        }
      });
    }
    const payloadTow = {
      accountId: profileData?.accountId,
      bussinessUnitId: selectedBusinessUnit?.value,
      monthName: moment(values?.mushakDate).format("MMMM"),
      yearId: +moment(values?.mushakDate).format("YYYY"),
      vat4: vatAmountObj?.vat4 || 0,
      vat23: vatAmountObj?.vat23 || 0,
      vat30: vatAmountObj?.vat30 || 0,
    };
    savePostTaxMonthEndNineNineJvApi(payloadTow, setLoading, () => {
      CreateMonthlyReturn_api(payload, setLoading, () => {
        commonSetStateEmpty();
      });
    });
  };
  useEffect(() => {
    if (monthlyReturn?.objRowList?.length > 0) {
      setLateReturn65(monthlyReturn?.objHeader?.isLateReturn || false);
      setAmendReturn66(monthlyReturn?.objHeader?.isAmendReturn || false);
    } else {
    }
  }, [monthlyReturn]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Mushak 9.1"}>
                <CardHeaderToolbar>
                  {monthlyReturn?.objRowList?.length > 0 ? null : (
                    <button
                      type="button"
                      className={"btn btn-primary ml-2"}
                      onClick={() => {
                        saveHandler(values);
                      }}
                      disabled={!values?.mushakDate}
                    >
                      Save
                    </button>
                  )}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <label>Date</label>
                      <InputField
                        value={values?.mushakDate}
                        name="mushakDate"
                        placeholder="Mushak Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("mushakDate", e.target.value);
                          commonSetStateEmpty();
                        }}
                      />
                    </div>
                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="taxBranch"
                        options={taxBranchDDL}
                        value={values?.taxBranch}
                        label="Select Tax Branch"
                        onChange={(valueOption) => {
                          setFieldValue("taxBranch", valueOption);
                        }}
                        placeholder="Select Tax Branch"
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setFieldValue("isRefundYes", false);
                          setFieldValue("isRefundNo", false);
                          setTaxDataTable(true);
                          commonSetStateEmpty();
                          GetMonthlyReturn_api(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            moment(values?.mushakDate).format("M"),
                            moment(values?.mushakDate).format("YYYY"),
                            setMonthlyReturn
                          );
                          getPenaltyMonth_api(
                            values?.mushakDate,
                            setPenaltyMonth
                          );
                          getTaxPayerInformationReport(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            setTaxPayerInfo,
                            setLoading
                          );
                          getSupplyOutputTaxReport(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.mushakDate,
                            setOutputTaxData,
                            setLoading
                          );
                          getSupplyInputputTaxReport(
                            values?.mushakDate,
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            setInputTaxData,
                            setLoading
                          );
                          getTaxAdjustmentIncrInfoReport(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.mushakDate,
                            setIncrAdjustmentData,
                            setLoading
                          );
                          getTaxAdjustmentDecreInfoReport(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.mushakDate,
                            setDecreAdjustmentData,
                            setLoading
                          );
                          getNoteInfoReport(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.mushakDate,
                            setNoteData,
                            setLoading
                          );
                          //employeeBasicInfo
                          getEmployeeBasicInfoById_Api(
                            profileData?.employeeId,
                            setEmployeeBasicInfo
                          );
                          getTreasuryDepositInfo_api(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.mushakDate,
                            setTreasuryDepositInfo
                          );
                          getTaxLedgerSdVat(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.taxBranch?.value,
                            moment(values?.mushakDate).format("M"),
                            setTaxLedgerSdVat,
                            setLoading
                          );
                          getEmployeeBasicInfoById(
                            profileData?.userId,
                            setEmployeeBasicDetails
                          );
                          getPayableSurcharge(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.mushakDate,
                            setPayableSurcharge
                          );
                          getTaxLedgerSdVatForNote54(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.taxBranch?.value,
                            values?.mushakDate,
                            setClosingbalance
                          );
                          getTaxLedgerSdVatForNote52(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.taxBranch?.value,
                            moment(values?.mushakDate).format("M"),
                            moment(values?.mushakDate).format("YYYY"),
                            setCBLastTax
                          );
                        }}
                        disabled={!values?.mushakDate}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <GridData
                    outputTaxData={outputTaxData}
                    inputTaxData={inputTaxData}
                    taxPayerInfo={taxPayerInfo}
                    incrAdjustmentData={incrAdjustmentData}
                    decreAdjustmentData={decreAdjustmentData}
                    noteData={noteData}
                    taxLedgerSdVat={taxLedgerSdVat}
                    loading={loading}
                    taxDataTable={taxDataTable}
                    employeeBasicInfo={employeeBasicInfo}
                    treasuryDepositInfo={treasuryDepositInfo}
                    parentValues={values}
                    setFieldValue={setFieldValue}
                    setLoading={setLoading}
                    getTaxLedgerSdVat={getTaxLedgerSdVat}
                    setTaxLedgerSdVat={setTaxLedgerSdVat}
                    employeeBasicDetails={employeeBasicDetails}
                    payableSurcharge={payableSurcharge}
                    closingbalance={closingbalance}
                    cbLastTax={cbLastTax}
                    setElevenRefund={setElevenRefund}
                    elevenRefund={elevenRefund}
                    allGridData={allGridData}
                    netTaxCalculation={netTaxCalculation}
                    setNetTaxCalculation={setNetTaxCalculation}
                    penaltyMonth={penaltyMonth}
                    isLateReturn65={isLateReturn65}
                    setLateReturn65={setLateReturn65}
                    setAmendReturn66={setAmendReturn66}
                    isAmendReturn66={isAmendReturn66}
                    monthlyReturn={monthlyReturn}
                  />
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
