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
import { getCorporateDepertmentDDL } from "./../helper";
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
  corporate: "",
  year: "",
  aggregationType: "",
  section: "",
};

export default function CorporateKpiEntryForm({ isView, data }) {
  const [isDisabled, setDisabled] = useState(true);
  const [corporateDDL, setCorporateDDL] = useState([]);

  const { id } = useParams();
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

  useEffect(() => {
    getCorporateDepertmentDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setCorporateDDL
    );
  }, [profileData?.accountId && selectedBusinessUnit?.value]);

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
          // sbuid: objValues.sbu.value,
          sbuid: 0,
          employeeId: 0,
          employeeName: "",
          departmentId: 0,
          corporateDepartmentId: objValues.corporate?.value,
          kpiforId: 4,
          kpifor: "Corporate",
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
      dispatch(getKpiEntryById(+id, 4));
    }
  }, [id]);

  useEffect(() => {
    return () => {
      dispatch(setKpiTargetSingleEmpty());
      dispatch(SetEmployeeBasicInfoEmptyAction());
    };
  }, []);

  const [report, setReport] = useState({});

  useEffect(() => {
    if (profileData && selectedBusinessUnit && singleData && id) {
      getPmsReportAction(
        setReport,
        selectedBusinessUnit.value,
        singleData?.objHeader?.departmentId,
        singleData?.objHeader?.yearId,
        0,
        0,
        false,
        4
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
          4,
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
          title={
            id ? "CORPORATE KPI TARGET VIEW" : "CORPORATE KPI TARGET ENTRY"
          }
          getProps={setObjprops}
          isDisabled={isDisabled}
          isHiddenSave={id ? true : false}
          isHiddenReset={id ? true : false}
        >
          <Form
            {...objProps}
            report={report}
            setReport={setReport}
            initData={singleData || initData}
            saveHandler={saveHandler}
            disableHandler={disableHandler}
            accountId={profileData?.accountId}
            selectedBusinessUnit={selectedBusinessUnit}
            corporateDDL={corporateDDL}
            sbuDDL={sbuDDL}
            yearDDL={yearDDL}
            weightDDL={weightDDL}
            bscPerspectiveDDL={bscPerspectiveDDL}
            objectiveDDL={objectiveDDL}
            isEdit={id && true}
            dataSourceDDL={dataSourceDDL}
            id={id}
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
          path="/performance-management/corporate-kpi/target/details/:typeId/:typeName"
          component={ViewModal}
        />
      </BrowserRouter>
    </>
  );
}
