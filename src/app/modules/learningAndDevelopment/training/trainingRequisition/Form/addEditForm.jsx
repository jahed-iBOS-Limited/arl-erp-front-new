import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { toast } from "react-toastify";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  trainingSchedule: "",
  employee: "",
  resourcePerson: "",
  designation: "",
  jobType: "",
  email: "",
  phone: "",
  gender: "",
  supervisor: "",
};
export default function TrainingRequisitionCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [requisitionList, setRequisitionList] = useState([]);
  const [, saveRequisition] = useAxiosPost();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (!requisitionList?.length)
      return toast.warn("Please add at least one Requisition");
    const payload = requisitionList?.map((item) => ({
      intRequisitionId: 0,
      scheduleName: item?.trainingSchedule?.name,
      strResourcePerson: item?.resourcePerson,
      strSupervisor: item?.supervisor,
      intScheduleId: item?.trainingSchedule?.value,
      strTrainingName: item?.trainingSchedule?.name,
      intEmployeeId: item?.employee?.value,
      strEmployeeName: item?.employee?.name,
      intBusinessUnitId: item?.designation?.businessUnitId,
      intDesignationId: item?.designation?.value,
      strDesignationName: item?.designation?.label,
      strEmail: item?.email,
      strPhoneNo: item?.phone,
      strGender: item?.gender,
      intSupervisorId: item?.designation?.supervisorId,
      intEmploymentTypeId: item?.jobType?.value,
      strEmploymentType: item?.jobType?.label,
      dteActionDate: _todayDate(),
      intActionBy: profileData?.userId,
      isActive: true,
      strApprovalStatus: "Pending",
      strComments: "",
      isFromRequisition: true,
    }));
    saveRequisition(
      `/hcm/Training/CreateTrainingRequisition`,
      payload,
      () => {
        setRequisitionList([]);
      },
      true
    );
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title="Create Training Requisition"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenBack={true}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        profileData={profileData}
        requisitionList={requisitionList}
        setRequisitionList={setRequisitionList}
      />
    </IForm>
  );
}
