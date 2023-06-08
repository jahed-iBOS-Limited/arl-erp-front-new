/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./Form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useEffect } from "react";
import {
  getDepartmentDDLAction,
  getWorkplaceDDLAction,
  getOtShiftDDLAction,
  getCostCenterDDLAction,
  saveOvertimeReqAction,
} from "../helper";
import { toast } from "react-toastify";
import axios from "axios";

let initData = {
  reqDepartment: "",
  reqDate: _todayDate(),
  costCenter: "",
  workplace: "",
  reason: "",
  reqOtShift: "",
  hour: "",
  minutes: "",
  employee: "",
};

export function OverTimeRequisition() {
  const [isDisabled, setDisabled] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [objProps, setObjprops] = useState({});
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [otShiftDDL, setOtShiftDDL] = useState([]);
  const [costCenterDDL, setCostCenterDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);

  useEffect(() => {
    getDepartmentDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDepartmentDDL
    );
    getWorkplaceDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setWorkplaceDDL
    );
    getOtShiftDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setOtShiftDDL
    );
    getCostCenterDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setCostCenterDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const rowDtoAddHandler = async (values) => {
    if (!values?.reqDepartment) return toast.warn("Department is required");
    if (!values?.workplace) return toast.warn("Workplace is required");

    try {
      setDisabled(true);
      const res = await axios.get(
        `/hcm/HCMOvertimeRequisition/IsOvertimeRequisitionPossible?employeeId=${values?.employee?.value}&reqDate=${values?.reqDate}`
      );
      setDisabled(false);

      if (!res?.data) return toast.warn("Overtime exists in this date");

      if (values?.hour < 1 || values?.hour > 12)
        return toast.warn("Invalid hour");
      if (values?.minutes < 0 || values?.hour > 60)
        return toast.warn("Invalid minutes");

      const isExist = rowDto?.filter(
        (item) =>
          item?.employee?.value === values?.employee?.value &&
          item.reqDate === values?.reqDate
      );
      if (isExist?.length > 0) return toast.warn("Already Exists");

      const data = [...rowDto];
      data.push(values);
      setRowDto(data);
    } catch (error) {
      setDisabled(false);
      toast.warn("Try again later");
    }
  };

  const saveHandler = async (values, cb) => {
    if (rowDto?.length < 1) return toast.warn("Please add at least one row");
    saveOvertimeReqAction(
      profileData,
      selectedBusinessUnit?.value,
      rowDto,
      setRowDto,
      cb
    );
  };

  const remover = (id) => {
    const filterData = rowDto.filter((item, index) => id !== index);
    setRowDto(filterData);
  };

  const obj = {
    profileData,
    selectedBusinessUnit,
    initData,
    saveHandler,
    remover,
    departmentDDL,
    workplaceDDL,
    otShiftDDL,
    costCenterDDL,
    rowDtoAddHandler,
    rowDto,
  };

  return (
    <IForm
      title={"Overtime Requisition"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form {...objProps} obj={obj} />
      </div>
    </IForm>
  );
}
