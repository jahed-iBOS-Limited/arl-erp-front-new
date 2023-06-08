import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import IButton from "../../../_helper/iButton";
import ICustomCard from "../../../_helper/_customCard";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  type: "",
};

const typeList = [
  { value: 7, label: "Unload Bill" },
  { value: 8, label: "Day & Category Base Labor Cost" },
  { value: 9, label: "Day & Vehicle Category Base Trip Status" },
  { value: 10, label: "Day & Vehicle Base Trip Status" },
  { value: 11, label: "Driver Base Trip Status" },
  { value: 12, label: "Detail Statement" },
];

const TripCostStatement = () => {
  const [showReport, setShowReport] = useState(false);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);


  const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";
  const reportId = "6224c485-84f3-4916-b3fb-6d16297c26a9";

  const parameterValues = (values) => {
    return [
      { name: "intPartid", value: `${values?.type?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
      {name: "Bunit", value: `${selectedBusinessUnit?.value}`},
    ];
  };

  return (
    <Formik enableReinitialize={true} initialValues={initData}>
      {({ values, setFieldValue }) => (
        <ICustomCard title="Vehicle Trip">
          <form className="form form-label-right">
            <div className="form-group row global-form">
              <div className="col-lg-3">
                <NewSelect
                  name="type"
                  options={typeList}
                  value={values?.type}
                  label="Type"
                  onChange={(valueOption) => {
                    setFieldValue("type", valueOption);
                    setShowReport(false);
                  }}
                  placeholder="Type"
                />
              </div>
              <FromDateToDateForm
                obj={{
                  values,
                  setFieldValue,
                  onChange: () => {
                    setShowReport(false);
                  },
                }}
              />
              <IButton
                colSize={"col-lg-3"}
                onClick={() => {
                  setShowReport(true);
                }}
              />
            </div>
          </form>
          {showReport && (
            <PowerBIReport
              reportId={reportId}
              groupId={groupId}
              parameterValues={parameterValues(values)}
              parameterPanel={false}
            />
          )}
        </ICustomCard>
      )}
    </Formik>
  );
};

export default TripCostStatement;
