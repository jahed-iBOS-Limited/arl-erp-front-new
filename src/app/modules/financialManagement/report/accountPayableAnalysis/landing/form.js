import { Form, Formik } from "formik";
import React, { useRef } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import AccountPayableAginTable from "./table/accPayableAgain";
import AccountPayableAnalysisTable from "./table/accPayableAnalysis";

const initData = {
  payableType: "",
  reportDate: _todayDate(),
};

export function AccountPayableAnalysis() {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [rowDto, getRowDto, rowDtoLoader,setRowDto] = useAxiosGet();

  const getLadingData = (values) => {
    if (values?.payableType?.value === 1) {
      getRowDto(
        `/fino/BalanceSheet/GetAccountsReceivableAgingReport?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&ReportDate=${values?.reportDate}&ChannelId=0&ReportType=2`
      );
    } else {
      getRowDto(
        `/fino/BalanceSheet/GetPayableAgingReport?businessUnitId=${selectedBusinessUnit?.value}`
      )
    }
  };

  const printRef = useRef();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        onSubmit={() => {}}
      >
        {({ setFieldValue, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Payable Report">
                <CardHeaderToolbar>
                  <div
                    className={
                      rowDto?.length > 0
                        ? `d-flex align-items-center`
                        : "d-none"
                    }
                  >
                    <ReactToPrint
                      pageStyle={
                        "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                      }
                      trigger={() => (
                        <button type="button" className="btn btn-primary mr-2">
                          <i class="fa fa-print pointer" aria-hidden="true"></i>
                          Print
                        </button>
                      )}
                      content={() => printRef.current}
                    />

                    <div>
                      <ReactHTMLTableToExcel
                        id="test-table-xls-button-att-reports"
                        className="btn btn-primary"
                        table={
                          values?.payableType?.value === 1
                            ? "table-to-xlsx"
                            : "table-to-xlsx2"
                        }
                        filename={
                          values?.payableType?.value === 1
                            ? "Account Payable Analysis"
                            : "Account Payable Again"
                        }
                        sheet={
                          values?.payableType?.value === 1
                            ? "Account Payable Analysis"
                            : "Account Payable Again"
                        }
                        buttonText="Export Excel"
                      />
                    </div>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>

              <CardBody>
                <Form className="form form-label-right">
                  {rowDtoLoader && <Loading />}
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="payableType"
                        options={[
                          { label: "Payable Analysis", value: 1 },
                          { label: "Payable Aging", value: 2 },
                        ]}
                        onChange={(valueOption) => {
                          setRowDto([])
                          setFieldValue("payableType", valueOption);
                        }}
                        value={values?.payableType}
                        label="Payable Type"
                      />
                    </div>
                    {
                      values?.payableType?.value === 1 &&  (
                        <div className="col-lg-2">
                      <InputField
                        value={values?.reportDate}
                        label="Report Date"
                        name="reportDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("reportDate", e?.target?.value);
                        }}
                      />
                    </div>
                      )
                    }

                    <div className="col-lg-1 text-right">
                      <ButtonStyleOne
                        label="View"
                        disabled={!values?.payableType}
                        onClick={() => {
                          getLadingData(values);
                        }}
                        style={{ marginTop: "19px" }}
                      />
                    </div>
                  </div>
                </Form>

                {[1]?.includes(values?.payableType?.value) && (
                  <AccountPayableAnalysisTable
                    rowDto={rowDto}
                    values={values}
                    printRef={printRef}
                  />
                )}
                {[2]?.includes(values?.payableType?.value) && (
                  <AccountPayableAginTable
                    rowDto={rowDto}
                    values={values}
                    printRef={printRef}
                  />
                )}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
