import axios from "axios";
/* 
 Color Render For present, offday, leave, holiday, late, unprocessed, absent, movement, 
*/
export const colorList = {
  preset: {
    color: "green",
    backgroundColor: {
      backgroundColor: "rgba(52, 211, 153, 1)",
    },
  },
  late: {
    color: "yellow",
    backgroundColor: {
      backgroundColor: "rgba(251, 191, 36, 1)",
    },
  },
  offday: {
    color: "gray",
    backgroundColor: {
      backgroundColor: "rgba(156, 163, 175, 1)",
    },
  },
  absent: {
    color: "red",
    backgroundColor: {
      backgroundColor: "rgba(248, 113, 113, 1)",
    },
  },
  leave: {
    color: "indigo",
    backgroundColor: {
      backgroundColor: "rgba(129, 140, 248, 1)",
    },
  },
  movement: {
    color: "pink",
    backgroundColor: {
      backgroundColor: "rgba(244, 114, 182, 1)",
    },
  },
  holiday: {
    color: "pink",
    backgroundColor: {
      backgroundColor: "rgba(96, 165, 250, 1)",
    },
  },
  unprocessed: {
    color: "purple",
    backgroundColor: {
      backgroundColor: " rgba(167, 139, 250, 1)",
    },
  },
  default: {
    color: "default",
    backgroundColor: {
      backgroundColor: " rgba(229, 231, 235, 1)",
    },
  },
};

// Filter Single Dataset by day number
const singleDataSetFinder = (day, resDataset) => {
  return resDataset?.filter((item) => item?.dayNumber === +day)[0];
};

// Match All day from allday list with resData set and return final dataset
const matchDataset = (dateList, resDataset) => {
  const finalDataSetModify = dateList?.map((item) => {
    const singleResData = singleDataSetFinder(item, resDataset);
    if (singleResData) {
      return {
        dayName: singleResData?.dayName,
        dayNumber: singleResData?.dayNumber,
        dayOfWeek: singleResData?.dayOfWeek,
        intEmployeeId: singleResData?.intEmployeeId,
        monthDate: singleResData?.monthDate,
        monthName: singleResData?.monthName,
        presentStatus: singleResData?.presentStatus,
        weekOfMonth: singleResData?.weekOfMonth,
      };
    }
    return {
      dayName: "",
      dayNumber: 0,
      dayOfWeek: 0,
      intEmployeeId: 0,
      monthDate: "0",
      monthName: "",
      presentStatus: "-",
      weekOfMonth: 0,
    };
  });
  return finalDataSetModify;
};

export const getEmployeeAttendenceDetailsReport = async (
  empId,
  month,
  year,
  setter,
  allDayList
) => {
  try {
    let res = await axios.get(
      `/hcm/HCMLeaveAndMovementReport/GetAttendanceSummaryCalenderViewReport?EmployeeId=${empId}&Monthy=${month}&Year=${year}`
    );
    
    /*  **Last Change Assign | Md. Al Amin (CPO) */
    // if (res?.data?.length >= 28) {
    //   // ** Old Logic
    //   let index = res?.data?.findIndex((item) => item?.dayNumber === 1);
    //   let indexLast = res?.data?.findIndex(
    //     (item) => item.dayNumber === +endDay
    //   );
    //   // console.log(index, indexLast);
    //   let newData = res?.data?.slice(index, indexLast + 1);
    //   // console.log("new data", newData);
    //   setter(newData);
    // } else {}
    
    setter(matchDataset(allDayList, res?.data));
  } catch (error) {
    setter([]);
  }
};
