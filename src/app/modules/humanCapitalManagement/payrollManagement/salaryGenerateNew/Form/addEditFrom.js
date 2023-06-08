import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  getBuDDLForEmpDirectoryAndSalaryDetails,
  getMonthYearDDLAction,
  getWorkplaceGroupDDLAction,
} from "../helper";

let initData = {
  businessUnit: "",
  month: "",
  year: "",
  workplaceGroup: "",
};

export function SalaryGenerateNew({
  history,
  match: {
    params: { id },
  },
}) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [workPlaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [bUDDL, setBUDDL] = useState([]);
  const [monthDDL, setMonthDDL] = useState([]);
  const [yearDDL, setYearDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Generate");

  useEffect(() => {
    getWorkplaceGroupDDLAction(profileData?.accountId, setWorkplaceGroupDDL);
    getBuDDLForEmpDirectoryAndSalaryDetails(profileData?.accountId, setBUDDL);
    getMonthYearDDLAction(1, setMonthDDL);
    getMonthYearDDLAction(2, setYearDDL);
  }, [profileData]);

  const saveHandler = async (values, cb) => {};

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Salary Generate"}
      getProps={setObjprops}
      isHiddenBack={true}
      isHiddenReset={true}
      isHiddenSave={true}
    >
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          workPlaceGroupDDL={workPlaceGroupDDL}
          bUDDL={bUDDL}
          gridData={gridData}
          setGridData={setGridData}
          isLoading={isLoading}
          setLoading={setLoading}
          selectedBusinessUnit={selectedBusinessUnit}
          monthDDL={monthDDL}
          yearDDL={yearDDL}
          buttonText={buttonText}
          setButtonText={setButtonText}
          profileData={profileData}
        />
      </div>
    </IForm>
  );
}
