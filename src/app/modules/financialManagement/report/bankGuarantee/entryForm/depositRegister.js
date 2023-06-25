import React, { useRef } from "react";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { attachmentUpload } from "../../../../_helper/attachmentUpload";
import placeholderImg from "../../../../_helper/images/placeholderImg.png";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";
export default function DepositRegister({
  values,
  setFieldValue,
  errors,
  touched,
  attachmentFile,
  setAttachmentFile,
  bankDDL,
  bankAccDDL,
  accId,
  sbuDDL,
}) {
  const inputAttachFile = useRef(null);
  const onButtonAttachmentClick = () => {
    inputAttachFile.current.click();
  };

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
            setFieldValue("bank", valueOption);
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
        <NewSelect
          name="securityType"
          options={[{ value: "Pay order", label: "Pay order" }]}
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
        <label>Responsible Person</label>
        <SearchAsyncSelect
          selectedValue={values?.responsiblePerson}
          handleChange={(valueOption) => {
            setFieldValue("responsiblePerson", valueOption);
          }}
          isDisabled={false}
          loadOptions={(v) => {
            const searchValue = v.trim();
            if (searchValue?.length < 3) return [];
            return axios
              .get(
                `/hcm/HCMDDL/GetEmployeeDDLSearch?AccountId=${accId}&Search=${searchValue}`
              )
              .then((res) => res?.data);
          }}
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
      <div className="col-lg-3">
        <label>Attachment </label>
        <div
          className={
            attachmentFile ? "image-upload-box with-img" : "image-upload-box"
          }
          onClick={onButtonAttachmentClick}
          style={{
            cursor: "pointer",
            position: "relative",
            height: "35px",
          }}
        >
          <input
            onChange={(e) => {
              if (e.target.files?.[0]) {
                attachmentUpload(e.target.files)
                  .then((data) => {
                    setAttachmentFile(data?.[0]?.id);
                  })
                  .catch((error) => {
                    setAttachmentFile("");
                  });
              }
            }}
            type="file"
            ref={inputAttachFile}
            id="file"
            style={{ display: "none" }}
          />
          <div>
            {!attachmentFile && (
              <img
                style={{ maxWidth: "50px" }}
                src={placeholderImg}
                className="img-fluid"
                alt="Upload or drag documents"
              />
            )}
          </div>
          {attachmentFile && (
            <div className="d-flex align-items-center">
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#0072E5",
                  cursor: "pointer",
                  margin: "0px",
                }}
              >
                {attachmentFile}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
