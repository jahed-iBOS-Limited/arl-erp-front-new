import React from "react";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";

const types = [
  { value: 1, label: "Bank Guarantee Report" },
  { value: 2, label: "Bank Guarantee Dataset (with excel format)" },
  { value: 3, label: "Bank Guarantee Excel Upload" },
];

const BankGuaranteeReportLandingForm = ({ obj }) => {
  const {
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
          {[1, 2].includes(values?.type?.value) && (
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
                  setRowDto([]);
                  setShowReport(false);
                }}
                placeholder="Distribution Channel"
                errors={errors}
                touched={touched}
              />
            </div>
          )}

          {[1, 2].includes(values?.type?.value) && (
            <div>
              <button
                disabled={!values?.distributionChannel}
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
          {values?.type?.value === 3 && rowDto?.length > 0 && (
            <button
              className="btn btn-info mt-5 ml-3"
              type="button"
              onClick={() => {
                saveHandler(() => {
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
