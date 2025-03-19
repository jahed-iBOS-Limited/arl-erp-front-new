/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import NewSelect from './../../../../_helper/_select';

// Validation schema for bank transfer
const validationSchema = Yup.object().shape({
  transportRouteCostComponent: Yup.string().required("Component Name required"),
});

export default function _Form({ initData, btnRef, saveHandler, resetBtnRef }) {
  const [valid, setValid] = useState(true);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setValid(false);
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="global-form from-label-right">
              <div className="form-group row">
                <div className="col-lg-3 pl pr-1 mb-1 h-narration border-gray">
                  <IInput
                    value={values?.transportRouteCostComponent || ""}
                    label="Cost Component"
                    name="transportRouteCostComponent"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="generalLedger"
                    options={[]}
                    value={values?.generalLedger}
                    label="General Ledger"
                    onChange={(valueOption) => {
                      setFieldValue("generalLedger", valueOption);
                    }}
                    placeholder="General Ledger"
                    errors={errors}
                    touched={touched}
              
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
