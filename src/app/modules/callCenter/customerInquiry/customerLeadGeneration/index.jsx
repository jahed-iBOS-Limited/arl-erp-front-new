import React from "react";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../_helper/_customCard";

export default function CustomerLeadGeneration() {
  let history = useHistory();

  return (
    <ICustomCard
      title="Customer Lead Generation"
      createHandler={() => {
        history.push(
          "/call-center-management/customer-inquiry/customerleadgeneration/create"
        );
      }}
      backHandler={() => {
        history.goBack();
      }}
    >
      This section is under development!
    </ICustomCard>
  );
}
