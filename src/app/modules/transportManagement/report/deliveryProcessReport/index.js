import { Form, Formik } from "formik";
import React, { useState } from "react";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import IButton from "../../../_helper/iButton";
import {
  groupId,
  initData,
  selectParameters,
  selectReportId,
  validationSchema,
} from "./helper";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import { shallowEqual, useSelector } from "react-redux";

const DeliveryProcessReportPage = () => {
  // get selected business unit from store
  const {
    selectedBusinessUnit: { value: buUnId },
  } = useSelector((state) => state.authData, shallowEqual);

  // state
  const [showReport, setShowReport] = useState(false);
  // save handler
  const saveHandler = (values, cb) => {
    setShowReport(true);
    cb && cb();
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
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
          {false && <Loading />}
          <IForm
            title="Delivery Process Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDateTime}
                    label="From Date Time"
                    name="fromDateTime"
                    type="datetime-local"
                    onChange={(e) => {
                      setFieldValue("fromDateTime", e.target.value);
                      setShowReport(false);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.toDateTime}
                    label="To Date Time"
                    name="toDateTime"
                    type="datetime-local"
                    onChange={(e) => {
                      setFieldValue("toDateTime", e.target.value);
                      setShowReport(false);
                    }}
                  />
                </div>
                <div class="col-lg-1">
                  <IButton onClick={handleSubmit} disabled={false} />
                </div>
              </div>
            </Form>

            {showReport && (
              <PowerBIReport
                reportId={selectReportId["rdl"]}
                groupId={groupId}
                parameterValues={selectParameters(values, buUnId)}
                parameterPanel={false}
              />
            )}
          </IForm>
        </>
      )}
    </Formik>
  );
};
export default DeliveryProcessReportPage;
