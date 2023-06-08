import React from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import { BonusNameTable } from "./bonusNameTable";

const BonusNameLanding = () => {
  const history = useHistory();

  return (
    <ICustomCard
      title="Bonus Name"
      createHandler={() =>
        history.push(
          "/human-capital-management/hcmconfig/createbonusname/create"
        )
      }
    >
      <BonusNameTable />
    </ICustomCard>
  );
};

export default BonusNameLanding;
