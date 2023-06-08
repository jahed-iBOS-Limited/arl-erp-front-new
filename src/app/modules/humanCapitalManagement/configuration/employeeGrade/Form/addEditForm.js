/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { toast } from "react-toastify";
import {
  createData,
  getDDL,
  fetchSingleData,
  editSingleData,
} from "../helper/Actions";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";

const initData = {
  employeePositionGroup: "",
  employeeHrPosition: "",
  employeeGrade: "",
  code: "",
};

export function EmpGradeForm({
  history,
  match: {
    params: { empGradeId, posId, posGrpId },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [empPosGrpDDL, setEmpPosGrpDDL] = useState([]);
  const [empHrPosDDL, setEmpHrPosDDL] = useState([]);

  const [singleData, setSingleData] = useState({});
  const [rowData, setRowData] = useState([]);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const saveHandler = async (data, cb) => {
    if (empGradeId && posId && posGrpId) {
      if (data.length === 0) {
        toast.warn("Please add at least one");
      } else {
        const saveDataArray = data.map((item, index) => {
          return {
            empGradeId: item.empGradeId,
            empGradeCode: item?.code,
            empGradeName: item?.employeeGrade,
            sl: index + 1,
            empBaseGrade: item?.baseGrade?.value,
            positionId: +posId,
            positionGroupId: +posGrpId,
            accountId: profileData.accountId,
            actionBy: profileData?.userId,
          };
        });
        editSingleData(saveDataArray, cb, setDisabled);
      }
    } else {
      if (data.length === 0) {
        toast.warn("Please add at least one");
      } else {
        const editDataArray = data.map((item, index) => {
          return {
            empGradeCode: item?.code,
            empGradeName: item?.employeeGrade,
            sl: index + 1,
            empBaseGrade: item?.baseGrade?.value,
            positionId: item?.employeeHrPosition?.value,
            positionGroupId: item?.employeePositionGroup?.value,
            accountId: profileData.accountId,
            actionBy: profileData?.userId,
          };
        });
        createData(editDataArray, cb, setDisabled);
      }
    }
  };

  // Get Emp Position Group DDL
  useEffect(() => {
    getDDL("/hcm/HCMDDL/GetEmployeePositionGroupDDL", setEmpPosGrpDDL);
  }, []);

  // Get Position DDL
  const getEmployeePositionFetch = (empPosGrpId) => {
    if (empPosGrpId) {
      getDDL(
        `hcm/HCMDDL/GetPositionDDLForGrade?PositionGroupId=${empPosGrpId}`,
        setEmpHrPosDDL
      );
    }
  };

  // Get Single data
  useEffect(() => {
    if (profileData.accountId && posId && posGrpId) {
      fetchSingleData(profileData.accountId, posId, posGrpId, setSingleData);
    }
  }, []);

  // Bind row data [based on singleData come]
  useEffect(() => {
    if (singleData.length > 0) {
      let newData = singleData?.map((item) => ({
        empGradeId: item.empGradeId,
        baseGrade: {
          value: item.empBaseGrade,
          label: item.empBaseGrade,
        },
        code: item.empGradeCode,
        employeeGrade: item.empGradeName,
        employeeHrPosition: {
          code: item.positionCode,
          label: item.positionName,
          value: item.positionId,
        },
        employeePositionGroup: {
          code: item.positionGroupCode,
          label: item.positionGroupName,
          value: item.positionGroupId,
        },
      }));
      setRowData(newData);
    } else {
      setRowData([]);
    }
  }, [singleData]);

  // This will handle adding data in state
  const rowDataAddHandler = (values, setFieldValue, baseGrade = "") => {
    
    const foundData = rowData?.filter(
      (item) => values?.employeeGrade === item?.employeeGrade
    );
    if (foundData?.length > 0) {
      return toast.warn("Employee grade is already Exists");
    } else {
      setRowData([
        ...rowData,
        {
          sl: "",
          employeePositionGroup: values?.employeePositionGroup,
          employeeHrPosition: values?.employeeHrPosition,
          employeeGrade: values?.employeeGrade,
          baseGrade: baseGrade,
          code: values?.code,
        },
      ]);
    }
    setFieldValue("employeeGrade", "");
    setFieldValue("code", "");
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={empGradeId ? "Edit Employee Grade" : "Create Employee Grade"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={empGradeId}
    >
      
      <div>
      {isDisabled && <Loading/>}
        <Form
          {...objProps}
          initData={
            empGradeId
              ? {
                  employeePositionGroup: {
                    value: singleData[0]?.positionGroupCode,
                    label: singleData[0]?.positionGroupName,
                  },
                  employeeHrPosition: {
                    value: singleData[0]?.positionCode,
                    label: singleData[0]?.positionName,
                  },
                  employeeGrade: "",
                  code: "",
                }
              : initData
          }
          saveHandler={saveHandler}
          isEdit={empGradeId}
          empPosGrpDDL={empPosGrpDDL}
          empHrPosDDL={empHrPosDDL}
          rowData={rowData}
          setRowData={setRowData}
          rowDataAddHandler={rowDataAddHandler}
          getEmployeePositionFetch={getEmployeePositionFetch}
        />
      </div>
    </IForm>
  );
}
