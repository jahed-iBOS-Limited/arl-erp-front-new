import { Formik } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import AttachFile from "../../../../_helper/commonInputFieldsGroups/attachemntUpload";
import IButton from "../../../../_helper/iButton";

export default function _Form({ obj }) {
  const {
    title,
    initData,
    testTypes,
    saveHandler,
    projectTypes,
    performPlaces,
    setUploadedImage,
  } = obj;
  const history = useHistory();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, resetForm }) => (
          <ICustomCard
            title={title}
            backHandler={() => {
              history.goBack();
            }}
            resetHandler={() => {
              resetForm(initData);
            }}
            saveHandler={() => {
              saveHandler(values, () => {
                resetForm();
              });
            }}
            saveDisabled={false}
          >
            <form className="form form-label-right">
              <div className="row global-form global-form-custom">
                <div className="col-lg-3">
                  <NewSelect
                    name="projectType"
                    options={projectTypes || []}
                    value={values?.projectType}
                    label="Project Type"
                    onChange={(valueOption) => {
                      setFieldValue("projectType", valueOption);
                    }}
                    placeholder="Project Type"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="testType"
                    options={testTypes || []}
                    value={values?.testType}
                    label="Test Type"
                    onChange={(valueOption) => {
                      setFieldValue("testType", valueOption);
                    }}
                    placeholder="Test Type"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="testPerformPlace"
                    options={performPlaces || []}
                    value={values?.testPerformPlace}
                    label="Test Perform Place"
                    onChange={(valueOption) => {
                      setFieldValue("testPerformPlace", valueOption);
                    }}
                    placeholder="Test Perform Place"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.testDate}
                    name="testDate"
                    placeholder="Test Date"
                    label="Test Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.quantity}
                    name="quantity"
                    placeholder="Quantity"
                    label="Quantity"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("quantity", e?.target?.value);
                      const amount = e?.target?.value * values?.rate;
                      setFieldValue("amount", amount);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.rate}
                    name="rate"
                    placeholder="Rate"
                    label="Rate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("rate", e?.target?.value);
                      const amount = e?.target?.value * values?.quantity;
                      setFieldValue("amount", amount);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.amount}
                    name="amount"
                    placeholder="Amount"
                    label="Amount"
                    type="number"
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.remark}
                    name="remark"
                    placeholder="Remark"
                    label="Remark"
                  />
                </div>
                <IButton
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Attach File
                </IButton>
                <AttachFile obj={{ open, setOpen, setUploadedImage }} />
              </div>
            </form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
