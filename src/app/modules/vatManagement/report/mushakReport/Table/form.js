/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import InputField from "./../../../../_helper/_inputField";
import { useSelector } from "react-redux";
import GridData from "./grid";
import { shallowEqual } from "react-redux";

import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";

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
  getTaxBranchDDL,
  getEmployeeBasicInfoById,
  getPayableSurcharge,
  getTaxLedgerSdVatForNote54,
  getTaxLedgerSdVatForNote52,
} from "../helper";
import { _todayDate } from "./../../../../_helper/_todayDate";
import NewSelect from "./../../../../_helper/_select";

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
  const [outputTaxData, setOutputTaxData] = useState([]);
  const [inputTaxData, setInputTaxData] = useState([]);
  const [taxPayerInfo, setTaxPayerInfo] = useState("");
  const [incrAdjustmentData, setIncrAdjustmentData] = useState([]);
  const [decreAdjustmentData, setDecreAdjustmentData] = useState([]);
  const [noteData, setNoteData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taxDataTable, setTaxDataTable] = useState(false);
  const [employeeBasicInfo, setEmployeeBasicInfo] = useState("");
  const [treasuryDepositInfo, setTreasuryDepositInfo] = useState([]);
  const [taxBranchDDL, setTaxBranchDDL] = useState([]);
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

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getTaxBranchDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Mushak 9.1"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <label>Mushak-9.1 : No</label>
                      <InputField
                        value={values?.mushakDate}
                        name="mushakDate"
                        placeholder="Mushak Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3">
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
                    </div>
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setTaxDataTable(true);
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
                            _todayDate(),
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
                        disabled={!values?.mushakDate || !values?.taxBranch}
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
