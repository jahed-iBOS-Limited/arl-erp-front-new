/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./Form";
import IForm from "../../../../_helper/_form";
import { getSinglePageData, saveCreateData, saveEditData } from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "../../../../_helper/_loading";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

let initData = {
  payrollPeriodName: "",
  payrollPeriodCode: "",
  startDate: _todayDate(),
  endDate: _todayDate(),
  runDate: _todayDate(),
  payDate: _todayDate(),
};

export function PayrollPeriodForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [singlePageData, setSinglePageData] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);

  useEffect(() => {
    getSinglePageData(id, setSinglePageData);
  }, [id]);

  let singData = {};
  if (id && singlePageData.length > 0) {
    singData = {
      payrollPeriodName: singlePageData[0].payrollPeriodName,
      payrollPeriodCode: singlePageData[0].payrollPeriodCode,
      startDate: _dateFormatter(singlePageData[0]?.startDate),
      endDate: _dateFormatter(singlePageData[0]?.endDate),
      runDate: _dateFormatter(singlePageData[0]?.runDate),
      payDate: _dateFormatter(singlePageData[0]?.payDate),
    };
  }

  const saveHandler = async (values, cb) => {
    if (values) {
      if (id) {
        const payload = {
          payrollPeriodId: singlePageData[0].payrollPeriodId,
          payrollPeriodName: values.payrollPeriodName,
          payrollPeriodCode: values.payrollPeriodCode,
          accountId: profileData.accountId,
          startDate: values.startDate,
          endDate: values.endDate,
          runDate: values.runDate,
          payDate: values.payDate,
          actionBy: profileData.userId,
        };
        saveEditData(payload, setDisabled);

        // dispatch(saveEditDepartment(payload));
      } else {
        const payload = {
          payrollPeriodName: values.payrollPeriodName,
          payrollPeriodCode: values.payrollPeriodCode,
          accountId: profileData.accountId,
          startDate: values.startDate,
          endDate: values.endDate,
          runDate: values.runDate,
          payDate: values.payDate,
          actionBy: profileData.userId,
        };
        saveCreateData(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={id ? "Edit Payroll Period" : "Create Payroll Period"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={id ? singData : initData}
          saveHandler={saveHandler}
          isEdit={id ? id : false}
          id={id}
        />
      </div>
    </IForm>
  );
}
