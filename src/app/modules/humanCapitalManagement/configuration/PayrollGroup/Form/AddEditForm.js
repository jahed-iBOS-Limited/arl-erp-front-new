/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./Form";
import IForm from "../../../../_helper/_form";
import { getSinglePageData, saveCreateData, saveEditData } from "../helper";
import { getPayrollPeriodDdlData } from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "../../../../_helper/_loading";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

let initData = {
  payrollGroupName: "",
  payrollGroupCode: "",
  payrollPeriod: "",
  currentPeriodStart: _todayDate(),
  currentPeriodEnd: _todayDate(),
};

export function PayrollGroupForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [singlePageData, setSinglePageData] = useState([]);
  const [payrollPeriodDdlData, setPayrollPeriodDdlData] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    getSinglePageData(id, setSinglePageData);
  }, [id]);

  useEffect(() => {
    getPayrollPeriodDdlData(setPayrollPeriodDdlData);
  }, []);

  let singData = {};
  if (id && singlePageData.length > 0) {
    singData = {
      payrollGroupName: singlePageData[0].payrollGroupName,
      payrollGroupCode: singlePageData[0].payrollGroupCode,
      payrollPeriod: {
        value: singlePageData[0].payrollPeriodId,
        label: singlePageData[0].payrollPeriodName,
      },
      currentPeriodStart: _dateFormatter(singlePageData[0]?.currentPeriodStart),
      currentPeriodEnd: _dateFormatter(singlePageData[0]?.currentPeriodEnd),
    };
  }
  const [rowDataCreate, setRowDataCreate] = useState([]);

  const saveHandler = async (values, cb) => {

    if (values) {
      if (id) {
        let list = []
        const payload = {
          payrollGroupId: singlePageData[0]?.payrollGroupId,
          payrollGroupCode: values?.payrollGroupCode,
          payrollGroupName: values?.payrollGroupName,
          payrollPeriodId: singlePageData[0].payrollPeriodId,
          currentPeriodStart: values.currentPeriodStart,
          currentPeriodEnd: values.currentPeriodEnd,
          accountId: profileData?.accountId,
          actionBy: profileData?.userId,
        };
        if(payload){
          list = [...list, payload]
          saveEditData(list, setDisabled);
        }
        console.log(list);
      } else {
        saveCreateData(rowDataCreate, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={id ? "Edit Payroll Group" : "Create Payroll Group"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading/>}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={id ? singData : initData}
          saveHandler={saveHandler}
          isEdit={id ? id : false}
          id={id}
          payrollPeriodDdlData={payrollPeriodDdlData}
          profileData={profileData}
          setRowDataCreate={setRowDataCreate}
          rowDataCreate={rowDataCreate}
        />
      </div>
    </IForm>
  );
}
