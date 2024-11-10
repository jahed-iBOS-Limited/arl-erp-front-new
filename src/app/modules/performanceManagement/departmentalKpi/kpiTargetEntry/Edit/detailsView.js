import React, { useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import IViewModal from "../../../_helper/_viewModal";

export default function DetailsView() {
  const [show, setShow] = useState(true);
  const history = useHistory();
  const { state } = useLocation();
  const { typeId, typeName } = useParams();

  const IInput = (props) => (
    <>
      <label className="mb-2">{props.label}:</label>
      <br />
      <input {...props} className="form-control" />
    </>
  );

  const months = [
    {
      abbreviation: "Jan",
      fullForm: "January",
      name: "numJanTarget",
    },
    {
      abbreviation: "Feb",
      fullForm: "February",
      name: "numFebTarget",
    },
    {
      abbreviation: "Mar",
      fullForm: "March",
      name: "numMarTarget",
    },
    {
      abbreviation: "Apr",
      fullForm: "April",
      name: "numAprTarget",
    },
    {
      abbreviation: "May",
      fullForm: "May",
      name: "numMayTarget",
    },
    {
      abbreviation: "Jun",
      fullForm: "June",
      name: "numJunTarget",
    },
    {
      abbreviation: "Jul",
      fullForm: "July",
      name: "numJulTarget",
    },
    {
      abbreviation: "Aug",
      fullForm: "August",
      name: "numAugTarget",
    },
    {
      abbreviation: "Sep",
      fullForm: "September",
      name: "numSepTarget",
    },
    {
      abbreviation: "Oct",
      fullForm: "October",
      name: "numOctTarget",
    },
    {
      abbreviation: "Nov",
      fullForm: "November",
      name: "numNovTarget",
    },
    {
      abbreviation: "Dec",
      fullForm: "December",
      name: "numDecTarget",
    },
  ];
  //quarters
  const quarters = [
    {
      label: "1st Quarter",
      name: "num1stQuarterlyTarget",
    },
    {
      label: "2nd Quarter",
      name: "num2ndQuarterlyTarget",
    },
    {
      label: "3rd Quarter",
      name: "num3rdQuarterlyTarget",
    },
    {
      label: "4th Quarter",
      name: "num4thQuarterlyTarget",
    },
  ];
  // Daily kpi target  view
  const dailyKpiTarget = (
    <div className="col-lg-3">
      <IInput
        value={state.numDailyTarget}
        disabled={true}
        type="number"
        label="Daily Avarage"
        name="numDailyTarget"
        min="0"
      />
      <span className="text-muted">Last year value: 0</span>
    </div>
  );

  // Montly kpi taret view
  const MonthlyKpiTarget = months.map((month, i) => (
    <div key={i} className="col-lg-3">
      <label>{month.abbreviation}</label>
      <IInput
        disabled={true}
        value={state[month.name]}
        type="text"
        name={month.name}
      />
      <span className="text-muted">Last year value: 0</span>
    </div>
  ));

  //Yearly kpi target view
  const yearlyKpitarget = (
    <div className="col-lg-3">
      <label>Yearly</label>
      <IInput
        value={state.numYearlyTarget}
        disabled={true}
        type="number"
        name="numYearlyTarget"
        min="0"
      />
      <span className="text-muted">Last year value: 0</span>
    </div>
  );

  // Quarterly kpi target view
  const quarterlyKpitarget = quarters.map((quarter, idx) => (
    <div key={idx} className="col-lg-3">
      <label>{quarter.label}</label>
      <IInput
        type="number"
        min="0"
        name={quarter.name}
        disabled={true}
        value={state[quarter.name]}
      />
      <span className="text-muted">Last year value: 0</span>
    </div>
  ));
console.log({state})
  return (
    <div>
      <IViewModal
        show={show}
        onHide={() => {
          setShow(false);
          history.goBack();
        }}
        title={typeName ? `${typeName} KPI Target` : ""}
        isShow={state && false}
      >
        <div className="kpiTargetInfo mt-2">
          <div className="d-flex">
            <p>Objective :</p>
            <p className="ml-2">{state.objective || state.objectiveName}</p>
          </div>
          <div className="d-flex">
            <p>KPI Name :</p>
            <p className="ml-2">{state.kpiname}</p>
          </div>
          <div className="d-flex">
            <p>KPI Format :</p>
            <p className="ml-2">{state.kpiformat?.label || state.kpiformat}</p>
          </div>
        </div>
        <div className="row py-4">
          {typeId == 1 ? (
            dailyKpiTarget
          ) : typeId == 4 ? (
            yearlyKpitarget
          ) : typeId == 2 ? (
            MonthlyKpiTarget
          ) : typeId == 3 ? (
            quarterlyKpitarget
          ) : (
            <></>
          )}
        </div>
      </IViewModal>
    </div>
  );
}
