import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { WarehouseTable } from "./WarehouseTableCard";

export function WarehouseLandingCard() {
  let history = useHistory();
  return (
    <Card>
      <CardHeader title="Warehouse">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push("/inventory-management/configuration/warehouse/add")
            }
          >
            Create New
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <WarehouseTable />
      </CardBody>
    </Card>
  );
}
