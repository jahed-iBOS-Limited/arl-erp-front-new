import React from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { TableRow } from "./TableRow";
import { useHistory } from "react-router-dom";

export default function ProductionLineTable() {
  const history = useHistory();
  return (
    <ICustomCard
      renderProps={() => (
        <button
          className="btn btn-primary"
          onClick={() =>
            history.push(
              "/production-management/configuration/productionline/create"
            )
          }
        >
          Create New
        </button>
      )}
      title="Production Line Basic Information"
    >
      <TableRow></TableRow>
    </ICustomCard>
  );
}
