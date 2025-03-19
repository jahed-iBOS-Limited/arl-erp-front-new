/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Form from "./form";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import IForm from "./../../../../_helper/_form";
import HorizonTable from "./horizonTable";
import HorizonWeekTable from "./horizonWeekTable";
import {
  createHorizon,
  getPlantDDL,
  getYearDDL,
  getHorizonTypeDDL,
  getDaysInMonth,
  getWeekInYear,
} from "../helper";

const initData = {
  plant: "",
  year: "",
  horizon: "",
  schedulingHorizon: "",
};

const yearDetails = [
  { strPlanningHorizonName: "January", intSubHorizonId: 1 },
  { strPlanningHorizonName: "February", intSubHorizonId: 2 },
  { strPlanningHorizonName: "March", intSubHorizonId: 3 },
  { strPlanningHorizonName: "April", intSubHorizonId: 4 },
  { strPlanningHorizonName: "May", intSubHorizonId: 5 },
  { strPlanningHorizonName: "June", intSubHorizonId: 6 },
  { strPlanningHorizonName: "July", intSubHorizonId: 7 },
  { strPlanningHorizonName: "August", intSubHorizonId: 8 },
  { strPlanningHorizonName: "September", intSubHorizonId: 9 },
  { strPlanningHorizonName: "October", intSubHorizonId: 10 },
  { strPlanningHorizonName: "November", intSubHorizonId: 11 },
  { strPlanningHorizonName: "December", intSubHorizonId: 12 },
];

const HorizonForm = () => {
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState("");

  // All DDL
  const [plantNameDDL, setPlantNameDDL] = useState([]);
  const [horizonYearDDL, setHorizonYearDDL] = useState([]);
  const [horizonTypeDDL, setHorizonTypeDDL] = useState([]);
  const [horizonType, setHorizonType] = useState("");
  const [horizonYear, setHorizonYear] = useState("");
  const [gridData, setGridData] = useState([]);
  const [gridWeekData, setGridWeekData] = useState([]);
  const [dataVisible, setDataVisible] = useState(true);

  console.log('gridweekdata: ', gridWeekData)

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Fetch All DDL
  useEffect(() => {
    getPlantDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantNameDDL
    );
    getYearDDL(setHorizonYearDDL);
    getHorizonTypeDDL(setHorizonTypeDDL);
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  //Load Horizon Year Data
  useEffect(() => {
    if(horizonType){
      if (horizonYear && horizonType.label == "Monthly Horizon") {
        setGridData(getDaysInMonth(yearDetails, horizonYear.label));
        setGridWeekData([]);
      } else if (horizonYear && horizonType.label == "Weekly Horizon") {
        setGridWeekData(getWeekInYear(horizonYear.label));
        setGridData([]);
      } else {
      }
    }
    else{}
  }, [horizonYear, horizonType]);

  // Get Single Data By Id
  useEffect(() => {
    if (id) {
      // getBeatById(id, setDisabled, setSingleData);
    }
  }, [id]);

  // Save Handler
  const saveHandler = (values, cb) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      // Create
      if (!id) {
        // eslint-disable-next-line no-unused-vars
        let payload = {
          objHeader: {
            intHorizonTypeId: values?.horizon.value,
            strPlanningHorizonTypeName: values?.horizon.label,
            intYearId: values?.year.label,
            dteStartDateTime: new Date(values?.year.label, 0, 1 + 1),
            dteEndDateTime: new Date(values?.year.label, 11, 31 + 1),
            intAccountId: profileData?.accountId,
            intBusinessUnitId: selectedBusinessUnit?.value,
            intPlantId: values?.plant?.value,
            intActionBy: profileData?.userId,
          },
          objRowList: gridData.length > 0 ? gridData : gridWeekData,
        };
        createHorizon(payload);
      }
      // Edit
      else {
        // eslint-disable-next-line no-unused-vars
        let payload = {
          beatId: +id,
          beatCode: values?.beatCode,
          beatName: values?.beatName,
          territoryId: values?.territory?.value,
          routeId: values?.route?.value,
          actionBy: profileData?.userId,
        };
        // editBeat(payload, setDisabled);
      }
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <>
      <IForm
        title={!id ? "Horizon Create" : "Horizon Edit"}
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={singleData || initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          plantNameDDL={plantNameDDL}
          setHorizonYearDDL={setHorizonYearDDL}
          horizonYearDDL={horizonYearDDL}
          horizonTypeDDL={horizonTypeDDL}
          setHorizonType={setHorizonType}
          horizonType={horizonType}
          setHorizonYear={setHorizonYear}
          dataVisible={dataVisible}
          setDataVisible={setDataVisible}
          gridData={gridData}
          gridWeekData={gridWeekData}
        />
        {dataVisible && gridData.length > 0 ? (
          <HorizonTable gridData={gridData} />
        ) : (
          ""
        )}
        {dataVisible && gridWeekData.length > 0 ? (
          <HorizonWeekTable gridWeekData={gridWeekData} />
        ) : (
          ""
        )}
      </IForm>
    </>
  );
};

export default HorizonForm;
