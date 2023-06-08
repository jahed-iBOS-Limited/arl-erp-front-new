import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";

export const getPurposeDDL = async (setter) => {
  try {
    let res = await axios.get("/hcm/HCMDDL/GetOverTimePurposeListDDL");
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};


export const getEmpInfoById = async (id, setFieldValue) => {
  try {
    let res = await axios.get(`/hcm/HCMDDL/GetEmployeeDetailsByEmpId?EmpId=${id}`);
    let {employeeInfoDesignation} = res?.data
    setFieldValue(
      "designation",
      employeeInfoDesignation || ""
    );
  } catch (error) {
    return null;
  }
};

export const getWorkplaceDDL_api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/WorkPlace/GetWorkPlace?accountId=${accId}&businessUnitId=${buId}`
    );
    const modfid = res?.data?.map((item) => ({
      value: item?.workplaceId,
      label: item?.workplaceName,
      code: item?.workplaceCode,
      workplaceGroupId: item?.workplaceGroupId,
    }));
    setter(modfid);
  } catch (error) {
    setter([]);
  }
};

export const saveOverTime = async (
  rowDto,
  profileData,
  selectedBusinessUnit,
  setLoading
) => {
  try {
    
    if (rowDto?.length < 1)
      return toast.warn("Please add atleast one overtime");
      setLoading(true);
    let employeeId;
    let workPlaceId;

    let data = rowDto?.map((item) => {
      console.log("item", item)
      let diff = item.difference.split(":");
      let hour = `${diff[0]}.${diff[1]}`;

      employeeId = item?.employee?.value;
      workPlaceId = item?.workPlace?.value;

      return {
        dteDate: item?.date,
        tmStartTime: item?.startTime,
        tmEndTime: item?.endTime,
        numHours: +hour,
        intPurposeId: item?.purpose?.value || 0,
        strPurpose: item?.purpose?.label || "",
        strRemarks: item?.remarks || "",
      };
    });

    let payload = {
      employeeId,
      businessUnitId: selectedBusinessUnit?.value,
      workPlaceId : workPlaceId,
      insertBy: profileData?.userId,
      insertDateTime: _todayDate(),
      overTimeLine: data,
    };

    const res = await axios.post(
      "/hcm/HCMOverTime/CreateOverTimeEntry",
      payload
    );
    setLoading(false);
    toast.success(res?.data?.message || "Submitted Successfully");
  } catch (error) {
    console.log("Error", error);
    setLoading(false);
    toast.error(
      error?.response?.data?.message || "Something went wrong, try again"
    );
  }
};

export const getDifferenceBetweenTime = (date, startTime, endTime) => {
  var date1 = new Date(`${date} ${startTime}`);
  var date2 = new Date(`${date} ${endTime}`);

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return _dateFormatter(result);
  }

  // console.log(addDays(date, 1));

  var diff = date2.getTime() - date1.getTime();

  if (date2.getTime() < date1.getTime()) {
    let nextDate = addDays(date, 1);
    let nextDateTime = new Date(`${nextDate} ${endTime}`);
    diff = nextDateTime.getTime() - date1.getTime();
  }

  var msec = diff;
  var hh = Math.floor(msec / 1000 / 60 / 60);
  msec -= hh * 1000 * 60 * 60;
  var mm = Math.floor(msec / 1000 / 60);
  msec -= mm * 1000 * 60;
  var ss = Math.floor(msec / 1000);
  msec -= ss * 1000;

  if (hh < 10) {
    hh = `0${hh}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  if (ss < 10) {
    ss = `0${ss}`;
  }

  let difference = `${hh}:${mm}:${ss}`;

  return difference;
};

export const getOvertimeByEmp = async (empId, buId, setRowDto) => {
  try {
    const res = await axios.get(
      `/hcm/HCMOverTime/GetOverTimeByBUIdEmpId?BusinessUnitId=${buId}&EmployeeId=${empId}`
    );
    let data = res?.data?.map((item) => {
      console.log("item", item)
      let startTime = item?.startTime?.split(":");
      startTime = `${startTime[0]}:${startTime[1]}`;

      let endTime = item?.endTime?.split(":");
      endTime = `${endTime[0]}:${endTime[1]}`;

      let date = _dateFormatter(item?.date);

      let difference = getDifferenceBetweenTime(date, startTime, endTime);
      console.log("t", startTime, endTime, difference);

      return {
        employee: { value: item?.employeeId, label: "" },
        workPlace: { value: item?.workplaceId, label: "" },
        date: date,
        startTime: item?.startTime,
        endTime: item?.endTime,
        hour: item?.hours,
        purpose: { value: item?.purposeId, label: item?.purpose },
        remarks: item?.remarks,
        enroll: empId,
        difference: difference,
        countableHour: difference,
      };
    });
    setRowDto(data);
  } catch (error) {
    setRowDto([]);
  }
};
