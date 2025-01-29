/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import axios from "axios";
import Form from "./form";
import {
  getEmpDDLAction,
  getBSCPerspectiveDDLAction,
  getWeightDDLAction,
  getYearDDLAction,
  getEmployeeBasicInfoByIdAction,
  getKpiEntryById,
  setKpiTargetSingleEmpty,
  SetEmployeeBasicInfoEmptyAction,
  getObjectiveDDLAction,
  getKpiEditedSingleDataAction,
  EditIndividualKpiTargetAction,
  getDataSourceDDLAction,
} from "../../../_redux/Actions";
import { BrowserRouter, useParams } from "react-router-dom";
import IForm from "../../../../_helper/_form";
import { getPMSFrequencyDDLAction } from "../../../../_helper/_redux/Actions";
import {
  getStrategicParticularsGridAction,
  setParticullersGridEmpty,
} from "../../../_redux/Actions";
import { toArray } from "lodash";
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
  targetFrequency: "",
  section: "",
};

export default function SbuKpiEditForm({ isView, data }) {
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

  const singleData = useSelector((state) => {
    return state.performanceMgt?.singleData;
  }, shallowEqual);

  const editedSingleData = useSelector((state) => {
    return state.performanceMgt?.individualKpiEditedSingleData;
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    dispatch(getKpiEditedSingleDataAction(id, 3));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
          pmsid: +editedSingleData?.objHeader?.pmsid,
          accountId: +profileData.accountId,
          businessUnitId: +selectedBusinessUnit.value,
          sbuid: +objValues.sbu.value,
          employeeId: 0,
          employeeName: "",
          yearId: +objValues.year?.value,
          yearName: objValues.year?.label,
          sectionId: objValues.section?.value || 0,
          sectionName: objValues.section?.label || "",
          dteStartDate: "2020-10-08T10:37:49.823Z",
          dteEndDate: "2020-10-08T10:37:49.823Z",
          actionBy: +profileData.userId,
          departmentId: 0,
          kpiforId: 3,
          kpifor: "SBU",
        };
        const objRow = {
          kpiid: +id,
          objectiveId: +objValues.objective?.value,
          targetFrequencyId: +objValues.targetFrequency.value,
          targetFrequency: objValues.targetFrequency.label,
          bscperspectiveId: +objValues.bscPerspective.value,
          kpiMasterId: objValues?.kpiname?.value,
          kpiname: objValues?.kpiname?.label,
          kpiformat: objValues.kpiformat?.value,
          // weightId: +objValues.weight.value,
          weightId: 0,
          dataSource: objValues.dataSource.label,
          maxiMini: +objValues.maxiMini?.value,
          maxiMiniName: objValues.maxiMini?.label,
          aggregationType: objValues.aggregationType.label,
        };
        const data = toArray(objRowTargetAchivment)?.map((itm, index) => ({
          ...itm,
          target: +itm.target,
          previousYearTarget: +itm?.previousYearTarget,
        }));
        dispatch(
          EditIndividualKpiTargetAction({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getObjectiveDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          null,
          3
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

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
      dispatch(getKpiEntryById(+id, 3));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    return () => {
      dispatch(setKpiTargetSingleEmpty());
      dispatch(SetEmployeeBasicInfoEmptyAction());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [report, setReport] = useState({});

  useEffect(() => {
    if (profileData && selectedBusinessUnit && editedSingleData && id) {
      getPmsReportAction(
        setReport,
        selectedBusinessUnit.value,
        editedSingleData?.objHeader?.sbuid,
        editedSingleData?.objHeader?.yearId,
        0,
        0,
        false,
        3
      );
    }
  }, [profileData, selectedBusinessUnit, editedSingleData, id]);

  // dipatch getStrategicParticularsGridAction
  const getStrategicParticularsGridActionDispatcher = (frequencyId, year) => {
    dispatch(
      getStrategicParticularsGridAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        year?.value,
        year?.label,
        frequencyId,
        3
      )
    );
  };

  const [objProps, setObjprops] = useState({});

  return (
    <>
      <BrowserRouter>
        <IForm
          title="EDIT SBU KPI TARGET ENTRY"
          getProps={setObjprops}
          isDisabled={isDisabled}
          isHiddenReset={true}
        >
          <Form
            {...objProps}
            initData={editedSingleData || initData}
            saveHandler={saveHandler}
            disableHandler={disableHandler}
            accountId={profileData?.accountId}
            dataSourceDDL={dataSourceDDL}
            selectedBusinessUnit={selectedBusinessUnit}
            empDDL={empDDL}
            yearDDL={yearDDL}
            weightDDL={weightDDL}
            bscPerspectiveDDL={bscPerspectiveDDL}
            objectiveDDL={objectiveDDL}
            employeeBasicInfo={singleData?.objHeader || employeeBasicInfo}
            getEmployeeBasicInfo={getEmployeeBasicInfo}
            isEdit={true}
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
      </BrowserRouter>
    </>
  );
}
