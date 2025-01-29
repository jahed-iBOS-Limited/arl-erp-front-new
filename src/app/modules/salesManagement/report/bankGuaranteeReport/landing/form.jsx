import React, { useState } from "react";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";

const types = [
  { value: 1, label: "Bank Guarantee Report" },
  { value: 2, label: "Bank Guarantee Dataset (with excel format)" },
  { value: 3, label: "Bank Guarantee Excel Upload" },
  { value: 4, label: "Submitted Bank Guarantee" },
];

const BankGuaranteeReportLandingForm = ({ obj }) => {
  const {
    buId,
    accId,
    values,
    errors,
    rowDto,
    touched,
    initData,
    setRowDto,
    resetForm,
    saveHandler,
    viewHandler,
    handleClick,
    setShowReport,
    setFieldValue,
    setFileObject,
    hiddenFileInput,
    distributionChannelDDL,
  } = obj;
  const [channelId, setChannelId] = useState(0);

  const loadCustomerList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${v}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}`
      )
      .then((res) => res?.data);
  };
  return (
    <>
      <form className="form form-label-right">
        <div className="form-group row global-form printSectionNone">
          <div className="col-lg-3">
            <NewSelect
              name="type"
              options={types}
              value={values?.type}
              label="Operation Type"
              onChange={(valueOption) => {
                setFieldValue("type", valueOption);
                setRowDto([]);
                setShowReport(false);
              }}
              placeholder="Select operation type"
              errors={errors}
              touched={touched}
            />
          </div>

          {values?.type?.value === 1 && (
            <div className="col-lg-3">
              <InputField
                value={values?.date}
                label="Date"
                name="date"
                type="date"
                onChange={(e) => {
                  setFieldValue("date", e?.target?.value);
                  setRowDto([]);
                  setShowReport(false);
                }}
              />
            </div>
          )}
          {[1, 2, 4].includes(values?.type?.value) && (
            <div className="col-lg-3">
              <NewSelect
                name="distributionChannel"
                options={[
                  { value: 0, label: "All" },
                  ...distributionChannelDDL,
                ]}
                value={values?.distributionChannel}
                label="Distribution Channel"
                onChange={(valueOption) => {
                  setFieldValue("distributionChannel", valueOption);
                  setChannelId(valueOption?.value);
                  setRowDto([]);
                  setShowReport(false);
                }}
                placeholder="Distribution Channel"
                errors={errors}
                touched={touched}
              />
            </div>
          )}

          {[4].includes(values?.type?.value) && (
            <>
              <YearMonthForm obj={{ values, setFieldValue }} />

              <div className="col-lg-3">
                <label>Customer</label>
                <SearchAsyncSelect
                  selectedValue={values?.customer}
                  handleChange={(valueOption) => {
                    setShowReport(false);
                    setFieldValue("customer", valueOption);
                    setRowDto([]);
                  }}
                  placeholder="Search Customer"
                  loadOptions={loadCustomerList}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="status"
                  options={[
                    // { value: 0, label: "All" },
                    { value: true, label: "Approved" },
                    { value: false, label: "Pending" },
                  ]}
                  value={values?.status}
                  label="Status"
                  onChange={(valueOption) => {
                    setFieldValue("status", valueOption);
                    setRowDto([]);
                    setShowReport(false);
                  }}
                  placeholder="Status"
                  errors={errors}
                  touched={touched}
                />
              </div>
            </>
          )}

          {[1, 2, 4].includes(values?.type?.value) && (
            <div>
              <button
                disabled={
                  ([1, 2].includes(values?.type?.value) &&
                    !values?.distributionChannel) ||
                  ([4].includes(values?.type?.value) &&
                    (!values?.month || !values?.year || !values?.status))
                }
                type="button"
                className="btn btn-primary mt-5"
                style={{ marginLeft: "13px" }}
                onClick={() => {
                  viewHandler(values);
                  setShowReport(true);
                }}
              >
                View
              </button>
            </div>
          )}
          {values?.type?.value === 3 && (
            <div>
              <button
                className="btn btn-primary mt-5"
                onClick={handleClick}
                type="button"
              >
                Upload Excel
              </button>
              <input
                type="file"
                onChange={(e) => {
                  setFileObject(e.target.files[0]);
                }}
                ref={hiddenFileInput}
                style={{ display: "none" }}
                accept=".csv, .ods, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </div>
          )}
          {[1, 3].includes(values?.type?.value) && rowDto?.length > 0 && (
            <button
              className="btn btn-info mt-5 ml-3"
              type="button"
              onClick={() => {
                saveHandler(values, () => {
                  setRowDto([]);
                  resetForm(initData);
                });
              }}
            >
              Save
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default BankGuaranteeReportLandingForm;
