import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import NewSelect from "../../../../../_helper/_select";
import IInput from "../../../../../_helper/_inputField";
import { useEffect } from "react";
import { getBankDDL } from "../../helper";
import { useHistory } from "react-router-dom";

const fdrRegister = Yup.object().shape({
  bank: Yup.object().shape({
    label: Yup.string().required("Bank is required"),
    value: Yup.string().required("Bank is required"),
  }),
});

export default function FdrViewForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  setLoading,
}) {
  const history = useHistory();
  const [bankDDL, setBankDDL] = useState([]);

  useEffect(() => {
    getBankDDL(setBankDDL, setLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={fdrRegister}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            history.push("/financial-management/banking/fdr-register");
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
            <Form className="form form-label-right">
              {console.log("values", values)}

              <div className="row global-form h-100">
                <div className="col-lg-3">
                  <NewSelect
                    name="bank"
                    options={bankDDL}
                    value={values?.bank}
                    onChange={(valueOption) => {
                      setFieldValue("bank", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                    label="Bank"
                    placeholder="Bank"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="bankBranch"
                    options={[]}
                    value={values?.bankBranch}
                    onChange={(valueOption) => {
                      setFieldValue("bankBranch", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                    label="Branch"
                    placeholder="Branch"
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>FDR No</label>
                  <IInput
                    value={values?.fdrNo}
                    name="loanAccNo"
                    placeholder="FDR No"
                    onChange={(e) => {
                      setFieldValue("fdrNo", e.target.value);
                    }}
                    type="string"
                    disabled={isEdit}
                  />
                </div>
                <div className="col-lg-2">
                  <label>Opening Date</label>
                  <IInput
                    value={values?.openingDate}
                    name="openingDate"
                    placeholder="Date"
                    type="date"
                    disabled={isEdit}
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Term (Days)</label>
                  <IInput
                    value={values?.termDays}
                    name="termDays"
                    placeholder="Term (Days)"
                    onChange={(e) => {
                      if (e.target.value > 0) {
                        setFieldValue("termDays", e.target.value);
                      } else {
                        setFieldValue("termDays", "");
                      }
                    }}
                    type="number"
                    min="0"
                    step="any"
                    disabled={isEdit}
                  />
                </div>

                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Principal</label>
                  <IInput
                    value={values?.principle}
                    name="principle"
                    placeholder="Priciple"
                    onChange={(e) => {
                      if (e.target.value > 0) {
                        setFieldValue("principle", e.target.value);
                      } else {
                        setFieldValue("principle", "");
                      }
                    }}
                    type="number"
                    min="0"
                    step="any"
                    disabled={isEdit}
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Interest Rate</label>
                  <IInput
                    value={values?.interestRate}
                    name="interestRate"
                    placeholder="Interest Rate"
                    onChange={(e) => {
                      if (e.target.value > 0) {
                        setFieldValue("interestRate", e.target.value);
                      } else {
                        setFieldValue("interestRate", "");
                      }
                    }}
                    type="number"
                    min="0"
                    step="any"
                    disabled={isEdit}
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Lean To</label>
                  <IInput
                    value={values?.leanTo}
                    name="leanTo"
                    placeholder="Lean To"
                    onChange={(e) => {
                      setFieldValue("leanTo", e.target.value);
                    }}
                    type="string"
                    disabled={isEdit}
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
