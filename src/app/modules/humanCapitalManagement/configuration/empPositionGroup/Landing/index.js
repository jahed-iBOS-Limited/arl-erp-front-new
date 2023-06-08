import React from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import { EmpPositionGroupTable } from "./EmpPositionGroupTable";

const EmpPositionGroupLanding = () => {
  const history = useHistory();

  return (
    <ICustomCard
      title="Position Group"
      createHandler={() =>
        history.push(
          "/human-capital-management/hcmconfig/emppositiongroup/create"
        )
      }
    >
      <EmpPositionGroupTable />
    </ICustomCard>
  );
};

export default EmpPositionGroupLanding;
