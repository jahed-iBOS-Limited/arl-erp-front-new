import { Formik } from "formik";
import React, { useState } from "react";
import ICard from "../../../_helper/_card";
import InputField from "../../../_helper/_inputField";
import { _todayDate } from "../../../_helper/_todayDate";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import IButton from "../../../_helper/iButton";

const initData = {
  date: _todayDate(),
};

function FundRegisterLanding() {
  const [showReport, setShowReport] = useState(false);

  const groupId = "218e3d7e-f3ea-4f66-8150-bb16eb6fc606";
  const reportId = "1c58a47c-1783-438c-ac3c-f718a2bbb13a";

  const parameterValues = (values) => {
    return [{ name: "dteDate", value: `${values?.date}` }];
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <ICard title="Fund Register">
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    placeholder="Date"
                    type="date"
                    name="date"
                    onChange={(e) => {
                      setFieldValue("date", e.target.value);
                      setShowReport(false);
                    }}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReport(true);
                    }}
                    className="btn btn-primary"
                  >
                    View
                  </button>
                </div>
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
          </ICard>
        )}
      </Formik>
    </>
  );
}

export default FundRegisterLanding;
