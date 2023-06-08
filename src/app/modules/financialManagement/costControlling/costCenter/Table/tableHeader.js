import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { TableRow } from "./tableRow";

export function CostCenterTable() {
  let history = useHistory();
  return (
    <Card>
      <CardHeader title="Cost Center">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push("/financial-management/cost-controlling/cost_center/add")
            }
          >
            Create New
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <TableRow />
      </CardBody>
    </Card>
  );
}
