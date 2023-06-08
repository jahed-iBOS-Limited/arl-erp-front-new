/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { getDepartmentDDL, getYearDDL } from "../helper";
import Help from "../../../help/Help";

let initData = {
  department: "",
  year: "",
};

export function DepartmentProjectForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [year, setYear] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getDepartmentDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDepartmentDDL
    );
    getYearDDL(profileData?.accountId, selectedBusinessUnit?.value, setYear);
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {};

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Department Project"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenBack={true}
      isHiddenSave={true}
      isHelp={true}
      helpModalComponent={<Help />}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          departmentDDL={departmentDDL}
          year={year}
          saveHandler={saveHandler}
        />
      </div>
    </IForm>
  );
}
