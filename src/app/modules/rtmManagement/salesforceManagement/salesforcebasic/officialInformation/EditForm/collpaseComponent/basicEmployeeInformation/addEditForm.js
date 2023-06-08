import React, { useState, useEffect } from "react";
import Form from "./form";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";
import Loading from "./../../../../../../../_helper/_loading";
import {
  getEmployeeBasicInfoById_api,
  EditEmployeeBasicInformation,
} from "./helper";
import { empAttachment_action } from "./../../../../helper";

const initData = {
  id: undefined,
  firstName: "",
  middleName: "",
  lastName: "",
  businessUnit: "",
  SBUName: "",
  costCenter: "",
  functionalDepartment: "",
  HRposition: "",
  designation: "",
  employeeGrade: "",
  workplaceGroup: "",
  lineManager: "",
  employeeCode: "",
  employmentType: "",
  employeeStatus: "",
  nanagerInfo: "",
  joiningDate: "",
  empLavel: "",
  empProfileImage: "",
};
export default function BasicEmployeeInformation() {
  // iamge attachment
  const [fileObjects, setFileObjects] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [edit, setEdit] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const { state: headerData } = useLocation();
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getEmployeeBasicInfoById_api(headerData?.employeeId, setSingleData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        employeeId: headerData?.employeeId,
        employeeFirstName: values?.firstName,
        middleName: values?.middleName,
        lastName: values?.lastName,
        employeeFullName:
          values?.firstName + " " + values?.middleName + " " + values?.lastName,
        sbuid: values.SBUName.value,
        departmentId: values?.functionalDepartment?.value,
        designationId: values?.designation?.value,
        workPlaceId: values?.workplace?.value,
        //costCenterId: values?.costCenter?.value || 0,
        joiningDate: values?.joiningDate,
        positionId: values.HRposition.value,
        empGradeId: values.employeeGrade.value,
        employmentTypeId: values?.employmentType.value,
        lineManagerId: values?.lineManager.value,
        lineManagerCode: values?.nanagerInfo,
        employeeLevelId: values?.empLavel?.value,
        employeeStatusId: values?.employeeStatus.value,
        actionBy: profileData?.userId,
      };
      if (fileObjects.length > 0) {
        empAttachment_action(fileObjects).then((data) => {
          const modifyPlyload = {
            ...payload,
            empProfileImage: data[0]?.id || "",
          };
          EditEmployeeBasicInformation(modifyPlyload, setDisabled);
        });
      } else {
        const modifyPlyload = {
          ...payload,
          empProfileImage: "",
        };
        EditEmployeeBasicInformation(modifyPlyload, setDisabled);
      }
      //.then((data) => {
      //  getEmployeeBasicInfoById_api(headerData?.employeeId, setSingleData);
      //});
    }
  };

  return (
    <div className="employeeInformation">
      {isDisabled && <Loading />}
      <Form
        initData={singleData || initData}
        setEdit={setEdit}
        edit={edit}
        saveHandler={saveHandler}
        isDisabled={isDisabled}
        // image attachment
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
      />
    </div>
  );
}
