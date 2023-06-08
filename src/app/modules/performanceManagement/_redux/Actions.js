import * as requestFromServer from "./Api";
import { performanceMgtSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";

const { actions: slice } = performanceMgtSlice;

export const getReportAction = (
  buId,
  reportTypeRefId,
  yearId,
  fromMonth,
  toMonth,
  isDashboard,
  reportType,
  sectionId
) => (dispatch) => {
  return requestFromServer
    .getReport(
      buId,
      reportTypeRefId,
      yearId,
      fromMonth,
      toMonth,
      isDashboard,
      reportType,
      sectionId
    )
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetReportData(data));
      }
    });
};

export const setReportEmpty = () => async (dispatch) => {
  return dispatch(slice.SetReportEmpty());
};

export const getStrategicParticularsGridAction = (
  accId,
  buId,
  yearId,
  yearRange,
  frequencyId,
  loopCount
) => (dispatch) => {
  return requestFromServer
    .getStrategicParticularsGrid(
      accId,
      buId,
      yearId,
      yearRange,
      frequencyId,
      loopCount
    )
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetStrategicParticularsGrid({ data, frequencyId }));
      }
    });
};

// set single store empty
export const setParticullersGridEmpty = () => async (dispatch) => {
  return dispatch(slice.SetStrategicParticularsEmpty());
};

export const getCompetencyListAction = (accId, buId, employeeId) => (
  dispatch
) => {
  return requestFromServer
    .getCompetencyList(accId, buId, employeeId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetCompetencyList(data));
      }
    });
};
export const getValuesAndCompByEmpIdAction = (employeeId, yearId) => (
  dispatch
) => {
  return requestFromServer
    .getValuesAndCompByEmpId(employeeId, yearId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetValAndCompByEmpId(data[0]));
      }
    });
};
// value List
export const getValueListAction = (accId, buId) => (dispatch) => {
  return requestFromServer
    .getValueList(accId, buId)
    .then((res) => {
      if (res.status === 200) {
        return dispatch(slice.SetValuesList(res?.data));
      }
    })
    .catch((err) => {});
};

// employee basic info
export const getMeasuringScaleAction = (accId, buId) => (dispatch) => {
  return requestFromServer
    .getMeasuringScale(accId, buId)
    .then((res) => {
      if (res.status === 200) {
        return dispatch(slice.SetMeasuringScale(res?.data));
      }
    })
    .catch((err) => {});
};
export const getMeasuringScaleBottomAction = (accId, buId) => (dispatch) => {
  return requestFromServer
    .getMeasuringScaleButtom(accId, buId)
    .then((res) => {
      if (res.status === 200) {
        return dispatch(slice.SetMeasuringScaleButtom(res?.data));
      }
    })
    .catch((err) => {});
};

export const getEmpDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getEmpDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetEmpDDL(data));
    }
  });
};

export const getEmployeeBasicInfoByIdAction = (empId) => (dispatch) => {
  return requestFromServer
    .getEmployeeBasicInfoById(empId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetEmployeeBasicInfoById(data));
      }
    })
    .catch((err) => dispatch(slice.SetEmployeeBasicInfoById("")));
};

export const getBSCPerspectiveDDLAction = () => (dispatch) => {
  return requestFromServer.getBSCPerspectiveDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetBscPerspectiveDDL(data));
    }
  });
};

export const getObjectiveDDLAction = (accId, buId, typeId, objType, yearId) => (
  dispatch
) => {
  return requestFromServer
    .getObjectiveDDL(accId, buId, typeId, objType, yearId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetObjectiveDDL(data));
      }
    });
};

export const getUnFavDepSbuDDLAction = (buId, type, year) => (dispatch) => {
  return requestFromServer.getUnFavDepSbuDDL(buId, type, year).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetunFavDepSbuDDL(data));
    }
  });
};

export const getWeightDDLAction = (accId, buId, typeId) => (dispatch) => {
  return requestFromServer.getWeightDDL(accId, buId, typeId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetWeightDDL(data));
    }
  });
};

export const getScaleForValueDDLAction = (accId, buId, typeId) => (
  dispatch
) => {
  return requestFromServer
    .getScaleForValueDDL(accId, buId, typeId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetScaleForValueDDL(data));
      }
    });
};

export const getYearDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getYearDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetYearDDL(data));
    }
  });
};

export const getDataSourceDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getDataSourceDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetDataSourceDDL(data));
    }
  });
};

export const getValuesPopUpAction = (id) => (dispatch) => {
  return requestFromServer.getValuesPopUp(id).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetValuesPopUp(data));
    }
  });
};

export const getCompetencyPopUpAction = (id) => (dispatch) => {
  return requestFromServer.getCompetencyPopUp(id).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetCompetencyPopUp(data));
    }
  });
};

export const saveKpiTargetAction = (payload) => () => {
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};

