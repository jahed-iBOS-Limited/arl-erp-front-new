import moment from "moment";
import React from "react";
import FormikInput from "../../../../../chartering/_chartinghelper/common/formikInput";
import FormikSelect from "../../../../../chartering/_chartinghelper/common/formikSelect";
import customStyles from "../../../../../chartering/_chartinghelper/common/selectCustomStyle";
import { addHandlerLayTimeRowValidator, hourDDL, minDDL } from "../utils";
import FormikError from "../../../../../chartering/_chartinghelper/common/formikError";

export default function CreateRowForm({
  /* Formik */
  values,
  setFieldValue,
  errors,
  touched,
  setTouched,
  setErrors,
  /* Others */
  rowData,
  setRowData,
}) {
  /* This Function Combine & Make a time with HH & MM DDL */
  const timeSetter = (valueOption, values, setFieldValue, type, format) => {
    switch (type) {
      /* From Time Condition Goes Here!! */
      case "from":
        switch (format) {
          case "HH":
            valueOption?.value &&
              setFieldValue("workingTimeFrom", `${valueOption?.value}:00`);

            setFieldValue("workingFromMM", {
              value: "00",
              label: "00",
            });
            setFieldValue("workingFromHH", valueOption);
            break;

          default:
            valueOption?.value &&
              values?.workingFromHH?.value &&
              setFieldValue(
                "workingTimeFrom",
                `${values?.workingFromHH?.value}:${valueOption?.value}`
              );

            setFieldValue("workingFromMM", valueOption);
            break;
        }
        break;

      /* To Time Condition Goes Here */
      default:
        switch (format) {
          case "HH":
            valueOption?.value &&
              setFieldValue("workingTime", `${valueOption?.value}:00`);

            setFieldValue("workingToMM", {
              value: "00",
              label: "00",
            });
            setFieldValue("workingToHH", valueOption);
            break;

          default:
            valueOption?.value &&
              values?.workingToHH?.value &&
              setFieldValue(
                "workingTime",
                `${values?.workingToHH?.value}:${valueOption?.value}`
              );

            setFieldValue("workingToMM", valueOption);
            break;
        }
        break;
    }
  };

  return (
    <>
      <div className="marine-form-card-content">
        <div className="row">
          <div className="col-lg-2 pr-0">
            <label>Date</label>
            <FormikInput
              value={values?.layTimeDate}
              name="layTimeDate"
              type="date"
              onChange={(e) => {
                setFieldValue(
                  "layhTimeDay",
                  moment(e.target.value)
                    .format("ddd")
                    .toUpperCase()
                );
                setFieldValue("layTimeDate", e.target.value);
              }}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-lg-1 px-0">
            <label>Days</label>
            <FormikInput
              value={values?.layhTimeDay}
              name="layhTimeDay"
              type="text"
              errors={errors}
              touched={touched}
              disabled={true}
            />
          </div>

          {/* New time input 24 Hour Format */}
          <div className="col-lg-2">
            <label>Working From HH:MM</label>
            <div className="d-flex">
              <div style={{ width: "50%" }}>
                <FormikSelect
                  value={values?.workingFromHH || ""}
                  isSearchable={true}
                  options={hourDDL() || []}
                  styles={customStyles}
                  name="workingFromHH"
                  onChange={(valueOption) => {
                    timeSetter(
                      valueOption,
                      values,
                      setFieldValue,
                      "from",
                      "HH"
                    );
                  }}
                  placeholder="HH"
                  errors={errors}
                  touched={touched}
                  isClearable={false}
                />
              </div>
              <div style={{ width: "50%" }}>
                <FormikSelect
                  value={values?.workingFromMM || ""}
                  isSearchable={true}
                  options={minDDL() || []}
                  styles={customStyles}
                  name="workingFromMM"
                  onChange={(valueOption) => {
                    timeSetter(
                      valueOption,
                      values,
                      setFieldValue,
                      "from",
                      "MM"
                    );
                  }}
                  placeholder="MM"
                  errors={errors}
                  isDisabled={values?.workingFromHH?.value === "24"}
                  touched={touched}
                  isClearable={false}
                />
              </div>
            </div>
            <FormikError
              errors={errors}
              name={"workingTimeFrom"}
              touched={touched}
            />
          </div>

          <div className="col-lg-2">
            <label>Working To HH:MM</label>
            <div className="d-flex">
              <div style={{ width: "50%" }}>
                <FormikSelect
                  value={values?.workingToHH || ""}
                  isSearchable={true}
                  options={hourDDL() || []}
                  styles={customStyles}
                  name="workingToHH"
                  onChange={(valueOption) => {
                    timeSetter(valueOption, values, setFieldValue, "to", "HH");
                  }}
                  placeholder="HH"
                  errors={errors}
                  touched={touched}
                  isClearable={false}
                />
              </div>
              <div style={{ width: "50%" }}>
                <FormikSelect
                  value={values?.workingToMM || ""}
                  isSearchable={true}
                  options={minDDL() || []}
                  styles={customStyles}
                  name="workingToMM"
                  onChange={(valueOption) => {
                    timeSetter(valueOption, values, setFieldValue, "to", "MM");
                  }}
                  placeholder="MM"
                  isDisabled={values?.workingToHH?.value === "24"}
                  errors={errors}
                  touched={touched}
                  isClearable={false}
                />
              </div>
            </div>
            <FormikError
              errors={errors}
              name={"workingTime"}
              touched={touched}
            />
          </div>
          {/* New time input 24 Hour Format */}

          <div className="col-lg-2">
            <label>Ratio (%)</label>
            <FormikInput
              value={values?.ratio}
              name="ratio"
              type="number"
              onChange={(e) => {
                if (e.target.value <= 200) {
                  setFieldValue("ratio", Math.abs(e.target.value));
                }
              }}
              errors={errors}
              touched={touched}
            />
          </div>

          <div className="col-lg-3">
            <label>Remarks</label>
            <FormikInput
              value={values?.remark}
              name="remark"
              type="text"
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
      </div>

      {/* Add New in row */}
      <div className="col-lg-12">
        <div className="d-flex justify-content-end my-2">
          <button
            onClick={() => {
              addHandlerLayTimeRowValidator({
                values,
                setTouched,
                setErrors,
                rowData,
                setRowData,
                setFieldValue,
              });
            }}
            type="button"
            className="btn btn-info px-3 py-2"
          >
            + Add
          </button>
        </div>
      </div>
    </>
  );
}
