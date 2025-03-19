import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./landing";
// import Loading from "../../../../_helper/_loading";
import ICustomCard from "../../../../_helper/_customCard";
import { getSBUDDL, getPlantDDL } from "../helper";

let initData = {
  sbu: "",
  plant: "",
  wereHouse: "",
  shopFloor: "",
  fromDate: "",
  toDate: "",
};

export function IssueProduction({ history }) {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );

  const [SBUDDL, setSBUDDL] = useState([]);
  const [plantDDL, setPlantDDL] = useState([]);
  const [wereDDL, setWareDDL] = useState([]);
  const [shopFloorDDL, setShopFloorDDL] = useState([]);

  useEffect(() => {
    getSBUDDL(profileData?.accountId, selectedBusinessUnit?.value, setSBUDDL);
    getPlantDDL(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );
  }, [profileData, selectedBusinessUnit]);

  return (
    <ICustomCard
      title={"Issue For Production"}
      createHandler={() =>
        history.push(
          `/inventory-management/warehouse-management/issueforproduction/create`
        )
      }
    >
      <div className="mt-0">
        <Form
          initData={initData}
          SBUDDL={SBUDDL}
          plantDDL={plantDDL}
          wereDDL={wereDDL}
          setWareDDL={setWareDDL}
          shopFloorDDL={shopFloorDDL}
          setShopFloorDDL={setShopFloorDDL}
        />
      </div>
    </ICustomCard>
  );
}
