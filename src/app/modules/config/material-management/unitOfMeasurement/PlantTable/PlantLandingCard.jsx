import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { PlantTable } from "./PlantTableCard";

export function UOMLandingCard() {
  let history = useHistory();
  return (
    <Card>
      <CardHeader title="Unit Of Measurement">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push(
                "/config/material-management/unit-of-measurement/add"
              )
            }
          >
            Create New
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <PlantTable />
      </CardBody>
    </Card>
  );
}
