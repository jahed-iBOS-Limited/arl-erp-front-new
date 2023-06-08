import React from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import { EmpFuncDesgTable } from "./EmpFuncDesgTable";

const EmpFuncDesgLanding = () => {
  const history = useHistory();

  return (
    <ICustomCard
      title="Designation"
      createHandler={() =>
        history.push(
          "/human-capital-management/hcmconfig/empfundesignation/create"
        )
      }
    >
      <EmpFuncDesgTable />
    </ICustomCard>
  );
};

export default EmpFuncDesgLanding;
