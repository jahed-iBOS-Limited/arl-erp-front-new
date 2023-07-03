import React, { useEffect } from "react";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

export default function BankGuarantee({
  values,
  setFieldValue,
  errors,
  touched,
  bankDDL,
  bankAccDDL,
  getBankAccDDL,
  setBankAccDDL,
  sbuDDL,
  profileData,
  selectedBusinessUnit,
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
              setFieldValue("beneficiary", "");
              getBankAccDDL(
                `/costmgmt/BankAccount/GetBankAccountDDLByBankId?AccountId=${profileData?.accountId}&BusinssUnitId=${selectedBusinessUnit?.value}&BankId=${valueOption?.value}`
              );
            } else {
              setFieldValue("bank", "");
              setFieldValue("beneficiary", "");
              setBankAccDDL([]);
            }
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
          value={values?.amount}
          label="BG Amount"
          name="amount"
          type="number"
          onChange={(e) => {
            setFieldValue("amount", e.target.value);
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
