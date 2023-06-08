import { Formik, Form } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import {
  getAccRcvAnalysisLandingData,
  getDistributionChannels,
} from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import NewSelect from "../../../../_helper/_select";

import AccRcvAnalysisTable from "./table/accRcvAnalysisTable";
import ReactToPrint from "react-to-print";

const initData = {
  reportDate: _todayDate(),
  reportType: { value: 1, label: "Accounts Receivable Analysis" },
  channel: "",
};

export function PartnerAccAnalysisLanding() {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  // const [reportTypeDDL] = useState([
  //   { value: 1, label: "Accounts Receivable Analysis" },
  //   { value: 2, label: "Accounts Payable Analysis" },
  //   { value: 3, label: "Inventory Analysis" },
  // ]);

  const [channelDDL, setChannelDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDistributionChannels(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setChannelDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const getLadingData = (values) => {
    // switch (values.reportType.value) {
    //   case 1:
    getAccRcvAnalysisLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.channel?.value,
      values?.reportDate,
      setLoading,
      setRowDto
    );
    //     break;

    //   default:
    //     break;
    // }
  };

  const printRef = useRef();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        onSubmit={() => {}}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Receivable Analysis">
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
                        filename="Account Receivable Analysis"
                        sheet="Account Receivable Analysis"
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
                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="reportType"
                        options={reportTypeDDL || []}
                        value={values?.reportType}
                        label="Report Type"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setFieldValue("reportType", valueOption);
                        }}
                        placeholder="Report Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}
                    <div className="col-lg-3">
                      <NewSelect
                        name="channel"
                        options={
                          [{ value: 0, label: "All" }, ...channelDDL] || []
                        }
                        value={values?.channel}
                        label="Distribution Channel"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setFieldValue("channel", valueOption);
                        }}
                        placeholder="Distribution Channel"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

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
                        disabled={!values?.channel}
                      />
                    </div>
                  </div>
                </Form>

                {/* {values?.reportType?.value === 1 ? ( */}
                <AccRcvAnalysisTable
                  rowDto={rowDto}
                  values={values}
                  printRef={printRef}
                />
                {/* ) : null} */}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
