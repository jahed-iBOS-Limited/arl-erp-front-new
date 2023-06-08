import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { PriceStructureTableCard } from "./PriceStructureTableCard";

export function PriceStructureLandingCard() {
  let history = useHistory();
  return (
    <Card>
      <CardHeader title="Price Structure List">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push("/config/material-management/price-structure/add")
            }
          >
            Create New
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <PriceStructureTableCard />
      </CardBody>
    </Card>
  );
}
