import React from "react";
import ExistingTransportPolicyLanding from "./landing";
import { useSelector, shallowEqual } from "react-redux";
import TransportZoneRateReport from "./../../transportZoneRate/landing/index";
function ExistingTransportPolicy() {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  return (
    <>
      {/* if  Akij Poly Fibre Industries Ltd.*/}
      {selectedBusinessUnit?.value === 8 && <ExistingTransportPolicyLanding />}
      {selectedBusinessUnit?.value === 4 && (
        <TransportZoneRateReport title="Existing Transport Policy" />
      )}
    </>
  );
}

export default ExistingTransportPolicy;
