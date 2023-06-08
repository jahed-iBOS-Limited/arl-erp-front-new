import React, { useState } from "react";
import { Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../_helper/_card";
import ICustomTable from "../../../_helper/_customTable";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import { GetExpenseInfoModifyLandingData, InactiveExpense } from "./helper";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import axios from "axios";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import IClose from "../../../_helper/_helperIcons/_close";
import IApproval from "../../../_helper/_helperIcons/_approval";

const initData = {
  type: "",
  employeeName: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  expenseGroup: "",
};

const headers = [
  "SL",
  "Expense Code",
  "Date",
  "Name",
  "Enroll",
  "Amount",
  "Action",
];

const typeDDL = [
  { value: 11, label: "Inactive" },
  { value: 12, label: "Bill Date Change" },
  { value: 13, label: "Supervisor approve inactive" },
  { value: 14, label: "Line manager approve inactive" },
];

const ExpenseInfoModify = () => {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const employeeList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/tms/TMSReport/GetEmployeeListUnitWise?businessUnitId=${selectedBusinessUnit?.value}&search=${v}`
      )
      .then((res) => res?.data);
  };

  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  const girdDataFunc = (values) => {
    setGridData([]);
    GetExpenseInfoModifyLandingData(
      selectedBusinessUnit?.value,
      values?.type?.value,
      values?.employeeName?.value,
      values?.fromDate,
      values?.toDate,
      profileData?.employeeId,
      values?.expenseGroup?.label,
      setGridData,
      setLoading
    );
  };

  const Inactive = (item, values) => {
    const payload = {
      head: {
        partid: values?.type?.value,
        accountId: profileData?.accountId,
        expesneForID: values?.employeeName?.value,
        fromDate: values?.fromDate,
        todate: values?.toDate,
        unitId: selectedBusinessUnit?.value,
        actionBy: profileData?.userId,
      },
      row: [
        {
          expenseID: item?.intexpenseid,
          expenserowid: item?.rrintExpenseRowId,
          updateDate: item?.dteExpenseDate,
          comments: item?.strComments,
          locations: "",
          billAmount: item?.numApplicantAmount,
        },
      ],
    };

    InactiveExpense(payload, setLoading, () => {
      girdDataFunc(values);
    });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {}}
      >
        {({ values, setFieldValue, touched, errors }) => (
          <ICard title="Expense Information Modify">
            {loading && <Loading />}
            <form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      options={typeDDL}
                      value={values?.type}
                      label="Type"
                      onChange={(valueOption) => {
                        setFieldValue("type", valueOption);
                        setGridData([]);
                      }}
                      placeholder="Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Employee Name</label>
                    <SearchAsyncSelect
                      selectedValue={values?.employeeName}
                      handleChange={(valueOption) => {
                        setFieldValue("employeeName", valueOption);
                        setGridData([]);
                      }}
                      loadOptions={employeeList || []}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="expenseGroup"
                      options={[
                        { value: 1, label: "TaDa" },
                        { value: 2, label: "Other" },
                      ]}
                      value={values?.expenseGroup}
                      label="Expense Group"
                      onChange={(valueOption) => {
                        setFieldValue("expenseGroup", valueOption);
                      }}
                      placeholder="Expense Group"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col d-flex justify-content-end align-items-center ">
                    <button
                      type="button"
                      onClick={() => girdDataFunc(values)}
                      className="btn btn-primary mt-2"
                      disabled={!values?.type}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
              <ICustomTable className={"mt-0"} ths={headers}>
                {gridData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.strExpenseCode}</td>

                      <td>
                        {values?.type?.value === 12 ? (
                          <InputField
                            value={_dateFormatter(item?.dteExpenseDate)}
                            name="expenseDate"
                            placeholder="Date"
                            type="date"
                            onChange={(e) => {
                              gridData[index].dteExpenseDate = e.target.value;
                              setGridData([...gridData]);
                            }}
                          />
                        ) : (
                          _dateFormatter(item?.dteExpenseDate)
                        )}
                      </td>
                      <td>{item?.strEmployeeFullName}</td>
                      <td>{item?.intExpenseForId}</td>
                      <td className="text-right">
                        {_formatMoney(item?.numApplicantAmount)}
                      </td>
                      <td className="text-center">
                        {values?.type?.value === 12 ? (
                          <span
                            className="cursor-pointer"
                            onClick={() => {
                              Inactive(item, values);
                            }}
                          >
                            <IApproval title="Done"></IApproval>
                          </span>
                        ) : (
                          ([14, 242].includes(profileData?.departmentId) ||
                            values?.type?.value === 11) && (
                            <span
                              className="cursor-pointer"
                              onClick={() => {
                                Inactive(item, values);
                              }}
                            >
                              <IClose title="Inactive"></IClose>
                            </span>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })}
              </ICustomTable>
            </form>
          </ICard>
        )}
      </Formik>
    </>
  );
};

export default ExpenseInfoModify;
