/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useLocation } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import {
  getCostCenterDDL,
  getSingleData,
  getAssignToData,
  saveWorkOrderEdit,
  getServiceDDLForEdit,
  saveWorkOrderTaskData,
  getMaintananceTaskRowData,
  saveMntTaskforEdit,
} from "../helpers";

const initData = {
  workOrder: "",
  status: "",
  reparingType: "",
  startDate: "",
  priority: "",
  costCenter: "",
  service: "",
  assignTo: "",
  note: "",
  depService: "",
  amount: "",
  description: "",
};

export default function MaintenanceServiceForm({
  history,
  match: {
    params: { id },
  },
}) {
  const location = useLocation();
  const [isDisabled, setDisabled] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [singleData, setSingleData] = useState("");
  const [costCenter, setCostCenter] = useState([]);
  const [AssignTo, setAssignTo] = useState([]);
  const [serviceDDL, setServiceDDL] = useState([]);
  const [taskRowData, setTaskRowData] = useState([]);

  useEffect(() => {
    getSingleData(id, setSingleData);
    getMaintananceTaskRowData(id, setTaskRowData);
  }, []);

  useEffect(() => {
    if (singleData) {
      getCostCenterDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        singleData.sbuId,
        setCostCenter
      );
      getAssignToData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        singleData.sbuId,
        setAssignTo
      );
      getServiceDDLForEdit(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        singleData.plantId,
        singleData.warehouseId,
        setServiceDDL
      );
    }
  }, [singleData]);

  const onClickForServicesave = (values) => {
    const payload = {
      maintenanceId: +id,
      serviceId: values.depService.value,
      serviceName: values.depService.label,
      description: values.description,
      amount: +values.amount,
      insertBy: profileData?.userId,
      actionBy: profileData?.userId,
      isChecked: false,
    };
    saveWorkOrderTaskData(payload, id, setTaskRowData);
  };

  const onClickforMntTask = (index) => {
    let payload = taskRowData[index];
    saveMntTaskforEdit(payload);
  };

  // rowdto handler for catch data from row's input field in rowTable
  const rowDtoHandler = (name, value, sl) => {
    let data = [...taskRowData];
    let _sl = data[sl];
    if (name === "description") {
      _sl[name] = value;
    } else {
      _sl[name] = +value;
    }
    setTaskRowData(data);
  };

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      //console.log(values)
      const payload = {
        assetMaintenanceId: id,
        status: values.status.label,
        costCenterId: values.costCenter.value,
        costCenterName: values.costCenter.label,
        engineerEmployeeId: values.assignTo.value,
        engineerName: values.assignTo.label,
        notes: values.note || "",
        actionBy: profileData?.userId,
      };
      saveWorkOrderEdit(payload, cb, setDisabled);
    } else {
      setDisabled(false);
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  const [objProps, setObjprops] = useState({});

  return (
    <div className="AssetorderAbc">
      <IForm
        title="a Maintenance Service"
        getProps={setObjprops}
        isDisabled={isDisabled}
        isHiddenReset
      >
        <Form
          {...objProps}
          initData={id ? singleData : initData}
          saveHandler={saveHandler}
          // disableHandler={disableHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          singleData={singleData}
          location={location.state}
          costCenter={costCenter}
          AssignTo={AssignTo}
          serviceDDL={serviceDDL}
          onClickForServicesave={onClickForServicesave}
          taskRowData={taskRowData}
          setTaskRowData={setTaskRowData}
          rowDtoHandler={rowDtoHandler}
          onClickforMntTask={onClickforMntTask}
          maintainId={id}
          setDisabled={setDisabled}
        />
      </IForm>
    </div>
  );
}