export const saveCopyKpiTargetAction = (
  copyFromEmpId,
  copyToEmpId,
  copyFromYearId,
  copyToYearId
) => () => {
  return requestFromServer
    .saveCreateCopyData(
      copyFromEmpId,
      copyToEmpId,
      copyFromYearId,
      copyToYearId
    )
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        // copyFromEmpId && copyToEmpId && copyFromYearId.cb();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};

export const EditIndividualKpiTargetAction = (
  payload,
  indKpiTartCrPageRedirect
) => () => {
  console.log(indKpiTartCrPageRedirect);
  return requestFromServer
    .saveEditedIndividualKpiTarget(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        indKpiTartCrPageRedirect && indKpiTartCrPageRedirect();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};
export const saveValuesAndCompetencyAction = (payload) => () => {
  return requestFromServer
    .saveValuesAndCompetency(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};
// action for save edited data
export const updateValAndCompAction = (payload) => () => {
  return requestFromServer
    .saveEditData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
      }
    })
    .catch((err) => {
      console.log(err?.response);
      toast.error(err?.response?.data?.message);
    });
};
// action for get grid data
export const getKpiTargetGridData = (accId, buId, typeId) => (dispatch) => {
  return requestFromServer
    .getGridData(accId, buId, typeId)
    .then((res) => {
      return dispatch(slice.SetGridData(res.data?.data));
    })
    .catch((err) => {});
};

// get kpi details by pms id
export const getKpiEntryById = (id, type) => (dispatch) => {
  return requestFromServer
    .getDataById(id, type)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        const item = res.data[0];
        const data = {
          ...item,
          responsiblePerson: {
            value: item.responsiblePerson,
            label: item.responsiblePersonName,
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {});
};

export const getKpiEditedSingleDataAction = (kpiId, type) => (dispatch) => {
  return requestFromServer
    .getKpiEditedSingleData(kpiId, type)
    .then((res) => {
      if (res.status === 200 && isArray(res.data)) {
        const item = res.data[0];
        const data = {
          ...item,
          employee: {
            value: item?.objHeader?.employeeId,
            label: item?.objHeader?.employeeName,
          },
          department: {
            value: item?.objHeader?.departmentId,
            label: item?.objHeader?.departmentName,
          },
          sbu: {
            value: item?.objHeader?.sbuid,
            label: item?.objHeader?.sbuName,
          },
          year: {
            value: item?.objHeader?.yearId,
            label: item?.objHeader?.yearName,
          },
          section: {
            value: item?.objHeader?.sectionId,
            label: item?.objHeader?.sectionName,
          },
          benchmark: item?.objRow?.benchmark,
          objective: {
            value: item?.objRow?.objectiveId,
            label: item?.objRow?.objectiveName,
          },
          bscPerspective: {
            value: item?.objRow?.bscperspectiveId,
            label: item?.objRow?.bscperspectiveName,
          },
          kpiname: {
            value : item?.objRow?.kpiMasterId,
            label: item?.objRow?.kpiname
          },
          url: item?.objRow?.url || "",
          operator: item?.objRow?.operator || "",
          isDailyEntry: item?.objRow?.isDailyEntry || false,
          kpiformat: {
            value: item?.objRow?.kpiformat,
            label: item?.objRow?.kpiformat,
          },
          weight: {
            value: item?.objRow?.weightId,
            label: item?.objRow?.weightId,
          },
          dataSource: {
            value: item?.objRow?.dataSource,
            label: item?.objRow?.dataSource,
          },
          maxiMini: {
            value: item?.objRow?.maxiMini,
            label: item?.objRow?.maxiMiniName,
          },
          aggregationType: {
            value: item?.objRow?.aggregationType,
            label: item?.objRow?.aggregationType,
          },
          targetFrequency: {
            value: item?.objRow?.targetFrequencyId,
            label: item?.objRow?.targetFrequency,
          },
        };
        return dispatch(slice.SetIndividualKpiEditedSingleData(data));
      }
    })
    .catch((err) => {});
};

// set single store empty
export const setKpiTargetSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};

// set employee basicinfo  empty
export const SetEmployeeBasicInfoEmptyAction = () => async (dispatch) => {
  return dispatch(slice.SetEmployeeBasicInfoEmpty());
};

// set employee basicinfo  empty
export const SetValuesListEmptyAction = () => async (dispatch) => {
  return dispatch(slice.SetValuesListEmpty());
};
// set employee basicinfo  empty
export const SetCompetencyEmptyAction = () => async (dispatch) => {
  return dispatch(slice.SetCompetencyEmpty());
};
// set employee basicinfo  empty
export const SetValAndCompByEmpIdEmptyAction = () => async (dispatch) => {
  return dispatch(slice.SetValAndCompByEmpIdEmpty());
};

export const deleteIndividualKPIByIdAction = (
  kpiId,
  getReportAction,
  values
) => (dispatch) => {
  return requestFromServer
    .deleteIndividualKPIById(kpiId)
    .then((res) => {
      if (res.status === 200) {
        toast.success("Deleted Successfully");
        // get kpi report after deleted successfully
        getReportAction(values);
      }
    })
    .catch((err) => {
      toast.warn("Something went wrong");
    });
};

export const getNewKpiReportAction = (
  buId,
  reportTypeRefId,
  yearId,
  fromMonth,
  toMonth,
  isDashboard,
  reportType
) => (dispatch) => {
  return requestFromServer
    .getNewKpiReport(
      buId,
      reportTypeRefId,
      yearId,
      fromMonth,
      toMonth,
      isDashboard,
      reportType
    )
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetNewKpiReport(data));
      }
    });
};

// set employee basicinfo  empty
export const SetNewKpiReportEmptyAction = () => async (dispatch) => {
  return dispatch(slice.SetNewKpiReportEmpty());
};
