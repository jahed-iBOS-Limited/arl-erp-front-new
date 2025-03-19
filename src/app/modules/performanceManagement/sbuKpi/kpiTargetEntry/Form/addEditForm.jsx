/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import axios from "axios";
import Form from "./form";
import {
  getBSCPerspectiveDDLAction,
  getWeightDDLAction,
  getYearDDLAction,
  saveKpiTargetAction,
  getKpiEntryById,
  setKpiTargetSingleEmpty,
  SetEmployeeBasicInfoEmptyAction,
  getObjectiveDDLAction,
  getDataSourceDDLAction,
} from "../../../_redux/Actions";
import { BrowserRouter, Route, useParams } from "react-router-dom";
import ViewModal from "./detailsView";
import IForm from "../../../../_helper/_form";
import { toArray } from "lodash";
import { getPMSFrequencyDDLAction } from "../../../../_helper/_redux/Actions";
import {
  getStrategicParticularsGridAction,
  setParticullersGridEmpty,
} from "../../../_redux/Actions";
import { getSbuDDLAction } from "../../../individualKpi/balancedScore/_redux/Actions";
import { getPmsReportAction } from "../../../_helper/getReportAction";

const initData = {
  kpiformat: "",
  objective: "",
  bscPerspective: "",
  kpiname: "",
  weight: "",
  dataSource: "",
  maxiMini: "",
  sbu: "",
  year: "",
  aggregationType: "",
  section: "",
};

export default function SBuKpiEntryForm({ isView, data }) {
  const [isDisabled, setDisabled] = useState(true);

  const { id, sectionId } = useParams();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const sbuDDL = useSelector((state) => {
    return state?.inDividualBalancedScore?.sbuDDL;
  }, shallowEqual);

  // get year ddl from store
  const yearDDL = useSelector((state) => {
    return state?.performanceMgt?.yearDDL;
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

  // data source ddl
  const dataSourceDDL = useSelector((state) => {
    return state?.performanceMgt?.dataSourceDDL;
  }, shallowEqual);

  const dispatch = useDispatch();

  const [report, setReport] = useState({});

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getSbuDDLAction(profileData.accountId, selectedBusinessUnit.value)
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
        const objHeader = {
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          sbuid: objValues.sbu.value,
          employeeId: 0,
          employeeName: "",
          departmentId: 0,
          kpiforId: 3,
          kpifor: "SBU",
          yearId: objValues.year?.value,
          sectionId: objValues.section?.value || 0,
          sectionName: objValues.section?.label || "",
          yearName: objValues.year?.label,
          actionBy: profileData.userId,
        };
        const objRow = {
          aggregationTypeName: objValues.aggregationType.value,
          objectiveId: objValues.objective?.value,
          targetFrequencyId: objValues.targetFrequency.value,
          targetFrequency: objValues.targetFrequency.label,
          bscperspectiveId: objValues.bscPerspective.value,
          kpiMasterId: objValues?.kpiname?.value,
          kpiname: objValues?.kpiname?.label,
          kpiformat: objValues.kpiformat?.value,
          // weightId: objValues.weight.value,
          weightId: 0,
          dataSource: objValues.dataSource.label,
          maxiMini: objValues.maxiMini?.value,
        };
        const data = toArray(objRowTargetAchivment)?.map((itm, index) => ({
          ...itm,
          target: +itm.target,
          previousYearTarget: +itm?.previousTarget,
        }));
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

  // dispatch get single pms action
  useEffect(() => {
    if (id) {
      dispatch(getKpiEntryById(+id, 3));
    }
  }, [id]);

  useEffect(() => {
    return () => {
      dispatch(setKpiTargetSingleEmpty());
      dispatch(SetEmployeeBasicInfoEmptyAction());
    };
  }, []);

  useEffect(() => {
    if (profileData && selectedBusinessUnit && singleData && id) {
      getPmsReportAction(
        setReport,
        selectedBusinessUnit.value,
        singleData?.objHeader?.sbuid,
        singleData?.objHeader?.yearId,
        0,
        0,
        false,
        3,
        sectionId
      );
    }
  }, [profileData, selectedBusinessUnit, singleData, id]);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getObjectiveDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          null,
          3,
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
          title={id ? "SBU KPI TARGET VIEW" : "SBU KPI TARGET ENTRY"}
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
            selectedBusinessUnit={selectedBusinessUnit}
            sbuDDL={sbuDDL}
            yearDDL={yearDDL}
            weightDDL={weightDDL}
            bscPerspectiveDDL={bscPerspectiveDDL}
            objectiveDDL={objectiveDDL}
            isEdit={id && true}
            dataSourceDDL={dataSourceDDL}
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
          />
        </IForm>
        <Route
          path="/performance-management/sbu-kpi/target/details/:typeId/:typeName"
          component={ViewModal}
        />
      </BrowserRouter>
    </>
  );
}
