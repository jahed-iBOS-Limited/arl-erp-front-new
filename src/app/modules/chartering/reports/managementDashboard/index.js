import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import IForm from "./../../../_helper/_form";

export default function ManagementDashboard() {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [show, setShow] = useState(false);

  const getReportId = (values) => {
    if (values?.reportType?.value === 1) {
      return "36acdf46-2d4e-44f4-916b-9e4bdca932d0";
    } else if (values?.reportType?.value === 2) {
      return "d7999c8d-ce78-4257-9904-647491d6caac";
    } else if (values?.reportType?.value === 3) {
      return "c98e8d68-3a19-46b0-bf33-6a81b283be46";
    } else if (values?.reportType?.value === 4) {
      return "8e00fbd8-95b9-49ba-85b1-9f03487a9576";
    }
    return "";
  };

  const getGroupId = (values) => {
    return "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";
  };

  const parameterValues = (values) => {
    const commonParam = [
      { name: "intUnitId", value: selectedBusinessUnit?.value?.toString() },
      { name: "ProfitCenterId", value: "0" },
      { name: "ControlUnitId", value: "0" },
      { name: "ProficCenterGroupId", value: "0" },
      { name: "dteFromDate", value: values?.fromDate },
      { name: "dteToDate", value: values?.toDate },
    ];
    const paramThree = [
      { name: "fromDate", value: values?.fromDate },
      { name: "toDate", value: values?.toDate },
    ];
    if ([1, 2, 4].includes(values?.reportType?.value)) {
      return commonParam;
    } else if ([3].includes(values?.reportType?.value)) {
      return paramThree;
    }
    return [];
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          <IForm
            title="Management Dashboard"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="reportType"
                      options={[
                        { value: 1, label: "Shipping Crew Report" },
                        { value: 2, label: "Shipping FGV Tech Report" },
                        { value: 3, label: "Shipping Vessel Certification" },
                        {
                          value: 4,
                          label: "Shipping Profit Cost Center Report",
                        },
                      ]}
                      value={values?.reportType}
                      label="Report Type"
                      onChange={(valueOption) => {
                        setFieldValue("reportType", valueOption || "");
                        setShow(false);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                        setShow(false);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      name="toDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                        setShow(false);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <button
                      onClick={() => {
                        setShow(true);
                      }}
                      type="button"
                      className="btn btn-primary mt-5"
                    >
                      Show
                    </button>
                  </div>
                </div>
                {show && (
                  <div className="mt-5">
                    <PowerBIReport
                      reportId={getReportId(values)}
                      groupId={getGroupId(values)}
                      parameterValues={parameterValues(values)}
                      parameterPanel={false}
                    />
                  </div>
                )}
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
