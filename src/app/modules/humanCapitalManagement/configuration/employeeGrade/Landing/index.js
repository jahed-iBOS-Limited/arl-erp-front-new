import React from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import { EmpGradeTable } from "./EmpGradeTable";

const EmpGradeLanding = () => {
  const history = useHistory();

  return (
    <ICustomCard
      title="Employee Grade"
      createHandler={() =>
        history.push("/human-capital-management/hcmconfig/empgrade/create")
      }
    >
      <EmpGradeTable />
    </ICustomCard>
  );
};

export default EmpGradeLanding;
