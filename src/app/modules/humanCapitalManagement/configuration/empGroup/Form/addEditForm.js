import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import IForm from "../../../../_helper/_form";
import Form from "./form";
import { useSelector, shallowEqual } from "react-redux";
import { createEmployeeGroupNew, getEmployeeGroupNameLanding } from "../helper";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";

let initData = {
  employeeGroupName: "",
};

export default function EmpGroupCreateForm() {
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [objProps, setObjprops] = useState({});
  const [allBusinessUnit, setAllBusinessUnit] = useState(false);
  const [employeeGroupNames, setEmployeeGroupNames] = useState([]);

  const location = useLocation();
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getEmployeeGroupNameLanding(
        profileData?.accountId,
        setEmployeeGroupNames
      );
    }
  }, [profileData, selectedBusinessUnit]);

  console.log(employeeGroupNames.employeeGroupName, "employeeGroupNames");

  const saveHandler = async (data, cb) => {
    let groupName = employeeGroupNames.find(
      (item) => item.employeeGroupName === data.employeeGroupName
    );
    if (groupName) {
      toast.error("Item already added");
    } else if (profileData?.accountId && selectedBusinessUnit) {
      if (data) {
        const payload = [
          {
            strEmployeeGroup: data?.employeeGroupName,
            intAccountId: +profileData?.accountId,
            intActionBy: +profileData?.userId,
          },
        ];
        createEmployeeGroupNew(payload, cb, setDisabled);
      } else {
        console.log(data);
      }
    }
  };

  return (
    <IForm
      title="Create Employee Group"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        id={id}
        businessUnitDDL={businessUnitDDL}
        setBusinessUnitDDL={setBusinessUnitDDL}
        isEdit={id ? id : false}
        location={location}
        allBusinessUnit={allBusinessUnit}
        setAllBusinessUnit={setAllBusinessUnit}
      />
    </IForm>
  );
}
