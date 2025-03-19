import React from "react";
import LiftingPlanReport from "./liftingPlanReport";
import { useSelector, shallowEqual } from "react-redux";
import LiftingEntry from "../liftingEntry/landing";

function LiftingPlan() {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  return (
    <>
      {selectedBusinessUnit?.value === 175 ? (
        <LiftingPlanReport />
      ) : (
        <LiftingEntry title="Lifting Plan Report" viewType="report"/>
      )}
    </>
  );
}

export default LiftingPlan;
