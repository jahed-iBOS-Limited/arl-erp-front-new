import axios from "axios";
import { isArray } from "lodash";
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

export const getEmployeeAttendenceDetailsReport = async (
  empId,
  endDay,
  month,
  year,
  setter
) => {
  try {
    let res = await axios.get(
      `/hcm/HCMLeaveAndMovementReport/GetAttendanceSummaryCalenderView?EmployeeId=${empId}&Monthy=${month}&Year=${year}`
    );

    if (res.status === 200 && isArray(res.data)) {
      let index = res?.data?.findIndex((item) => item?.DayNumber === 1);
      let indexLast = res?.data?.findIndex(
        (item) => item?.DayNumber === +endDay
      );
      let newData = res?.data?.slice(index, indexLast + 1);
      setter(newData);
    }
  } catch (error) {
    setter([]);
  }
};
