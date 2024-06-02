import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import NewSelect from "../../../../../_helper/_select";
import IInput from "../../../../../_helper/_inputField";
import { useEffect } from "react";
import { getBankBranchDDL, getBankDDL } from "../../helper";
import { useHistory } from "react-router-dom";
import { getBankAc } from "../../../../financials/bankJournal/helper";
import InputField from "../../../../../_helper/_inputField";
import { toast } from "react-toastify";

const fdrRegister = Yup.object().shape({
  bank: Yup.object()
    .shape({
      label: Yup.string().required("Bank is required"),
      value: Yup.string().required("Bank is required"),
    })
    .nullable(),
  bankBranch: Yup.object()
    .shape({
      label: Yup.string().required("Branch is required"),
      value: Yup.string().required("Branch is required"),
    })
    .nullable(),
  // bankAccount: Yup.object()
  //   .shape({
  //     label: Yup.string().required("Bank Account is required"),
  //     value: Yup.string().required("Bank Account is required"),
  //   })
  //   .nullable(),
  principle: Yup.string().required("Priciple is required"),
  interestRate: Yup.number().required("Interest Rate is required"),
  fdrNo: Yup.string().required("FDR No is required"),
  openingDate: Yup.date().required("Opening Date is required"),
  termDays: Yup.number().required("Term Days is required"),
});

export default function FdrForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  oldPrincipal,
  setLoading,
}) {
  const history = useHistory();
  const [bankDDL, setBankDDL] = useState([]);
  const [bankAccountDDL, setBankAccountDDL] = useState([]);
  const [bankBranchDDL, setBankBranchDDL] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getBankDDL(setBankDDL, setLoading);
    if (profileData.accountId && selectedBusinessUnit.value) {
      getBankAc(
        profileData.accountId,
        selectedBusinessUnit.value,
        setBankAccountDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const setPrincipal = (setFieldValue, ait, exDuty, interest) => {
    const newPrincipal =
      Number(oldPrincipal) + Number(interest) - Number(ait) - Number(exDuty);
    setFieldValue("principle", newPrincipal || 0);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={fdrRegister}
        onSubmit={(values, { resetForm }) => {
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
        }) => (
          <>
            <Form className="form form-label-right">
              {isEdit ? (
                <div className="form-group  global-form">
                  <h6>
                    <strong>Closing Information</strong>
                  </h6>
                  <div className="row">
                    <div className="col-lg-3">
                      <InputField
                        label="AIT"
                        value={values?.ait}
                        name="ait"
                        type="number"
                        onChange={(e) => {
                          if (+e.target.value < 0)
                            return toast.warn("AIT can't be less than zero");
                          setFieldValue("ait", e.target.value);
                          setPrincipal(
                            setFieldValue,
                            +e.target.value,
                            values?.exDuty || 0,
                            values?.interest || 0
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Excise Duty"
                        value={values?.exDuty}
                        name="exDuty"
                        type="number"
                        onChange={(e) => {
                          if (+e.target.value < 0)
                            return toast.warn("Excise can't be less than zero");
                          setFieldValue("exDuty", e.target.value);
                          setPrincipal(
                            setFieldValue,
                            values?.ait || 0,
                            +e.target.value,
                            values?.interest || 0
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Interest"
                        value={values?.interest}
                        name="interest"
                        type="number"
                        onChange={(e) => {
                          if (+e.target.value < 0)
                            return toast.warn("Interest can't less than zero");
                          setFieldValue("interest", e.target.value);
                          setPrincipal(
                            setFieldValue,
                            values?.ait || 0,
                            values?.exDuty || 0,
                            +e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="row global-form h-100">
                <div className="col-lg-3">
                  <NewSelect
                    name="bank"
                    options={bankDDL}
                    value={values?.bank}
                    onChange={(valueOption) => {
                      setFieldValue("bank", valueOption);
                      setFieldValue("bankBranch", "");

                      getBankBranchDDL(
                        valueOption?.value,
                        setBankBranchDDL,
                        setLoading
                      );
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
                    options={bankBranchDDL}
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
                <div className="col-lg-3">
                  <NewSelect
                    name="bankAccount"
                    options={bankAccountDDL}
                    value={values?.bankAccount}
                    onChange={(valueOption) => {
                      setFieldValue("bankAccount", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    // isDisabled={isEdit}
                    label="Bank Account (Optional)"
                    placeholder="Bank Account"
                  />
                </div>

                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>FDR No</label>
                  <IInput
                    value={values?.fdrNo}
                    name="fdrNo"
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
                  />
                </div>

                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Principal</label>
                  <IInput
                    value={values?.principle}
                    name="principle"
                    disabled={isEdit}
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
