/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./Form";
import IForm from "../../../../_helper/_form";
import {
  getBusinessUnitDdl,
  getSinglePageData,
  saveCreateData,
  saveEditData,
} from "../helper";
import Loading from "../../../../_helper/_loading";

let initData = {
  functionalDepartmentName: "",
  functionalDepartmentCode: "",
  businessUnit: "",
  isCorporate:""
};

export function EmpDepartmentForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [singlePageData, setSinglePageData] = useState([]);
  const [businessUnitDdlData, setBusinessUnitDdlData] = useState([]);
  const [allBusinessUnitChecked, setAllBusinessUnitChecked] = useState(false);
  const [isCorporateChecked, setIsCorporateChecked] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if(id) getSinglePageData(id, setSinglePageData);
  }, [id]);

  useEffect(() => {
    getBusinessUnitDdl(profileData.accountId,setBusinessUnitDdlData);
  }, [profileData.accountId]);

  // let singData = {};
  // if (id && singlePageData.length > 0) {
  //   singData = {
  //     ...singlePageData,
  //     functionalDepartmentName: singlePageData[0].departmentName,
  //     functionalDepartmentCode: singlePageData[0].departmentCode,
  //     businessUnit: "",
  //     ...singlePageData[0]
  //     // isCorporate: singlePageData[0].isCorporate
  //   };
  // }

  const saveHandler = async (values, cb) => {

    if (values) {
      if (id) {
        const payload = {
          functionalDepartmentId: +id,
          functionalDepartmentName: values.functionalDepartmentName,
          functionalDepartmentCode: values.functionalDepartmentCode,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          actionBy: profileData?.userId,
        };

        saveEditData(payload, setDisabled);
     
        // dispatch(saveEditDepartment(payload));
      } else {
        const payload = {
          functionalDepartmentName: values.functionalDepartmentName,
          functionalDepartmentCode: values.functionalDepartmentCode,
          accountId: profileData.accountId,
          businessUnitId: values.businessUnit.value,
          actionBy: profileData.userId,
          isCorporate:isCorporateChecked
        };

        console.log(payload)        
        saveCreateData(allBusinessUnitChecked ? 1 : 0, payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={id ? "Edit Department" : "Create Department"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading/>}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={id ? singlePageData : initData}
          saveHandler={saveHandler}
          isEdit={id ? id : false}
          businessUnitDdlData={businessUnitDdlData}
          allBusinessUnitChecked={allBusinessUnitChecked}
          setAllBusinessUnitChecked={setAllBusinessUnitChecked}
          isCorporateChecked={isCorporateChecked}
          setIsCorporateChecked={setIsCorporateChecked}
          id={id}
        />
      </div>
    </IForm>
  );
}
