/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import axios from "axios";
import Form from "./form";
import {
  getEmpDDLAction,
  getBSCPerspectiveDDLAction,
  getWeightDDLAction,
  getScaleForValueDDLAction,
  getYearDDLAction,
  getEmployeeBasicInfoByIdAction,
  saveKpiTargetAction,
  getKpiEntryById,
  setKpiTargetSingleEmpty,
  SetEmployeeBasicInfoEmptyAction,
  getObjectiveDDLAction,
  getDataSourceDDLAction,
  deleteIndividualKPIByIdAction,
  getKpiEditedSingleDataAction,
  saveCopyKpiTargetAction,
} from "../../../_redux/Actions";
import { BrowserRouter, Route, useParams } from "react-router-dom";
import ViewModal from "./detailsView";
import IForm from "../../../../_helper/_form";
import { toArray } from "lodash";
import { getPMSFrequencyDDLAction } from "../../../../_helper/_redux/Actions";
import IConfirmModal from "./../../../../_helper/_confirmModal";
import {
  getStrategicParticularsGridAction,
  setParticullersGridEmpty,
} from "../../../_redux/Actions";
import { toast } from "react-toastify";
import { getPmsReportAction } from "../../../_helper/getReportAction";

const initData = {
  kpiformat: "",
  objective: "",
  bscPerspective: "",
  kpiname: "",
  weight: "",
  dataSource: "",
  maxiMini: "",
  employee: "",
  year: "",
  aggregationType: "",
  operator: "",
  url: "",
  isDailyEntry: false,
  selectedType: "",
  copyEmployee: "",
  copyYear: "",
  benchmark: "",
};

