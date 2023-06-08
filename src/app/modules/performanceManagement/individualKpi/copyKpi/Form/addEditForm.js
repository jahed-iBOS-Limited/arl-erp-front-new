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
  getKpiEntryById,
  setKpiTargetSingleEmpty,
  SetEmployeeBasicInfoEmptyAction,
  getObjectiveDDLAction,
  getDataSourceDDLAction,
  deleteIndividualKPIByIdAction,
  getKpiEditedSingleDataAction,
} from "../../../_redux/Actions";
import { BrowserRouter, Route, useParams } from "react-router-dom";
import ViewModal from "./detailsView";
import IForm from "../../../../_helper/_form";
import { getPMSFrequencyDDLAction } from "../../../../_helper/_redux/Actions";
import IConfirmModal from "./../../../../_helper/_confirmModal";
import {
  getStrategicParticularsGridAction,
  setParticullersGridEmpty,
} from "../../../_redux/Actions";
import { saveCopyKpiForEmployee, saveCopyKpiForYear } from "./../helper";
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
};

export default function CopyKpiForm({ isView, data }) {
  const [isDisabled, setDisabled] = useState(false);
  const [gridData, setGridData] = useState([]);

  const [report, setReport] = useState({});

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
  const yearDDLFromRedux = useSelector((state) => {
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

  const dispatch = useDispatch();

  const getKpiEditedSingleData = (empId) => {
    dispatch(getKpiEditedSingleDataAction(empId, 1));
  };

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getEmpDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
      dispatch(
        getYearDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
      dispatch(getBSCPerspectiveDDLAction());

      dispatch(
        getWeightDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );

      dispatch(
        getDataSourceDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      dispatch(getPMSFrequencyDDLAction());
      dispatch(
        getScaleForValueDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          1
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const getBscPerspectiveDefaultValue = (id) => {
    return axios.get(`/pms/CommonDDL/BSCPerspectiveDDLByObjId?ObjId=${id}`);
  };

  const saveHandler = async (values, gridData, cb) => {
    setDisabled(true);
    try {
      setDisabled(false);
      if (
        values &&
        gridData &&
        profileData?.accountId &&
        selectedBusinessUnit?.value
      ) {
        const payload = {
          fromEmployeeId: values?.employee?.value,
          toEmployeeId: values?.copyEmployee?.value,
          fromYearId: values?.year?.value,
          toYearId: values?.copyYear?.value,
        };

        if (values?.selectedType?.label === "Employee") {
          saveCopyKpiForEmployee(payload, cb, setDisabled);
        } else {
          saveCopyKpiForYear(gridData, values, cb, setDisabled);
        }
      }
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
      1
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
          0
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
          title={"Copy KPI"}
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
            commonYearDDL={yearDDLFromRedux}
            dataSourceDDL={dataSourceDDL}
            weightDDL={weightDDL}
            bscPerspectiveDDL={bscPerspectiveDDL}
            objectiveDDL={objectiveDDL}
            employeeBasicInfo={singleData?.objHeader || employeeBasicInfo}
            getEmployeeBasicInfo={getEmployeeBasicInfo}
            isEdit={id && true}
            id={id}
            gridData={gridData}
            setGridData={setGridData}
            viewRowDto={singleData?.objRow || false}
            frequencyDDL={frequencyDDL}
            report={report}
            setReport={setReport}
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
