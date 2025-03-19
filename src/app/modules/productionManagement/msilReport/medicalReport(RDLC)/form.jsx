import React from "react";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { shallowEqual, useSelector } from "react-redux";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import Loading from "../../../_helper/_loading";
import { Form, Formik } from "formik";
import "./style.css";
import IForm from "../../../_helper/_form";

const MedicalReportRDLC = () => {
  const reportId = `46be6d6c-f1e9-4696-b95d-0d29a0b1e76a`;
  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const saveHandler = (values, cb) => { };
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit
  }, shallowEqual)

  const parameterValues = (values) => {
    return [
      { name: "Bunit", value: selectedBusinessUnit?.value?.toString() }
    ];
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm();
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
          {console.log("values", values)}
          <IForm
            title="Medical Register Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
            }}
          >
            <Form>
              <>
                <PowerBIReport
                  reportId={reportId}
                  groupId={groupId}
                  parameterValues={parameterValues(values)}
                  parameterPanel={true}
                />
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default MedicalReportRDLC;
