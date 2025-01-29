import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { useLocation } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { toast } from "react-toastify";

const initData = {
  trainigName: "",
  duration: "",
  fromDate: "",
  toDate: "",
  monthYear: "",
  venue: "",
  resourcePerson: "",
  batchSize: "",
  batchNo: "",
  remarks: "",
  requestedPerson: "",
};
export default function TrainingScheduleCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [modifyData, setModifyData] = useState("");
  const location = useLocation();
  const [isRequested, setIsRequested] = useState(false);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [rowData, setRowData] = useState([]);
  const [, saveData] = useAxiosPost();

  useEffect(() => {
    if (location?.state?.intTrainingId) {
      const newData = {
        trainigName: {
          value: location?.state?.intTrainingId,
          label: location?.state?.strTrainingName,
        },
        duration: location?.state?.numTotalDuration,
        fromDate: _dateFormatter(location?.state?.dteFromDate),
        toDate: _dateFormatter(location?.state?.dteToDate),
        monthYear: `${location?.state?.intYear}-${
          location?.state?.intMonth?.toString()?.length < 2 ? "0" : ""
        }${location?.state?.intMonth}`,
        venue: location?.state?.strVenue,
        resourcePerson: location?.state?.strResourcePersonName,
        batchSize: location?.state?.intBatchSize,
        batchNo: location?.state?.strBatchNo,
        remarks: location?.state?.strRemarks,
        requestedPerson: {
          value: location?.state?.intRequestedByEmp,
          label: location?.state?.strEmployeeName,
        },
      };
      setIsRequested(location?.state?.isRequestedSchedule);
      setModifyData({ ...newData });
    }
  }, [location]);

  const saveHandler = async (values, cb) => {
    if (!location?.state?.intTrainingId && !rowData?.length)
      return toast.warn("Please add at least one Training Schedule");
    const createPayload =
      rowData?.length > 0 &&
      rowData?.map((item) => ({
        intTrainingId: +item?.trainigName?.value,
        strTrainingName: item?.trainigName?.label,
        intYear: item?.monthYear?.split("-")[0],
        intMonth: item?.monthYear?.split("-")[1],
        numTotalDuration: item?.duration,
        strVenue: item?.venue,
        strResourcePersonName: item?.resourcePerson,
        intBatchSize: item?.batchSize,
        strBatchNo: item?.batchNo,
        dteFromDate: item?.fromDate,
        dteToDate: item?.toDate,
        strRemarks: item?.remarks,
        isPublished: false,
        isActive: true,
        intActionBy: profileData?.userId,
        intUpdatedBy: 0,
        dteActionDate: _todayDate(),
        isRequestedSchedule: item?.isRequested,
        intRequestedByEmp: item?.requestedPerson?.value,
      }));

    const editPayload = {
      intScheduleId: location.state?.intScheduleId,
      intTrainingId: values?.trainigName?.value,
      strTrainingName: values?.trainigName?.label,
      intYear: values?.monthYear?.split("-")[0],
      intMonth: values?.monthYear?.split("-")[1],
      numTotalDuration: values?.duration,
      strVenue: values?.venue,
      strResourcePersonName: values?.resourcePerson,
      intBatchSize: values?.batchSize,
      strBatchNo: values?.batchNo,
      dteFromDate: values?.fromDate,
      dteToDate: values?.toDate,
      strRemarks: values?.remarks,
      isPublished: false,
      isActive: true,
      intActionBy: 0,
      intUpdatedBy: profileData?.userId,
      dteUpdatedDate: _todayDate(),
      isRequestedSchedule: isRequested,
      intRequestedByEmp: values?.requestedPerson?.value,
    };

    saveData(
      location?.state?.intTrainingId
        ? `/hcm/Training/EditTrainingSchedule`
        : `/hcm/Training/CreateTrainingSchedule`,
      location?.state?.intTrainingId ? editPayload : createPayload,
      cb,
      true
    );
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title={
        location?.state?.intTrainingId
          ? "Edit Training Schedule"
          : "Create Training Schedule"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={location?.state?.intTrainingId ? modifyData : initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        rowData={rowData}
        setRowData={setRowData}
        profileData={profileData}
        isRequested={isRequested}
        setIsRequested={setIsRequested}
        location={location}
      />
    </IForm>
  );
}
