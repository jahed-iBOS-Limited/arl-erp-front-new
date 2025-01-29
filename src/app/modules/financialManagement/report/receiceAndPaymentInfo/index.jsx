/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../_helper/_customCard";
import { _firstDateofMonth } from "../../../_helper/_firstDateOfCurrentMonth";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import IButton from "../../../_helper/iButton";
import { getBusinessUnitDDL } from "../cashRegisterReport/Form/helper";

const ReceiveAndPaymentInfoReport = () => {
  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const reportId = `8a46173c-e907-43e3-98d7-c186ed1573ff`;

  const [showReport, setShowReport] = React.useState(false);

  const initData = {
    businessUnit:{value: 0, label: 'All'},
    fromDate: _firstDateofMonth(),
    toDate: _todayDate(),
    viewType: "",
  };
  const {
    profileData: { accountId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  useEffect(() => {
    getBusinessUnitDDL(accountId, (businessUnitDDLData) => {
      setBusinessUnitDDL(businessUnitDDLData);
    });
  }, [accountId]);
  const parameterValues = (values) => {
    return [
      { name: "BUnit", value: `${values?.businessUnit?.value || 0}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
      { name: "ViewType", value: `${+values?.viewType?.value}` },
    ];
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <ICustomCard title="Receive And Payment Info">
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-md-3">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitDDL || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                      setShowReport(false);
                    }}
                    placeholder="Business Unit"
                  />
                </div>
                <div className="col-md-3">
                  <NewSelect
                    name="viewType"
                    options={[
                      { value: 1, label: "Top Sheet" },
                      { value: 2, label: "Details" },
                      { value: 3, label: "Cash at Bank" },
                    ]}
                    label="View Type"
                    value={values?.viewType}
                    onChange={(valueOption) => {
                      setFieldValue("viewType", valueOption);
                      setShowReport(false);
                    }}
                    placeholder="View Type"
                  />
                </div>{" "}
                <FromDateToDateForm
                  obj={{
                    values,
                    setFieldValue,
                    onChange: () => setShowReport(false),
                    colSize:"col-md-2"
                  }}
                />
                <IButton
                  colSize={"col-md-1"}
                  onClick={() => {
                    setShowReport(false);
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
    </>
  );
};

export default ReceiveAndPaymentInfoReport;
