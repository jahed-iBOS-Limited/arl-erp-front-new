import React from "react";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
export default function DepositRegister({
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
        <NewSelect
          name="securityType"
          options={[]}
          value={values?.securityType}
          label="Security Type"
          onChange={(valueOption) => {
            setFieldValue("securityType", valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.no}
          label="No"
          name="no"
          type="number"
          onChange={(e) => {
            setFieldValue("no", e.target.value);
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
          value={values?.retirementDate}
          label="Retirement Date"
          name="retirementDate"
          type="date"
          onChange={(e) => {
            setFieldValue("retirementDate", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.amount}
          label="Amount"
          name="amount"
          type="number"
          onChange={(e) => {
            setFieldValue("amount", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.inFavOf}
          label="In Fav. Of"
          name="inFavOf"
          type="text"
          onChange={(e) => {
            setFieldValue("inFavOf", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.purpose}
          label="Purpose"
          name="purpose"
          type="text"
          onChange={(e) => {
            setFieldValue("purpose", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="responsiblePerson"
          options={[]}
          value={values?.responsiblePerson}
          label="Responsible Person"
          onChange={(valueOption) => {
            setFieldValue("responsiblePerson", valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.note}
          label="Note"
          name="note"
          type="text"
          onChange={(e) => {
            setFieldValue("note", e.target.value);
          }}
        />
      </div>
    </div>
  );
}
