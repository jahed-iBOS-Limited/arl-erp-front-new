import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./Form";
import IForm from "../../../../_helper/_form";
import { toast } from "react-toastify";
import {saveData} from "../helper"

let initData = {
  employeeDDL:null,
  monthDDL:null,
  yearDDL:null,
  additionalAmount: "",
  deductionAmount: "",
  department: "",
  designation: "",
  employeeName: "",
  averageDaamount: "",
  monthlyMeetingExpAmount: "",
  monthlyOthersAmount: "",
  monthlyTaamount: "",
  totalDaamount: "",
  totalPresentDay: "",
  totalWorkingDay: "",
  meetingExpense:"",
};

export default function SalesforceMonthlyTaDa({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  // const [summaryReportData, setSummaryReportData] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get selected business unit from store
  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);

  const saveHandler = async (values, cb) => {
    try {
      const res = saveData(values,profileData?.accountId, selectedBusinessUnit.value,profileData?.userId)
      toast.success('data successfully added')
      console.log(res)
      cb()
    } catch (error) {
      
    }
 

  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Sales Force Monthly TaDa"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          disableHandler={disableHandler}
          isEdit={id ? id : false}
          id={id}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
        />
      </div>
    </IForm>
  );
}