export default function KpiEntryForm({ isView, data }) {
  const [isDisabled, setDisabled] = useState(true);

  const { id } = useParams();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get employee basic info from store
  const employeeBasicInfo = useSelector((state) => {
    return state?.performanceMgt?.employeeBasicInfo;
  }, shallowEqual);

  // get emplist ddl from store
  const empDDL = useSelector((state) => {
    return state?.performanceMgt?.empDDL;
  }, shallowEqual);

  // get year ddl from store
  const yearDDL = useSelector((state) => {
    return state?.performanceMgt?.yearDDL;
  }, shallowEqual);

  // data source ddl
  const dataSourceDDL = useSelector((state) => {
    return state?.performanceMgt?.dataSourceDDL;
  }, shallowEqual);

  // get objectiveDDL from store
  const objectiveDDL = useSelector((state) => {
    return state?.performanceMgt?.objectiveDDL;
  }, shallowEqual);

  // get bscPerspectiveDDL from store
  const bscPerspectiveDDL = useSelector((state) => {
    return state?.performanceMgt?.bscPerspectiveDDL;
  }, shallowEqual);

  // get weightDDL from store
  const weightDDL = useSelector((state) => {
    return state?.performanceMgt?.weightDDL;
  }, shallowEqual);

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.performanceMgt?.singleData;
  }, shallowEqual);

  // get frequencyDDL from common store
  const frequencyDDL = useSelector((state) => {
    return state?.commonDDL?.frequencyDDL;
  }, shallowEqual);

  // get strategicParticularsGrid from common store
  const strategicParticularsGrid = useSelector((state) => {
    return state?.performanceMgt?.strategicParticularsGrid;
  }, shallowEqual);

  // table report data
  const [report, setReport] = useState({});

  const dispatch = useDispatch();

  const getKpiEditedSingleData = (empId) => {
    dispatch(getKpiEditedSingleDataAction(empId, 1));
  };

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getEmpDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
      dispatch(
        getYearDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
      dispatch(getBSCPerspectiveDDLAction());

      dispatch(
        getWeightDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );

      dispatch(
        getDataSourceDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      dispatch(getPMSFrequencyDDLAction());
      dispatch(
        getScaleForValueDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          1
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const getBscPerspectiveDefaultValue = (id) => {
    return axios.get(`/pms/CommonDDL/BSCPerspectiveDDLByObjId?ObjId=${id}`);
  };

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    try {
      setDisabled(false);
      if (values && profileData?.accountId && selectedBusinessUnit?.value) {
        const { objValues, objRowTargetAchivment } = values;
        const employeeName = objValues.employee.label.split("[")[0];
        const objHeader = {
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          sbuid: 0,
          employeeId: objValues.employee.value,
          employeeName,
          departmentId: 0,
          kpiforId: 1,
          kpifor: "Employee",
          yearId: objValues.year?.value,
          yearName: objValues.year?.label,
          actionBy: profileData.userId,
        };

        const objRow = {
          aggregationTypeName: objValues?.aggregationType?.value,
          objectiveId: objValues?.objective?.value,
          targetFrequencyId: objValues?.targetFrequency?.value,
          targetFrequency: objValues?.targetFrequency?.label,
          bscperspectiveId: objValues?.bscPerspective?.value,
          kpiMasterId: objValues?.kpiname?.value,
          kpiname: objValues?.kpiname?.label,
          kpiformat: objValues?.kpiformat?.value,
          weightId: objValues?.weight?.value,
          dataSource: objValues?.dataSource?.label,
          maxiMini: objValues?.maxiMini?.value,
          operator: objValues?.operator,
          url: objValues?.url,
          isDailyEntry: objValues?.isDailyEntry,
          benchmark: +objValues?.benchmark || 0,
        };

        const data = toArray(objRowTargetAchivment)?.map((itm, index) => ({
          ...itm,
          target: +itm.target,
        }));
        if (values?.objValues?.selectedType === "") {
          dispatch(
            saveKpiTargetAction({
              data: {
                objHeader,
                objRow,
                objRowTargetAchivment: data,
              },
              cb,
            })
          );
        } else {
          if (
            values?.objValues?.selectedType?.label === "Employee" &&
            !values?.objValues?.copyEmployee
          )
            return toast.warn("Please add Employee!");
          if (
            values?.objValues?.selectedType?.label === "Year" &&
            !values?.objValues?.copyYear
          )
            return toast.warn("Please add Year!");

          dispatch(
            saveCopyKpiTargetAction(
              //copyFrom
              values?.objValues?.selectedType?.label === "Employee"
                ? values?.objValues?.copyEmployee?.value || ""
                : 0,
              //copyTo
              values?.objValues?.employee?.value,
              //copyFrom year
              values?.objValues?.selectedType?.label === "Employee"
                ? 0
                : values?.objValues?.copyYear?.value,
              //copyTo year
              values?.objValues?.year?.value
            ),
            cb
          );
        }
      }
      console.log(values, "values");
    } catch (error) {
      setDisabled(false);
    }
  };

  useEffect(() => {
    return () => dispatch(setParticullersGridEmpty());
  }, []);

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  // call employee basicinfo action
  const getEmployeeBasicInfo = (empid) => {
    dispatch(getEmployeeBasicInfoByIdAction(empid));
  };

  // dispatch get single pms action
  useEffect(() => {
    if (id) {
      dispatch(getKpiEntryById(+id, 1));
    }
  }, [id]);

  useEffect(() => {
    return () => {
      dispatch(setKpiTargetSingleEmpty());
      dispatch(SetEmployeeBasicInfoEmptyAction());
    };
  }, []);

  useEffect(() => {
    if (singleData) {
      console.log("hello");
      getReport();
    }
  }, [singleData]);

  const getReport = (values) => {
    getPmsReportAction(
      setReport,
      selectedBusinessUnit.value,
      singleData?.objHeader?.employeeId,
      singleData?.objHeader?.yearId,
      0,
      0,
      false,
      1,
    );
  };

  const deleteIndividualKPIById = (kpiId, values) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to delete`,
      yesAlertFunc: () => {
        dispatch(deleteIndividualKPIByIdAction(kpiId, getReport, values));
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getObjectiveDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          null,
          1,
          11
        )
      );
    }
  }, [profileData, selectedBusinessUnit]);

  // dipatch getStrategicParticularsGridAction
  const getStrategicParticularsGridActionDispatcher = (frequencyId, year) => {
    dispatch(
      getStrategicParticularsGridAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        year?.value,
        year?.label,
        frequencyId,
        1
      )
    );
  };

  const [objProps, setObjprops] = useState({});

  return (
    <>
      <BrowserRouter>
        <IForm
          title={id ? "KPI TARGET VIEW" : "KPI TARGET ENTRY"}
          getProps={setObjprops}
          isDisabled={isDisabled}
          isHiddenSave={id ? true : false}
          isHiddenReset={id ? true : false}
        >
          <Form
            {...objProps}
            initData={singleData || initData}
            saveHandler={saveHandler}
            disableHandler={disableHandler}
            accountId={profileData?.accountId}
            profileData={profileData}
            selectedBusinessUnit={selectedBusinessUnit}
            empDDL={empDDL}
            yearDDL={yearDDL}
            dataSourceDDL={dataSourceDDL}
            weightDDL={weightDDL}
            bscPerspectiveDDL={bscPerspectiveDDL}
            objectiveDDL={objectiveDDL}
            employeeBasicInfo={singleData?.objHeader || employeeBasicInfo}
            getEmployeeBasicInfo={getEmployeeBasicInfo}
            isEdit={id && true}
            id={id}
            report={report}
            setReport={setReport}
            viewRowDto={singleData?.objRow || false}
            frequencyDDL={frequencyDDL}
            strategicParticularsGrid={strategicParticularsGrid?.data}
            frequencyId={strategicParticularsGrid?.frequencyId}
            getBscPerspectiveDefaultValue={getBscPerspectiveDefaultValue}
            getStrategicParticularsGridActionDispatcher={
              getStrategicParticularsGridActionDispatcher
            }
            deleteIndividualKPIById={deleteIndividualKPIById}
            getKpiEditedSingleData={getKpiEditedSingleData}
          />
        </IForm>
        <Route
          path="/human-capital-management/performance_mgt/kpitarget-entry/details/:typeId/:typeName"
          component={ViewModal}
        />
      </BrowserRouter>
    </>
  );
}
