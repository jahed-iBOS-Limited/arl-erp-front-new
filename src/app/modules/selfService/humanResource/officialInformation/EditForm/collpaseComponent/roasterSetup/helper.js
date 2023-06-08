import axios from "axios";
import { toast } from "react-toastify";
import { _todayDate } from './../../../../../../_helper/_todayDate';


export const getCalenderDDL_api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetCalenderDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};
export const getCalenderRoasterDDL_api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetCalenderRosterDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};


// //administrativeId_api
// export const administrativeId_api = async (id, setter) => {
//   try {
//     const res = await axios.get(
//       `/hcm/AdministrativeInformation/GetAdministrativeInfoById?AdministrativeId=${id}`
//     );

//     if (res.status === 200 && res.data) {
//       setter(res.data);
//     }
//   } catch (error) {
    
//   }
// };

export const runningCalender_api = async (roasterHeaderId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMRosterReport/GetRosterGroupByCalenderIdDDL?RoasterGrpHeaderId=${roasterHeaderId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    
  }
};

//CREATE ROASTER SETUP
export const createRoasterSetup_api = async (
  empId,
  generateDate,
  actionBy,
  runningCalenderId,
  nextChangeDate,
  calenderType,
  roasterGroupHeaderId,
  cb,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/hcm/HCMCreateRosterGenerate/CreateRosterGenerate?intEmployeeId=${empId}&dteGenerateStartDate=${generateDate}&intActionBy=${actionBy}&intRunningCalendarId=${runningCalenderId}&dteNextChangeDate=${nextChangeDate}&strCalendarType=${calenderType}&intRosterGroupHeaderId=${roasterGroupHeaderId}`
    );

    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message || "Submitted unsuccessful");
    setDisabled(false);
  }
};

export const getRoasterSetupInfoById_api = async (employeeId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/EmployeeRosterGenerate/GetEmployeeRosterByEmployeeId?EmployeeId=${employeeId}`
    );
    if (res?.status === 200) {
      const {
        intCalenderGeneralId,
        strCalenderGeneralName,
        strCalendarType,
        intCalendarTypeId,
        intRosterGroupHeaderId,
        strRosterGroupHeaderName,
        intRunningCalendarId,
        strRosterCalendarName
       
      } = res?.data;

      const newData = {
        calenderType: {
          value: intCalendarTypeId,
          label: strCalendarType
        },
        calender: {
          value: intCalenderGeneralId || intRosterGroupHeaderId,
          label: strCalenderGeneralName || strRosterGroupHeaderName,
        },
        startingCalender: {
          value: intRunningCalendarId,
          label: strRosterCalendarName
        },
        generateDate: _todayDate(),
        nextChangeDate: _todayDate(),
        
        
      };

      setter(newData);
    }
  } catch (error) {}
};

export const editAdministrativeInformation_api = async (
  payload,
  setDisabled
) => {
  try {
    const res = await axios.put(
      "/hcm/AdministrativeInformation/EditAdministrativeInformation",
      payload
    );

    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message || "Submitted unsuccessful");
    setDisabled(false);
  }
};
// emp group ddl
export const getEployeeGroupDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMDDL/GetEmployeeGroupDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res.status === 200 && res.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};
