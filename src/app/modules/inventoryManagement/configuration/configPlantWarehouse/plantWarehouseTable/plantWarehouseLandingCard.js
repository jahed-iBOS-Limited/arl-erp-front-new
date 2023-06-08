import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { PlantWarehouseTable } from "./plantWarehouseTableCard";

export function PlantWarehouseLandingCard() {
  let history = useHistory();
  return (
    <Card>
      <CardHeader title="Plant Warehouse Config.">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push("/inventory-management/configuration/conf-plant-warehouse/add")
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
