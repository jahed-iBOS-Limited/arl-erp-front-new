import React from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import { EmploymentTypeTable } from "./EmploymentTypeTable";

const EmploymentTypeLanding = () => {
  const history = useHistory();

  return (
    <ICustomCard
      title="Employment Type"
      createHandler={() =>
        history.push(
          "/human-capital-management/hcmconfig/employmenttype/create"
        )
      }
    >
      <EmploymentTypeTable />
    </ICustomCard>
  );
};

export default EmploymentTypeLanding;
