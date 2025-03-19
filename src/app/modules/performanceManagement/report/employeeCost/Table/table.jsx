import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import ICard from "../../../../_helper/_card";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  channel: "",
  region: "",
  area: "",
  territory: "",
  zone: "",
};

const reportTypeList = [{ value: 1, label: "Salesforce KPI" }];

export default function EmployeeCostReport() {
  const printRef = useRef();

  const PBIReport = (values) => {
    return [1].includes(values?.reportType?.value);
  };
  const [biReport, setBIReport] = useState(false);

  // get user data from store
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const reportId = `d70d26a4-a2f0-41e7-910f-9d3ce2377fc9`;

  const parameterValues = (values) => {
    return [
      { name: "intunit", value: `${buId}` },
      { name: "intchannelid", value: `${values?.channel?.value}` },
      { name: "RegionId", value: `${values?.region?.value}` },
      { name: "fromdate", value: `${values?.fromDate}` },
      { name: "todate", value: `${values?.toDate}` },
      { name: "AreaId", value: `${values?.area?.value}` },
      { name: "TerritoryId", value: `${values?.territory?.value}` },
      { name: "ZoneId", value: `${values?.zone?.value}` },
    ];
  };

  return (
    <ICard
      printTitle="Print"
      title="Employee Cost"
      isPrint={true}
      isShowPrintBtn={true}
      componentRef={printRef}
      pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
    >
      <div ref={printRef}>
        <div className="mx-auto">
          <Formik
            enableReinitialize={true}
            initialValues={initData}
            onSubmit={() => {}}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <>
                <Form className="form form-label-right">
                  <div className="form-group row global-form printSectionNone">
                    <div className="col-lg-3">
                      <NewSelect
                        name="reportType"
                        options={reportTypeList}
                        value={values?.reportType}
                        label="Report Type"
                        onChange={(valueOption) => {
                          setBIReport(false);
                          setFieldValue("reportType", valueOption);
                        }}
                        placeholder="Report Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {values?.reportType?.value === 1 && (
                      <>
                        <RATForm
                          obj={{
                            values,
                            setFieldValue,
                            zone: true,
                            onChange: () => {
                              setBIReport(false);
                            },
                          }}
                        />
                        <FromDateToDateForm
                          obj={{
                            values,
                            setFieldValue,
                            onChange: () => {
                              setBIReport(false);
                            },
                          }}
                        />
                      </>
                    )}

                    <div className="col-lg-2 mt-6">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          if (PBIReport(values)) {
                            setBIReport(true);
                          }
                        }}
                        disabled={!values?.reportType?.value}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </Form>

                {/* show power BI reports */}
                {PBIReport(values) && biReport ? (
                  <PowerBIReport
                    reportId={reportId}
                    groupId={groupId}
                    parameterPanel={false}
                    parameterValues={parameterValues(values)}
                  />
                ) : null}
              </>
            )}
          </Formik>
        </div>
      </div>
    </ICard>
  );
}

// sr: same as http://localhost:3000/sales-management/report/salesReportEssential
