import React, { useEffect } from "react";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

export default function BankGuarantee({
  values,
  setFieldValue,
  errors,
  touched,
  bankDDL,
  branchDDL,
  bankAccDDL,
  getBranchDDL,
  setBranchDDL,
  sbuDDL,
}) {
  const [currencyDDL, getCurrencyDDL] = useAxiosGet();

  useEffect(() => {
    getCurrencyDDL(`/domain/Purchase/GetBaseCurrencyList`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="form-group  global-form row">
      <div className="col-lg-3">
        <NewSelect
          name="sbu"
          options={sbuDDL}
          value={values?.sbu}
          label="SBU"
          onChange={(valueOption) => {
            setFieldValue("sbu", valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="bank"
          options={bankDDL}
          value={values?.bank}
          label="Bank"
          onChange={(valueOption) => {
            if (valueOption) {
              setFieldValue("bank", valueOption);
              getBranchDDL(
                `/costmgmt/BankAccount/GETBankBranchDDl?BankId=${valueOption?.value}&CountryId=18`
              );
            } else {
              setFieldValue("bank", "");
              setFieldValue("branch", "");
              setBranchDDL([]);
            }
          }}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="branch"
          options={branchDDL}
          value={values?.branch}
          label="Branch"
          onChange={(valueOption) => {
            setFieldValue("branch", valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="beneficiary"
          options={bankAccDDL}
          value={values?.beneficiary}
          label="Beneficiary"
          onChange={(valueOption) => {
            setFieldValue("beneficiary", valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.bankGuaranteeNumber}
          label="Bank Guarantee Number"
          name="bankGuaranteeNumber"
          type="text"
          onChange={(e) => {
            setFieldValue("bankGuaranteeNumber", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.issuingDate}
          label="Issuing Date"
          name="issuingDate"
          type="date"
          onChange={(e) => {
            setFieldValue("issuingDate", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.endingDate}
          label="Ending Date"
          name="endingDate"
          type="date"
          onChange={(e) => {
            setFieldValue("endingDate", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.tDays}
          label="T Days"
          name="tDays"
          type="number"
          onChange={(e) => {
            setFieldValue("tDays", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="currency"
          options={currencyDDL}
          value={values?.currency}
          label="Currency"
          onChange={(valueOption) => {
            setFieldValue("currency", valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.bgAmount}
          label="BG Amount"
          name="bgAmount"
          type="number"
          onChange={(e) => {
            setFieldValue("bgAmount", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.marginRef}
          label="Margin Ref."
          name="marginRef"
          type="text"
          onChange={(e) => {
            setFieldValue("marginRef", e.target.value);
          }}
        />
      </div>
    </div>
  );
}
