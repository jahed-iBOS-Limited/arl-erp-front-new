import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../_helper/_customCard";
import NewSelect from "../../../_helper/_select";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import RATForm from "../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../_helper/iButton";
import { _firstDateofMonth } from "../../../_helper/_firstDateOfCurrentMonth";
import { _todayDate } from "../../../_helper/_todayDate";
const initData = {
  channel: "",
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  reportView: "",
};
export default function SalesForceBenefitAnalysis() {
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const [showReport, setShowReport] = useState(false);

  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const reportId = `8e3924aa-fb52-4b8b-9fd8-f381cd46f9f0`;
  const parameters = (values) => {
    const params = [
      { name: "intUnitid", value: `${buId}` },
      { name: "intChannelid", value: `${values?.channel?.value}` },
      { name: "dteFromDate", value: `${values?.fromDate}` },
      { name: "dteToDate", value: `${values?.toDate}` },
      { name: "intPartid", value: `${1}` },
      { name: "intLevelid", value: `${0}` },
      { name: "RATZId", value: `${0}` },
      { name: "ReportView", value: `${values?.reportView?.value}` },
    ];

    return params;
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <>
          <ICustomCard title="Sales Force Benefit Analysis">
            <Form>
              <div className="form-group row global-form">
                <RATForm
                  obj={{
                    values,
                    setFieldValue,
                    region: false,
                    area: false,
                    territory: false,
                  }}
                />
                <FromDateToDateForm obj={{ values, setFieldValue }} />
                <div className="col-lg-3">
                  <NewSelect
                    name="reportView"
                    options={[
                      { value: 1, label: "Graph View" },
                      { value: 2, label: "Details View" },
                    ]}
                    value={values?.reportView}
                    label="Select Report View"
                    onChange={(valueOption) => {
                      setFieldValue("reportView", valueOption);
                      setShowReport(false);
                    }}
                    placeholder="Report View"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <IButton
                  onClick={() => {
                    setShowReport(true);
                  }}
                />
              </div>
              {showReport && (
                <PowerBIReport
                  reportId={reportId}
                  groupId={groupId}
                  parameterValues={parameters(values)}
                  parameterPanel={false}
                />
              )}
            </Form>
          </ICustomCard>
        </>
      )}
    </Formik>
  );
}
