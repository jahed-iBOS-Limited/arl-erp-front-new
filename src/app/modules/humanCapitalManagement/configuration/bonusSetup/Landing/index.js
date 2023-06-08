import React from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import { BonusSetupTable } from "./bonusSetupTable";

const BonusSetupLanding = () => {
  const history = useHistory();

  return (
    <ICustomCard
      title="Bonus Setup"
      createHandler={() =>
        history.push("/human-capital-management/hcmconfig/bonussetup/create")
      }
    >
      <BonusSetupTable />
    </ICustomCard>
  );
};

export default BonusSetupLanding;
