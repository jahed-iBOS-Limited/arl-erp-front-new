import { Formik, Form } from "formik";
import React, { useRef, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { getAccountPayableAnalysisData } from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import AccountPayableAnalysisTable from "./table/accPayableAnalysis";
import ReactToPrint from "react-to-print";

const initData = {
  reportDate: _todayDate(),
};

export function AccountPayableAnalysis() {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLadingData = (values) => {
    getAccountPayableAnalysisData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.reportDate,
      setLoading,
      setRowDto
    );
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
              <CardHeader title="Payable Analysis">
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
                        table={"table-to-xlsx"}
                        filename="Account Payable Analysis"
                        sheet="Account Payable Analysis"
                        buttonText="Export Excel"
                      />
                    </div>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>

              <CardBody>
                <Form className="form form-label-right">
                  {loading && <Loading />}
                  <div className="row global-form">
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

                    <div className="col-lg-1 text-right">
                      <ButtonStyleOne
                        label="View"
                        onClick={() => {
                          getLadingData(values);
                        }}
                        style={{ marginTop: "19px" }}
                      />
                    </div>
                  </div>
                </Form>

                <AccountPayableAnalysisTable
                  rowDto={rowDto}
                  values={values}
                  printRef={printRef}
                />
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
