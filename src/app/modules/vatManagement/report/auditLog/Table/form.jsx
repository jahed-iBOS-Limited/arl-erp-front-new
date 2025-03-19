import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import PurchaseTable from "./purchaseTable";
import DebitNoteTable from "./debitNoteTable";
import { shallowEqual } from "react-redux";
import {
  GetAuditType_api,
  GetPurchaseLogSummary_api,
  GetDebitNoteLogSummary_api,
  GetSalesLogSummary_api,
  GetCreditNoteLogSummary_api,
  GetTreasuryDepositSummary_api,
} from "../helper";

import Loading from "./../../../../_helper/_loading";
import InputField from "./../../../../_helper/_inputField";
import { _todayDate } from "./../../../../_helper/_todayDate";
import OneLabelModel from "./../oneLabelModel";
import SalesTable from "./salesTable";
import CreditNoteTable from "./creditNoteTable";
import TreasuryDepositTable from "./treasuryDepositTable";
import NewSelect from './../../../../_helper/_select';
import {

  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
// Validation schema
const validationSchema = Yup.object().shape({});
const initData = {
  id: undefined,
  viewType: "",
  toDate: _todayDate(),
  fromDate: _todayDate(),
};

export default function HeaderForm() {
  const [gridData, setGridData] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewTypeDDL, setViewTypeDDL] = useState([]);
  const [isOneLabelModel, setOneLabelModel] = useState(false);
  const [parentRowClickData, setParentRowClickData] = useState("");
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      GetAuditType_api(setViewTypeDDL);
    }
  }, [selectedBusinessUnit, profileData]);

  const commonGridDataFunc = (values) => {
    setGridData([]);
    if (values?.viewType?.value === 1) {
      GetPurchaseLogSummary_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        setGridData,
        setLoading
      );
    } else if (values?.viewType?.value === 3) {
      GetDebitNoteLogSummary_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        setGridData,
        setLoading
      );
    } else if (values?.viewType?.value === 2) {
      GetSalesLogSummary_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        setGridData,
        setLoading
      );
    } else if (values?.viewType?.value === 4) {
      GetCreditNoteLogSummary_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        setGridData,
        setLoading
      );
    } else if (values?.viewType?.value === 5) {
      GetTreasuryDepositSummary_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        setGridData,
        setLoading
      );
    }
  };
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
            {loading && <Loading />}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Transaction Log"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="viewType"
                        options={viewTypeDDL || []}
                        value={values?.viewType}
                        label="View Type"
                        onChange={(valueOption) => {
                          setFieldValue("viewType", valueOption);
                          setGridData([]);
                        }}
                        placeholder="View Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        disabled={!values?.viewType}
                        onClick={() => {
                          commonGridDataFunc(values);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  {gridData?.length > 0 &&
                    (values?.viewType?.value === 1 ? (
                      <PurchaseTable
                        values={values}
                        gridData={gridData}
                        setOneLabelModel={setOneLabelModel}
                        setParentRowClickData={setParentRowClickData}
                      />
                    ) : values?.viewType?.value === 3 ? (
                      <DebitNoteTable
                        values={values}
                        gridData={gridData}
                        setOneLabelModel={setOneLabelModel}
                        setParentRowClickData={setParentRowClickData}
                      />
                    ) : values?.viewType?.value === 2 ? (
                      <SalesTable
                        values={values}
                        gridData={gridData}
                        setOneLabelModel={setOneLabelModel}
                        setParentRowClickData={setParentRowClickData}
                      />
                    ) : values?.viewType?.value === 4 ? (
                      <CreditNoteTable
                        values={values}
                        gridData={gridData}
                        setOneLabelModel={setOneLabelModel}
                        setParentRowClickData={setParentRowClickData}
                      />
                    ) : values?.viewType?.value === 5 ? (
                      <TreasuryDepositTable
                        values={values}
                        gridData={gridData}
                        setOneLabelModel={setOneLabelModel}
                        setParentRowClickData={setParentRowClickData}
                      />
                    ) : null)}

                  {isOneLabelModel && (
                    <OneLabelModel
                      show={isOneLabelModel}
                      onHide={() => {
                        setOneLabelModel(false);
                      }}
                      parentRowClickData={parentRowClickData}
                      values={values}
                    />
                  )}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
