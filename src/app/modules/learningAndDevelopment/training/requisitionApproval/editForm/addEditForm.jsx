import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";

import { toast } from "react-toastify";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { useParams } from "react-router-dom";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

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
export default function TrainingRequisitionApprovalEdit() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [requisitionList, setRequisitionList] = useState([]);
  const [, saveRequisition] = useAxiosPost();
  const params = useParams();
  const [editData, getEditData] = useAxiosGet();
  const [modifyData, getModifyData] = useState(null);
  const [isFromRequisition, setIsFromRequisition] = useState(true);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  console.log("editData", editData);

  useEffect(() => {
    if (params?.editId) {
      getEditData(
        `/hcm/Training/GetTrainingRequisitionLanding?intScheduleId=${params?.editId}`,
        (data) => {
          getModifyData({
            trainingSchedule: {
              value: data[0]?.intScheduleId,
              label: data[0]?.scheduleName,
              name: data[0]?.strTrainingName,
            },
            employee: "",
            resourcePerson: data[0]?.strResourcePerson,
            designation: "",
            jobType: "",
            email: "",
            gender: "",
            supervisor: "",
          });
          setRequisitionList(
            data?.map((item) => ({
              trainingSchedule: {
                value: item?.intScheduleId,
                label: "",
                name: item?.strTrainingName,
              },
              employee: {
                value: item?.intEmployeeId,
                label: "",
                name: item?.strEmployeeName,
                code: "",
              },
              resourcePerson: item?.strResourcePerson,
              designation: {
                value: item?.intDesignationId,
                label: item?.strDesignationName,
                businessUnitId: item?.intBusinessUnitId,
                supervisorId: item?.intSupervisorId,
              },
              jobType: {
                value: item?.intEmploymentTypeId,
                label: item?.strEmploymentType,
              },
              email: item?.strEmail || "",
              phone: item?.strPhoneNo || "",
              gender: item?.strGender,
              supervisor: item?.strSupervisor,
              intRequisitionId: item?.intRequisitionId,
              isFromRequisition: item?.isFromRequisition,
            }))
          );
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.editId]);

  console.log("requisitionList", requisitionList);

  const saveHandler = async (values, cb) => {
    if (!requisitionList?.length)
      return toast.warn("Please add at least one Requisition");
    const payload = requisitionList?.map((item) => ({
      intRequisitionId: item?.intRequisitionId || 0,
      intScheduleId: item?.trainingSchedule?.value,
      strTrainingName: item?.trainingSchedule?.name,
      intEmployeeId: item?.employee?.value,
      strEmployeeName: item?.employee?.name,
      intBusinessUnitId: item?.designation?.businessUnitId,
      intDesignationId: item?.designation?.value,
      strDesignationName: item?.designation?.label,
      strEmail: item?.emil || "",
      strPhoneNo: item?.phone || "",
      strGender: item?.gender,
      intSupervisorId: item?.designation?.supervisorId,
      strSupervisor: item?.supervisor,
      intEmploymentTypeId: item?.jobType?.value,
      strEmploymentType: item?.jobType?.label,
      dteActionDate: _todayDate(),
      intActionBy: profileData?.userId,
      isActive: true,
      strApprovalStatus: "Pending",
      strComments: "",
      isFromRequisition: item?.isFromRequisition,
    }));
    saveRequisition(
      `/hcm/Training/EditTrainingRequisition`,
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
      title="Edit Training Requisition"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.editId ? modifyData : initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        profileData={profileData}
        requisitionList={requisitionList}
        setRequisitionList={setRequisitionList}
        isFromRequisition={isFromRequisition}
        setIsFromRequisition={setIsFromRequisition}
      />
    </IForm>
  );
}
