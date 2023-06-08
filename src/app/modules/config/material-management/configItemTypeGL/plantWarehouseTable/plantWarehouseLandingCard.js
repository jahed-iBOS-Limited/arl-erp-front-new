import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { PlantWarehouseTable } from "./plantWarehouseTableCard";

export function ConfigItemTypeGLLandingCard() {
  let history = useHistory();
  return (
    <Card>
      <CardHeader title="Config Item Category General Ledger">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push(
                "/config/material-management/config-item-type-gl/add"
              )
            }
          >
            Create New
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <PlantWarehouseTable />
      </CardBody>
    </Card>
  );
}
