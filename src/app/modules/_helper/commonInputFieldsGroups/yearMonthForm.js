import React from "react";
import NewSelect from "../_select";
import { YearDDL } from "../_yearDDL";

export const monthDDL = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const YearMonthForm = ({ obj }) => {
  const {
    values,
    setFieldValue,
    setGridData,
    onChange,
    year,
    month,
    colSize,
  } = obj;
  const col = colSize ? colSize : "col-lg-3";
  return (
    <>
      {month !== false && (
        <div className={col}>
          <NewSelect
            name="month"
            options={monthDDL}
            value={values?.month}
            label="Month"
            onChange={(valueOption) => {
              setFieldValue("month", valueOption);
              setGridData && setGridData([]);
              onChange && onChange({ ...values, month: valueOption }, "month");
            }}
            placeholder="Month"
          />
        </div>
      )}
      {year !== false && (
        <div className={col}>
          <NewSelect
            name="year"
            options={YearDDL()}
            value={values?.year}
            label="Year"
            onChange={(valueOption) => {
              setFieldValue("year", valueOption);
              setGridData && setGridData([]);
              onChange && onChange({ ...values, year: valueOption }, "year");
            }}
            placeholder="Year"
          />
        </div>
      )}
    </>
  );
};

export default YearMonthForm;
