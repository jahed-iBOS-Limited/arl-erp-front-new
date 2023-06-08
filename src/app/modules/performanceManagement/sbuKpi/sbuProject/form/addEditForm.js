/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { getYearDDL } from "../helper";
import { getSbuDDLAction } from "../helper";
import Help from "../../../help/Help";

let initData = {
  sbu: "",
  year: "",
};

export function SBUProjectForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [year, setYear] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getSbuDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSbuDDL
    );
    getYearDDL(profileData?.accountId, selectedBusinessUnit?.value, setYear);
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {};

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"SBU Project"}
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
          sbuDDL={sbuDDL}
          year={year}
          saveHandler={saveHandler}
        />
      </div>
    </IForm>
  );
}
