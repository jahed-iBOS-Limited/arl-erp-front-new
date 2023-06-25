import React from "react";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";

export default function BankGuarantee({
  values,
  setFieldValue,
  errors,
  touched,
}) {
  return (
    <div className="form-group  global-form row">
      <div className="col-lg-3">
        <NewSelect
          name="sbu"
          options={[]}
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
          options={[]}
          value={values?.bank}
          label="Bank"
          onChange={(valueOption) => {
            setFieldValue("bank", valueOption);
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
          type="number"
          onChange={(e) => {
            setFieldValue("bankGuaranteeNumber", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.beneficiary}
          label="Beneficiary"
          name="beneficiary"
          type="number"
          onChange={(e) => {
            setFieldValue("beneficiary", e.target.value);
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
          options={[]}
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
        <NewSelect
          name="status"
          options={[]}
          value={values?.status}
          label="Status"
          onChange={(valueOption) => {
            setFieldValue("status", valueOption);
          }}
          errors={errors}
          touched={touched}
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
