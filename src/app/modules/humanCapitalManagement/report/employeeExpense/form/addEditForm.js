import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { currentMonthInitData } from "../../../../_helper/_currentMonth";

const date = new Date();
const year = date.getFullYear();

let initData = {
  fromMonth: currentMonthInitData(date),
  fromYear: {value: year, label: year},
};

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

export const yearDDL = [
  { value: 2020, label: "2020" },
  { value: 2021, label: "2021" },
  { value: 2022, label: "2022" },
  { value: 2023, label: "2023" },
  { value: 2024, label: "2024" },
  { value: 2025, label: "2025" },
  { value: 2026, label: "2026" },
];

export function EmployeeExpenseForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);

  const { selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);

  return (
    <IForm title={"Employee Expense"} getProps={setObjprops}>
      {loading && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          setLoading={setLoading}
          selectedBusinessUnit={selectedBusinessUnit}
          rowDto={rowDto}
          setRowDto={setRowDto}
          year={year}
          month={month}
          setYear={setYear}
          setMonth={setMonth}
        />
      </div>
    </IForm>
  );
}
