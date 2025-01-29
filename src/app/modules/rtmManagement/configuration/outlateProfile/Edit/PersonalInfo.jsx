import React from "react";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";

export const PersonalInfo = ({
  values,
  setFieldValue,
  errors,
  touched
}) => {
  return (
    <>
      <div className="row">
        <div className="col-lg-3">
          <label>Contact Type</label>
          <InputField
            value={values?.contactType}
            name="contactType"
            placeholder="Contact Type"
            type="text"
            errors={errors}
            touched={touched}
          />
        </div>

        <div className="col-lg-3">
          <label>Email Address</label>
          <InputField
            value={values?.emailAddress}
            name="emailAddress"
            placeholder="Email Address"
            type="text"
            errors={errors}
            touched={touched}
          />
        </div>

        <div className="col-lg-3">
          <label>Date of Birth</label>
          <InputField
            value={values?.dateOfBirth}
            name="dateOfBirth"
            placeholder="Date of Birth"
            type="date"
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <NewSelect
            label="Marriage Satus"
            name="marriageSatus"
            options={[
              { label: "Married", value: 1 },
              { label: "Unmarried", value: 2 },
            ]}
            value={values?.marriageSatus}
            onChange={(valueOption) => {
              setFieldValue("marriageSatus", valueOption);
            }}
            placeholder="Select Marriage Satus"
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <label>Marriage Date</label>
          <InputField
            value={values?.marriageDate}
            name="marriageDate"
            placeholder="Marriage Date"
            type="date"
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <label>Owner NID</label>
          <InputField
            value={values?.ownerNid}
            name="ownerNid"
            placeholder="Owner NID"
            type="text"
            errors={errors}
            touched={touched}
          />
        </div>
      </div>
    </>
  );
};
